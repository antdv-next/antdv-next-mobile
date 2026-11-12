import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import type { MaybeElementRef } from './shared'
import { computed, onMounted, reactive, ref, shallowRef, toRefs, toValue, watch } from 'vue'
import { getScrollParent, inBrowser } from '../_util'
import { useEventListener } from '../_util/hooks'
import { tryOnScopeDispose, unrefElement } from './shared'

export interface ElementRect {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
}

const emptyRect = (): ElementRect => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 })

/** `getBoundingClientRect()` of an element, a component instance or `window`. */
export function getRect(target: MaybeElementRef | Window): ElementRect {
  if (!inBrowser)
    return emptyRect()
  if (target === window) {
    const width = window.innerWidth
    const height = window.innerHeight
    return { top: 0, left: 0, right: width, bottom: height, width, height }
  }
  const el = unrefElement(target as MaybeElementRef)
  if (!el?.getBoundingClientRect)
    return emptyRect()
  const { top, left, right, bottom, width, height } = el.getBoundingClientRect()
  return { top, left, right, bottom, width, height }
}

/** Reactive bounding rect, measured on mount and on demand with `update()`. */
export function useRect(target: MaybeElementRef) {
  const rect = reactive(emptyRect())
  const update = () => Object.assign(rect, getRect(target))
  onMounted(update)
  return { ...toRefs(rect), update }
}

/** Reactive `width` / `height` of an element, kept in sync by a ResizeObserver. */
export function useElementSize(target: MaybeElementRef) {
  const width = ref(0)
  const height = ref(0)
  let observer: ResizeObserver | undefined

  const cleanup = () => {
    observer?.disconnect()
    observer = undefined
  }
  const observe = () => {
    cleanup()
    const el = unrefElement(target)
    if (!el)
      return
    width.value = el.offsetWidth
    height.value = el.offsetHeight
    if (typeof ResizeObserver === 'undefined')
      return
    observer = new ResizeObserver(() => {
      width.value = el.offsetWidth
      height.value = el.offsetHeight
    })
    observer.observe(el)
  }

  if (inBrowser) {
    onMounted(() => {
      observe()
      watch(() => unrefElement(target), observe)
    })
  }
  tryOnScopeDispose(cleanup)
  return { width, height }
}

/** Reactive viewport size, updated on resize and orientation change. */
export function useWindowSize() {
  const width = ref(inBrowser ? window.innerWidth : 0)
  const height = ref(inBrowser ? window.innerHeight : 0)
  const update = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }
  useEventListener('resize', update, { passive: true })
  useEventListener('orientationchange', update, { passive: true })
  return { width, height }
}

/** The nearest scrollable ancestor of an element (`window` when none). */
export function useScrollParent(target: MaybeElementRef, root?: HTMLElement | Window) {
  const scrollParent = shallowRef<HTMLElement | Window>()
  onMounted(() => {
    const el = unrefElement(target)
    if (el)
      scrollParent.value = getScrollParent(el, root)
  })
  return scrollParent
}

/** `'visible' | 'hidden'`: pause timers / animations while the page is in the background. */
export function usePageVisibility(): Ref<DocumentVisibilityState> {
  const visibility = ref<DocumentVisibilityState>(inBrowser ? document.visibilityState : 'visible')
  if (inBrowser) {
    useEventListener('visibilitychange', () => {
      visibility.value = document.visibilityState
    }, { target: document })
  }
  return visibility
}

export interface UseInViewportOptions {
  root?: MaybeElementRef
  rootMargin?: string
  threshold?: number | number[]
  /** stop observing after the first time it becomes visible (lazy loading, exposure tracking) */
  once?: boolean
}

