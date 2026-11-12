import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import VirtualList from '..'

const data = Array.from({ length: 1000 }, (_, i) => ({ id: `k${i}`, text: `Item ${i}` }))
const slots = { default: ({ item }: any) => h('span', { class: 'row' }, item.text) }

function setScroll(el: Element, top: number, clientHeight = 200) {
  Object.defineProperty(el, 'clientHeight', { value: clientHeight, configurable: true })
  Object.defineProperty(el, 'scrollHeight', { value: 1000 * 40, configurable: true })
  ;(el as HTMLElement).scrollTop = top
}

describe('VirtualList', () => {
  it('renders only a window of a long list', () => {
    const wrapper = mount(VirtualList, { props: { data, height: 200, itemHeight: 40, itemKey: 'id', fixed: true }, slots })
    const rows = wrapper.findAll('.am-virtual-list-item')
    // 200 / 40 = 5 visible + the partially visible one + overscan 4
    expect(rows.length).toBe(10)
    expect(rows[0].text()).toBe('Item 0')
    expect(wrapper.find('.am-virtual-list-holder').attributes('style')).toContain('height: 40000px')
    expect(wrapper.attributes('style')).toContain('height: 200px')
  })

  it('moves the window on scroll and emits visibleChange / scroll', async () => {
    const wrapper = mount(VirtualList, { props: { data, height: 200, itemHeight: 40, itemKey: 'id', fixed: true }, slots })
    setScroll(wrapper.element, 4000)
    await wrapper.trigger('scroll')
    const rows = wrapper.findAll('.am-virtual-list-item')
    expect(rows[0].attributes('data-index')).toBe('96')
    expect(rows[rows.length - 1].attributes('data-index')).toBe('109')
    expect(wrapper.find('.am-virtual-list-inner').attributes('style')).toContain('translate3d(0, 3840px, 0)')
    expect(wrapper.emitted('scroll')).toHaveLength(1)
    expect(wrapper.emitted('visibleChange')!.slice(-1)[0]).toEqual([96, 110])
  })

  it('emits reachEnd once near the bottom', async () => {
    const wrapper = mount(VirtualList, { props: { data, height: 200, itemHeight: 40, fixed: true }, slots })
    setScroll(wrapper.element, 40000 - 200)
    await wrapper.trigger('scroll')
    await wrapper.trigger('scroll')
    expect(wrapper.emitted('reachEnd')).toHaveLength(1)
  })

  it('renders everything when virtual is false', () => {
    const wrapper = mount(VirtualList, { props: { data: data.slice(0, 50), virtual: false, itemHeight: 40 }, slots })
    expect(wrapper.findAll('.am-virtual-list-item')).toHaveLength(50)
    expect(wrapper.find('.am-virtual-list-holder').attributes('style')).toBeUndefined()
  })

  it('scrollTo supports offsets, index, key and align', async () => {
    const wrapper = mount(VirtualList, { props: { data, height: 200, itemHeight: 40, itemKey: 'id', fixed: true }, slots })
    const vm = wrapper.vm as any
    setScroll(wrapper.element, 0)
    vm.scrollTo(120)
    expect((wrapper.element as HTMLElement).scrollTop).toBe(120)
    vm.scrollTo({ index: 500 })
    expect((wrapper.element as HTMLElement).scrollTop).toBe(20000)
    vm.scrollTo({ key: 'k10', align: 'center' })
    expect((wrapper.element as HTMLElement).scrollTop).toBe(400 - 80)
    vm.scrollTo({ index: 20, align: 'end' })
    expect((wrapper.element as HTMLElement).scrollTop).toBe(800 + 40 - 200)
    await nextTick()
    expect(wrapper.find('.am-virtual-list-item').exists()).toBe(true)
    expect(vm.getScrollTop()).toBe(640)
  })

  it('uses measured heights in dynamic mode', async () => {
    const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')!
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, get: () => 100 })
    try {
      const wrapper = mount(VirtualList, { props: { data: data.slice(0, 100), height: 200, itemHeight: 40, itemKey: 'id' }, slots })
      await nextTick()
      // the 10 items of the first window are measured at 100px, the other 90 keep the 40px estimate
      expect(wrapper.find('.am-virtual-list-holder').attributes('style')).toContain('height: 4600px')
      // taller items -> fewer of them are needed to fill the viewport
      expect(wrapper.findAll('.am-virtual-list-item').length).toBeLessThan(10)
    }
    finally {
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', original)
    }
  })

  it('passes attrs, rootClass, semantic classes, header and footer slots', () => {
    const wrapper = mount(VirtualList, {
      props: { data: data.slice(0, 3), itemHeight: 40, rootClass: 'r', classes: { item: 'i', list: 'l' }, component: 'ul' },
      attrs: { 'class': 'custom', 'data-x': '1' },
      slots: { ...slots, header: () => 'H', footer: () => 'F' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-virtual-list', 'r', 'custom']))
    expect(wrapper.attributes('data-x')).toBe('1')
    expect(wrapper.find('ul.am-virtual-list-inner').classes()).toContain('l')
    expect(wrapper.find('.am-virtual-list-item').classes()).toContain('i')
    expect(wrapper.find('.am-virtual-list-header').text()).toBe('H')
    expect(wrapper.find('.am-virtual-list-footer').text()).toBe('F')
  })
})
