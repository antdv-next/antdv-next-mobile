import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, effectScope, h, nextTick, ref } from 'vue'
import {
  getRect,
  parseCountDownTime,
  useBoolean,
  useClipboard,
  useCountDown,
  useCountTo,
  useDebounceFn,
  useElementSize,
  useIntervalFn,
  useLoadMore,
  useLongPress,
  useMediaQuery,
  useOnline,
  usePageVisibility,
  useRequest,
  useStorage,
  useSwipe,
  useThrottleFn,
  useTimeoutFn,
  useToggle,
  useWindowSize,
} from '..'

/** runs a composable inside a mounted component so lifecycle hooks fire */
function withSetup<T>(composable: (el: ReturnType<typeof ref<HTMLElement>>) => T) {
  let result!: T
  const wrapper = mount(defineComponent({
    setup() {
      const el = ref<HTMLElement>()
      result = composable(el)
      return () => h('div', { ref: el, class: 'target' })
    },
  }), { attachTo: document.body })
  return { result, wrapper }
}

const touch = (x: number, y: number) => ({ touches: [{ clientX: x, clientY: y }] })

describe('state', () => {
  it('useBoolean', () => {
    const { state, setTrue, setFalse, toggle, set } = useBoolean()
    expect(state.value).toBe(false)
    setTrue()
    expect(state.value).toBe(true)
    toggle()
    expect(state.value).toBe(false)
    set(true)
    setFalse()
    expect(state.value).toBe(false)
  })

  it('useToggle', () => {
    const [open, toggle] = useToggle()
    toggle()
    expect(open.value).toBe(true)
    toggle(false)
    expect(open.value).toBe(false)
    const [mode, toggleMode] = useToggle('light', 'dark')
    toggleMode()
    expect(mode.value).toBe('dark')
    toggleMode()
    expect(mode.value).toBe('light')
  })
})

