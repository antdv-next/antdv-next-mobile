import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import NavBar from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'

describe('NavBar', () => {
  it('renders title, back arrow and base classes', () => {
    const wrapper = mount(NavBar, { props: { title: 'Title' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-nav-bar', 'am-nav-bar-bordered']))
    expect(wrapper.find('.am-nav-bar-title-text').text()).toBe('Title')
    expect(wrapper.find('.am-nav-bar-back-icon').exists()).toBe(true)
    expect(wrapper.find('.am-nav-bar-back-text').exists()).toBe(false)
    expect(wrapper.find('.am-nav-bar-sub-title').exists()).toBe(false)
    expect(wrapper.find('.am-nav-bar-back').attributes('aria-label')).toBe('返回')
  })

  it('renders back text, sub title, left and right', () => {
    const wrapper = mount(NavBar, {
      props: { title: 'Title', subTitle: 'Sub', back: 'Back', left: 'Left', right: () => h('i', { class: 'r' }) },
    })
    expect(wrapper.find('.am-nav-bar-back-text').text()).toBe('Back')
    expect(wrapper.find('.am-nav-bar-sub-title').text()).toBe('Sub')
    expect(wrapper.find('.am-nav-bar-left').text()).toContain('Left')
    expect(wrapper.find('.am-nav-bar-right .r').exists()).toBe(true)
  })

  it('hides the back area with back=null and the arrow with backIcon=false', () => {
    const hidden = mount(NavBar, { props: { back: null } })
    expect(hidden.find('.am-nav-bar-back').exists()).toBe(false)
    const noArrow = mount(NavBar, { props: { back: 'Close', backIcon: false } })
    expect(noArrow.find('.am-nav-bar-back').exists()).toBe(true)
    expect(noArrow.find('.am-nav-bar-back-icon').exists()).toBe(false)
    const custom = mount(NavBar, { props: { backIcon: () => h('i', { class: 'custom-arrow' }) } })
    expect(custom.find('.am-nav-bar-back-icon .custom-arrow').exists()).toBe(true)
  })

  it('emits back', async () => {
    const wrapper = mount(NavBar)
    await wrapper.find('.am-nav-bar-back').trigger('click')
    expect(wrapper.emitted('back')).toHaveLength(1)
  })

  it('slots take priority over props', () => {
    const wrapper = mount(NavBar, {
      props: { title: 'prop-title', back: 'prop-back', right: 'prop-right', subTitle: 'prop-sub' },
      slots: { default: 'slot-title', back: 'slot-back', right: 'slot-right', subTitle: 'slot-sub', left: 'slot-left' },
    })
    expect(wrapper.find('.am-nav-bar-title-text').text()).toBe('slot-title')
    expect(wrapper.find('.am-nav-bar-back-text').text()).toBe('slot-back')
    expect(wrapper.find('.am-nav-bar-right').text()).toBe('slot-right')
    expect(wrapper.find('.am-nav-bar-sub-title').text()).toBe('slot-sub')
    expect(wrapper.find('.am-nav-bar-left').text()).toContain('slot-left')
    const named = mount(NavBar, { props: { title: 'prop-title' }, slots: { title: 'named-title' } })
    expect(named.find('.am-nav-bar-title-text').text()).toBe('named-title')
  })

  it('supports fixed, placeholder, safeArea, bordered and zIndex', () => {
    const wrapper = mount(NavBar, { props: { fixed: true, placeholder: true, safeArea: true, bordered: false, zIndex: 9 } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-nav-bar-fixed', 'am-nav-bar-placeholder', 'am-nav-bar-safe-area']))
    expect(wrapper.classes()).not.toContain('am-nav-bar-bordered')
    expect(wrapper.find('.am-nav-bar-content').attributes('style')).toContain('z-index: 9')
    const noFixed = mount(NavBar, { props: { placeholder: true } })
    expect(noFixed.classes()).not.toContain('am-nav-bar-placeholder')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(NavBar, {
      props: { title: 'T', rootClass: 'root-cls', classes: { title: 'title-cls', back: 'back-cls' }, styles: { title: { color: 'red' } } },
      attrs: { 'class': 'custom', 'style': 'margin: 1px', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-nav-bar-title').classes()).toContain('title-cls')
    expect(wrapper.find('.am-nav-bar-title').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-nav-bar-back').classes()).toContain('back-cls')
  })

  it('follows ConfigProvider locale', () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(NavBar) },
    })
    expect(wrapper.find('.am-nav-bar-back').attributes('aria-label')).toBe(enUS.common.back)
  })
})
