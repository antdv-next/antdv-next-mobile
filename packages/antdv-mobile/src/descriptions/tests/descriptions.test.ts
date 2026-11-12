import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Descriptions from '..'
import ConfigProvider from '../../config-provider'

const items = [
  { key: 'name', label: 'Name', content: 'Zhou Maomao' },
  { key: 'phone', label: 'Phone', content: '1810000000' },
  { key: 'live', label: 'Live', content: 'Hangzhou' },
]

function spans(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('.am-descriptions-item').map(node => (node.element as HTMLElement).style.gridColumn)
}

describe('Descriptions', () => {
  it('renders items in a single column by default', () => {
    const wrapper = mount(Descriptions, { props: { items } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-descriptions', 'am-descriptions-horizontal']))
    expect(wrapper.find('.am-descriptions-header').exists()).toBe(false)
    expect(wrapper.find('.am-descriptions-view').attributes('style')).toContain('repeat(1, minmax(0, 1fr))')
    const nodes = wrapper.findAll('.am-descriptions-item')
    expect(nodes).toHaveLength(3)
    expect(nodes[0]!.find('.am-descriptions-item-label').text()).toBe('Name')
    expect(nodes[0]!.find('.am-descriptions-item-content').text()).toBe('Zhou Maomao')
    expect(spans(wrapper)).toEqual(['span 1', 'span 1', 'span 1'])
  })

  it('supports deprecated children', () => {
    const wrapper = mount(Descriptions, { props: { items: [{ label: 'a', children: 'legacy' }] } })
    expect(wrapper.find('.am-descriptions-item-content').text()).toBe('legacy')
  })

  it('renders title and extra; slots win over props', () => {
    const byProp = mount(Descriptions, { props: { items, title: 'User', extra: 'Edit' } })
    expect(byProp.find('.am-descriptions-title').text()).toBe('User')
    expect(byProp.find('.am-descriptions-extra').text()).toBe('Edit')
    const bySlot = mount(Descriptions, {
      props: { items, title: 'User', extra: 'Edit' },
      slots: { title: 'slot-title', extra: 'slot-extra' },
    })
    expect(bySlot.find('.am-descriptions-title').text()).toBe('slot-title')
    expect(bySlot.find('.am-descriptions-extra').text()).toBe('slot-extra')
    const onlyExtra = mount(Descriptions, { props: { items, extra: 'Edit' } })
    expect(onlyExtra.find('.am-descriptions-title').exists()).toBe(false)
    expect(onlyExtra.find('.am-descriptions-extra').exists()).toBe(true)
  })

  it('fills every row with column and span', () => {
    const wrapper = mount(Descriptions, {
      props: {
        column: 3,
        items: [
          { label: 'a', content: 1 },
          { label: 'b', content: 2, span: 2 },
          { label: 'c', content: 3 },
          { label: 'd', content: 4, span: 3 },
          { label: 'e', content: 5 },
          { label: 'f', content: 6, span: 'filled' as const },
          { label: 'g', content: 7, span: 9 },
          { label: 'h', content: 8 },
        ],
      },
    })
    expect(wrapper.find('.am-descriptions-view').attributes('style')).toContain('repeat(3, minmax(0, 1fr))')
    expect(spans(wrapper)).toEqual([
      'span 1',
      'span 2',
      // "c" is alone on its row because "d" needs a full row
      'span 3',
      'span 3',
      'span 1',
      'span 2',
      'span 3',
      // last item fills the rest
      'span 3',
    ])
  })

  it('supports layout, bordered, colon and contentAlign', () => {
    const wrapper = mount(Descriptions, { props: { items, layout: 'vertical', bordered: true, colon: false, contentAlign: 'end' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-descriptions-vertical', 'am-descriptions-bordered']))
    // contentAlign only applies to the horizontal layout
    expect(wrapper.classes()).not.toContain('am-descriptions-content-end')
    expect(wrapper.find('.am-descriptions-item-label').classes()).toContain('am-descriptions-item-no-colon')
    const horizontal = mount(Descriptions, { props: { items, contentAlign: 'end' } })
    expect(horizontal.classes()).toContain('am-descriptions-content-end')
    expect(horizontal.find('.am-descriptions-item-label').classes()).not.toContain('am-descriptions-item-no-colon')
  })

  it('supports size and ConfigProvider componentSize', () => {
    expect(mount(Descriptions, { props: { items, size: 'small' } }).classes()).toContain('am-descriptions-sm')
    const wrapper = mount(ConfigProvider, {
      props: { componentSize: 'large' },
      slots: { default: () => h(Descriptions, { items }) },
    })
    expect(wrapper.find('.am-descriptions').classes()).toContain('am-descriptions-lg')
  })

  it('labelRender / contentRender props and slots (slots win)', () => {
    const byProp = mount(Descriptions, {
      props: {
        items,
        labelRender: ({ value, index }) => `${index}-${value}`,
        contentRender: ({ value, item }) => h('b', `${item.key}=${value}`),
      },
    })
    expect(byProp.find('.am-descriptions-item-label').text()).toBe('0-Name')
    expect(byProp.find('.am-descriptions-item-content b').text()).toBe('name=Zhou Maomao')
    const bySlot = mount(Descriptions, {
      props: { items, labelRender: () => 'prop', contentRender: () => 'prop' },
      slots: {
        labelRender: ({ value }: any) => `slot ${value}`,
        contentRender: ({ value, index }: any) => `slot ${index} ${value}`,
      },
    })
    expect(bySlot.find('.am-descriptions-item-label').text()).toBe('slot Name')
    expect(bySlot.findAll('.am-descriptions-item-content')[1]!.text()).toBe('slot 1 1810000000')
  })

  it('passes attrs, rootClass, classes / styles and item level overrides', () => {
    const wrapper = mount(Descriptions, {
      props: {
        title: 't',
        extra: 'e',
        items: [{
          label: 'a',
          content: 'b',
          class: 'item-cls',
          style: { margin: '2px' },
          classes: { label: 'item-label', content: 'item-content' },
          styles: { content: { fontWeight: 700 } },
        }],
        rootClass: 'root-cls',
        classes: { root: 'r', header: 'h', title: 'tt', extra: 'ee', label: 'l', content: 'c' },
        styles: { label: { color: 'red' } },
      },
      attrs: { 'class': 'custom', 'style': 'margin: 1px', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r']))
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-descriptions-header').classes()).toContain('h')
    expect(wrapper.find('.am-descriptions-title').classes()).toContain('tt')
    expect(wrapper.find('.am-descriptions-extra').classes()).toContain('ee')
    const item = wrapper.find('.am-descriptions-item')
    expect(item.classes()).toContain('item-cls')
    expect(item.attributes('style')).toContain('margin: 2px')
    const label = wrapper.find('.am-descriptions-item-label')
    expect(label.classes()).toEqual(expect.arrayContaining(['l', 'item-label']))
    expect(label.attributes('style')).toContain('color: red')
    const content = wrapper.find('.am-descriptions-item-content')
    expect(content.classes()).toEqual(expect.arrayContaining(['c', 'item-content']))
    expect(content.attributes('style')).toContain('font-weight: 700')
  })
})
