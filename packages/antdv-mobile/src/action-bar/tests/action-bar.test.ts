import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import ActionBar, { ActionBarButton, ActionBarIcon } from '..'
import ConfigProvider from '../../config-provider'

describe('ActionBar', () => {
  it('renders with default classes and children', () => {
    const wrapper = mount(ActionBar, {
      slots: { default: () => [h(ActionBarIcon, { text: 'Shop' }), h(ActionBarButton, null, () => 'Buy')] },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'am-action-bar',
      'am-action-bar-fixed',
      'am-action-bar-safe-area',
      'am-action-bar-bordered',
    ]))
    expect(wrapper.classes()).not.toContain('am-action-bar-placeholder')
    const content = wrapper.find('.am-action-bar-content')
    expect(content.find('.am-action-bar-icon').exists()).toBe(true)
    expect(content.find('.am-action-bar-button').exists()).toBe(true)
    expect(wrapper.find('.am-action-bar-prefix').exists()).toBe(false)
  })

  it('exposes the sub components as statics', () => {
    expect(ActionBar.Icon).toBe(ActionBarIcon)
    expect(ActionBar.Button).toBe(ActionBarButton)
    expect(ActionBar.name).toBe('AmActionBar')
    expect(ActionBarIcon.name).toBe('AmActionBarIcon')
    expect(ActionBarButton.name).toBe('AmActionBarButton')
  })

  it('supports fixed, placeholder, safeArea, bordered and zIndex', async () => {
    const wrapper = mount(ActionBar, { props: { placeholder: true, safeArea: false, bordered: false, zIndex: 7 } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-action-bar-fixed', 'am-action-bar-placeholder']))
    expect(wrapper.classes()).not.toContain('am-action-bar-safe-area')
    expect(wrapper.classes()).not.toContain('am-action-bar-bordered')
    expect(wrapper.find('.am-action-bar-content').attributes('style')).toContain('z-index: 7')
    // the placeholder only makes sense when fixed
    await wrapper.setProps({ fixed: false })
    expect(wrapper.classes()).not.toContain('am-action-bar-fixed')
    expect(wrapper.classes()).not.toContain('am-action-bar-placeholder')
  })

  it('renders the prefix prop and the prefix slot wins', () => {
    const byProp = mount(ActionBar, { props: { prefix: 'Total' } })
    expect(byProp.find('.am-action-bar-prefix').text()).toBe('Total')
    const bySlot = mount(ActionBar, { props: { prefix: 'Total' }, slots: { prefix: () => h('b', 'Slot') } })
    expect(bySlot.find('.am-action-bar-prefix').text()).toBe('Slot')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(ActionBar, {
      props: {
        prefix: 'x',
        rootClass: 'root-cls',
        classes: { root: 'r', content: 'content-cls', prefix: 'prefix-cls' },
        styles: { root: { color: 'red' }, content: { opacity: 0.5 }, prefix: { color: 'blue' } },
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-action-bar-content').classes()).toContain('content-cls')
    expect(wrapper.find('.am-action-bar-content').attributes('style')).toContain('opacity: 0.5')
    expect(wrapper.find('.am-action-bar-prefix').classes()).toContain('prefix-cls')
    expect(wrapper.find('.am-action-bar-prefix').attributes('style')).toContain('color: blue')
  })
})

describe('ActionBarIcon', () => {
  it('renders icon and text', () => {
    const wrapper = mount(ActionBarIcon, { props: { icon: () => h('i', { class: 'ic' }), text: 'Cart' } })
    expect(wrapper.classes()).toContain('am-action-bar-icon')
    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.attributes('tabindex')).toBe('0')
    expect(wrapper.find('.am-action-bar-icon-icon .ic').exists()).toBe(true)
    expect(wrapper.find('.am-action-bar-icon-text').text()).toBe('Cart')
    expect(wrapper.find('.am-action-bar-icon-badge').exists()).toBe(false)
  })

  it('skips the empty parts', () => {
    const onlyText = mount(ActionBarIcon, { props: { text: 'Cart' } })
    expect(onlyText.find('.am-action-bar-icon-icon').exists()).toBe(false)
    const onlyIcon = mount(ActionBarIcon, { props: { icon: 'I' } })
    expect(onlyIcon.find('.am-action-bar-icon-text').exists()).toBe(false)
  })

  it('renders number, text and dot badges through BaseBadge', () => {
    const count = mount(ActionBarIcon, { props: { icon: 'I', text: 'Cart', badge: 5 } })
    const badge = count.find('.am-action-bar-icon-icon .am-action-bar-icon-badge')
    expect(badge.classes()).toContain('am-base-badge')
    expect(badge.text()).toBe('5')

    const dot = mount(ActionBarIcon, { props: { icon: 'I', badge: true } })
    expect(dot.find('.am-action-bar-icon-badge').classes()).toEqual(expect.arrayContaining(['am-base-badge-dot', 'am-action-bar-icon-badge-dot']))
    expect(dot.find('.am-action-bar-icon-badge').text()).toBe('')

    // without an icon the badge is attached to the text
    const text = mount(ActionBarIcon, { props: { text: 'Cart', badge: 'new' } })
    expect(text.find('.am-action-bar-icon-text .am-action-bar-icon-badge').text()).toBe('new')

    const none = mount(ActionBarIcon, { props: { icon: 'I', badge: false } })
    expect(none.find('.am-action-bar-icon-badge').exists()).toBe(false)
  })

  it('slots take priority over props, default slot is the text', () => {
    const wrapper = mount(ActionBarIcon, {
      props: { icon: 'prop-icon', text: 'prop-text' },
      slots: { icon: () => h('i', { class: 'slot-icon' }), default: () => 'default-text' },
    })
    expect(wrapper.find('.slot-icon').exists()).toBe(true)
    expect(wrapper.find('.am-action-bar-icon-icon').text()).toBe('')
    expect(wrapper.find('.am-action-bar-icon-text').text()).toBe('default-text')

    const named = mount(ActionBarIcon, {
      props: { text: 'prop-text' },
      slots: { text: () => 'slot-text', default: () => 'default-text' },
    })
    expect(named.find('.am-action-bar-icon-text').text()).toBe('slot-text')
  })

  it('emits click on tap and Enter, not when disabled', async () => {
    const wrapper = mount(ActionBarIcon, { props: { text: 'Cart' } })
    await wrapper.trigger('click')
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('click')).toHaveLength(2)

    await wrapper.setProps({ disabled: true })
    expect(wrapper.classes()).toContain('am-action-bar-icon-disabled')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('tabindex')).toBe('-1')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(2)
  })

  it('follows ConfigProvider componentDisabled, own prop wins', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { componentDisabled: true },
      slots: {
        default: () => [
          h(ActionBarIcon, { text: 'A', class: 'a' }),
          h(ActionBarIcon, { text: 'B', class: 'b', disabled: false }),
        ],
      },
    })
    expect(wrapper.find('.a').classes()).toContain('am-action-bar-icon-disabled')
    expect(wrapper.find('.b').classes()).not.toContain('am-action-bar-icon-disabled')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(ActionBarIcon, {
      props: {
        icon: 'I',
        text: 'Cart',
        badge: 1,
        rootClass: 'root-cls',
        classes: { root: 'r', icon: 'icon-cls', text: 'text-cls', badge: 'badge-cls' },
        styles: { root: { color: 'red' }, icon: { color: 'blue' }, text: { color: 'green' }, badge: { opacity: 0.5 } },
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-action-bar-icon-icon').classes()).toContain('icon-cls')
    expect(wrapper.find('.am-action-bar-icon-icon').attributes('style')).toContain('color: blue')
    expect(wrapper.find('.am-action-bar-icon-text').classes()).toContain('text-cls')
    expect(wrapper.find('.am-action-bar-icon-text').attributes('style')).toContain('color: green')
    expect(wrapper.find('.am-action-bar-icon-badge').classes()).toContain('badge-cls')
    expect(wrapper.find('.am-action-bar-icon-badge').attributes('style')).toContain('opacity: 0.5')
  })
})

describe('ActionBarButton', () => {
  it('renders the library Button, primary by default', () => {
    const wrapper = mount(ActionBarButton, { slots: { default: () => 'Buy now' } })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'am-button',
      'am-action-bar-button',
      'am-button-color-primary',
      'am-button-variant-solid',
    ]))
    expect(wrapper.find('.am-button-content').text()).toBe('Buy now')
  })

  it('passes the Button props through', () => {
    const wrapper = mount(ActionBarButton, {
      props: { type: 'default', color: 'warning', variant: 'filled', ghost: true, icon: () => h('i', { class: 'ic' }), iconPlacement: 'end', htmlType: 'submit' },
      slots: { default: () => 'Add' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'am-button-color-warning',
      'am-button-variant-filled',
      'am-button-ghost',
      'am-button-icon-end',
    ]))
    expect(wrapper.attributes('type')).toBe('submit')
    expect(wrapper.find('.am-button-icon .ic').exists()).toBe(true)

    const danger = mount(ActionBarButton, { props: { danger: true } })
    expect(danger.classes()).toContain('am-button-color-danger')

    const link = mount(ActionBarButton, { props: { href: '/cart', target: '_blank' } })
    expect(link.element.tagName).toBe('A')
    expect(link.attributes('href')).toBe('/cart')
    expect(link.attributes('target')).toBe('_blank')
  })

  it('icon slot wins over the icon prop', () => {
    const wrapper = mount(ActionBarButton, {
      props: { icon: 'prop-icon' },
      slots: { icon: () => h('i', { class: 'slot-icon' }), default: () => 'Buy' },
    })
    expect(wrapper.find('.am-button-icon .slot-icon').exists()).toBe(true)
    expect(wrapper.find('.am-button-icon').text()).toBe('')
  })

  it('emits click, not when disabled or loading', async () => {
    const wrapper = mount(ActionBarButton, { slots: { default: () => 'Buy' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)

    await wrapper.setProps({ disabled: true })
    expect(wrapper.classes()).toContain('am-button-disabled')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)

    await wrapper.setProps({ disabled: false, loading: true })
    expect(wrapper.classes()).toContain('am-button-loading')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('follows ConfigProvider componentDisabled', () => {
    const wrapper = mount(ConfigProvider, {
      props: { componentDisabled: true },
      slots: { default: () => h(ActionBarButton, null, () => 'Buy') },
    })
    expect(wrapper.find('.am-action-bar-button').classes()).toContain('am-button-disabled')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(ActionBarButton, {
      props: {
        icon: 'I',
        rootClass: 'root-cls',
        classes: { root: 'r', icon: 'icon-cls', content: 'content-cls' },
        styles: { root: { color: 'red' }, content: { color: 'blue' } },
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
      slots: { default: () => 'Buy' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-action-bar-button', 'custom', 'root-cls', 'r']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-button-icon').classes()).toContain('icon-cls')
    expect(wrapper.find('.am-button-content').classes()).toContain('content-cls')
    expect(wrapper.find('.am-button-content').attributes('style')).toContain('color: blue')
  })
})
