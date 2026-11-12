/** Copies text with the async clipboard API, falling back to `execCommand` (http pages, old WebViews). */
export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    }
    catch {
      // fall through to the legacy path
    }
  }
  if (typeof document === 'undefined')
    return false
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.cssText = 'position: fixed; top: 0; left: 0; opacity: 0; pointer-events: none;'
  document.body.appendChild(textarea)
  textarea.select()
  textarea.setSelectionRange(0, text.length)
  let success = false
  try {
    success = !!document.execCommand?.('copy')
  }
  catch {
    success = false
  }
  textarea.remove()
  return success
}
