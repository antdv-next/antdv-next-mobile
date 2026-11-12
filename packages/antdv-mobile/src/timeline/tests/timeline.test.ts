import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Timeline from '..'

const items = [
  { content: 'Create a services site' },
  { content: 'Solve initial network problems' },
  { content: 'Technical testing' },
]

describe('Timeline', () => {
  it('renders items with default classes', () => {
    const wrapper = mount(Timeline, { props: { items } })
    expect(wrapper.element.tagName).toBe('OL')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-timeline', 'am-timeline-mode-start', 'am-timeline-outlined']))
    expect(wrapper.classes()).not.toContain('am-timeline-layout-alternate')
    const nodes = wrapper.findAll('.am-timeline-item')
    expect(nodes).toHaveLength(3)
    expect(nodes[0]!.classes()).toContain('am-timeline-item-placement-start')
    expect(nodes[2]!.classes()).toContain('am-timeline-item-last')
    expect(nodes[0]!.find('.am-timeline-item-content').text()).toBe('Create a services site')
    expect(wrapper.find('.am-timeline-item-title').exists()).toBe(false)
  })

  it('supports deprecated label / children / dot / position', () => {
    const wrapper = mount(Timeline, {
      props: {
        items: [{ label: '2026', children: 'legacy', dot: () => h('i', { class: 'legacy-dot' }), position: 'right' as const }],
      },
    })
    expect(wrapper.find('.am-timeline-item-title').text()).toBe('2026')
    expect(wrapper.find('.am-timeline-item-content').text()).toBe('legacy')
    expect(wrapper.find('.am-timeline-item-icon .legacy-dot').exists()).toBe(true)
    expect(wrapper.find('.am-timeline-item').classes()).toContain('am-timeline-item-placement-end')
  })

  it('titles switch to the alternate layout', () => {
    const wrapper = mount(Timeline, { props: { items: [{ title: '09:00', content: 'a' }, { content: 'b' }] } })
    expect(wrapper.classes()).toContain('am-timeline-layout-alternate')
    const titles = wrapper.findAll('.am-timeline-item-title')
    expect(titles).toHaveLength(2)
    expect(titles[0]!.text()).toBe('09:00')
    expect(titles[1]!.text()).toBe('')
  })

  it('supports mode', () => {
    const end = mount(Timeline, { props: { items, mode: 'end' } })
    expect(end.classes()).toContain('am-timeline-mode-end')
    expect(end.findAll('.am-timeline-item-placement-end')).toHaveLength(3)
    expect(mount(Timeline, { props: { items, mode: 'right' } }).classes()).toContain('am-timeline-mode-end')
    expect(mount(Timeline, { props: { items, mode: 'left' } }).classes()).toContain('am-timeline-mode-start')

    const alternate = mount(Timeline, { props: { items: [...items, { content: 'x', placement: 'start' as const }], mode: 'alternate' } })
    expect(alternate.classes()).toEqual(expect.arrayContaining(['am-timeline-mode-alternate', 'am-timeline-layout-alternate']))
    const nodes = alternate.findAll('.am-timeline-item')
    expect(nodes[0]!.classes()).toContain('am-timeline-item-placement-start')
    expect(nodes[1]!.classes()).toContain('am-timeline-item-placement-end')
    expect(nodes[2]!.classes()).toContain('am-timeline-item-placement-start')
    // explicit placement wins
    expect(nodes[3]!.classes()).toContain('am-timeline-item-placement-start')
  })

  it('supports colors, item class / style and variant', () => {
    const wrapper = mount(Timeline, {
      props: {
        variant: 'filled',
        items: [
          { content: 'a', color: 'green', class: 'item-cls', className: 'item-cls-2', style: { margin: '1px' } },
          { content: 'b', color: '#00ccff' },
        ],
      },
    })
    expect(wrapper.classes()).toContain('am-timeline-filled')
    const nodes = wrapper.findAll('.am-timeline-item')
    expect(nodes[0]!.classes()).toEqual(expect.arrayContaining(['am-timeline-item-color-green', 'item-cls', 'item-cls-2']))
    expect(nodes[0]!.attributes('style')).toContain('margin: 1px')
    expect(nodes[1]!.attributes('style')).toContain('--am-timeline-item-color: #00ccff')
  })

  it('renders icon and loading', () => {
    const wrapper = mount(Timeline, {
      props: { items: [{ content: 'a', icon: () => h('i', { class: 'custom-icon' }) }, { content: 'b', loading: true }, { content: 'c' }] },
    })
    const icons = wrapper.findAll('.am-timeline-item-icon')
    expect(icons[0]!.classes()).toContain('am-timeline-item-icon-custom')
    expect(icons[0]!.find('.custom-icon').exists()).toBe(true)
    expect(icons[1]!.find('.anticon-loading').exists()).toBe(true)
    expect(icons[2]!.classes()).not.toContain('am-timeline-item-icon-custom')
  })

  it('reverses items', () => {
    const wrapper = mount(Timeline, { props: { items, reverse: true } })
    expect(wrapper.classes()).toContain('am-timeline-reverse')
    const contents = wrapper.findAll('.am-timeline-item-content').map(node => node.text())
    expect(contents).toEqual(['Technical testing', 'Solve initial network problems', 'Create a services site'])
  })

  it('renders pending as the last node (first when reversed)', () => {
    const wrapper = mount(Timeline, { props: { items, pending: 'Recording...' } })
    expect(wrapper.classes()).toContain('am-timeline-pending')
    const nodes = wrapper.findAll('.am-timeline-item')
    expect(nodes).toHaveLength(4)
    expect(nodes[3]!.classes()).toEqual(expect.arrayContaining(['am-timeline-item-pending', 'am-timeline-item-last']))
    expect(nodes[3]!.find('.am-timeline-item-content').text()).toBe('Recording...')
    expect(nodes[3]!.find('.anticon-loading').exists()).toBe(true)

    const reversed = mount(Timeline, {
      props: { items, pending: true, reverse: true, pendingDot: () => h('i', { class: 'pending-dot' }) },
    })
    const first = reversed.findAll('.am-timeline-item')[0]!
    expect(first.classes()).toContain('am-timeline-item-pending')
    expect(first.find('.pending-dot').exists()).toBe(true)
    expect(first.find('.am-timeline-item-content').text()).toBe('')
  })

  it('pending / pendingDot slots win over props', () => {
    const wrapper = mount(Timeline, {
      props: { items, pending: 'prop', pendingDot: () => h('i', { class: 'prop-dot' }) },
      slots: { pending: 'slot', pendingDot: () => h('i', { class: 'slot-dot' }) },
    })
    const node = wrapper.find('.am-timeline-item-pending')
    expect(node.find('.am-timeline-item-content').text()).toBe('slot')
    expect(node.find('.slot-dot').exists()).toBe(true)
    expect(node.find('.prop-dot').exists()).toBe(false)
  })

  it('render props: dotRender / labelRender / contentRender', () => {
    const wrapper = mount(Timeline, {
      props: {
        items,
        dotRender: ({ index }) => h('i', { class: `dot-${index}` }),
        labelRender: ({ index }) => `label-${index}`,
        contentRender: ({ item, index }) => `${index}:${item.content}`,
      },
    })
    expect(wrapper.classes()).toContain('am-timeline-layout-alternate')
    expect(wrapper.find('.am-timeline-item-icon .dot-1').exists()).toBe(true)
    expect(wrapper.findAll('.am-timeline-item-title')[2]!.text()).toBe('label-2')
    expect(wrapper.findAll('.am-timeline-item-content')[0]!.text()).toBe('0:Create a services site')
  })

  it('render slots win over render props and get the original index when reversed', () => {
    const wrapper = mount(Timeline, {
      props: { items, reverse: true, contentRender: () => 'prop', dotRender: () => 'prop-dot' },
      slots: {
        contentRender: ({ item, index }: any) => `slot ${index} ${item.content}`,
        dotRender: ({ index }: any) => h('i', { class: `slot-dot-${index}` }),
        labelRender: ({ index }: any) => `L${index}`,
      },
    })
    expect(wrapper.findAll('.am-timeline-item-content')[0]!.text()).toBe('slot 2 Technical testing')
    expect(wrapper.find('.slot-dot-2').exists()).toBe(true)
    expect(wrapper.findAll('.am-timeline-item-title')[0]!.text()).toBe('L2')
  })

  it('falls back to the item when a render prop / slot renders nothing', () => {
    const data = [{ title: 't0', content: 'c0', icon: () => h('i', { class: 'item-icon' }) }, { title: 't1', content: 'c1' }]
    const byProp = mount(Timeline, {
      props: {
        items: data,
        dotRender: ({ index }) => (index === 1 ? h('i', { class: 'render-icon' }) : null),
        contentRender: ({ index }) => (index === 1 ? 'rendered' : undefined),
      },
    })
    const icons = byProp.findAll('.am-timeline-item-icon')
    expect(icons[0]!.find('.item-icon').exists()).toBe(true)
    expect(icons[1]!.find('.render-icon').exists()).toBe(true)
    expect(byProp.findAll('.am-timeline-item-content').map(node => node.text())).toEqual(['c0', 'rendered'])

    const bySlot = mount(Timeline, {
      props: { items: [{ content: 'a' }, { content: 'b' }] },
      slots: { dotRender: ({ index }: any) => (index === 0 ? h('i', { class: 'slot-icon' }) : []) },
    })
    const slotIcons = bySlot.findAll('.am-timeline-item-icon')
    expect(slotIcons[0]!.classes()).toContain('am-timeline-item-icon-custom')
    // an empty slot keeps the default dot
    expect(slotIcons[1]!.classes()).not.toContain('am-timeline-item-icon-custom')
  })

  it('supports titleSpan', () => {
    const data = [{ title: 't', content: 'c' }]
    expect(mount(Timeline, { props: { items: data, titleSpan: 6 } }).attributes('style')).toContain('--am-timeline-title-span: 25%')
    expect(mount(Timeline, { props: { items: data, titleSpan: '80px' } }).attributes('style')).toContain('--am-timeline-title-span: 80px')
    expect(mount(Timeline, { props: { items: data, titleSpan: 6, mode: 'alternate' } }).attributes('style')).toBeUndefined()
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Timeline, {
      props: {
        items: [{ title: 't', content: 'c' }],
        rootClass: 'root-cls',
        classes: { root: 'r', item: 'i', itemTitle: 'it', itemRail: 'ir', itemIcon: 'ii', itemContent: 'ic' },
        styles: { itemContent: { color: 'red' } },
      },
      attrs: { 'class': 'custom', 'style': 'margin: 1px', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r']))
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-timeline-item').classes()).toContain('i')
    expect(wrapper.find('.am-timeline-item-title').classes()).toContain('it')
    expect(wrapper.find('.am-timeline-item-rail').classes()).toContain('ir')
    expect(wrapper.find('.am-timeline-item-icon').classes()).toContain('ii')
    expect(wrapper.find('.am-timeline-item-content').classes()).toContain('ic')
    expect(wrapper.find('.am-timeline-item-content').attributes('style')).toContain('color: red')
  })
})
