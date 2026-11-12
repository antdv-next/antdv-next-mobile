import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Badge, { BadgeRibbon } from '..'

const child = () => h('a', { class: 'child' })
const stubs = { global: { stubs: { transition: false } } }

describe('Badge', () => {
  it('renders count over the wrapped content', () => {
    const wrapper = mount(Badge, { props: { count: 5 }, slots: { default: child }, ...stubs })
    expect(wrapper.classes()).toEqual(['am-badge'])
    expect(wrapper.find('.child').exists()).toBe(true)
    const sup = wrapper.find('sup')
    expect(sup.classes()).toEqual(expect.arrayContaining(['am-badge-indicator', 'am-badge-count']))
    expect(sup.text()).toBe('5')
    expect(sup.attributes('title')).toBe('5')
  })

  it('handles overflowCount and multiple words', () => {
    const wrapper = mount(Badge, { props: { count: 100 }, slots: { default: child }, ...stubs })
    expect(wrapper.find('sup').text()).toBe('99+')
    expect(wrapper.find('sup').classes()).toContain('am-badge-multiple-words')
    const custom = mount(Badge, { props: { count: 11, overflowCount: 10 }, slots: { default: child }, ...stubs })
    expect(custom.find('sup').text()).toBe('10+')
    expect(custom.find('sup').attributes('title')).toBe('11')
    const text = mount(Badge, { props: { count: 'new' }, slots: { default: child }, ...stubs })
    expect(text.find('sup').text()).toBe('new')
  })

  it('hides zero / empty count unless showZero', async () => {
    const wrapper = mount(Badge, { props: { count: 0 }, slots: { default: child }, ...stubs })
    expect(wrapper.find('sup').exists()).toBe(false)
    await wrapper.setProps({ showZero: true })
    expect(wrapper.find('sup').text()).toBe('0')
    const empty = mount(Badge, { slots: { default: child }, ...stubs })
    expect(empty.find('sup').exists()).toBe(false)
  })

  it('renders dot without text', () => {
    const wrapper = mount(Badge, { props: { dot: true, count: 5 }, slots: { default: child }, ...stubs })
    const sup = wrapper.find('sup')
    expect(sup.classes()).toContain('am-badge-dot')
    expect(sup.classes()).not.toContain('am-badge-count')
    expect(sup.text()).toBe('')
    expect(sup.attributes('title')).toBeUndefined()
    const zero = mount(Badge, { props: { dot: true, count: 0 }, slots: { default: child }, ...stubs })
    expect(zero.find('sup').exists()).toBe(false)
  })

  it('supports size, title and offset', () => {
    const wrapper = mount(Badge, {
      props: { count: 5, size: 'small', title: 'custom', offset: [10, -4] },
      slots: { default: child },
      ...stubs,
    })
    const sup = wrapper.find('sup')
    expect(sup.classes()).toContain('am-badge-count-sm')
    expect(sup.attributes('title')).toBe('custom')
    expect((sup.element as HTMLElement).style.insetInlineEnd).toBe('-10px')
    expect((sup.element as HTMLElement).style.marginTop).toBe('-4px')
    const noTitle = mount(Badge, { props: { count: 5, title: null }, slots: { default: child }, ...stubs })
    expect(noTitle.find('sup').attributes('title')).toBeUndefined()
  })

  it('supports preset and custom color', () => {
    const preset = mount(Badge, { props: { count: 5, color: 'purple' }, slots: { default: child }, ...stubs })
    expect(preset.find('sup').classes()).toContain('am-badge-color-purple')
    const custom = mount(Badge, { props: { count: 5, color: '#f50' }, slots: { default: child }, ...stubs })
    expect((custom.find('sup').element as HTMLElement).style.getPropertyValue('--am-badge-color')).toBe('#f50')
    const dotOnly = mount(Badge, { props: { status: 'success' }, slots: { default: child }, ...stubs })
    expect(dotOnly.find('sup').classes()).toEqual(expect.arrayContaining(['am-badge-dot', 'am-badge-status-success']))
  })

  it('renders standalone count', () => {
    const wrapper = mount(Badge, { props: { count: 25 }, ...stubs })
    expect(wrapper.classes()).toContain('am-badge-not-a-wrapper')
    expect(wrapper.find('sup').text()).toBe('25')
  })

  it('renders status dot with text, text slot wins', () => {
    const wrapper = mount(Badge, { props: { status: 'processing', text: 'Running' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-badge-status', 'am-badge-not-a-wrapper']))
    expect(wrapper.find('.am-badge-status-dot').classes()).toContain('am-badge-status-processing')
    expect(wrapper.find('.am-badge-status-text').text()).toBe('Running')
    expect(wrapper.find('sup').exists()).toBe(false)
    const colored = mount(Badge, { props: { color: 'cyan', text: 'prop' }, slots: { text: () => 'slot' } })
    expect(colored.find('.am-badge-status-dot').classes()).toContain('am-badge-color-cyan')
    expect(colored.find('.am-badge-status-text').text()).toBe('slot')
  })

  it('renders custom count node, slot wins over prop', () => {
    const byProp = mount(Badge, { props: { count: () => h('i', { class: 'prop-count' }) }, slots: { default: child } })
    expect(byProp.find('.am-badge-custom-count .prop-count').exists()).toBe(true)
    const bySlot = mount(Badge, {
      props: { count: 5 },
      slots: { default: child, count: () => h('i', { class: 'slot-count' }) },
    })
    expect(bySlot.find('.am-badge-custom-count .slot-count').exists()).toBe(true)
    expect(bySlot.find('sup').exists()).toBe(false)
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Badge, {
      props: {
        count: 5,
        rootClass: 'root-cls',
        classes: { root: 'r', indicator: 'indicator-cls' },
        styles: { root: { margin: '1px' }, indicator: { color: 'red' } },
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
      slots: { default: child },
      ...stubs,
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.find('sup').classes()).toContain('indicator-cls')
    expect(wrapper.find('sup').attributes('style')).toContain('color: red')
  })
})

describe('Badge.Ribbon', () => {
  it('is exposed as Badge.Ribbon', () => {
    expect(Badge.Ribbon).toBe(BadgeRibbon)
  })

  it('renders text, placement and color', () => {
    const wrapper = mount(BadgeRibbon, { props: { text: 'Hot' }, slots: { default: child } })
    expect(wrapper.classes()).toContain('am-ribbon-wrapper')
    expect(wrapper.find('.child').exists()).toBe(true)
    expect(wrapper.find('.am-ribbon').classes()).toContain('am-ribbon-placement-end')
    expect(wrapper.find('.am-ribbon-content').text()).toBe('Hot')

    const start = mount(BadgeRibbon, { props: { text: 'Hot', placement: 'start', color: 'red' } })
    expect(start.find('.am-ribbon').classes()).toEqual(expect.arrayContaining(['am-ribbon-placement-start', 'am-badge-color-red']))
    const custom = mount(BadgeRibbon, { props: { text: 'Hot', color: '#f50' } })
    expect((custom.find('.am-ribbon').element as HTMLElement).style.getPropertyValue('--am-ribbon-color')).toBe('#f50')
  })

  it('text slot wins and semantic classes are applied', () => {
    const wrapper = mount(BadgeRibbon, {
      props: { text: 'prop', rootClass: 'root-cls', classes: { indicator: 'i-cls', content: 'c-cls' } },
      attrs: { class: 'custom' },
      slots: { text: () => 'slot' },
    })
    expect(wrapper.find('.am-ribbon-content').text()).toBe('slot')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.find('.am-ribbon').classes()).toContain('i-cls')
    expect(wrapper.find('.am-ribbon-content').classes()).toContain('c-cls')
  })
})
