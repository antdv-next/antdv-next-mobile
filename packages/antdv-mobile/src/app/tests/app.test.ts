import type { UseAppProps } from '..'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import App from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'

/** let transitions (rAF based in jsdom) finish */
async function flush(ms = 100) {
  await nextTick()
  await vi.advanceTimersByTimeAsync(ms)
}

function createChild(onApi: (api: UseAppProps) => void) {
  return defineComponent({
    setup() {
      onApi(App.useApp())
      return () => h('p', { class: 'child' }, 'child')
    },
  })
}

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a div root with attrs, rootClass and the default slot', () => {
    const wrapper = mount(App, {
      props: { rootClass: 'root-class' },
      attrs: { 'class': 'attr-class', 'data-id': '1', 'style': 'color: red' },
      slots: { default: () => h('p', { class: 'child' }, 'child') },
    })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-app', 'root-class', 'attr-class']))
    expect(wrapper.classes()).not.toContain('am-app-rtl')
    expect(wrapper.attributes('data-id')).toBe('1')
    expect((wrapper.element as HTMLElement).style.color).toBe('red')
    expect(wrapper.find('.child').exists()).toBe(true)
    expect(App.name).toBe('AmApp')
  })

  it('supports a custom component and component: false', () => {
    const section = mount(App, { props: { component: 'section' }, slots: { default: () => 'text' } })
    expect(section.element.tagName).toBe('SECTION')
    expect(section.classes()).toContain('am-app')

    const Child = createChild(() => {})
    const bare = mount(defineComponent({
      setup: () => () => h('main', [h(App, { component: false }, { default: () => h(Child) })]),
    }))
    expect(bare.find('.am-app').exists()).toBe(false)
    expect(bare.find('main > .child').exists()).toBe(true)
  })

  it('follows the direction of the ConfigProvider', () => {
    const wrapper = mount(defineComponent({
      setup: () => () => h(ConfigProvider, { direction: 'rtl' }, { default: () => h(App) }),
    }))
    expect(wrapper.find('.am-app').classes()).toContain('am-app-rtl')
  })

  it('useApp returns instances rendered under the surrounding ConfigProvider theme and locale', async () => {
    let api!: UseAppProps
    const Child = createChild(value => (api = value))
    mount(defineComponent({
      setup: () => () => h(
        ConfigProvider,
        { theme: { algorithm: 'dark' }, locale: enUS },
        { default: () => h(App, null, { default: () => h(Child) }) },
      ),
    }))
    await nextTick()

    api.message.success('message')
    api.notification.info({ title: 'notification', duration: 0 })
    api.toast.show('toast')
    api.modal.confirm({ title: 'modal' })
    await flush(10)

    expect(document.querySelector('.am-static-holder')).toBeNull()
    expect(document.querySelector('.am-message')!.classList.contains('am-theme-dark')).toBe(true)
    expect(document.querySelector('.am-message-text')!.textContent).toBe('message')
    expect(document.querySelector('.am-notification')!.classList.contains('am-theme-dark')).toBe(true)
    expect(document.querySelector('.am-notification-title')!.textContent).toBe('notification')
    expect(document.querySelector('.am-notification-close')!.getAttribute('aria-label')).toBe(enUS.common.close)
    expect(document.querySelector('.am-toast-root')!.classList.contains('am-theme-dark')).toBe(true)
    expect(document.querySelector('.am-toast')!.textContent).toBe('toast')
    expect(document.querySelector('.am-modal-root, .am-modal')!.closest('.am-theme-dark')).not.toBeNull()
    expect(Array.from(document.querySelectorAll('.am-modal-action')).map(el => el.textContent)).toEqual([enUS.Modal.cancelText, enUS.Modal.okText])

    api.message.destroy()
    api.notification.destroy()
    api.toast.clear()
    document.querySelector<HTMLElement>('.am-modal-action')!.click()
    await flush(500)
    expect(document.querySelector('.am-message-notice')).toBeNull()
    expect(document.querySelector('.am-notification-notice')).toBeNull()
    expect(document.querySelector('.am-toast')).toBeNull()
    expect(document.querySelector('.am-modal')).toBeNull()
  })

  it('applies the message / notification / toast config and keeps it reactive', async () => {
    let api!: UseAppProps
    const Child = createChild(value => (api = value))
    const duration = ref(1)
    mount(defineComponent({
      setup: () => () => h(App, {
        message: { duration: duration.value, top: 50 },
        notification: { duration: duration.value, placement: 'bottom', bottom: 30 },
        toast: { duration: duration.value * 1000, position: 'bottom' },
      }, { default: () => h(Child) }),
    }))
    await nextTick()

    api.message.info('m')
    api.notification.open({ title: 'n' })
    api.toast.show('t')
    await nextTick()
    expect(document.querySelector<HTMLElement>('.am-message')!.style.getPropertyValue('--am-message-top')).toBe('50px')
    expect(document.querySelector<HTMLElement>('.am-notification')!.style.getPropertyValue('--am-notification-bottom')).toBe('30px')
    expect(document.querySelector('.am-notification-list-bottom .am-notification-notice')).not.toBeNull()
    expect(document.querySelector('.am-toast')!.classList.contains('am-toast-bottom')).toBe(true)
    await vi.advanceTimersByTimeAsync(1100)
    await flush()
    expect(document.querySelector('.am-message-notice')).toBeNull()
    expect(document.querySelector('.am-notification-notice')).toBeNull()
    expect(document.querySelector('.am-toast')).toBeNull()

    duration.value = 5
    await nextTick()
    api.message.info('m')
    api.notification.open({ title: 'n' })
    await vi.advanceTimersByTimeAsync(4000)
    expect(document.querySelector('.am-message-notice')).not.toBeNull()
    expect(document.querySelector('.am-notification-notice')).not.toBeNull()
    await vi.advanceTimersByTimeAsync(1100)
    await flush()
    expect(document.querySelector('.am-message-notice')).toBeNull()
    expect(document.querySelector('.am-notification-notice')).toBeNull()
  })

  it('a nested App inherits the config of its parent and owns its instances', async () => {
    let outer!: UseAppProps
    let inner!: UseAppProps
    const Outer = createChild(value => (outer = value))
    const Inner = createChild(value => (inner = value))
    mount(defineComponent({
      setup: () => () => h(App, { notification: { placement: 'bottom', duration: 0 } }, {
        default: () => [h(Outer), h(App, { notification: { maxCount: 1 } }, { default: () => h(Inner) })],
      }),
    }))
    await nextTick()
    expect(inner.notification).not.toBe(outer.notification)

    inner.notification.open({ title: '1' })
    inner.notification.open({ title: '2' })
    await flush()
    const cards = Array.from(document.querySelectorAll('.am-notification-list-bottom .am-notification-notice'))
    expect(cards.map(el => el.textContent)).toEqual(['2'])
    await vi.advanceTimersByTimeAsync(10000)
    expect(document.querySelectorAll('.am-notification-notice')).toHaveLength(1)
  })

  it('exposes the instances on the component ref', () => {
    let api!: UseAppProps
    const Child = createChild(value => (api = value))
    const wrapper = mount(App, { slots: { default: () => h(Child) } })
    const exposed = wrapper.vm as unknown as UseAppProps
    expect(exposed.message).toBe(api.message)
    expect(exposed.notification).toBe(api.notification)
    expect(exposed.modal).toBe(api.modal)
    expect(exposed.toast).toBe(api.toast)
  })

  it('useApp outside an App returns empty instances, as on PC', () => {
    let api!: UseAppProps
    mount(createChild(value => (api = value)))
    expect(api).toEqual({ message: {}, notification: {}, modal: {}, toast: {} })
  })
})
