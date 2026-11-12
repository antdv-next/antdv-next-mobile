import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import { computed, getCurrentInstance, onMounted, ref, toValue, watch } from 'vue'
import { cancelRaf, inBrowser, raf } from '../_util'
import { tryOnScopeDispose } from './shared'

export interface UseTimerFnOptions {
  /** start right away. Default `true`. */
  immediate?: boolean
}

export interface UseTimerFnReturn {
  isActive: Ref<boolean>
  start: () => void
  stop: () => void
}

/** `setTimeout` with start / stop controls, cleared on unmount. */
export function useTimeoutFn(fn: () => void, delay: MaybeRefOrGetter<number>, options: UseTimerFnOptions = {}): UseTimerFnReturn {
  const { immediate = true } = options
  const isActive = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  const stop = () => {
    isActive.value = false
    if (timer !== undefined)
      clearTimeout(timer)
    timer = undefined
  }
  const start = () => {
    stop()
    isActive.value = true
    timer = setTimeout(() => {
      isActive.value = false
      timer = undefined
      fn()
    }, toValue(delay))
  }
  if (immediate && inBrowser)
    start()
  tryOnScopeDispose(stop)
  return { isActive, start, stop }
}

export interface UseIntervalFnOptions extends UseTimerFnOptions {
  /** call `fn` once when started, before the first interval */
  immediateCallback?: boolean
}

/** `setInterval` with start / stop controls, cleared on unmount. */
export function useIntervalFn(fn: () => void, interval: MaybeRefOrGetter<number> = 1000, options: UseIntervalFnOptions = {}): UseTimerFnReturn {
  const { immediate = true, immediateCallback = false } = options
  const isActive = ref(false)
  let timer: ReturnType<typeof setInterval> | undefined

  const stop = () => {
    isActive.value = false
    if (timer !== undefined)
      clearInterval(timer)
    timer = undefined
  }
  const start = () => {
    stop()
    isActive.value = true
    if (immediateCallback)
      fn()
    timer = setInterval(fn, toValue(interval))
  }
  if (immediate && inBrowser)
    start()
  tryOnScopeDispose(stop)
  return { isActive, start, stop }
}

/** Calls `fn` on every animation frame while active. */
export function useRafFn(fn: (delta: number) => void, options: UseTimerFnOptions = {}): UseTimerFnReturn {
  const { immediate = true } = options
  const isActive = ref(false)
  let id = -1
  let previous = 0

  const loop = (timestamp: number) => {
    if (!isActive.value)
      return
    fn(previous ? timestamp - previous : 0)
    previous = timestamp
    id = raf(loop)
  }
  const stop = () => {
    isActive.value = false
    cancelRaf(id)
    previous = 0
  }
  const start = () => {
    if (isActive.value || !inBrowser)
      return
    isActive.value = true
    id = raf(loop)
  }
  if (immediate)
    start()
  tryOnScopeDispose(stop)
  return { isActive, start, stop }
}