describe('fn & timers', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('useDebounceFn: trailing, leading, cancel, flush', () => {
    const fn = vi.fn()
    const debounced = useDebounceFn(fn, 100)
    debounced(1)
    debounced(2)
    vi.advanceTimersByTime(99)
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith(2)

    debounced(3)
    debounced.cancel()
    vi.advanceTimersByTime(200)
    expect(fn).toHaveBeenCalledTimes(1)

    debounced(4)
    debounced.flush()
    expect(fn).toHaveBeenLastCalledWith(4)

    const lead = vi.fn()
    const leading = useDebounceFn(lead, 100, { leading: true, trailing: false })
    leading('a')
    leading('b')
    expect(lead).toHaveBeenCalledTimes(1)
    expect(lead).toHaveBeenCalledWith('a')
    vi.advanceTimersByTime(100)
    leading('c')
    expect(lead).toHaveBeenCalledTimes(2)
  })

  it('useThrottleFn: leading + trailing with the last arguments', () => {
    const fn = vi.fn()
    const throttled = useThrottleFn(fn, 100)
    throttled(1)
    throttled(2)
    throttled(3)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith(1)
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith(3)
    throttled(4)
    throttled.cancel()
    vi.advanceTimersByTime(200)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('timers are cancelled when the scope is disposed', () => {
    const fn = vi.fn()
    const scope = effectScope()
    scope.run(() => {
      useDebounceFn(fn, 100)(1)
      useTimeoutFn(fn, 100)
      useIntervalFn(fn, 100)
    })
    scope.stop()
    vi.advanceTimersByTime(500)
    expect(fn).not.toHaveBeenCalled()
  })

  it('useTimeoutFn and useIntervalFn', () => {
    const fn = vi.fn()
    const timeout = useTimeoutFn(fn, 100, { immediate: false })
    expect(timeout.isActive.value).toBe(false)
    timeout.start()
    expect(timeout.isActive.value).toBe(true)
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(timeout.isActive.value).toBe(false)

    const tick = vi.fn()
    const interval = useIntervalFn(tick, 50, { immediateCallback: true })
    expect(tick).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(150)
    expect(tick).toHaveBeenCalledTimes(4)
    interval.stop()
    vi.advanceTimersByTime(150)
    expect(tick).toHaveBeenCalledTimes(4)
  })

  it('parseCountDownTime', () => {
    expect(parseCountDownTime(90061001)).toEqual({ total: 90061001, days: 1, hours: 1, minutes: 1, seconds: 1, milliseconds: 1 })
    expect(parseCountDownTime(-5).total).toBe(0)
  })

  it('useCountDown counts down by wall-clock time, pauses, resets and finishes', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'Date'] })
    const onFinish = vi.fn()
    const onChange = vi.fn()
    const { current, isActive, start, pause, reset } = useCountDown({ time: 3000, onFinish, onChange })
    expect(current.value.seconds).toBe(3)
    start()
    expect(isActive.value).toBe(true)
    vi.advanceTimersByTime(1100)
    expect(current.value.seconds).toBe(1)
    pause()
    vi.advanceTimersByTime(5000)
    expect(current.value.seconds).toBe(1)
    start()
    vi.advanceTimersByTime(2500)
    expect(current.value.total).toBe(0)
    expect(onFinish).toHaveBeenCalledTimes(1)
    expect(isActive.value).toBe(false)
    expect(onChange).toHaveBeenCalled()
    reset()
    expect(current.value.seconds).toBe(3)
    reset(60000)
    expect(current.value.minutes).toBe(1)
  })

  it('useCountTo animates to the source, follows changes, replays and stops', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'Date'] })
    const source = ref(100)
    const onFinish = vi.fn()
    const { current, isActive, start, stop } = useCountTo(source, { duration: 1000, easing: p => p, onFinish })
    expect(isActive.value).toBe(true)
    expect(current.value).toBe(0)
    vi.advanceTimersByTime(500)
    expect(current.value).toBeGreaterThan(40)
    expect(current.value).toBeLessThan(60)
    vi.advanceTimersByTime(600)
    expect(current.value).toBe(100)
    expect(isActive.value).toBe(false)
    expect(onFinish).toHaveBeenCalledTimes(1)

    source.value = 300
    await nextTick()
    expect(isActive.value).toBe(true)
    vi.advanceTimersByTime(500)
    expect(current.value).toBeGreaterThan(180)
    expect(current.value).toBeLessThan(220)
    stop()
    expect(current.value).toBe(300)
    expect(isActive.value).toBe(false)
    vi.advanceTimersByTime(1000)
    expect(onFinish).toHaveBeenCalledTimes(1)

    start(200)
    expect(current.value).toBe(200)
    vi.advanceTimersByTime(1100)
    expect(current.value).toBe(300)
    expect(onFinish).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })

  it('useCountTo: disabled, immediate: false and zero duration skip the animation', async () => {
    const source = ref(5)
    const disabled = useCountTo(source, { disabled: true })
    expect(disabled.current.value).toBe(5)
    expect(disabled.isActive.value).toBe(false)
    source.value = 8
    await nextTick()
    expect(disabled.current.value).toBe(8)

    const lazy = useCountTo(source, { immediate: false })
    expect(lazy.current.value).toBe(8)
    expect(lazy.isActive.value).toBe(false)

    const onFinish = vi.fn()
    const instant = useCountTo(source, { duration: 0, onFinish })
    expect(instant.current.value).toBe(8)
    expect(onFinish).toHaveBeenCalledTimes(1)
  })
})

