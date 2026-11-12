import type { TabsItem } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import Tabs from '..'
import ConfigProvider from '../../config-provider'

const items: TabsItem[] = [
  { key: '1', label: 'Tab 1', content: 'Content 1' },
  { key: '2', label: 'Tab 2', content: () => h('p', { class: 'c2' }, 'Content 2') },
  { key: '3', label: 'Tab 3', children: 'Content 3', disabled: true },
  { key: '4', label: 'Tab 4', content: 'Content 4', icon: () => h('i', { class: 'tab-icon' }) },
]

function swipe(wrapper: ReturnType<typeof mount>, from: number, to: number) {
  const body = wrapper.find('.am-tabs-body')
  return (async () => {
    await body.trigger('touchstart', { touches: [{ clientX: from, clientY: 0 }] })
    await body.trigger('touchmove', { touches: [{ clientX: (from + to) / 2, clientY: 0 }] })
    await body.trigger('touchmove', { touches: [{ clientX: to, clientY: 0 }] })
    await body.trigger('touchend')
  })()
}

describe('Tabs', () => {
  it('renders tabs, activates the first one and renders panes lazily', () => {
    const wrapper = mount(Tabs, { props: { items } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-tabs', 'am-tabs-top', 'am-tabs-line', 'am-tabs-stretch']))
    const tabs = wrapper.findAll('.am-tabs-tab')
    expect(tabs).toHaveLength(4)
    expect(tabs[0].classes()).toContain('am-tabs-tab-active')
    expect(tabs[2].classes()).toContain('am-tabs-tab-disabled')
    expect(tabs[3].find('.tab-icon').exists()).toBe(true)
    const panes = wrapper.findAll('.am-tabs-tabpane')
    expect(panes[0].text()).toBe('Content 1')
    expect(panes[0].classes()).toContain('am-tabs-tabpane-active')
    expect(panes[1].text()).toBe('')
    expect(wrapper.find('.am-tabs-ink-bar').exists()).toBe(true)
  })

  it('switches uncontrolled, keeps visited panes and emits events', async () => {
    const wrapper = mount(Tabs, { props: { items, defaultActiveKey: '2' } })
    const tabs = wrapper.findAll('.am-tabs-tab')
    const panes = wrapper.findAll('.am-tabs-tabpane')
    expect(panes[1].find('.c2').exists()).toBe(true)
    await tabs[3].trigger('click')
    expect(tabs[3].classes()).toContain('am-tabs-tab-active')
    expect(panes[3].text()).toBe('Content 4')
    expect(panes[1].find('.c2').exists()).toBe(true)
    expect(wrapper.emitted('change')![0]).toEqual(['4'])
    expect(wrapper.emitted('update:activeKey')![0]).toEqual(['4'])
    expect(wrapper.emitted('tabClick')![0][0]).toBe('4')
    // disabled: tabClick only
    await tabs[2].trigger('click')
    expect(wrapper.emitted('tabClick')).toHaveLength(2)
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('works controlled', async () => {
    const wrapper = mount(Tabs, { props: { items, activeKey: '1' } })
    const tabs = wrapper.findAll('.am-tabs-tab')
    await tabs[1].trigger('click')
    expect(wrapper.emitted('update:activeKey')![0]).toEqual(['2'])
    expect(tabs[0].classes()).toContain('am-tabs-tab-active')
    await wrapper.setProps({ activeKey: '2' })
    expect(tabs[1].classes()).toContain('am-tabs-tab-active')
  })

  it('supports destroyOnHidden and forceRender', async () => {
    const wrapper = mount(Tabs, {
      props: {
        destroyOnHidden: true,
        items: [
          { key: 'a', label: 'A', content: 'A content' },
          { key: 'b', label: 'B', content: 'B content', forceRender: true },
          { key: 'c', label: 'C', content: 'C content', destroyOnHidden: false },
        ],
      },
    })
    const tabs = wrapper.findAll('.am-tabs-tab')
    const panes = wrapper.findAll('.am-tabs-tabpane')
    expect(panes[1].text()).toBe('B content')
    expect(panes[2].text()).toBe('')
    await tabs[2].trigger('click')
    expect(panes[0].text()).toBe('')
    await tabs[0].trigger('click')
    expect(panes[2].text()).toBe('C content')
  })

  it('supports type, size, centered, stretch, placement and sticky', async () => {
    const wrapper = mount(Tabs, {
      props: { items, type: 'capsule', size: 'small', centered: true, tabPosition: 'bottom', sticky: true, offsetTop: 46 },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-tabs-capsule', 'am-tabs-sm', 'am-tabs-centered', 'am-tabs-bottom', 'am-tabs-sticky']))
    expect(wrapper.classes()).not.toContain('am-tabs-stretch')
    expect(wrapper.find('.am-tabs-ink-bar').exists()).toBe(false)
    expect(wrapper.find('.am-tabs-header').attributes('style')).toContain('top: 46px')
    await wrapper.setProps({ tabPlacement: 'top', stretch: true, type: 'card' })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-tabs-top', 'am-tabs-stretch', 'am-tabs-card']))
    const many = mount(Tabs, { props: { items: Array.from({ length: 6 }, (_, i) => ({ key: i, label: `T${i}` })) } })
    expect(many.classes()).not.toContain('am-tabs-stretch')
  })

  it('renders labelRender / contentRender / default / extra slots', () => {
    const wrapper = mount(Tabs, {
      props: { items },
      slots: {
        labelRender: ({ item, index }: any) => `L${index}-${item.key}`,
        contentRender: ({ item }: any) => `slot-${item.key}`,
        leftExtra: 'left',
        rightExtra: 'right',
      },
    })
    expect(wrapper.findAll('.am-tabs-tab')[1].text()).toBe('L1-2')
    expect(wrapper.findAll('.am-tabs-tabpane')[0].text()).toBe('slot-1')
    expect(wrapper.findAll('.am-tabs-extra').map(e => e.text())).toEqual(['left', 'right'])

    const fallback = mount(Tabs, {
      props: { items: [{ key: 'x', label: 'X' }, { key: 'y', label: 'Y', content: 'own' }], defaultActiveKey: 'x' },
      slots: { default: ({ item }: any) => `default-${item.key}` },
    })
    expect(fallback.findAll('.am-tabs-tabpane')[0].text()).toBe('default-x')
  })

  it('animates panes on a track and follows the active index', async () => {
    const wrapper = mount(Tabs, { props: { items, animated: true } })
    const track = wrapper.find('.am-tabs-content')
    expect(track.classes()).toContain('am-tabs-content-track')
    expect(track.attributes('style')).toContain('translate3d(calc(0% + 0px), 0, 0)')
    await wrapper.findAll('.am-tabs-tab')[1].trigger('click')
    expect(track.attributes('style')).toContain('translate3d(calc(-100% + 0px), 0, 0)')
    const plain = mount(Tabs, { props: { items, animated: { inkBar: false } } })
    expect(plain.find('.am-tabs-content').classes()).not.toContain('am-tabs-content-track')
  })

  it('switches by swiping and skips disabled tabs', async () => {
    const wrapper = mount(Tabs, { props: { items, swipeable: true, defaultActiveKey: '2' } })
    const track = wrapper.find('.am-tabs-content')
    const body = wrapper.find('.am-tabs-body')
    await body.trigger('touchstart', { touches: [{ clientX: 200, clientY: 0 }] })
    await body.trigger('touchmove', { touches: [{ clientX: 150, clientY: 0 }] })
    expect(track.classes()).toContain('am-tabs-content-dragging')
    expect(track.attributes('style')).toContain('-50px')
    await body.trigger('touchmove', { touches: [{ clientX: 100, clientY: 0 }] })
    await body.trigger('touchend')
    expect(track.classes()).not.toContain('am-tabs-content-dragging')
    // tab 3 is disabled -> jumps to tab 4
    expect(wrapper.emitted('change')![0]).toEqual(['4'])
    // rubber band at the end, no change
    await swipe(wrapper, 200, 100)
    expect(wrapper.emitted('change')).toHaveLength(1)
    await swipe(wrapper, 100, 200)
    expect(wrapper.emitted('change')![1]).toEqual(['2'])
  })

  it('ignores vertical gestures and does nothing when not swipeable', async () => {
    const wrapper = mount(Tabs, { props: { items, swipeable: true } })
    const body = wrapper.find('.am-tabs-body')
    await body.trigger('touchstart', { touches: [{ clientX: 100, clientY: 0 }] })
    await body.trigger('touchmove', { touches: [{ clientX: 100, clientY: 80 }] })
    await body.trigger('touchend')
    expect(wrapper.emitted('change')).toBeUndefined()
    const fixed = mount(Tabs, { props: { items } })
    await swipe(fixed, 200, 50)
    expect(fixed.emitted('change')).toBeUndefined()
  })

  it('reverses the swipe direction in RTL', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: { default: () => h(Tabs, { items, swipeable: true }) },
    })
    const tabs = wrapper.findComponent(Tabs)
    await swipe(tabs as any, 100, 200)
    expect(tabs.emitted('change')![0]).toEqual(['2'])
    await nextTick()
    expect(wrapper.find('.am-tabs-content').attributes('style')).toContain('calc(100% + 0px)')
  })

  it('passes attrs, rootClass, classes, styles and ConfigProvider size', () => {
    const wrapper = mount(Tabs, {
      props: {
        items,
        rootClass: 'root-cls',
        classes: { header: 'header-cls', item: 'item-cls', content: 'content-cls', indicator: 'ink-cls', body: 'body-cls' },
        styles: { item: { color: 'red' } },
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-tabs-header').classes()).toContain('header-cls')
    expect(wrapper.find('.am-tabs-tab').classes()).toContain('item-cls')
    expect(wrapper.find('.am-tabs-tab').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-tabs-tabpane').classes()).toContain('content-cls')
    expect(wrapper.find('.am-tabs-ink-bar').classes()).toContain('ink-cls')
    expect(wrapper.find('.am-tabs-body').classes()).toContain('body-cls')

    const sized = mount(ConfigProvider, {
      props: { componentSize: 'large' },
      slots: { default: () => h(Tabs, { items }) },
    })
    expect(sized.find('.am-tabs').classes()).toContain('am-tabs-lg')
  })
})
