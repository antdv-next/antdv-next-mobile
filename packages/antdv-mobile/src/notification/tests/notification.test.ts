import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import notification from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'
import NotificationVue from '../Notification.vue'

const cards = () => Array.from(document.querySelectorAll<HTMLElement>('.am-notification-notice'))
const list = (edge: 'top' | 'bottom') => document.querySelector<HTMLElement>(`.am-notification-list-${edge}`)!

/**
 * Render, then let the clock move on: Vue ignores an event that reaches a second listener
 * attached in the very millisecond the event was fired, which only happens with a frozen clock.
 */
async function settle() {
  await nextTick()
  await vi.advanceTimersByTimeAsync(10)
}

/** let leave transitions (rAF based in jsdom) finish */
async function flush(ms = 100) {
  await nextTick()
  await vi.advanceTimersByTimeAsync(ms)
}

function touch(el: Element, type: string, clientX = 0, clientY = 0) {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.assign(event, { touches: [{ clientX, clientY }] })
  el.dispatchEvent(event)
}

async function swipe(el: Element, dx: number, dy: number) {
  touch(el, 'touchstart', 100, 100)
  touch(el, 'touchmove', 100 + dx / 2, 100 + dy / 2)
  touch(el, 'touchmove', 100 + dx, 100 + dy)
  // slow enough not to count as a flick
  await vi.advanceTimersByTimeAsync(1000)
  touch(el, 'touchend')
  await nextTick()
}

