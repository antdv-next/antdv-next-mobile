import type { SideBarItem } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import SideBar from '..'

const items: SideBarItem[] = [
  { key: 'a', title: 'A' },
  { key: 'b', title: 'B', badge: 5 },
  { key: 'c', title: () => h('em', 'C'), badge: true },
  { key: 'd', title: 'D', disabled: true },
]

describe('SideBar', () => {
  it('renders items and activates the first one by default', () => {
    const wrapper = mount(SideBar, { props: { items } })
    expect(wrapper.classes()).toContain('am-side-bar')
    const els = wrapper.findAll('.am-side-bar-item')
    expect(els).toHaveLength(4)
    expect(els[0].classes()).toContain('am-side-bar-item-active')
    expect(els[1].classes()).toContain('am-side-bar-item-next')
    expect(els[2].find('em').text()).toBe('C')
    expect(els[3].classes()).toContain('am-side-bar-item-disabled')
  })

  it('renders badges', () => {
    const wrapper = mount(SideBar, { props: { items } })
    const els = wrapper.findAll('.am-side-bar-item')
    expect(els[0].find('.am-side-bar-badge').exists()).toBe(false)
    expect(els[1].find('.am-side-bar-badge').text()).toBe('5')
    expect(els[2].find('.am-side-bar-badge').classes()).toContain('am-side-bar-badge-dot')
  })

  it('works uncontrolled and marks neighbours', async () => {
    const wrapper = mount(SideBar, { props: { items, defaultActiveKey: 'b' } })
    const els = wrapper.findAll('.am-side-bar-item')
    expect(els[1].classes()).toContain('am-side-bar-item-active')
    await els[2].trigger('click')
    expect(els[2].classes()).toContain('am-side-bar-item-active')
    expect(els[1].classes()).toContain('am-side-bar-item-prev')
    expect(els[3].classes()).toContain('am-side-bar-item-next')
    expect(wrapper.emitted('change')![0]).toEqual(['c'])
    expect(wrapper.emitted('update:activeKey')![0]).toEqual(['c'])
    await els[3].trigger('click')
    await els[2].trigger('click')
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('works controlled', async () => {
    const wrapper = mount(SideBar, { props: { items, activeKey: 'a' } })
    const els = wrapper.findAll('.am-side-bar-item')
    await els[1].trigger('click')
    expect(wrapper.emitted('update:activeKey')![0]).toEqual(['b'])
    expect(els[0].classes()).toContain('am-side-bar-item-active')
    await wrapper.setProps({ activeKey: 'b' })
    expect(els[1].classes()).toContain('am-side-bar-item-active')
  })

  it('title slot takes priority and receives the item context', () => {
    const wrapper = mount(SideBar, {
      props: { items },
      slots: { title: ({ item, index, active }: any) => `${index}-${item.key}-${active}` },
    })
    expect(wrapper.findAll('.am-side-bar-item-title')[0].text()).toBe('0-a-true')
    expect(wrapper.findAll('.am-side-bar-item-title')[1].text()).toContain('1-b-false')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(SideBar, {
      props: { items, rootClass: 'root-cls', classes: { item: 'item-cls', title: 'title-cls' }, styles: { item: { color: 'red' } } },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-side-bar-item').classes()).toContain('item-cls')
    expect(wrapper.find('.am-side-bar-item').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-side-bar-item-title').classes()).toContain('title-cls')
  })
})