describe('dom', () => {
  it('getRect handles window, elements and nothing', () => {
    expect(getRect(window).width).toBe(window.innerWidth)
    expect(getRect(null)).toEqual({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 })
    const el = document.createElement('div')
    el.getBoundingClientRect = () => ({ top: 1, left: 2, right: 3, bottom: 4, width: 5, height: 6 }) as DOMRect
    expect(getRect(el)).toEqual({ top: 1, left: 2, right: 3, bottom: 4, width: 5, height: 6 })
  })

  it('useWindowSize follows resize', () => {
    const { result } = withSetup(() => useWindowSize())
    ;(window as any).innerWidth = 320
    window.dispatchEvent(new Event('resize'))
    expect(result.width.value).toBe(320)
  })

  it('useElementSize reads the element size on mount', () => {
    const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')!
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, get: () => 120 })
    const { result } = withSetup(el => useElementSize(el))
    expect(result.width.value).toBe(120)
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', original)
  })

  it('usePageVisibility and useOnline react to events', () => {
    const { result } = withSetup(() => ({ visibility: usePageVisibility(), online: useOnline() }))
    expect(result.visibility.value).toBe('visible')
    expect(result.online.value).toBe(true)
    window.dispatchEvent(new Event('offline'))
    expect(result.online.value).toBe(false)
    window.dispatchEvent(new Event('online'))
    expect(result.online.value).toBe(true)
  })

  it('useMediaQuery reads matchMedia and follows changes', () => {
    let listener: ((event: any) => void) | undefined
    const matchMedia = vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: query.includes('dark'),
      media: query,
      addEventListener: (_: string, cb: any) => (listener = cb),
      removeEventListener: () => (listener = undefined),
    }) as any)
    const scope = effectScope()
    const matches = scope.run(() => useMediaQuery('(prefers-color-scheme: dark)'))!
    expect(matches.value).toBe(true)
    listener!({ matches: false })
    expect(matches.value).toBe(false)
    scope.stop()
    expect(listener).toBeUndefined()
    matchMedia.mockRestore()
  })
})

describe('gesture', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('useLongPress fires after the delay, not after a move or early release', async () => {
    const handler = vi.fn()
    const onRelease = vi.fn()
    const { result, wrapper } = withSetup(el => useLongPress(el, handler, { delay: 300, onRelease }))
    const target = wrapper.find('.target')

    await target.trigger('touchstart', touch(0, 0))
    vi.advanceTimersByTime(300)
    expect(handler).toHaveBeenCalledTimes(1)
    expect(result.pressed.value).toBe(true)
    await target.trigger('touchend')
    expect(onRelease).toHaveBeenCalledTimes(1)
    expect(result.pressed.value).toBe(false)

    await target.trigger('touchstart', touch(0, 0))
    await target.trigger('touchmove', touch(40, 0))
    vi.advanceTimersByTime(300)
    await target.trigger('touchstart', touch(0, 0))
    vi.advanceTimersByTime(100)
    await target.trigger('touchend')
    vi.advanceTimersByTime(300)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('useSwipe reports deltas and the direction', async () => {
    const onSwipeEnd = vi.fn()
    const { result, wrapper } = withSetup(el => useSwipe(el, { threshold: 30, onSwipeEnd }))
    const target = wrapper.find('.target')
    await target.trigger('touchstart', touch(100, 100))
    await target.trigger('touchmove', touch(40, 104))
    expect(result.isSwiping.value).toBe(true)
    expect(result.deltaX.value).toBe(-60)
    await target.trigger('touchend')
    expect(result.direction.value).toBe('left')
    expect(onSwipeEnd.mock.calls[0][1]).toBe('left')

    await target.trigger('touchstart', touch(100, 100))
    await target.trigger('touchmove', touch(100, 180))
    await target.trigger('touchend')
    expect(result.direction.value).toBe('down')

    await target.trigger('touchstart', touch(100, 100))
    await target.trigger('touchmove', touch(110, 100))
    await target.trigger('touchend')
    expect(result.direction.value).toBeUndefined()
  })
})

describe('browser', () => {
  it('useClipboard uses the async API and resets `copied`', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const { copy, copied, text } = useClipboard({ copiedDuring: 500 })
    expect(await copy('hello')).toBe(true)
    expect(writeText).toHaveBeenCalledWith('hello')
    expect(copied.value).toBe(true)
    expect(text.value).toBe('hello')
    vi.advanceTimersByTime(500)
    expect(copied.value).toBe(false)
    vi.useRealTimers()
  })

  it('useClipboard falls back to execCommand', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
    ;(document as any).execCommand = vi.fn().mockReturnValue(true)
    const { copy } = useClipboard()
    expect(await copy('legacy')).toBe(true)
    expect((document as any).execCommand).toHaveBeenCalledWith('copy')
  })

  it('useStorage persists, removes and follows other tabs', async () => {
    localStorage.clear()
    const { result } = withSetup(() => useStorage('am-test', { count: 0 }))
    expect(result.value).toEqual({ count: 0 })
    result.value.count = 2
    await nextTick()
    expect(JSON.parse(localStorage.getItem('am-test')!)).toEqual({ count: 2 })

    localStorage.setItem('am-test', JSON.stringify({ count: 9 }))
    window.dispatchEvent(new StorageEvent('storage', { key: 'am-test', storageArea: localStorage }))
    expect(result.value).toEqual({ count: 9 })

    await flushPromises()
    result.value = null as any
    await nextTick()
    expect(localStorage.getItem('am-test')).toBeNull()

    localStorage.setItem('am-saved', '"x"')
    expect(useStorage('am-saved', 'default').value).toBe('x')
  })
})