describe('notification', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(async () => {
    notification.destroy()
    notification.config({
      top: undefined,
      bottom: undefined,
      duration: undefined,
      maxCount: undefined,
      getContainer: undefined,
      placement: undefined,
      stack: undefined,
      showProgress: undefined,
      pauseOnHover: undefined,
      closeIcon: undefined,
      closable: undefined,
      classes: undefined,
      styles: undefined,
    })
    await flush()
    vi.useRealTimers()
  })

  it('opens a card at the top of body and closes it after 4.5s', async () => {
    const onClose = vi.fn()
    notification.open({ title: 'Title', description: 'Description', onClose })
    await nextTick()
    expect(document.querySelector('.am-static-holder .am-notification, body > .am-notification')).not.toBeNull()
    expect(cards()).toHaveLength(1)
    expect(list('top').contains(cards()[0])).toBe(true)
    expect(cards()[0].getAttribute('role')).toBe('alert')
    expect(cards()[0].querySelector('.am-notification-title')!.textContent).toBe('Title')
    expect(cards()[0].querySelector('.am-notification-description')!.textContent).toBe('Description')
    expect(cards()[0].querySelector('.am-notification-icon')).toBeNull()
    expect(cards()[0].querySelector('.am-notification-actions')).toBeNull()
    expect(cards()[0].querySelector('.am-notification-progress')).toBeNull()
    expect(cards()[0].querySelector('.am-notification-close')!.getAttribute('aria-label')).toBe('关闭')

    await vi.advanceTimersByTimeAsync(4400)
    expect(onClose).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(200)
    expect(onClose).toHaveBeenCalledTimes(1)
    await flush()
    expect(cards()).toHaveLength(0)
  })

  it('supports every type, a custom icon, actions, class / style / props / role', async () => {
    notification.success({ title: 's' })
    notification.error({ title: 'e' })
    notification.info({ title: 'i' })
    notification.warning({ title: 'w' })
    notification.open({
      title: 'custom',
      icon: () => h('i', { class: 'my-icon' }),
      actions: () => h('button', { class: 'my-action' }, 'Undo'),
      class: 'custom',
      style: { color: 'red' },
      props: { 'data-testid': 'n' },
      role: 'status',
      classes: { root: 'r', title: 't', actions: 'a', close: 'c', section: 's' },
      styles: { title: { fontSize: '20px' } },
    })
    await nextTick()
    // the newest one is first
    expect(cards().map(n => n.className.match(/am-notification-notice-(success|error|info|warning)/)?.[1])).toEqual([undefined, 'warning', 'info', 'error', 'success'])
    expect(cards()[1].querySelector('.am-notification-icon svg')).not.toBeNull()
    const custom = cards()[0]
    expect(custom.querySelector('.am-notification-icon .my-icon')).not.toBeNull()
    expect(custom.querySelector('.am-notification-actions.a .my-action')).not.toBeNull()
    expect(custom.classList.contains('custom')).toBe(true)
    expect(custom.classList.contains('r')).toBe(true)
    expect(custom.style.color).toBe('red')
    expect(custom.dataset.testid).toBe('n')
    expect(custom.getAttribute('role')).toBe('status')
    expect(custom.querySelector<HTMLElement>('.am-notification-title.t')!.style.fontSize).toBe('20px')
    expect(custom.querySelector('.am-notification-close.c')).not.toBeNull()
    expect(custom.querySelector('.am-notification-section.s')).not.toBeNull()
  })

  it('duration 0 / false keeps the notification open', async () => {
    notification.open({ title: 'a', duration: 0 })
    notification.open({ title: 'b', duration: false })
    await vi.advanceTimersByTimeAsync(20000)
    expect(cards()).toHaveLength(2)
  })

  it('updates in place by key and restarts the timer', async () => {
    const first = vi.fn()
    const second = vi.fn()
    notification.open({ key: 'k', title: 'one', duration: 2, onClose: first })
    await vi.advanceTimersByTimeAsync(1500)
    notification.success({ key: 'k', title: 'two', duration: 2, onClose: second })
    await nextTick()
    expect(cards()).toHaveLength(1)
    expect(cards()[0].querySelector('.am-notification-title')!.textContent).toBe('two')
    expect(cards()[0].classList.contains('am-notification-notice-success')).toBe(true)
    await vi.advanceTimersByTimeAsync(1500)
    expect(cards()).toHaveLength(1)
    await vi.advanceTimersByTimeAsync(600)
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
    await flush()
    expect(cards()).toHaveLength(0)
  })

  it('maps placements to the top / bottom edge', async () => {
    notification.open({ title: 'default', duration: 0 })
    notification.open({ title: 'topRight', placement: 'topRight', duration: 0 })
    notification.open({ title: 'bottom', placement: 'bottom', duration: 0 })
    notification.open({ title: 'bottomLeft', placement: 'bottomLeft', duration: 0 })
    await nextTick()
    expect(list('top').querySelectorAll('.am-notification-notice')).toHaveLength(2)
    expect(list('bottom').querySelectorAll('.am-notification-notice')).toHaveLength(2)

    notification.destroy()
    notification.config({ placement: 'bottomRight', top: 20, bottom: '2rem' })
    notification.open({ title: 'configured', duration: 0 })
    await flush()
    expect(list('bottom').querySelectorAll('.am-notification-notice')).toHaveLength(1)
    const root = document.querySelector<HTMLElement>('.am-notification')!
    expect(root.style.getPropertyValue('--am-notification-top')).toBe('20px')
    expect(root.style.getPropertyValue('--am-notification-bottom')).toBe('2rem')
  })

  it('closes by the close button, which can be hidden, replaced or disabled', async () => {
    const onClose = vi.fn()
    const onClosableClose = vi.fn()
    const onClick = vi.fn()
    notification.config({ stack: false })
    notification.open({ key: 1, title: 'a', duration: 0, onClose, onClick, closable: { onClose: onClosableClose, closeIcon: () => h('i', { class: 'x' }) } })
    notification.open({ key: 2, title: 'b', duration: 0, closable: false })
    notification.open({ key: 3, title: 'c', duration: 0, closeIcon: null })
    notification.open({ key: 4, title: 'd', duration: 0, closable: { disabled: true } })
    await settle()
    const [d, c, b, a] = cards()
    expect(b.querySelector('.am-notification-close')).toBeNull()
    expect(c.querySelector('.am-notification-close')).toBeNull()
    expect(d.querySelector<HTMLButtonElement>('.am-notification-close')!.disabled).toBe(true)
    expect(a.classList.contains('am-notification-notice-closable')).toBe(true)
    expect(a.querySelector('.am-notification-close .x')).not.toBeNull()

    a.querySelector<HTMLElement>('.am-notification-close')!.click()
    await flush()
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onClosableClose).toHaveBeenCalledTimes(1)
    expect(onClick).not.toHaveBeenCalled()
    expect(cards()).toHaveLength(3)
  })

  it('fires onClick on tap', async () => {
    const onClick = vi.fn()
    notification.open({ title: 'a', duration: 0, onClick })
    await settle()
    cards()[0].click()
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClick.mock.calls[0][0]).toBeInstanceOf(MouseEvent)
  })

  it('shows a progress bar and pauses the timer while touched', async () => {
    const onClose = vi.fn()
    notification.open({ title: 'a', duration: 2, showProgress: true, onClose })
    await nextTick()
    const bar = () => cards()[0].querySelector<HTMLElement>('.am-notification-progress-bar')!
    expect(bar().style.animationDuration).toBe('2s')
    expect(bar().style.animationPlayState).toBe('running')

    await vi.advanceTimersByTimeAsync(1500)
    touch(cards()[0], 'touchstart', 10, 10)
    await nextTick()
    expect(bar().style.animationPlayState).toBe('paused')
    await vi.advanceTimersByTimeAsync(5000)
    expect(onClose).not.toHaveBeenCalled()

    touch(cards()[0], 'touchend')
    await nextTick()
    expect(bar().style.animationPlayState).toBe('running')
    await vi.advanceTimersByTimeAsync(400)
    expect(onClose).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(200)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('pauseOnHover false keeps the timer running while touched', async () => {
    const onClose = vi.fn()
    notification.open({ title: 'a', duration: 1, pauseOnHover: false, onClose })
    await nextTick()
    touch(cards()[0], 'touchstart', 10, 10)
    await vi.advanceTimersByTimeAsync(1100)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('is dismissed by a swipe towards its edge or sideways', async () => {
    const closed: string[] = []
    const onClick = vi.fn()
    const open = (key: string, placement: 'top' | 'bottom' = 'top') =>
      notification.open({ key, title: key, duration: 0, placement, onClick, onClose: () => closed.push(key) })
    notification.config({ stack: false })
    open('up')
    await nextTick()

    // too short: springs back
    await swipe(cards()[0], 0, -20)
    expect(closed).toEqual([])
    expect(cards()[0].style.transform).toBe('')
    // away from the edge: resisted, never dismissed
    await swipe(cards()[0], 0, 120)
    expect(closed).toEqual([])

    touch(cards()[0], 'touchstart', 100, 100)
    touch(cards()[0], 'touchmove', 100, 80)
    touch(cards()[0], 'touchmove', 100, 60)
    await nextTick()
    expect(cards()[0].classList.contains('am-notification-notice-dragging')).toBe(true)
    expect(cards()[0].style.transform).toBe('translate3d(0px, -40px, 0)')
    touch(cards()[0], 'touchend')
    await flush()
    expect(closed).toEqual(['up'])
    expect(cards()).toHaveLength(0)

    open('side')
    await nextTick()
    await swipe(cards()[0], 120, 0)
    await flush()
    expect(closed).toEqual(['up', 'side'])

    open('down', 'bottom')
    await nextTick()
    await swipe(cards()[0], 0, -120)
    expect(closed).toEqual(['up', 'side'])
    await swipe(cards()[0], 0, 60)
    await flush()
    expect(closed).toEqual(['up', 'side', 'down'])

    // a quick flick is enough
    open('flick')
    await nextTick()
    touch(cards()[0], 'touchstart', 100, 100)
    touch(cards()[0], 'touchmove', 100, 90)
    touch(cards()[0], 'touchmove', 100, 76)
    touch(cards()[0], 'touchend')
    await flush()
    expect(closed).toEqual(['up', 'side', 'down', 'flick'])
    expect(onClick).not.toHaveBeenCalled()
  })

  it('maxCount closes the earliest notification', async () => {
    const onClose = vi.fn()
    notification.config({ maxCount: 2 })
    notification.open({ title: '1', duration: 0, onClose })
    notification.open({ title: '2', duration: 0 })
    notification.open({ title: '3', duration: 0 })
    await flush()
    expect(cards().map(n => n.textContent)).toEqual(['3', '2'])
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('destroy removes one or all notifications without calling onClose', async () => {
    const onClose = vi.fn()
    notification.open({ key: 'a', title: 'a', duration: 0, onClose })
    notification.open({ key: 'b', title: 'b', duration: 0, onClose })
    notification.open({ key: 'c', title: 'c', duration: 0, onClose })
    await nextTick()
    notification.destroy('b')
    await flush()
    expect(cards().map(n => n.textContent)).toEqual(['c', 'a'])
    notification.destroy()
    await flush()
    expect(cards()).toHaveLength(0)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('collapses into a stack above the threshold and expands on tap', async () => {
    const onClick = vi.fn()
    for (let i = 1; i <= 3; i++)
      notification.open({ key: i, title: `${i}`, duration: 0, onClick })
    await nextTick()
    expect(list('top').classList.contains('am-notification-list-collapsed')).toBe(false)

    notification.open({ key: 4, title: '4', duration: 0, onClick })
    await settle()
    expect(list('top').classList.contains('am-notification-list-stack')).toBe(true)
    expect(list('top').classList.contains('am-notification-list-collapsed')).toBe(true)
    expect(list('bottom').classList.contains('am-notification-list-collapsed')).toBe(false)
    const wrappers = Array.from(list('top').querySelectorAll<HTMLElement>('.am-notification-wrapper'))
    expect(wrappers.map(w => w.style.getPropertyValue('--am-notification-index'))).toEqual(['0', '1', '2', '3'])

    // the first tap only opens the stack
    cards()[0].click()
    await settle()
    expect(onClick).not.toHaveBeenCalled()
    expect(list('top').classList.contains('am-notification-list-collapsed')).toBe(false)
    cards()[0].click()
    expect(onClick).toHaveBeenCalledTimes(1)

    // an outside tap folds it again
    document.body.click()
    await nextTick()
    expect(list('top').classList.contains('am-notification-list-collapsed')).toBe(true)

    notification.destroy(4)
    await flush()
    expect(list('top').classList.contains('am-notification-list-stack')).toBe(false)
  })

  it('supports a custom threshold and stack: false', async () => {
    notification.config({ stack: { threshold: 1 } })
    notification.open({ title: '1', duration: 0 })
    notification.open({ title: '2', duration: 0 })
    await nextTick()
    expect(list('top').classList.contains('am-notification-list-collapsed')).toBe(true)
    notification.config({ stack: false })
    await nextTick()
    expect(list('top').classList.contains('am-notification-list-stack')).toBe(false)
  })

  it('applies the global config: duration, getContainer, closeIcon, classes, showProgress', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const onClose = vi.fn()
    notification.config({
      duration: 1,
      getContainer: () => container,
      closeIcon: () => h('i', { class: 'global-x' }),
      classes: { root: 'global-root', title: 'global-title' },
      showProgress: true,
    })
    notification.open({ title: 'a', onClose, classes: { title: 'own-title' } })
    await nextTick()
    expect(container.querySelector('.am-notification')).not.toBeNull()
    expect(cards()[0].classList.contains('global-root')).toBe(true)
    expect(cards()[0].querySelector('.am-notification-title')!.classList.contains('own-title')).toBe(true)
    expect(cards()[0].querySelector('.am-notification-close .global-x')).not.toBeNull()
    expect(cards()[0].querySelector('.am-notification-progress')).not.toBeNull()
    await vi.advanceTimersByTimeAsync(1100)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('useNotification renders through the context holder and keeps the provider theme and locale', async () => {
    let api: any
    const Comp = defineComponent({
      setup() {
        const [notificationApi, ContextHolder] = notification.useNotification({ duration: 1, placement: 'bottom' })
        api = notificationApi
        return () => h(ConfigProvider, { theme: { algorithm: 'dark' }, locale: enUS, direction: 'rtl' }, { default: () => h(ContextHolder) })
      },
    })
    mount(Comp)
    await nextTick()
    api.success({ title: 'hook' })
    await nextTick()
    expect(document.querySelector('.am-static-holder')).toBeNull()
    const root = document.querySelector('.am-notification')!
    expect(root.classList.contains('am-theme-dark')).toBe(true)
    expect(root.getAttribute('dir')).toBe('rtl')
    expect(list('bottom').querySelectorAll('.am-notification-notice')).toHaveLength(1)
    expect(cards()[0].querySelector('.am-notification-close')!.getAttribute('aria-label')).toBe(enUS.common.close)
    await vi.advanceTimersByTimeAsync(1100)
    await flush()
    expect(cards()).toHaveLength(0)
  })

  it('the card prefers slots over props and passes attrs to the root', async () => {
    const wrapper = mount(NotificationVue, {
      props: { title: 'prop title', description: 'prop description', icon: 'prop icon', actions: 'prop actions', duration: 0, rootClass: 'root-class' },
      attrs: { 'class': 'attr-class', 'data-id': '1' },
      slots: { title: 'slot title', icon: 'slot icon', actions: 'slot actions', closeIcon: 'slot close' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-notification-notice', 'am-notification-notice-with-description', 'root-class', 'attr-class']))
    expect(wrapper.attributes('data-id')).toBe('1')
    expect(wrapper.find('.am-notification-title').text()).toBe('slot title')
    expect(wrapper.find('.am-notification-description').text()).toBe('prop description')
    expect(wrapper.find('.am-notification-icon').text()).toBe('slot icon')
    expect(wrapper.find('.am-notification-actions').text()).toBe('slot actions')
    expect(wrapper.find('.am-notification-close').text()).toBe('slot close')
    expect(wrapper.find('.am-notification-progress').exists()).toBe(false)

    await wrapper.find('.am-notification-close').trigger('click')
    await wrapper.find('.am-notification-close').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('the card pauses on mouse hover as well', async () => {
    const wrapper = mount(NotificationVue, { props: { title: 't', duration: 1 } })
    await wrapper.trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(3000)
    expect(wrapper.emitted('close')).toBeUndefined()
    await wrapper.trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(1000)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('animates the very first notification (the holder is mounted with it)', async () => {
    notification.destroy()
    await nextTick()
    // a fresh static holder: drop the current one
    document.querySelector('.am-notification')?.remove()
    notification.open({ title: 'first', duration: 0 })
    await nextTick()
    await nextTick()
    const wrapper = document.querySelector('.am-notification-wrapper')
    expect(wrapper).not.toBeNull()
    expect(wrapper!.classList.contains('am-notification-motion-enter-active')).toBe(true)
    notification.destroy()
  })
})
