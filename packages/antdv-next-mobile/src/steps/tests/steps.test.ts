import type { StepsItem } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Steps from '..'
import ConfigProvider from '../../config-provider'

const items: StepsItem[] = [
  { title: 'First', content: 'First content' },
  { title: 'Second', subTitle: 'Sub', description: 'Legacy description' },
  { title: 'Third', icon: () => h('i', { class: 'custom-icon' }) },
  { title: 'Fourth', disabled: true },
]

describe('Steps', () => {
  it('renders items with status derived from current', () => {
    const wrapper = mount(Steps, { props: { items, current: 1 } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-steps', 'am-steps-horizontal', 'am-steps-title-vertical']))
    const els = wrapper.findAll('.am-steps-item')
    expect(els).toHaveLength(4)
    expect(els[0].classes()).toContain('am-steps-item-finish')
    expect(els[1].classes()).toEqual(expect.arrayContaining(['am-steps-item-process', 'am-steps-item-active']))
    expect(els[1].attributes('aria-current')).toBe('step')
    expect(els[2].classes()).toEqual(expect.arrayContaining(['am-steps-item-wait', 'am-steps-item-custom']))
    expect(els[0].find('.am-steps-item-icon .anticon').exists()).toBe(true)
    expect(els[1].find('.am-steps-item-icon').text()).toBe('2')
    expect(els[2].find('.custom-icon').exists()).toBe(true)
    expect(els[0].find('.am-steps-item-content').text()).toBe('First content')
    expect(els[1].find('.am-steps-item-content').text()).toBe('Legacy description')
    expect(els[1].find('.am-steps-item-subtitle').text()).toBe('Sub')
    expect(els[2].find('.am-steps-item-content').exists()).toBe(false)
    // no rail after the last item
    expect(wrapper.findAll('.am-steps-item-rail')).toHaveLength(3)
  })

  it('supports status, item status and initial', () => {
    const wrapper = mount(Steps, {
      props: { items: [{ title: 'a' }, { title: 'b' }, { title: 'c', status: 'finish' }], current: 2, initial: 1, status: 'error' },
    })
    const els = wrapper.findAll('.am-steps-item')
    expect(els[0].classes()).toContain('am-steps-item-finish')
    expect(els[1].classes()).toContain('am-steps-item-error')
    expect(els[1].find('.am-steps-item-icon .anticon').exists()).toBe(true)
    expect(els[2].classes()).toContain('am-steps-item-finish')
    expect(mount(Steps, { props: { items, initial: 3 } }).findAll('.am-steps-item-icon')[1].text()).toBe('5')
  })

  it('supports orientation, titlePlacement, type and size (with deprecated aliases)', async () => {
    const wrapper = mount(Steps, { props: { items, orientation: 'vertical', size: 'small', type: 'dot' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-steps-vertical', 'am-steps-title-horizontal', 'am-steps-dot', 'am-steps-sm']))
    expect(wrapper.findAll('.am-steps-item-dot')).toHaveLength(4)
    expect(wrapper.find('.custom-icon').exists()).toBe(false)
    const legacy = mount(Steps, { props: { items, direction: 'vertical', progressDot: true } })
    expect(legacy.classes()).toEqual(expect.arrayContaining(['am-steps-vertical', 'am-steps-dot']))
    const horizontal = mount(Steps, { props: { items, labelPlacement: 'horizontal' } })
    expect(horizontal.classes()).toContain('am-steps-title-horizontal')
    await horizontal.setProps({ titlePlacement: 'vertical' })
    expect(horizontal.classes()).toContain('am-steps-title-vertical')
    // dots always put the title below
    await horizontal.setProps({ titlePlacement: 'horizontal', type: 'dot' })
    expect(horizontal.classes()).toContain('am-steps-title-vertical')
  })

  it('is not clickable without a change listener', async () => {
    const wrapper = mount(Steps, { props: { items } })
    expect(wrapper.find('.am-steps-item-clickable').exists()).toBe(false)
    await wrapper.findAll('.am-steps-item')[1].trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('emits change when clickable (uncontrolled)', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Steps, { props: { items, onChange } as any })
    const els = wrapper.findAll('.am-steps-item')
    expect(els[1].classes()).toContain('am-steps-item-clickable')
    expect(els[0].classes()).not.toContain('am-steps-item-clickable')
    expect(els[3].classes()).not.toContain('am-steps-item-clickable')
    await els[2].trigger('click')
    expect(onChange).toHaveBeenCalledWith(2)
    expect(els[2].classes()).toContain('am-steps-item-process')
    // current & disabled steps do nothing
    await els[2].trigger('click')
    await els[3].trigger('click')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('works with v-model:current (controlled)', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(Steps, { props: { items, 'current': 0, 'onUpdate:current': onUpdate } as any })
    const els = wrapper.findAll('.am-steps-item')
    await els[1].trigger('click')
    expect(onUpdate).toHaveBeenCalledWith(1)
    expect(els[0].classes()).toContain('am-steps-item-process')
    await wrapper.setProps({ current: 1 })
    expect(els[1].classes()).toContain('am-steps-item-process')
  })

  it('iconRender slot takes priority', () => {
    const wrapper = mount(Steps, {
      props: { items, current: 1 },
      slots: { iconRender: ({ index, status, active }: any) => h('b', { class: 'slot-icon' }, `${index}-${status}-${active}`) },
    })
    expect(wrapper.findAll('.slot-icon').map(e => e.text())).toEqual(['0-finish-false', '1-process-true', '2-wait-false', '3-wait-false'])
    expect(wrapper.find('.custom-icon').exists()).toBe(false)
  })

  it('passes attrs, rootClass, classes, styles and ConfigProvider size', () => {
    const wrapper = mount(Steps, {
      props: {
        items,
        rootClass: 'root-cls',
        classes: { item: 'item-cls', itemIcon: 'icon-cls', itemTitle: 'title-cls', itemRail: 'rail-cls' },
        styles: { itemTitle: { color: 'red' } },
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-steps-item').classes()).toContain('item-cls')
    expect(wrapper.find('.am-steps-item-icon').classes()).toContain('icon-cls')
    expect(wrapper.find('.am-steps-item-title').classes()).toContain('title-cls')
    expect(wrapper.find('.am-steps-item-title').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-steps-item-rail').classes()).toContain('rail-cls')

    const sized = mount(ConfigProvider, {
      props: { componentSize: 'small' },
      slots: { default: () => h(Steps, { items }) },
    })
    expect(sized.find('.am-steps').classes()).toContain('am-steps-sm')
  })
})
