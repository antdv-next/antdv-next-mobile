import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import Toast from '..'
import ConfigProvider from '../../config-provider'

const toast = () => document.querySelector<HTMLElement>('.am-toast')

/** let the fade transition (rAF based in jsdom) finish */
async function flush(ms = 100) {
  await nextTick()
  await vi.advanceTimersByTimeAsync(ms)
}

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(async () => {
    Toast.clear()
    Toast.config({ duration: undefined, position: undefined, maskClickable: undefined, getContainer: undefined })
    await flush()
    vi.useRealTimers()
  })

  it('shows a text toast in body and closes it after 2s by default', async () => {
    const afterClose = vi.fn()
    Toast.show({ content: 'hello', afterClose })
    await nextTick()
    expect(toast()!.textContent).toBe('hello')
    expect(toast()!.classList.contains('am-toast-center')).toBe(true)
    expect(toast()!.classList.contains('am-toast-with-icon')).toBe(false)
    expect(document.querySelector('.am-toast-root')!.classList.contains('am-toast-root-block')).toBe(false)

    await vi.advanceTimersByTimeAsync(1900)
    expect(toast()).not.toBeNull()
    await vi.advanceTimersByTimeAsync(100)
    await flush()
    expect(toast()).toBeNull()
    expect(afterClose).toHaveBeenCalledTimes(1)
  })

  it('accepts a string', async () => {
    Toast.show('plain')
    await nextTick()
    expect(toast()!.textContent).toBe('plain')
  })

  it('renders preset and custom icons', async () => {
    Toast.success('ok')
    await nextTick()
    expect(toast()!.classList.contains('am-toast-with-icon')).toBe(true)
    expect(toast()!.querySelector('.am-toast-icon .anticon-check')).not.toBeNull()
    Toast.fail({ content: 'no' })
    await nextTick()
    expect(toast()!.querySelector('.am-toast-icon .anticon-close')).not.toBeNull()
    Toast.show({ content: 'custom', icon: () => h('i', { class: 'custom-icon' }) })
    await nextTick()
    expect(toast()!.querySelector('.am-toast-icon .custom-icon')).not.toBeNull()
  })

  it('loading is persistent and blocks the page until closed', async () => {
    const handler = Toast.loading('loading')
    await nextTick()
    expect(toast()!.querySelector('.am-spinner.am-spin-icon')).not.toBeNull()
    expect(document.querySelector('.am-toast-root')!.classList.contains('am-toast-root-block')).toBe(true)
    await vi.advanceTimersByTimeAsync(10000)
    expect(toast()).not.toBeNull()
    handler.close()
    await flush()
    expect(toast()).toBeNull()
    expect(document.querySelector('.am-toast-root')!.classList.contains('am-toast-root-block')).toBe(false)
  })

  it('shows only one toast: a new one replaces the old one', async () => {
    const afterClose = vi.fn()
    const first = Toast.show({ content: 'first', duration: 1000, afterClose })
    await nextTick()
    Toast.show({ content: 'second', duration: 3000, position: 'bottom' })
    await nextTick()
    expect(document.querySelectorAll('.am-toast')).toHaveLength(1)
    expect(toast()!.textContent).toBe('second')
    expect(toast()!.classList.contains('am-toast-bottom')).toBe(true)
    expect(afterClose).toHaveBeenCalledTimes(1)

    // the timer and the handler of the replaced toast do not close the new one
    first.close()
    await vi.advanceTimersByTimeAsync(1500)
    expect(toast()).not.toBeNull()
    await vi.advanceTimersByTimeAsync(1500)
    await flush()
    expect(toast()).toBeNull()
  })

  it('clear closes the current toast', async () => {
    const afterClose = vi.fn()
    Toast.show({ content: 'x', duration: 0, afterClose })
    await nextTick()
    Toast.clear()
    await flush()
    expect(toast()).toBeNull()
    expect(afterClose).toHaveBeenCalledTimes(1)
  })

  it('config sets defaults for duration, position, maskClickable and getContainer', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    Toast.config({ duration: 500, position: 'top', maskClickable: false, getContainer: () => container })
    Toast.show({ content: 'x', class: 'custom', style: { color: 'red' } })
    await nextTick()
    const root = container.querySelector<HTMLElement>('.am-toast-root')!
    expect(root).not.toBeNull()
    expect(root.classList.contains('custom')).toBe(true)
    expect(root.classList.contains('am-toast-root-block')).toBe(true)
    expect(root.style.color).toBe('red')
    expect(toast()!.classList.contains('am-toast-top')).toBe(true)
    await vi.advanceTimersByTimeAsync(500)
    await flush()
    expect(toast()).toBeNull()
  })

  it('re-creates the holder when it was removed from the document', async () => {
    Toast.show('a')
    await nextTick()
    document.body.innerHTML = ''
    Toast.show('b')
    await nextTick()
    expect(toast()!.textContent).toBe('b')
  })

  it('useToast renders through the context holder and keeps the provider theme', async () => {
    let api: any
    const Comp = defineComponent({
      setup() {
        const [toastApi, ContextHolder] = Toast.useToast({ duration: 1000, position: 'top' })
        api = toastApi
        return () => h(ConfigProvider, { theme: { algorithm: 'dark' } }, { default: () => h(ContextHolder) })
      },
    })
    mount(Comp)
    await nextTick()
    api.success('hook')
    await nextTick()
    expect(document.querySelector('.am-static-holder')).toBeNull()
    expect(document.querySelector('.am-toast-root')!.classList.contains('am-theme-dark')).toBe(true)
    expect(toast()!.classList.contains('am-toast-top')).toBe(true)
    // independent from the static toast
    Toast.clear()
    await flush()
    expect(toast()!.textContent).toBe('hook')
    await vi.advanceTimersByTimeAsync(1000)
    await flush()
    expect(toast()).toBeNull()
  })
})
