import { config, enableAutoUnmount } from '@vue/test-utils'
import { afterEach } from 'vitest'

// Every wrapper is unmounted after its test, so global state (scroll lock, z-index, listeners) never leaks.
enableAutoUnmount(afterEach)

// Teleport targets and static-API containers live in document.body; clean them between tests.
afterEach(() => {
  document.body.innerHTML = ''
  document.body.removeAttribute('style')
  document.body.className = ''
})

config.global.stubs = {}

if (!('ResizeObserver' in globalThis)) {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  ;(globalThis as any).ResizeObserver = ResizeObserver
}
if (!('IntersectionObserver' in globalThis)) {
  class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return [] }
  }
  ;(globalThis as any).IntersectionObserver = IntersectionObserver
}
if (!window.matchMedia) {
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
Element.prototype.scrollTo = Element.prototype.scrollTo || (() => {})
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || (() => {})
