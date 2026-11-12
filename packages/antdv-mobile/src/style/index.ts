import './index.css'

// iOS Safari only applies `:active` styles when a touch listener exists on the page.
if (typeof document !== 'undefined' && !(document as any).__amActiveFix) {
  (document as any).__amActiveFix = true
  document.addEventListener('touchstart', () => {}, { passive: true })
}
