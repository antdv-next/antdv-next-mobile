import type { CollapseItemType } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Collapse, { CollapsePanel } from '..'
import ConfigProvider from '../../config-provider'

const items: CollapseItemType[] = [
  { key: '1', label: 'Panel 1', content: 'Content 1' },
  { key: '2', label: 'Panel 2', children: 'Content 2', extra: 'extra' },
  { key: '3', label: 'Panel 3', content: () => h('p', { class: 'c3' }, 'Content 3'), showArrow: false },
]

const headers = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('.am-collapse-header')
/** lets the leave transition finish (jsdom has no transitionend, Vue resolves it on the next frames) */
const flushMotion = () => new Promise(resolve => setTimeout(resolve, 60))
const itemsOf = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('.am-collapse-item')

describe('Collapse', () => {
  it('renders items collapsed and lazily', () => {
    const wrapper = mount(Collapse, { props: { items } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-collapse', 'am-collapse-bordered', 'am-collapse-icon-end']))
    expect(itemsOf(wrapper)).toHaveLength(3)
    expect(wrapper.findAll('.am-collapse-title').map(e => e.text())).toEqual(['Panel 1', 'Panel 2', 'Panel 3'])
    expect(wrapper.find('.am-collapse-panel').exists()).toBe(false)
    expect(itemsOf(wrapper)[1].find('.am-collapse-extra').text()).toBe('extra')
    expect(itemsOf(wrapper)[0].find('.am-collapse-expand-icon').exists()).toBe(true)
    expect(itemsOf(wrapper)[2].find('.am-collapse-expand-icon').exists()).toBe(false)
    expect(headers(wrapper)[0].attributes('aria-expanded')).toBe('false')
  })

  it('works uncontrolled with multiple panels', async () => {
    const wrapper = mount(Collapse, { props: { items, defaultActiveKey: ['1'] } })
    expect(itemsOf(wrapper)[0].classes()).toContain('am-collapse-item-active')
    expect(itemsOf(wrapper)[0].find('.am-collapse-body').text()).toBe('Content 1')
    await headers(wrapper)[2].trigger('click')
    expect(wrapper.emitted('change')![0]).toEqual([['1', '3']])
    expect(wrapper.emitted('update:activeKey')![0]).toEqual([['1', '3']])
    expect(itemsOf(wrapper)[2].find('.c3').exists()).toBe(true)
    await headers(wrapper)[0].trigger('click')
    expect(wrapper.emitted('change')![1]).toEqual([['3']])
    await flushMotion()
    // collapsed content stays mounted but hidden
    const panel = itemsOf(wrapper)[0].find('.am-collapse-panel')
    expect(panel.exists()).toBe(true)
    expect((panel.element as HTMLElement).style.display).toBe('none')
  })

  it('works controlled', async () => {
    const wrapper = mount(Collapse, { props: { items, activeKey: ['1'] } })
    await headers(wrapper)[1].trigger('click')
    expect(wrapper.emitted('update:activeKey')![0]).toEqual([['1', '2']])
    expect(itemsOf(wrapper)[1].classes()).not.toContain('am-collapse-item-active')
    await wrapper.setProps({ activeKey: ['1', '2'] })
    expect(itemsOf(wrapper)[1].classes()).toContain('am-collapse-item-active')
    await wrapper.setProps({ activeKey: 2 })
    expect(itemsOf(wrapper)[0].classes()).not.toContain('am-collapse-item-active')
    expect(itemsOf(wrapper)[1].classes()).toContain('am-collapse-item-active')
  })

  it('supports accordion', async () => {
    const wrapper = mount(Collapse, { props: { items, accordion: true, defaultActiveKey: '1' } })
    await headers(wrapper)[1].trigger('click')
    expect(wrapper.emitted('change')![0]).toEqual([['2']])
    expect(itemsOf(wrapper)[0].classes()).not.toContain('am-collapse-item-active')
    expect(itemsOf(wrapper)[1].classes()).toContain('am-collapse-item-active')
    await headers(wrapper)[1].trigger('click')
    expect(wrapper.emitted('change')![1]).toEqual([[]])
  })

  it('supports destroyOnHidden and forceRender', async () => {
    const wrapper = mount(Collapse, {
      props: { destroyOnHidden: true, items: [{ key: 'a', label: 'A', content: 'A' }, { key: 'b', label: 'B', content: 'B', forceRender: true }] },
    })
    expect(itemsOf(wrapper)[0].find('.am-collapse-panel').exists()).toBe(false)
    expect(itemsOf(wrapper)[1].find('.am-collapse-panel').exists()).toBe(true)
    await headers(wrapper)[0].trigger('click')
    expect(itemsOf(wrapper)[0].find('.am-collapse-panel').exists()).toBe(true)
    await headers(wrapper)[0].trigger('click')
    await flushMotion()
    expect(itemsOf(wrapper)[0].find('.am-collapse-panel').exists()).toBe(false)
  })

  it('supports collapsible: header / icon / disabled', async () => {
    const wrapper = mount(Collapse, {
      props: {
        items: [
          { key: 'h', label: 'Header', content: 'x', collapsible: 'header' },
          { key: 'i', label: 'Icon', content: 'x', collapsible: 'icon' },
          { key: 'd', label: 'Disabled', content: 'x', collapsible: 'disabled' },
        ],
      },
    })
    const [h1, i1, d1] = itemsOf(wrapper)
    await h1.find('.am-collapse-expand-icon').trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
    await h1.find('.am-collapse-title').trigger('click')
    expect(wrapper.emitted('change')![0]).toEqual([['h']])
    await i1.find('.am-collapse-title').trigger('click')
    expect(wrapper.emitted('change')).toHaveLength(1)
    await i1.find('.am-collapse-expand-icon').trigger('click')
    expect(wrapper.emitted('change')![1]).toEqual([['h', 'i']])
    expect(d1.classes()).toContain('am-collapse-item-disabled')
    await d1.find('.am-collapse-header').trigger('click')
    expect(wrapper.emitted('change')).toHaveLength(2)

    const all = mount(Collapse, { props: { items, collapsible: 'disabled' } })
    await headers(all)[0].trigger('click')
    expect(all.emitted('change')).toBeUndefined()
  })

  it('supports bordered, ghost, size and expandIconPlacement', async () => {
    const wrapper = mount(Collapse, { props: { items, ghost: true, size: 'small', expandIconPlacement: 'start' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-collapse-ghost', 'am-collapse-sm', 'am-collapse-icon-start']))
    expect(wrapper.classes()).not.toContain('am-collapse-bordered')
    await wrapper.setProps({ ghost: false, bordered: false, expandIconPlacement: undefined, expandIconPosition: 'start' })
    expect(wrapper.classes()).not.toContain('am-collapse-bordered')
    expect(wrapper.classes()).toContain('am-collapse-icon-start')
    const provider = mount(ConfigProvider, {
      props: { componentSize: 'large' },
      slots: { default: () => h(Collapse, { items }) },
    })
    expect(provider.find('.am-collapse').classes()).toContain('am-collapse-lg')
  })

  it('renders expandIcon by prop and slot (slot wins)', () => {
    const byProp = mount(Collapse, {
      props: { items, defaultActiveKey: ['1'], expandIcon: ({ isActive }: any) => h('i', { class: 'prop-icon' }, String(isActive)) },
    })
    expect(byProp.findAll('.prop-icon').map(e => e.text())).toEqual(['true', 'false'])
    const bySlot = mount(Collapse, {
      props: { items, expandIcon: () => h('i', { class: 'prop-icon' }) },
      slots: { expandIcon: ({ panelKey }: any) => h('i', { class: 'slot-icon' }, String(panelKey)) },
    })
    expect(bySlot.find('.prop-icon').exists()).toBe(false)
    expect(bySlot.findAll('.slot-icon').map(e => e.text())).toEqual(['1', '2'])
  })

  it('renders labelRender / contentRender slots', () => {
    const wrapper = mount(Collapse, {
      props: { items, defaultActiveKey: ['2'] },
      slots: {
        labelRender: ({ item, index }: any) => `${index}:${item.label}`,
        contentRender: ({ item }: any) => `slot content ${item.key}`,
      },
    })
    expect(wrapper.findAll('.am-collapse-title').map(e => e.text())).toEqual(['0:Panel 1', '1:Panel 2', '2:Panel 3'])
    expect(wrapper.find('.am-collapse-body').text()).toBe('slot content 2')
  })

  it('supports declarative panels with header / extra slots', async () => {
    const wrapper = mount(Collapse, {
      props: { defaultActiveKey: ['a'] },
      slots: {
        default: () => [
          h(CollapsePanel, { key: 'a', header: 'A' }, () => 'Content A'),
          h(CollapsePanel, { key: 'b', header: 'prop-header', extra: 'prop-extra' }, {
            default: () => 'Content B',
            header: () => 'slot-header',
            extra: () => 'slot-extra',
          }),
        ],
      },
    })
    expect(itemsOf(wrapper)).toHaveLength(2)
    expect(itemsOf(wrapper)[0].classes()).toContain('am-collapse-item-active')
    expect(itemsOf(wrapper)[0].find('.am-collapse-body').text()).toBe('Content A')
    expect(itemsOf(wrapper)[1].find('.am-collapse-title').text()).toBe('slot-header')
    expect(itemsOf(wrapper)[1].find('.am-collapse-extra').text()).toBe('slot-extra')
    await headers(wrapper)[1].trigger('click')
    expect(wrapper.emitted('change')![0]).toEqual([['a', 'b']])
    expect(Collapse.Panel).toBe(CollapsePanel)
  })

  it('a standalone panel toggles itself', async () => {
    const wrapper = mount(CollapsePanel, { props: { header: 'Alone' }, slots: { default: 'Body' } })
    expect(wrapper.find('.am-collapse-panel').exists()).toBe(false)
    await wrapper.find('.am-collapse-header').trigger('click')
    expect(wrapper.classes()).toContain('am-collapse-item-active')
    expect(wrapper.find('.am-collapse-body').text()).toBe('Body')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Collapse, {
      props: {
        defaultActiveKey: ['1'],
        rootClass: 'root-cls',
        classes: { header: 'header-cls', title: 'title-cls', body: 'body-cls', icon: 'icon-cls' },
        styles: { body: { color: 'red' } },
        items: [{ key: '1', label: 'L', content: 'C', class: 'item-cls', classes: { header: 'own-header' } }],
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-collapse-item').classes()).toContain('item-cls')
    expect(wrapper.find('.am-collapse-header').classes()).toEqual(expect.arrayContaining(['header-cls', 'own-header']))
    expect(wrapper.find('.am-collapse-title').classes()).toContain('title-cls')
    expect(wrapper.find('.am-collapse-expand-icon').classes()).toContain('icon-cls')
    expect(wrapper.find('.am-collapse-body').classes()).toContain('body-cls')
    expect(wrapper.find('.am-collapse-body').attributes('style')).toContain('color: red')
  })
})
