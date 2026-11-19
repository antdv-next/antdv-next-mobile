import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from deploy_docs import activate, exchange


class TestDeployDocs(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.target = Path(temp.name)
        self.site = self.target / "incoming" / "site"
        self.site.mkdir(parents=True)
        self.live = self.target / "index"
        self.live.mkdir()
        (self.live / "marker").write_text("old")

    def build(self):
        for name in ("index.html", "mobile.html"):
            (self.site / name).write_text('<script type="module" src="/app.js?v=1"></script>')
        (self.site / "app.js").write_text("ok")

    def test_invalid_artifacts_preserve_live_files(self):
        self.build()
        for filename in ("mobile.html", "app.js", "index.html"):
            with self.subTest(filename=filename):
                path = self.site / filename
                content = path.read_bytes()
                path.unlink()
                with self.assertRaises((ValueError, FileNotFoundError)):
                    activate(self.site, self.target)
                self.assertEqual((self.live / "marker").read_text(), "old")
                path.write_bytes(content)

    def test_failed_exchange_preserves_live_files(self):
        self.build()
        with patch("deploy_docs.exchange", side_effect=OSError("exchange unavailable")):
            with self.assertRaises(OSError):
                activate(self.site, self.target)
        self.assertEqual((self.live / "marker").read_text(), "old")

    def test_first_deployment(self):
        self.build()
        target = self.target / "first"
        target.mkdir()
        activate(self.site, target)
        self.assertTrue((target / "index" / "mobile.html").is_file())
        self.assertFalse((target / "index.bak").exists())

    @unittest.skipUnless(sys.platform.startswith("linux"), "Linux directory exchange")
    def test_backup_failure_restores_previous_live_site(self):
        self.build()
        backup = self.target / "index.bak"
        backup.mkdir()

        def fail_on_backup(first, second):
            if second == backup:
                raise OSError("backup unavailable")
            exchange(first, second)

        with patch("deploy_docs.exchange", side_effect=fail_on_backup):
            with self.assertRaises(OSError):
                activate(self.site, self.target)
        self.assertEqual((self.live / "marker").read_text(), "old")
        self.assertEqual((self.site / "app.js").read_text(), "ok")

    @unittest.skipUnless(sys.platform.startswith("linux"), "Linux directory exchange")
    def test_switch_rotates_existing_site_and_backup(self):
        self.build()
        backup = self.target / "index.bak"
        backup.mkdir()
        (backup / "marker").write_text("older")
        activate(self.site, self.target)
        self.assertEqual((self.live / "app.js").read_text(), "ok")
        self.assertEqual((backup / "marker").read_text(), "old")
        self.assertEqual((self.site / "marker").read_text(), "older")
