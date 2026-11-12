import type { TabBarItem } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import TabBar from '..'

const items: TabBarItem[] = [
  { key: 'home', title: 'Home', icon: (active: boolean) => h('i', { class: active ? 'icon-on' : 'icon-off' }) },
  { key: 'todo', title: 'Todo', icon: () => h('i', { class: 'todo' }), badge: 5 },
  { key: 'msg', title: 'Message', icon: 'M', badge: true },
  { key: 'me', title: 'Me', disabled: true },
]

describe('TabBar', () => {
  it('renders items and activates the first one by default', () => {
    const wrapper = mount(TabBar, { props: { items } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-tab-bar', 'am-tab-bar-bordered', 'am-tab-bar-safe-area']))
    const tabs = wrapper.findAll('.am-tab-bar-item')
    expect(tabs).toHaveLength(4)
    expect(tabs[0].classes()).toContain('am-tab-bar-item-active')
    expect(tabs[0].attributes('aria-selected')).toBe('true')
    expect(tabs[0].find('.icon-on').exists()).toBe(true)
    expect(tabs[1].find('.icon-on').exists()).toBe(false)
    expect(tabs[3].find('.am-tab-bar-item-icon').exists()).toBe(false)
    expect(tabs[3].classes()).toContain('am-tab-bar-item-disabled')
  })

  it('renders number badge and dot badge', () => {
    const wrapper = mount(TabBar, { props: { items: [...items, { key: 'x', title: 'X', badge: 'new' }] } })
    const tabs = wrapper.findAll('.am-tab-bar-item')
    expect(tabs[0].find('.am-tab-bar-badge').exists()).toBe(false)
    expect(tabs[1].find('.am-tab-bar-badge').text()).toBe('5')
    expect(tabs[2].find('.am-tab-bar-badge').classes()).toContain('am-tab-bar-badge-dot')
    expect(tabs[2].find('.am-tab-bar-badge').text()).toBe('')
    // without an icon the badge is attached to the title
    expect(tabs[4].find('.am-tab-bar-item-title .am-tab-bar-badge').text()).toBe('new')
  })

  it('works uncontrolled with defaultActiveKey', async () => {
    const wrapper = mount(TabBar, { props: { items, defaultActiveKey: 'todo' } })
    const tabs = wrapper.findAll('.am-tab-bar-item')
    expect(tabs[1].classes()).toContain('am-tab-bar-item-active')
    await tabs[2].trigger('click')
    expect(tabs[2].classes()).toContain('am-tab-bar-item-active')
    expect(wrapper.emitted('change')![0]).toEqual(['msg'])
    expect(wrapper.emitted('update:activeKey')![0]).toEqual(['msg'])
    // same key / disabled do nothing
    await tabs[2].trigger('click')
    await tabs[3].trigger('click')
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('works controlled', async () => {
    const wrapper = mount(TabBar, { props: { items, activeKey: 'home' } })
    const tabs = wrapper.findAll('.am-tab-bar-item')
    await tabs[1].trigger('click')
    expect(wrapper.emitted('update:activeKey')![0]).toEqual(['todo'])
    expect(tabs[0].classes()).toContain('am-tab-bar-item-active')
    await wrapper.setProps({ activeKey: 'todo' })
    expect(tabs[1].classes()).toContain('am-tab-bar-item-active')
  })

  it('icon / title slots take priority and receive the item context', () => {
    const wrapper = mount(TabBar, {
      props: { items },
      slots: {
        icon: ({ item, active }: any) => h('b', { class: 'slot-icon' }, `${item.key}:${active}`),
        title: ({ item, index }: any) => `${index}-${item.key}`,
      },
    })
    const tabs = wrapper.findAll('.am-tab-bar-item')
    expect(tabs[0].find('.slot-icon').text()).toBe('home:true')
    expect(tabs[1].find('.slot-icon').text()).toBe('todo:false')
    expect(tabs[0].find('.icon-on').exists()).toBe(false)
    expect(tabs[1].find('.am-tab-bar-item-title').text()).toBe('1-todo')
  })

  it('supports fixed, placeholder, safeArea, bordered and zIndex', () => {
    const wrapper = mount(TabBar, { props: { items, fixed: true, placeholder: true, safeArea: false, bordered: false, zIndex: 7 } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-tab-bar-fixed', 'am-tab-bar-placeholder']))
    expect(wrapper.classes()).not.toContain('am-tab-bar-safe-area')
    expect(wrapper.classes()).not.toContain('am-tab-bar-bordered')
    expect(wrapper.find('.am-tab-bar-content').attributes('style')).toContain('z-index: 7')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(TabBar, {
      props: { items, rootClass: 'root-cls', classes: { item: 'item-cls', badge: 'badge-cls' }, styles: { item: { color: 'red' } } },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-tab-bar-item').classes()).toContain('item-cls')
    expect(wrapper.find('.am-tab-bar-item').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-tab-bar-badge').classes()).toContain('badge-cls')
  })
})