export interface CountDownTime {
  total: number
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

export interface UseCountDownOptions {
  /** remaining time in ms */
  time: number
  /** update every frame (millisecond precision) instead of every second */
  millisecond?: boolean
  /** start right away */
  autoStart?: boolean
  onChange?: (current: CountDownTime) => void
  onFinish?: () => void
}

export interface UseCountDownReturn {
  current: ComputedRef<CountDownTime>
  isActive: Ref<boolean>
  start: () => void
  pause: () => void
  /** stop and set the remaining time (default: the initial `time`) */
  reset: (time?: number) => void
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function parseCountDownTime(time: number): CountDownTime {
  const total = Math.max(time, 0)
  return {
    total,
    days: Math.floor(total / DAY),
    hours: Math.floor((total % DAY) / HOUR),
    minutes: Math.floor((total % HOUR) / MINUTE),
    seconds: Math.floor((total % MINUTE) / SECOND),
    milliseconds: Math.floor(total % SECOND),
  }
}

/**
 * Count-down driven by `requestAnimationFrame` and wall-clock time, so it stays exact
 * when the tab was in the background (SMS code buttons, flash sales ...).
 */
export function useCountDown(options: UseCountDownOptions): UseCountDownReturn {
  const remain = ref(options.time)
  const isActive = ref(false)
  const current = computed(() => parseCountDownTime(remain.value))
  let endTime = 0
  let rafId = -1

  const setRemain = (value: number) => {
    remain.value = Math.max(value, 0)
    options.onChange?.(current.value)
    if (remain.value === 0) {
      pause()
      options.onFinish?.()
    }
  }

  const tick = () => {
    rafId = raf(() => {
      if (!isActive.value)
        return
      const next = Math.max(endTime - Date.now(), 0)
      // without `millisecond`, only publish when the displayed second changes
      if (options.millisecond || Math.floor(next / SECOND) !== Math.floor(remain.value / SECOND) || next === 0)
        setRemain(next)
      if (remain.value > 0)
        tick()
    })
  }

  function pause() {
    isActive.value = false
    cancelRaf(rafId)
  }

  const start = () => {
    if (isActive.value || !inBrowser || remain.value <= 0)
      return
    endTime = Date.now() + remain.value
    isActive.value = true
    tick()
  }

  const reset = (time: number = options.time) => {
    pause()
    remain.value = time
  }

  if (options.autoStart)
    start()
  tryOnScopeDispose(pause)
  return { current, isActive, start, pause, reset }
}

export interface UseCountToOptions {
  /** animation time in ms. Default `1000`. */
  duration?: MaybeRefOrGetter<number | undefined>
  /** value the first run starts from. Default `0`. */
  from?: number
  /** maps the progress (0 - 1) to the eased progress. Default: ease-out. */
  easing?: (progress: number) => number
  /** animate towards the initial value on mount. Default `true`. */
  immediate?: boolean
  /** follow the source without animating */
  disabled?: MaybeRefOrGetter<boolean | undefined>
  onFinish?: () => void
}

export interface UseCountToReturn {
  /** the animated number */
  current: Ref<number>
  isActive: Ref<boolean>
  /** replay from `from` (default: the `from` option) to the source value */
  start: (from?: number) => void
  /** jump to the source value */
  stop: () => void
}

const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3

function prefersReducedMotion() {
  return inBrowser && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Animates a number towards `source` whenever it changes (statistics, prices, scores ...).
 * Server-side and before mount `current` is the source value, so SSR output needs no hydration fix.
 */
export function useCountTo(source: MaybeRefOrGetter<number>, options: UseCountToOptions = {}): UseCountToReturn {
  const { from: initialFrom = 0, easing = easeOutCubic, immediate = true } = options
  const current = ref(toValue(source))
  const isActive = ref(false)
  let rafId = -1

  const cancel = () => {
    isActive.value = false
    cancelRaf(rafId)
  }

  const run = (from: number, to: number) => {
    cancel()
    if (toValue(options.disabled) || !inBrowser) {
      current.value = to
      return
    }
    const duration = toValue(options.duration) ?? 1000
    if (from === to || duration <= 0 || prefersReducedMotion()) {
      current.value = to
      if (from !== to)
        options.onFinish?.()
      return
    }
    const startTime = Date.now()
    current.value = from
    isActive.value = true
    const step = () => {
      if (!isActive.value)
        return
      const progress = Math.min((Date.now() - startTime) / duration, 1)
      if (progress < 1) {
        current.value = from + (to - from) * easing(progress)
        rafId = raf(step)
        return
      }
      current.value = to
      isActive.value = false
      options.onFinish?.()
    }
    rafId = raf(step)
  }

  watch(() => toValue(source), to => run(current.value, to))

  const start = (from: number = initialFrom) => run(from, toValue(source))
  const stop = () => {
    cancel()
    current.value = toValue(source)
  }

  if (immediate) {
    if (getCurrentInstance())
      onMounted(() => start())
    else
      start()
  }
  tryOnScopeDispose(cancel)
  return { current, isActive, start, stop }
}
