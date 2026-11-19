"""Validate a staged Vite site and atomically promote it on the Linux docs host."""

import ctypes
import os
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class EntryAssets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
        self.has_script = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "script" and attrs.get("src"):
            self.urls.append(attrs["src"])
            self.has_script = True
        elif tag == "link" and attrs.get("href") and attrs.get("rel") != "canonical":
            self.urls.append(attrs["href"])


def validate_site(site):
    for name in ("index.html", "mobile.html"):
        parser = EntryAssets()
        parser.feed((site / name).read_text(encoding="utf-8"))
        parser.close()
        if not parser.has_script:
            raise ValueError(f"{name} has no application script")
        for url in parser.urls:
            ref = urlsplit(url)
            if ref.scheme or ref.netloc or not ref.path:
                continue
            path = site / unquote(ref.path).lstrip("/")
            if not path.is_file() or not path.stat().st_size:
                raise ValueError(f"{name} references a missing or empty asset: {url}")


def exchange(first, second):
    # Linux renameat2(RENAME_EXCHANGE) swaps populated directories in one syscall.
    # If the host or filesystem lacks it, the existing site stays in place.
    renameat2 = ctypes.CDLL(None, use_errno=True).renameat2
    at_fdcwd, rename_exchange = -100, 2
    if renameat2(at_fdcwd, os.fsencode(first), at_fdcwd, os.fsencode(second), rename_exchange):
        error = ctypes.get_errno()
        raise OSError(error, os.strerror(error), str(first), None, str(second))


def activate(site, target):
    validate_site(site)
    live = target / "index"
    backup = target / "index.bak"
    if not os.path.lexists(live):
        site.rename(live)
        return
    exchange(site, live)
    try:
        if os.path.lexists(backup):
            exchange(site, backup)
        else:
            site.rename(backup)
    except OSError:
        exchange(site, live)
        raise


if __name__ == "__main__":
    activate(Path(sys.argv[1]), Path(sys.argv[2]))
