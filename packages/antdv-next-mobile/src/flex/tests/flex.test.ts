import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import Flex from '..'

describe('Flex', () => {
  it('renders a div with children', () => {
    const wrapper = mount(Flex, { slots: { default: () => [h('span', 'a'), h('span', 'b')] } })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toEqual(['am-flex'])
    expect(wrapper.findAll('span')).toHaveLength(2)
  })

  it('supports vertical / orientation', () => {
    expect(mount(Flex, { props: { vertical: true } }).classes()).toContain('am-flex-vertical')
    expect(mount(Flex, { props: { orientation: 'vertical' } }).classes()).toContain('am-flex-vertical')
    expect(mount(Flex, { props: { orientation: 'vertical', vertical: false } }).classes()).not.toContain('am-flex-vertical')
  })

  it('supports wrap as boolean or css value', () => {
    expect(mount(Flex, { props: { wrap: true } }).classes()).toContain('am-flex-wrap')
    expect(mount(Flex, { props: { wrap: 'wrap' } }).classes()).toContain('am-flex-wrap')
    const reverse = mount(Flex, { props: { wrap: 'wrap-reverse' } })
    expect(reverse.classes()).not.toContain('am-flex-wrap')
    expect((reverse.element as HTMLElement).style.flexWrap).toBe('wrap-reverse')
  })

  it('supports preset, number and string gap', () => {
    expect(mount(Flex, { props: { gap: 'small' } }).classes()).toContain('am-flex-gap-small')
    expect(mount(Flex, { props: { gap: 'large' } }).classes()).toContain('am-flex-gap-large')
    expect((mount(Flex, { props: { gap: 12 } }).element as HTMLElement).style.gap).toBe('12px')
    expect((mount(Flex, { props: { gap: '1rem' } }).element as HTMLElement).style.gap).toBe('1rem')
  })

  it('supports justify / align / flex', () => {
    const el = mount(Flex, { props: { justify: 'space-between', align: 'center', flex: '1 1 0%' } }).element as HTMLElement
    expect(el.style.justifyContent).toBe('space-between')
    expect(el.style.alignItems).toBe('center')
    expect(el.style.flex).toBe('1 1 0%')
  })

  it('supports custom component', () => {
    expect(mount(Flex, { props: { component: 'section' } }).element.tagName).toBe('SECTION')
    const Custom = defineComponent({ setup: (_, { slots }) => () => h('nav', { class: 'custom-nav' }, slots.default?.()) })
    const wrapper = mount(Flex, { props: { component: Custom }, slots: { default: 'x' } })
    expect(wrapper.element.tagName).toBe('NAV')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom-nav', 'am-flex']))
  })

  it('passes attrs and rootClass, user style wins', () => {
    const wrapper = mount(Flex, {
      props: { rootClass: 'root-cls', gap: 8 },
      attrs: { 'class': 'custom', 'style': 'gap: 20px; color: red', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect((wrapper.element as HTMLElement).style.color).toBe('red')
    expect((wrapper.element as HTMLElement).style.gap).toBe('20px')
  })
})
