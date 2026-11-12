import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Alert from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'

const noTransition = { global: { stubs: { transition: false } } }

describe('Alert', () => {
  it('renders title with default classes', () => {
    const wrapper = mount(Alert, { props: { title: 'Hello' } })
    const root = wrapper.find('.am-alert')
    expect(root.classes()).toEqual(expect.arrayContaining(['am-alert-info', 'am-alert-filled', 'am-alert-no-icon']))
    expect(root.attributes('role')).toBe('alert')
    expect(wrapper.find('.am-alert-title').text()).toBe('Hello')
    expect(wrapper.find('.am-alert-icon').exists()).toBe(false)
    expect(wrapper.find('.am-alert-close').exists()).toBe(false)
  })

  it('supports deprecated message and the default slot as title', () => {
    expect(mount(Alert, { props: { message: 'Msg' } }).find('.am-alert-title').text()).toBe('Msg')
    expect(mount(Alert, { props: { message: 'Msg', title: 'Title' } }).find('.am-alert-title').text()).toBe('Title')
    expect(mount(Alert, { slots: { default: 'Slot' } }).find('.am-alert-title').text()).toBe('Slot')
  })

  it.each(['success', 'info', 'warning', 'error'] as const)('renders type %s with icon', (type) => {
    const wrapper = mount(Alert, { props: { type, showIcon: true, title: 't' } })
    expect(wrapper.find('.am-alert').classes()).toContain(`am-alert-${type}`)
    expect(wrapper.find('.am-alert-icon .anticon').exists()).toBe(true)
  })

  it('renders description and variant', () => {
    const wrapper = mount(Alert, { props: { title: 't', description: 'desc', variant: 'outlined' } })
    expect(wrapper.find('.am-alert').classes()).toEqual(expect.arrayContaining(['am-alert-with-description', 'am-alert-outlined']))
    expect(wrapper.find('.am-alert-description').text()).toBe('desc')
  })

  it('banner defaults to warning with icon', () => {
    const wrapper = mount(Alert, { props: { banner: true, title: 't' } })
    expect(wrapper.find('.am-alert').classes()).toEqual(expect.arrayContaining(['am-alert-banner', 'am-alert-warning']))
    expect(wrapper.find('.am-alert-icon').exists()).toBe(true)
    const noIcon = mount(Alert, { props: { banner: true, showIcon: false, type: 'error' } })
    expect(noIcon.find('.am-alert-icon').exists()).toBe(false)
    expect(noIcon.find('.am-alert').classes()).toContain('am-alert-error')
  })

  it('slots win over props', () => {
    const wrapper = mount(Alert, {
      props: {
        showIcon: true,
        title: 'prop-title',
        description: 'prop-desc',
        icon: () => h('i', { class: 'prop-icon' }),
        action: 'prop-action',
        closable: true,
        closeIcon: () => h('i', { class: 'prop-close' }),
      },
      slots: {
        title: 'slot-title',
        description: 'slot-desc',
        icon: () => h('i', { class: 'slot-icon' }),
        action: 'slot-action',
        closeIcon: () => h('i', { class: 'slot-close' }),
      },
    })
    expect(wrapper.find('.am-alert-title').text()).toBe('slot-title')
    expect(wrapper.find('.am-alert-description').text()).toBe('slot-desc')
    expect(wrapper.find('.slot-icon').exists()).toBe(true)
    expect(wrapper.find('.prop-icon').exists()).toBe(false)
    expect(wrapper.find('.am-alert-actions').text()).toBe('slot-action')
    expect(wrapper.find('.slot-close').exists()).toBe(true)
    expect(wrapper.find('.prop-close').exists()).toBe(false)
  })

  it('renders icon / action / closeIcon props', () => {
    const wrapper = mount(Alert, {
      props: {
        showIcon: true,
        icon: () => h('i', { class: 'prop-icon' }),
        action: () => h('button', { class: 'prop-action' }),
        closeIcon: () => h('i', { class: 'prop-close' }),
      },
    })
    expect(wrapper.find('.prop-icon').exists()).toBe(true)
    expect(wrapper.find('.prop-action').exists()).toBe(true)
    // closeIcon alone makes it closable, like antdv-next
    expect(wrapper.find('.am-alert-close .prop-close').exists()).toBe(true)
  })

  it('closes: emits close then afterClose', async () => {
    const onClose = vi.fn()
    const onAfterClose = vi.fn()
    const wrapper = mount(Alert, {
      props: { title: 't', closable: true },
      attrs: { onClose, onAfterClose },
      ...noTransition,
    })
    await wrapper.find('.am-alert-close').trigger('click')
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onClose.mock.calls[0]![0]).toBeInstanceOf(MouseEvent)
    expect(wrapper.find('.am-alert').exists()).toBe(false)
    expect(onAfterClose).not.toHaveBeenCalled()
  })

  it('emits afterClose when the leave transition ends', async () => {
    const onAfterClose = vi.fn()
    const wrapper = mount(Alert, {
      props: { title: 't', closable: true },
      attrs: { onAfterClose },
      global: { stubs: { transition: true } },
    })
    await wrapper.find('.am-alert-close').trigger('click')
    wrapper.findComponent({ name: 'Transition' }).vm.$emit('after-leave')
    expect(onAfterClose).toHaveBeenCalledTimes(1)
  })

  it('supports closable config', async () => {
    const onClose = vi.fn()
    const wrapper = mount(Alert, {
      props: { closable: { 'closeIcon': () => h('i', { class: 'cfg-close' }), 'aria-label': 'dismiss', 'disabled': true } },
      attrs: { onClose },
    })
    const close = wrapper.find('.am-alert-close')
    expect(close.find('.cfg-close').exists()).toBe(true)
    expect(close.attributes('aria-label')).toBe('dismiss')
    await close.trigger('click')
    expect(onClose).not.toHaveBeenCalled()
    expect(wrapper.find('.am-alert').exists()).toBe(true)

    const forced = mount(Alert, { props: { closable: false, closeIcon: 'x' } })
    expect(forced.find('.am-alert-close').exists()).toBe(false)
  })

  it('uses locale for the close label', () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(Alert, { closable: true }) },
    })
    expect(wrapper.find('.am-alert-close').attributes('aria-label')).toBe('Close')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Alert, {
      props: {
        title: 't',
        description: 'd',
        showIcon: true,
        closable: true,
        action: 'a',
        rootClass: 'root-cls',
        classes: { root: 'r', icon: 'i', section: 's', title: 'tt', description: 'dd', actions: 'aa', close: 'cc' },
        styles: { title: { color: 'red' } },
      },
      attrs: { 'class': 'custom', 'style': 'margin: 1px', 'data-id': 'x' },
    })
    const root = wrapper.find('.am-alert')
    expect(root.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r']))
    expect(root.attributes('style')).toContain('margin: 1px')
    expect(root.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-alert-icon').classes()).toContain('i')
    expect(wrapper.find('.am-alert-section').classes()).toContain('s')
    expect(wrapper.find('.am-alert-title').classes()).toContain('tt')
    expect(wrapper.find('.am-alert-title').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-alert-description').classes()).toContain('dd')
    expect(wrapper.find('.am-alert-actions').classes()).toContain('aa')
    expect(wrapper.find('.am-alert-close').classes()).toContain('cc')
  })
})
