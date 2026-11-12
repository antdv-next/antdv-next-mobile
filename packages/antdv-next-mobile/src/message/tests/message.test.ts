import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import message from '..'
import ConfigProvider from '../../config-provider'

const notices = () => Array.from(document.querySelectorAll<HTMLElement>('.am-message-notice'))

/** let leave transitions (rAF based in jsdom) finish */
async function flush(ms = 100) {
  await nextTick()
  await vi.advanceTimersByTimeAsync(ms)
}

describe('message', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(async () => {
    message.destroy()
    message.config({ top: undefined, duration: undefined, maxCount: undefined, getContainer: undefined })
    await flush()
    vi.useRealTimers()
  })

  it('opens a message in body and closes it after the duration', async () => {
    const onClose = vi.fn()
    message.info('hello', 2, onClose)
    await nextTick()
    expect(document.querySelector('.am-message')).not.toBeNull()
    expect(notices()).toHaveLength(1)
    expect(notices()[0].classList.contains('am-message-notice-info')).toBe(true)
    expect(notices()[0].querySelector('.am-message-text')!.textContent).toBe('hello')
    expect(notices()[0].querySelector('.am-message-icon')).not.toBeNull()

    await vi.advanceTimersByTimeAsync(1900)
    expect(onClose).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(200)
    expect(onClose).toHaveBeenCalledTimes(1)
    await flush()
    expect(notices()).toHaveLength(0)
  })

  it('supports every type, the default duration of 3s and the object form', async () => {
    message.success('s')
    message.error('e')
    message.warning('w')
    message.loading({ content: 'l', class: 'custom', style: { color: 'red' } })
    await nextTick()
    expect(notices().map(n => n.className.match(/am-message-notice-(\w+)/)![1])).toEqual(['success', 'error', 'warning', 'loading'])
    expect(notices()[3].classList.contains('custom')).toBe(true)
    expect(notices()[3].style.color).toBe('red')
    expect(notices()[3].querySelector('.am-spinner.am-spin-icon')).not.toBeNull()
    await vi.advanceTimersByTimeAsync(3000)
    await flush()
    expect(notices()).toHaveLength(0)
  })

  it('returns a thenable close handle', async () => {
    const closed = vi.fn()
    const hide = message.loading('loading', 0)
    hide.then(closed)
    await vi.advanceTimersByTimeAsync(10000)
    expect(notices()).toHaveLength(1)
    expect(closed).not.toHaveBeenCalled()
    hide()
    await flush()
    expect(closed).toHaveBeenCalledWith(true)
    expect(notices()).toHaveLength(0)
  })

  it('accepts onClose as the second argument', async () => {
    const onClose = vi.fn()
    message.success('ok', onClose)
    await vi.advanceTimersByTimeAsync(3000)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('updates in place when the key is the same', async () => {
    message.open({ key: 'k', type: 'loading', content: 'loading', duration: 0 })
    await nextTick()
    const el = notices()[0]
    message.open({ key: 'k', type: 'success', content: 'done', duration: 1 })
    await nextTick()
    expect(notices()).toHaveLength(1)
    expect(notices()[0]).toBe(el)
    expect(el.classList.contains('am-message-notice-success')).toBe(true)
    expect(el.querySelector('.am-message-text')!.textContent).toBe('done')
    await vi.advanceTimersByTimeAsync(1000)
    await flush()
    expect(notices()).toHaveLength(0)
  })

  it('renders custom icon / vnode content and handles click', async () => {
    const onClick = vi.fn()
    message.open({
      content: () => h('b', { class: 'custom-content' }, 'x'),
      icon: () => h('i', { class: 'custom-icon' }),
      onClick,
    })
    await nextTick()
    expect(document.querySelector('.am-message-text .custom-content')).not.toBeNull()
    expect(document.querySelector('.am-message-icon .custom-icon')).not.toBeNull()
    document.querySelector<HTMLElement>('.am-message-notice-content')!.click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('destroy removes one message by key or all of them', async () => {
    message.open({ key: 'a', content: 'a', duration: 0 })
    message.open({ key: 'b', content: 'b', duration: 0 })
    message.open({ key: 'c', content: 'c', duration: 0 })
    message.destroy('b')
    await flush()
    expect(notices().map(n => n.textContent)).toEqual(['a', 'c'])
    message.destroy()
    await flush()
    expect(notices()).toHaveLength(0)
  })

  it('config applies top, duration, maxCount and getContainer', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    message.config({ top: 40, duration: 1, maxCount: 2, getContainer: () => container })
    const onClose = vi.fn()
    message.info({ content: '1', onClose })
    message.info('2')
    message.info('3')
    await nextTick()
    const root = container.querySelector<HTMLElement>('.am-message')!
    expect(root).not.toBeNull()
    expect(root.style.getPropertyValue('--am-message-top')).toBe('40px')
    expect(onClose).toHaveBeenCalledTimes(1)
    await flush()
    expect(notices().map(n => n.textContent)).toEqual(['2', '3'])
    await vi.advanceTimersByTimeAsync(1000)
    await flush()
    expect(notices()).toHaveLength(0)
  })

  it('useMessage renders through the context holder and keeps the provider theme', async () => {
    let api: any
    const Comp = defineComponent({
      setup() {
        const [messageApi, ContextHolder] = message.useMessage({ duration: 1 })
        api = messageApi
        return () => h(ConfigProvider, { theme: { algorithm: 'dark' } }, { default: () => h(ContextHolder) })
      },
    })
    mount(Comp)
    await nextTick()
    const hide = api.success('hook')
    await nextTick()
    expect(document.querySelector('.am-static-holder')).toBeNull()
    expect(document.querySelector('.am-message')!.classList.contains('am-theme-dark')).toBe(true)
    expect(notices()).toHaveLength(1)
    hide()
    await flush()
    expect(notices()).toHaveLength(0)
  })

  it('animates the very first message (the holder is mounted with it)', async () => {
    message.destroy()
    await flush()
    // a fresh static holder: drop the current one
    document.querySelector('.am-message')?.remove()
    message.info('first')
    await nextTick()
    await nextTick()
    expect(notices()).toHaveLength(1)
    expect(notices()[0].classList.contains('am-message-motion-enter-active')).toBe(true)
    message.destroy()
    await flush()
  })
})
