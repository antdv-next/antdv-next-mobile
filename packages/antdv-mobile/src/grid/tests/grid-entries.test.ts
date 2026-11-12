import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { Grid, GridItem } from '..'

function style(wrapper: { element: Element }) {
  return (wrapper.element as HTMLElement).style
}

const items = [
  { key: 'a', icon: 'A', title: 'Alpha' },
  { key: 'b', icon: 'B', title: 'Beta', badge: 5 },
  { key: 'c', title: 'Gamma', badge: true },
  { key: 'd', title: 'Delta', disabled: true, class: 'custom-item', style: { color: 'red' } },
]

describe('Grid (entries)', () => {
  it('renders items with default classes', () => {
    const wrapper = mount(Grid, { props: { items } })
    expect(wrapper.classes()).toEqual(['am-grid'])
    const nodes = wrapper.findAll('.am-grid-item')
    expect(nodes).toHaveLength(4)
    expect(nodes[0].find('.am-grid-item-icon').text()).toBe('A')
    expect(nodes[0].find('.am-grid-item-title').text()).toBe('Alpha')
    expect(nodes[0].classes()).toContain('am-grid-item-clickable')
    expect(nodes[0].attributes('role')).toBe('button')
    expect(nodes[2].find('.am-grid-item-icon').exists()).toBe(false)
    expect(nodes[3].classes()).toContain('custom-item')
    expect(style(nodes[3]).color).toBe('red')
  })

  it('exposes install, names and the static Item', () => {
    expect(Grid.name).toBe('AmGrid')
    expect(GridItem.name).toBe('AmGridItem')
    expect(typeof Grid.install).toBe('function')
    expect(Grid.Item).toBe(GridItem)
  })

  it('columns / gap / iconSize are written as css', () => {
    const wrapper = mount(Grid, { props: { columns: 3, gap: 8, iconSize: 32 } })
    expect(style(wrapper).getPropertyValue('--am-grid-columns')).toBe('3')
    expect(style(wrapper).getPropertyValue('--am-grid-icon-size')).toBe('32px')
    expect(style(wrapper).columnGap).toBe('8px')
    expect(style(wrapper).rowGap).toBe('8px')
    expect(wrapper.classes()).toContain('am-grid-gapped')

    const both = mount(Grid, { props: { gap: [0, '1rem'] } })
    expect(style(both).columnGap).toBe('')
    expect(style(both).rowGap).toBe('1rem')
    expect(both.classes()).toContain('am-grid-gapped')

    const none = mount(Grid, { props: { gap: 0 } })
    expect(none.classes()).not.toContain('am-grid-gapped')
    expect(style(none).getPropertyValue('--am-grid-columns')).toBe('')
  })

  it('bordered / square / orientation modifiers', () => {
    const wrapper = mount(Grid, { props: { bordered: true, square: true, orientation: 'horizontal' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-grid-bordered', 'am-grid-square', 'am-grid-horizontal']))
  })

  it('badge: count on the icon, dot on the title when there is no icon', () => {
    const wrapper = mount(Grid, { props: { items } })
    const nodes = wrapper.findAll('.am-grid-item')
    expect(nodes[0].find('.am-grid-item-badge').exists()).toBe(false)
    expect(nodes[1].find('.am-grid-item-icon .am-grid-item-badge').text()).toBe('5')
    expect(nodes[1].find('.am-grid-item-title .am-grid-item-badge').exists()).toBe(false)
    expect(nodes[2].find('.am-grid-item-title .am-grid-item-badge').classes()).toContain('am-grid-item-badge-dot')
  })

  it('emits itemClick, not for disabled items', async () => {
    const wrapper = mount(Grid, { props: { items } })
    const nodes = wrapper.findAll('.am-grid-item')
    await nodes[1].trigger('click')
    expect(wrapper.emitted('itemClick')).toHaveLength(1)
    expect(wrapper.emitted('itemClick')![0].slice(0, 2)).toEqual([items[1], 1])
    await nodes[3].trigger('click')
    expect(wrapper.emitted('itemClick')).toHaveLength(1)
    expect(nodes[3].classes()).toContain('am-grid-item-disabled')
    expect(nodes[3].classes()).not.toContain('am-grid-item-clickable')
    expect(nodes[3].attributes('aria-disabled')).toBe('true')
  })

  it('clickable: false removes the press feedback but keeps the click', async () => {
    const wrapper = mount(Grid, { props: { items, clickable: false } })
    const node = wrapper.find('.am-grid-item')
    expect(node.classes()).not.toContain('am-grid-item-clickable')
    expect(node.attributes('role')).toBeUndefined()
    await node.trigger('click')
    expect(wrapper.emitted('itemClick')).toHaveLength(1)
  })

  it('slots win over the item fields', () => {
    const wrapper = mount(Grid, {
      props: { items: items.slice(0, 1) },
      slots: {
        icon: ({ item, index }: any) => `icon-${item.key}-${index}`,
        title: ({ item }: any) => `title-${item.key}`,
      },
    })
    expect(wrapper.find('.am-grid-item-icon').text()).toBe('icon-a-0')
    expect(wrapper.find('.am-grid-item-title').text()).toBe('title-a')
  })

  it('renders GridItem children after the items', async () => {
    const wrapper = mount(Grid, {
      props: { items: items.slice(0, 1) },
      slots: {
        default: () => [
          h(GridItem, { title: 'Child', icon: 'C', span: 2 }),
          h(GridItem, null, { default: () => h('i', { class: 'custom' }), icon: () => 'x' }),
          h(GridItem, { icon: 'p', title: 'p' }, { icon: () => 'slot-icon', title: () => 'slot-title' }),
        ],
      },
    })
    const nodes = wrapper.findAll('.am-grid-item')
    expect(nodes).toHaveLength(4)
    expect(nodes[1].find('.am-grid-item-title').text()).toBe('Child')
    expect(style(nodes[1]).gridColumn).toBe('span 2')
    expect(nodes[2].find('.custom').exists()).toBe(true)
    expect(nodes[2].find('.am-grid-item-icon').exists()).toBe(false)
    expect(nodes[3].find('.am-grid-item-icon').text()).toBe('slot-icon')
    expect(nodes[3].find('.am-grid-item-title').text()).toBe('slot-title')
  })

  it('gridItem emits click unless disabled', async () => {
    const wrapper = mount(GridItem, { props: { title: 'a' } })
    await wrapper.trigger('click')
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('click')).toHaveLength(2)
    await wrapper.setProps({ disabled: true })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(2)
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Grid, {
      props: {
        items: items.slice(1, 2),
        rootClass: 'root-a',
        classes: { root: 'root-b', item: 'item-c', icon: 'icon-c', title: 'title-c', badge: 'badge-c' },
        styles: { root: { margin: '4px' }, item: { padding: '2px' }, title: { color: 'blue' } },
      },
      attrs: { 'class': 'user', 'style': 'margin: 8px', 'data-id': 'grid' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-grid', 'root-a', 'root-b', 'user']))
    expect(wrapper.attributes('data-id')).toBe('grid')
    expect(style(wrapper).margin).toBe('8px')
    const node = wrapper.find('.am-grid-item')
    expect(node.classes()).toContain('item-c')
    expect(style(node).padding).toBe('2px')
    expect(node.find('.am-grid-item-icon').classes()).toContain('icon-c')
    expect(node.find('.am-grid-item-title').classes()).toContain('title-c')
    expect(style(node.find('.am-grid-item-title')).color).toBe('blue')
    expect(node.find('.am-grid-item-badge').classes()).toContain('badge-c')

    const item = mount(GridItem, {
      props: { title: 't', rootClass: 'r', classes: { root: 'cr', title: 'ct' }, styles: { root: { color: 'red' } } },
      attrs: { class: 'u' },
    })
    expect(item.classes()).toEqual(expect.arrayContaining(['am-grid-item', 'r', 'cr', 'u']))
    expect(style(item).color).toBe('red')
    expect(item.find('.am-grid-item-title').classes()).toContain('ct')
  })
})
