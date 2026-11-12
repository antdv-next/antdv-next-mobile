import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import LoadingBar from '..'

const bar = () => document.querySelector<HTMLElement>('.am-loading-bar')
const inner = () => document.querySelector<HTMLElement>('.am-loading-bar-inner')
const isOpen = () => !!bar()?.classList.contains('am-loading-bar-open')

async function advance(ms: number) {
  await vi.advanceTimersByTimeAsync(ms)
  await nextTick()
}

describe('LoadingBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(async () => {
    LoadingBar.finish()
    await advance(1000)
    LoadingBar.config({ color: undefined, errorColor: undefined, height: undefined, top: undefined, zIndex: undefined, getContainer: undefined })
    vi.useRealTimers()
  })

  it('start() shows an empty bar in body that creeps forward but never completes', async () => {
    LoadingBar.start()
    await nextTick()
    expect(bar()!.parentElement).toBe(document.body)
    expect(isOpen()).toBe(true)
    expect(bar()!.getAttribute('role')).toBe('progressbar')
    expect(bar()!.classList.contains('am-loading-bar-animated')).toBe(false)
    expect(inner()!.style.width).toBe('0%')

    await advance(16)
    expect(bar()!.classList.contains('am-loading-bar-animated')).toBe(true)
    expect(inner()!.style.width).toBe('20%')
    await advance(200)
    expect(inner()!.style.width).toBe('27%')
    await advance(60_000)
    const width = Number.parseFloat(inner()!.style.width)
    expect(width).toBeGreaterThan(85)
    expect(width).toBeLessThanOrEqual(90)
    expect(isOpen()).toBe(true)
  })

  it('finish() fills the bar, fades it out and resets it', async () => {
    LoadingBar.start()
    await advance(500)
    LoadingBar.finish()
    await advance(16)
    expect(inner()!.style.width).toBe('100%')
    expect(bar()!.getAttribute('aria-valuenow')).toBe('100')
    expect(bar()!.classList.contains('am-loading-bar-leaving')).toBe(false)
    await advance(200)
    expect(bar()!.classList.contains('am-loading-bar-leaving')).toBe(true)
    expect(isOpen()).toBe(true)
    await advance(300)
    expect(isOpen()).toBe(false)
    expect(bar()!.classList.contains('am-loading-bar-leaving')).toBe(false)
    expect(inner()!.style.width).toBe('0%')
    expect(bar()!.getAttribute('aria-hidden')).toBe('true')
  })

  it('finish() without start() does nothing', async () => {
    LoadingBar.finish()
    await advance(1000)
    expect(isOpen()).toBe(false)
  })

  it('error() switches to the error color, also when never started', async () => {
    LoadingBar.start()
    await advance(300)
    LoadingBar.error()
    await advance(16)
    expect(bar()!.classList.contains('am-loading-bar-error')).toBe(true)
    expect(inner()!.style.width).toBe('100%')
    await advance(500)
    expect(isOpen()).toBe(false)
    expect(bar()!.classList.contains('am-loading-bar-loading')).toBe(true)

    LoadingBar.error()
    await nextTick()
    expect(isOpen()).toBe(true)
    expect(bar()!.classList.contains('am-loading-bar-error')).toBe(true)
    await advance(16)
    expect(inner()!.style.width).toBe('100%')
    await advance(500)
    expect(isOpen()).toBe(false)
  })

  it('start() restarts a bar that is finishing', async () => {
    LoadingBar.start()
    await advance(300)
    LoadingBar.finish()
    await advance(250)
    expect(bar()!.classList.contains('am-loading-bar-leaving')).toBe(true)
    LoadingBar.start()
    await nextTick()
    expect(bar()!.classList.contains('am-loading-bar-leaving')).toBe(false)
    expect(inner()!.style.width).toBe('0%')
    await advance(1000)
    expect(isOpen()).toBe(true)
  })

  it('config() sets colors, size, position, zIndex and container', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    LoadingBar.config({ color: 'red', errorColor: 'blue', height: 5, top: '44px', zIndex: 77, getContainer: () => container })
    LoadingBar.start()
    await nextTick()
    const el = bar()!
    expect(el.parentElement).toBe(container)
    expect(el.style.getPropertyValue('--am-loading-bar-color')).toBe('red')
    expect(el.style.getPropertyValue('--am-loading-bar-error-color')).toBe('blue')
    expect(el.style.getPropertyValue('--am-loading-bar-height')).toBe('5px')
    expect(el.style.getPropertyValue('--am-loading-bar-top')).toBe('44px')
    expect(el.style.zIndex).toBe('77')
  })

  it('stacks above popups opened before it by default', async () => {
    LoadingBar.start()
    await nextTick()
    expect(Number(bar()!.style.zIndex)).toBeGreaterThan(1000)
  })
})
