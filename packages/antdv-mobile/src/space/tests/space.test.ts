import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Space from '..'

const items = () => [h('span', 'a'), h('span', 'b'), h('span', 'c')]

describe('Space', () => {
  it('wraps every child in an item', () => {
    const wrapper = mount(Space, { slots: { default: items } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-space', 'am-space-horizontal', 'am-space-align-center', 'am-space-gap-col-small', 'am-space-gap-row-small']))
    expect(wrapper.findAll('.am-space-item')).toHaveLength(3)
  })

  it('renders nothing without children', () => {
    const wrapper = mount(Space)
    expect(wrapper.find('.am-space').exists()).toBe(false)
    const onlyComment = mount(Space, { slots: { default: () => [null, false, undefined] } })
    expect(onlyComment.find('.am-space').exists()).toBe(false)
  })

  it('flattens fragments, skips empty nodes and stays reactive', async () => {
    const show = ref(false)
    const list = ref(['a', 'b'])
    const Demo = defineComponent({
      setup: () => () => h(Space, null, {
        default: () => [
          list.value.map(text => h('i', { key: text }, text)),
          show.value ? h('b', 'extra') : null,
          'text',
        ],
      }),
    })
    const wrapper = mount(Demo)
    expect(wrapper.findAll('.am-space-item')).toHaveLength(3)
    show.value = true
    list.value = ['a', 'b', 'c']
    await nextTick()
    expect(wrapper.findAll('.am-space-item')).toHaveLength(5)
    expect(wrapper.text()).toBe('abcextratext')
  })

  it('supports orientation / direction / vertical', () => {
    expect(mount(Space, { props: { orientation: 'vertical' }, slots: { default: items } }).classes()).toContain('am-space-vertical')
    expect(mount(Space, { props: { direction: 'vertical' }, slots: { default: items } }).classes()).toContain('am-space-vertical')
    const vertical = mount(Space, { props: { vertical: true }, slots: { default: items } })
    expect(vertical.classes()).toContain('am-space-vertical')
    expect(vertical.classes()).not.toContain('am-space-align-center')
  })

  it('supports preset / number / string / tuple size', () => {
    const preset = mount(Space, { props: { size: 'large' }, slots: { default: items } })
    expect(preset.classes()).toEqual(expect.arrayContaining(['am-space-gap-col-large', 'am-space-gap-row-large']))
    const num = mount(Space, { props: { size: 20 }, slots: { default: items } })
    expect((num.element as HTMLElement).style.columnGap).toBe('20px')
    expect((num.element as HTMLElement).style.rowGap).toBe('20px')
    const tuple = mount(Space, { props: { size: ['middle', '1rem'] }, slots: { default: items } })
    expect(tuple.classes()).toContain('am-space-gap-col-middle')
    expect((tuple.element as HTMLElement).style.rowGap).toBe('1rem')
    expect((tuple.element as HTMLElement).style.columnGap).toBe('')
  })

  it('supports align / wrap / block', () => {
    const wrapper = mount(Space, { props: { align: 'baseline', wrap: true, block: true }, slots: { default: items } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-space-align-baseline', 'am-space-wrap', 'am-space-block']))
  })

  it('renders separator between items, slot wins over prop', () => {
    const byProp = mount(Space, { props: { separator: '|' }, slots: { default: items } })
    const separators = byProp.findAll('.am-space-item-separator')
    expect(separators).toHaveLength(2)
    expect(separators[0].text()).toBe('|')
    const bySlot = mount(Space, {
      props: { separator: '|' },
      slots: { default: items, separator: () => h('em', '/') },
    })
    expect(bySlot.findAll('.am-space-item-separator em')).toHaveLength(2)
    expect(bySlot.text()).not.toContain('|')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Space, {
      props: {
        rootClass: 'root-cls',
        separator: '|',
        classes: { root: 'r', item: 'item-cls', separator: 'sep-cls' },
        styles: { root: { padding: '2px' }, item: { color: 'red' }, separator: { color: 'blue' } },
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
      slots: { default: items },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.attributes('style')).toContain('padding: 2px')
    expect(wrapper.find('.am-space-item').classes()).toContain('item-cls')
    expect(wrapper.find('.am-space-item').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-space-item-separator').classes()).toContain('sep-cls')
  })
})