/** Whether an element intersects the viewport (IntersectionObserver). */
export function useInViewport(target: MaybeElementRef, options: UseInViewportOptions = {}) {
  const inViewport = ref(false)
  const ratio = ref(0)
  let observer: IntersectionObserver | undefined

  const stop = () => {
    observer?.disconnect()
    observer = undefined
  }
  const observe = () => {
    stop()
    const el = unrefElement(target)
    if (!el || typeof IntersectionObserver === 'undefined')
      return
    observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1]
      if (!entry)
        return
      inViewport.value = entry.isIntersecting
      ratio.value = entry.intersectionRatio
      if (entry.isIntersecting && options.once)
        stop()
    }, {
      root: unrefElement(options.root),
      rootMargin: options.rootMargin,
      threshold: options.threshold,
    })
    observer.observe(el)
  }

  if (inBrowser) {
    onMounted(() => {
      observe()
      watch(() => unrefElement(target), observe)
    })
  }
  tryOnScopeDispose(stop)
  return { inViewport, ratio, stop }
}

/** Reactive `matchMedia()` result. */
export function useMediaQuery(query: MaybeRefOrGetter<string>): Ref<boolean> {
  const matches = ref(false)
  if (!inBrowser || typeof window.matchMedia !== 'function')
    return matches
  let mql: MediaQueryList | undefined
  const handler = (event: MediaQueryListEvent) => {
    matches.value = event.matches
  }
  const cleanup = () => {
    mql?.removeEventListener?.('change', handler)
    mql = undefined
  }
  watch(() => toValue(query), (value) => {
    cleanup()
    mql = window.matchMedia(value)
    matches.value = mql.matches
    mql.addEventListener?.('change', handler)
  }, { immediate: true })
  tryOnScopeDispose(cleanup)
  return matches
}

/** Whether the system prefers a dark color scheme. Pair it with `theme.darkAlgorithm`. */
export function usePreferredDark(): Ref<boolean> {
  return useMediaQuery('(prefers-color-scheme: dark)')
}

/** Network status from `navigator.onLine`. */
export function useOnline(): Ref<boolean> {
  const online = ref(inBrowser ? navigator.onLine !== false : true)
  useEventListener('online', () => (online.value = true))
  useEventListener('offline', () => (online.value = false))
  return online
}

export interface SafeAreaInsets {
  top: Ref<number>
  right: Ref<number>
  bottom: Ref<number>
  left: Ref<number>
  update: () => void
}

let probe: HTMLElement | undefined

/** Safe-area insets in px (notch, home indicator), read from `env(safe-area-inset-*)`. */
export function useSafeArea(): SafeAreaInsets {
  const top = ref(0)
  const right = ref(0)
  const bottom = ref(0)
  const left = ref(0)

  const update = () => {
    if (!inBrowser)
      return
    if (!probe) {
      probe = document.createElement('div')
      probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;top:0;left:0;'
        + 'padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);'
    }
    document.body.appendChild(probe)
    const style = window.getComputedStyle(probe)
    top.value = Number.parseFloat(style.paddingTop) || 0
    right.value = Number.parseFloat(style.paddingRight) || 0
    bottom.value = Number.parseFloat(style.paddingBottom) || 0
    left.value = Number.parseFloat(style.paddingLeft) || 0
    document.body.removeChild(probe)
  }

  onMounted(update)
  useEventListener('resize', update, { passive: true })
  useEventListener('orientationchange', update, { passive: true })
  return { top, right, bottom, left, update }
}

export interface UseKeyboardReturn {
  /** height covered by the on-screen keyboard, in px */
  height: Ref<number>
  open: ComputedRef<boolean>
}

/**
 * On-screen keyboard height, derived from the VisualViewport API.
 * Use it to lift a bottom bar or a submit button above the keyboard.
 */
export function useKeyboard(threshold = 80): UseKeyboardReturn {
  const height = ref(0)
  const open = computed(() => height.value > threshold)
  const viewport = inBrowser ? window.visualViewport : null
  if (viewport) {
    const update = () => {
      height.value = Math.max(Math.round(window.innerHeight - viewport.height - viewport.offsetTop), 0)
    }
    useEventListener('resize', update, { target: viewport, passive: true })
    useEventListener('scroll', update, { target: viewport, passive: true })
    onMounted(update)
  }
  return { height, open }
}