describe('request', () => {
  it('useRequest runs automatically and exposes data / loading', async () => {
    const onSuccess = vi.fn()
    const service = vi.fn(async (id: number) => `user-${id}`)
    const { data, loading, params, refresh, mutate } = useRequest(service, { defaultParams: [1], onSuccess })
    expect(loading.value).toBe(true)
    await flushPromises()
    expect(loading.value).toBe(false)
    expect(data.value).toBe('user-1')
    expect(params.value).toEqual([1])
    expect(onSuccess).toHaveBeenCalledWith('user-1', [1])
    refresh()
    await flushPromises()
    expect(service).toHaveBeenCalledTimes(2)
    mutate(prev => `${prev}!`)
    expect(data.value).toBe('user-1!')
  })

  it('useRequest: manual, errors, race protection and cancel', async () => {
    const onError = vi.fn()
    let resolveFirst!: (value: string) => void
    const service = vi.fn((key: string) => {
      if (key === 'slow')
        return new Promise<string>(resolve => (resolveFirst = resolve))
      if (key === 'bad')
        return Promise.reject(new Error('boom'))
      return Promise.resolve(key)
    })
    const { data, error, loading, run, runAsync, cancel } = useRequest(service, { manual: true, onError })
    expect(service).not.toHaveBeenCalled()

    run('slow')
    run('fast')
    await flushPromises()
    resolveFirst('stale')
    await flushPromises()
    expect(data.value).toBe('fast')

    run('bad')
    await flushPromises()
    expect((error.value as Error).message).toBe('boom')
    expect(onError).toHaveBeenCalledTimes(1)
    await expect(runAsync('bad')).rejects.toThrow('boom')

    run('slow')
    cancel()
    expect(loading.value).toBe(false)
    resolveFirst('ignored')
    await flushPromises()
    expect(data.value).toBe('fast')
  })

  it('useLoadMore pages, finishes, refreshes and reports errors', async () => {
    const all = Array.from({ length: 25 }, (_, i) => i)
    let fail = false
    const service = vi.fn(async ({ page, pageSize }: { page: number, pageSize: number }) => {
      if (fail)
        throw new Error('network')
      return { list: all.slice((page - 1) * pageSize, page * pageSize), total: all.length }
    })
    const state = useLoadMore(service, { pageSize: 10 })
    expect(state.loading.value).toBe(true)
    await flushPromises()
    expect(state.list.value).toHaveLength(10)
    expect(state.finished.value).toBe(false)

    await state.loadMore()
    await state.loadMore()
    expect(state.list.value).toHaveLength(25)
    expect(state.page.value).toBe(3)
    expect(state.finished.value).toBe(true)
    await state.loadMore()
    expect(service).toHaveBeenCalledTimes(3)

    await state.refresh()
    expect(state.list.value).toHaveLength(10)
    expect(state.page.value).toBe(1)
    expect(state.refreshing.value).toBe(false)

    fail = true
    await state.loadMore()
    expect(state.error.value).toBe(true)
    expect(state.loading.value).toBe(false)
    expect(state.list.value).toHaveLength(10)

    state.reset()
    expect(state.list.value).toEqual([])
    expect(state.page.value).toBe(0)
  })

  it('useLoadMore derives `finished` from a short page and `hasMore`', async () => {
    const short = useLoadMore(async () => ({ list: [1, 2] }), { pageSize: 10 })
    await flushPromises()
    expect(short.finished.value).toBe(true)
    const flagged = useLoadMore(async () => ({ list: [], hasMore: false }))
    await flushPromises()
    expect(flagged.empty.value).toBe(true)
  })
})
