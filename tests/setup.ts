import { config, enableAutoUnmount } from '@vue/test-utils'
import { afterEach } from 'vitest'

// Every wrapper is unmounted after its test, so global state (scroll lock, z-index, listeners) never leaks.
enableAutoUnmount(afterEach)

// Teleport targets and static-API containers live in document.body; clean them between tests.
afterEach(() => {
  if (typeof document === 'undefined')
    return
  document.body.innerHTML = ''
  document.body.removeAttribute('style')
  document.body.className = ''
})

config.global.stubs = {}

if (typeof window !== 'undefined' && !('ResizeObserver' in globalThis)) {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  ;(globalThis as any).ResizeObserver = ResizeObserver
}
if (typeof window !== 'undefined' && !('IntersectionObserver' in globalThis)) {
  class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return [] }
  }
  ;(globalThis as any).IntersectionObserver = IntersectionObserver
}
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  })) as any
}
if (typeof Element !== 'undefined') {
  Element.prototype.scrollTo = Element.prototype.scrollTo || (() => {})
  Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || (() => {})
}
