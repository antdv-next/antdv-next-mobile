import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Segmented from '..'
import ConfigProvider from '../../config-provider'

const options = [
  'Daily',
  { label: 'Weekly', value: 'weekly', icon: () => h('i', { class: 'opt-icon' }) },
  { label: 'Monthly', value: 'monthly', disabled: true, className: 'opt-cls' },
  3,
]

describe('Segmented', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders options and selects the first one by default', () => {
    const wrapper = mount(Segmented, { props: { options } })
    expect(wrapper.classes()).toContain('am-segmented')
    expect(wrapper.attributes('role')).toBe('radiogroup')
    const items = wrapper.findAll('.am-segmented-item')
    expect(items).toHaveLength(4)
    expect(items.map(i => i.text())).toEqual(['Daily', 'Weekly', 'Monthly', '3'])
    expect(items[0].classes()).toContain('am-segmented-item-selected')
    expect(items[0].attributes('aria-checked')).toBe('true')
    expect(items[1].find('.opt-icon').exists()).toBe(true)
    expect(items[2].classes()).toEqual(expect.arrayContaining(['am-segmented-item-disabled', 'opt-cls']))
  })

  it('works uncontrolled with defaultValue', async () => {
    const wrapper = mount(Segmented, { props: { options, defaultValue: 'weekly' } })
    const items = wrapper.findAll('.am-segmented-item')
    expect(items[1].classes()).toContain('am-segmented-item-selected')
    await items[3].trigger('click')
    expect(items[3].classes()).toContain('am-segmented-item-selected')
    expect(wrapper.emitted('change')![0]).toEqual([3])
    expect(wrapper.emitted('update:value')![0]).toEqual([3])
    // selected & disabled items do nothing
    await items[3].trigger('click')
    await items[2].trigger('click')
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('works controlled', async () => {
    const wrapper = mount(Segmented, { props: { options, value: 'Daily' } })
    const items = wrapper.findAll('.am-segmented-item')
    await items[1].trigger('click')
    expect(wrapper.emitted('update:value')![0]).toEqual(['weekly'])
    expect(items[0].classes()).toContain('am-segmented-item-selected')
    await wrapper.setProps({ value: 'weekly' })
    expect(items[1].classes()).toContain('am-segmented-item-selected')
  })

  it('supports block, size, shape, vertical and disabled', async () => {
    const wrapper = mount(Segmented, { props: { options, block: true, size: 'large', shape: 'round', vertical: true, disabled: true } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'am-segmented-block',
      'am-segmented-lg',
      'am-segmented-round',
      'am-segmented-vertical',
      'am-segmented-disabled',
    ]))
    await wrapper.findAll('.am-segmented-item')[1].trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
    await wrapper.setProps({ orientation: 'horizontal', size: 'small' })
    expect(wrapper.classes()).not.toContain('am-segmented-vertical')
    expect(wrapper.classes()).toContain('am-segmented-sm')
  })

  it('iconRender / labelRender slots take priority', () => {
    const wrapper = mount(Segmented, {
      props: { options },
      slots: {
        iconRender: (option: any) => h('b', { class: 'slot-icon' }, String(option.value)),
        labelRender: (option: any) => `label-${option.value}`,
      },
    })
    const items = wrapper.findAll('.am-segmented-item')
    expect(items[1].find('.slot-icon').text()).toBe('weekly')
    expect(items[1].find('.opt-icon').exists()).toBe(false)
    expect(items[1].find('.am-segmented-item-label').text()).toBe('label-weekly')
  })

  it('positions the sliding thumb on the selected item', async () => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
      return this.classList.contains('am-segmented-item') ? 60 : 0
    })
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(26)
    vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(function (this: HTMLElement) {
      return Array.from(this.parentElement!.querySelectorAll('.am-segmented-item')).indexOf(this) * 60
    })
    const wrapper = mount(Segmented, { props: { options }, attachTo: document.body })
    await nextTick()
    expect(wrapper.classes()).toContain('am-segmented-with-thumb')
    const thumb = () => wrapper.find('.am-segmented-thumb').attributes('style')
    expect(thumb()).toContain('width: 60px')
    expect(thumb()).toContain('translate3d(0px, 0px, 0)')
    await wrapper.findAll('.am-segmented-item')[1].trigger('click')
    await nextTick()
    await nextTick()
    expect(thumb()).toContain('translate3d(60px, 0px, 0)')
  })

  it('has no thumb when it cannot be measured', () => {
    const wrapper = mount(Segmented, { props: { options } })
    expect(wrapper.find('.am-segmented-thumb').exists()).toBe(false)
    expect(wrapper.classes()).not.toContain('am-segmented-with-thumb')
  })

  it('passes attrs, rootClass, classes, styles and follows ConfigProvider', () => {
    const wrapper = mount(Segmented, {
      props: { options, rootClass: 'root-cls', classes: { item: 'item-cls', label: 'label-cls', icon: 'icon-cls' }, styles: { label: { color: 'red' } } },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-segmented-item').classes()).toContain('item-cls')
    expect(wrapper.find('.am-segmented-item-label').classes()).toContain('label-cls')
    expect(wrapper.find('.am-segmented-item-label').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-segmented-item-icon').classes()).toContain('icon-cls')

    const provider = mount(ConfigProvider, {
      props: { componentSize: 'small', componentDisabled: true },
      slots: { default: () => h(Segmented, { options }) },
    })
    expect(provider.find('.am-segmented').classes()).toEqual(expect.arrayContaining(['am-segmented-sm', 'am-segmented-disabled']))
  })
})
