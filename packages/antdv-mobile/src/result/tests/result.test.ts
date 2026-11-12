import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Result from '..'

describe('Result', () => {
  it('renders info status by default', () => {
    const wrapper = mount(Result, { props: { title: 'Title' } })
    expect(wrapper.classes()).toEqual(['am-result', 'am-result-info'])
    expect(wrapper.find('.am-result-icon .anticon').exists()).toBe(true)
    expect(wrapper.find('.am-result-title').text()).toBe('Title')
    expect(wrapper.find('.am-result-subtitle').exists()).toBe(false)
    expect(wrapper.find('.am-result-extra').exists()).toBe(false)
    expect(wrapper.find('.am-result-body').exists()).toBe(false)
  })

  it.each(['success', 'error', 'info', 'warning'] as const)('renders %s status icon', (status) => {
    const wrapper = mount(Result, { props: { status } })
    expect(wrapper.classes()).toContain(`am-result-${status}`)
    expect(wrapper.find('.am-result-icon .anticon').exists()).toBe(true)
    expect(wrapper.find('.am-result-image').exists()).toBe(false)
  })

  it.each([404, '403', 500] as const)('renders %s exception illustration', (status) => {
    const wrapper = mount(Result, { props: { status } })
    expect(wrapper.classes()).toContain(`am-result-${status}`)
    expect(wrapper.find('.am-result-image svg.am-result-exception').exists()).toBe(true)
    expect(wrapper.find('.am-result-exception-code').text()).toBe(String(status))
  })

  it('renders title / subTitle / extra / body', () => {
    const wrapper = mount(Result, {
      props: { status: 'success', title: 'Paid', subTitle: 'Order 2024', extra: () => h('button', 'Back') },
      slots: { default: () => h('p', 'detail') },
    })
    expect(wrapper.find('.am-result-title').text()).toBe('Paid')
    expect(wrapper.find('.am-result-subtitle').text()).toBe('Order 2024')
    expect(wrapper.find('.am-result-extra button').text()).toBe('Back')
    expect(wrapper.find('.am-result-body p').text()).toBe('detail')
  })

  it('slots take priority over props', () => {
    const wrapper = mount(Result, {
      props: { icon: () => h('i', { class: 'prop-icon' }), title: 'prop-title', subTitle: 'prop-sub', extra: 'prop-extra' },
      slots: {
        icon: () => h('i', { class: 'slot-icon' }),
        title: () => 'slot-title',
        subTitle: () => 'slot-sub',
        extra: () => 'slot-extra',
      },
    })
    expect(wrapper.find('.slot-icon').exists()).toBe(true)
    expect(wrapper.find('.prop-icon').exists()).toBe(false)
    expect(wrapper.find('.am-result-title').text()).toBe('slot-title')
    expect(wrapper.find('.am-result-subtitle').text()).toBe('slot-sub')
    expect(wrapper.find('.am-result-extra').text()).toBe('slot-extra')
  })

  it('supports custom icon prop and hiding the icon', () => {
    const custom = mount(Result, { props: { status: 404, icon: () => h('i', { class: 'prop-icon' }) } })
    expect(custom.find('.am-result-icon .prop-icon').exists()).toBe(true)
    expect(custom.find('.am-result-image').exists()).toBe(false)
    const hidden = mount(Result, { props: { icon: false } })
    expect(hidden.find('.am-result-icon').exists()).toBe(false)
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Result, {
      props: {
        title: 'Title',
        subTitle: 'Sub',
        extra: 'Extra',
        rootClass: 'root-cls',
        classes: { root: 'r', icon: 'icon-cls', title: 'title-cls', subTitle: 'sub-cls', extra: 'extra-cls', body: 'body-cls' },
        styles: { root: { margin: '1px' }, title: { color: 'red' } },
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
      slots: { default: 'body' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.find('.am-result-icon').classes()).toContain('icon-cls')
    expect(wrapper.find('.am-result-title').classes()).toContain('title-cls')
    expect(wrapper.find('.am-result-title').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-result-subtitle').classes()).toContain('sub-cls')
    expect(wrapper.find('.am-result-extra').classes()).toContain('extra-cls')
    expect(wrapper.find('.am-result-body').classes()).toContain('body-cls')
  })
})
