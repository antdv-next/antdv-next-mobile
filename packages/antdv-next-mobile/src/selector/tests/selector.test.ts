import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, provide } from 'vue'
import Selector from '..'
import ConfigProvider from '../../config-provider'
import { formItemInputContextKey } from '../../form/context'

const options = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b', description: 'desc B' },
  { label: 'C', value: 'c', disabled: true },
  { label: 'D', value: 4 },
]

describe('Selector', () => {
  it('renders options, descriptions and base classes', () => {
    const wrapper = mount(Selector, { props: { options } })
    expect(wrapper.classes()).toContain('am-selector')
    expect(wrapper.attributes('role')).toBe('radiogroup')
    const items = wrapper.findAll('.am-selector-item')
    expect(items).toHaveLength(4)
    expect(items.map(n => n.find('.am-selector-item-label').text())).toEqual(['A', 'B', 'C', 'D'])
    expect(wrapper.findAll('.am-selector-item-description')).toHaveLength(1)
    expect(items[1].find('.am-selector-item-description').text()).toBe('desc B')
    expect(items[0].attributes('role')).toBe('radio')
    expect(items[0].attributes('aria-checked')).toBe('false')
    expect(items[2].classes()).toContain('am-selector-item-disabled')
    expect(items[2].attributes('tabindex')).toBe('-1')
  })

  it('single mode: selects one, switches and can be deselected (uncontrolled)', async () => {
    const wrapper = mount(Selector, { props: { options, defaultValue: ['a'] } })
    const items = wrapper.findAll('.am-selector-item')
    expect(items[0].classes()).toContain('am-selector-item-active')
    expect(items[0].find('.am-selector-check-mark').exists()).toBe(true)

    await items[1].trigger('click')
    expect(wrapper.emitted('update:value')?.[0]).toEqual([['b']])
    expect(wrapper.emitted('change')?.[0]).toEqual([['b'], { items: [options[1]] }])
    expect(items[0].classes()).not.toContain('am-selector-item-active')
    expect(items[1].classes()).toContain('am-selector-item-active')
    expect(items[1].attributes('aria-checked')).toBe('true')

    await items[1].trigger('click')
    expect(wrapper.emitted('change')?.[1]).toEqual([[], { items: [] }])
    expect(wrapper.findAll('.am-selector-item-active')).toHaveLength(0)
  })

  it('multiple mode: toggles values and reports the selected items', async () => {
    const wrapper = mount(Selector, { props: { options, multiple: true } })
    expect(wrapper.classes()).toContain('am-selector-multiple')
    expect(wrapper.attributes('role')).toBe('group')
    const items = wrapper.findAll('.am-selector-item')
    expect(items[0].attributes('role')).toBe('checkbox')
    await items[3].trigger('click')
    await items[0].trigger('click')
    expect(wrapper.emitted('change')?.[1]).toEqual([[4, 'a'], { items: [options[3], options[0]] }])
    await items[3].trigger('click')
    expect(wrapper.emitted('change')?.[2]).toEqual([['a'], { items: [options[0]] }])
    expect(wrapper.findAll('.am-selector-item-active')).toHaveLength(1)
  })

  it('is controlled by value', async () => {
    const wrapper = mount(Selector, { props: { options, value: ['a'] } })
    await wrapper.findAll('.am-selector-item')[1].trigger('click')
    expect(wrapper.emitted('update:value')?.[0]).toEqual([['b']])
    expect(wrapper.findAll('.am-selector-item')[0].classes()).toContain('am-selector-item-active')
    await wrapper.setProps({ value: ['b'] })
    expect(wrapper.findAll('.am-selector-item')[1].classes()).toContain('am-selector-item-active')
    expect(wrapper.findAll('.am-selector-item-active')).toHaveLength(1)
  })

  it('ignores disabled options and the disabled prop', async () => {
    const wrapper = mount(Selector, { props: { options } })
    await wrapper.findAll('.am-selector-item')[2].trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()

    await wrapper.setProps({ disabled: true })
    expect(wrapper.classes()).toContain('am-selector-disabled')
    await wrapper.findAll('.am-selector-item')[0].trigger('click')
    await wrapper.findAll('.am-selector-item')[0].trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.findAll('.am-selector-item-disabled')).toHaveLength(4)
  })

  it('follows ConfigProvider componentDisabled', () => {
    const wrapper = mount(ConfigProvider, {
      props: { componentDisabled: true },
      slots: { default: () => h(Selector, { options }) },
    })
    expect(wrapper.find('.am-selector').classes()).toContain('am-selector-disabled')
  })

  it('toggles with Enter / Space', async () => {
    const wrapper = mount(Selector, { props: { options } })
    const item = wrapper.findAll('.am-selector-item')[0]
    await item.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('change')?.[0][0]).toEqual(['a'])
    await item.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('change')?.[1][0]).toEqual([])
    await item.trigger('keydown', { key: 'a' })
    expect(wrapper.emitted('change')).toHaveLength(2)
  })

  it('supports columns and showCheckMark', () => {
    const wrapper = mount(Selector, { props: { options, columns: 2, showCheckMark: false, defaultValue: ['a'] } })
    expect(wrapper.classes()).toContain('am-selector-grid')
    expect(wrapper.attributes('style')).toContain('--am-selector-columns: 2')
    expect(wrapper.find('.am-selector-check-mark').exists()).toBe(false)
  })

  it('supports fieldNames', async () => {
    const data = [
      { name: 'One', id: 1, tip: 'first' },
      { name: 'Two', id: 2, off: true },
    ]
    const wrapper = mount(Selector, {
      props: { options: data, fieldNames: { label: 'name', value: 'id', description: 'tip', disabled: 'off' } },
    })
    const items = wrapper.findAll('.am-selector-item')
    expect(items[0].find('.am-selector-item-label').text()).toBe('One')
    expect(items[0].find('.am-selector-item-description').text()).toBe('first')
    expect(items[1].classes()).toContain('am-selector-item-disabled')
    await items[0].trigger('click')
    expect(wrapper.emitted('change')?.[0]).toEqual([[1], { items: [data[0]] }])
  })

  it('slots take priority over option fields and receive context', () => {
    const wrapper = mount(Selector, {
      props: { options, defaultValue: ['b'] },
      slots: {
        label: ({ option, checked, index }: any) => h('i', { class: 'slot-label' }, `${index}:${option.value}:${checked}`),
        description: ({ option }: any) => h('i', { class: 'slot-desc' }, `d-${option.value}`),
        checkMark: () => h('i', { class: 'slot-mark' }),
      },
    })
    expect(wrapper.findAll('.slot-label').map(n => n.text())).toEqual(['0:a:false', '1:b:true', '2:c:false', '3:4:false'])
    expect(wrapper.findAll('.slot-desc')).toHaveLength(4)
    expect(wrapper.text()).not.toContain('desc B')
    expect(wrapper.findAll('.slot-mark')).toHaveLength(1)
  })

  it('renders VNode / render function labels', () => {
    const wrapper = mount(Selector, {
      props: { options: [{ label: () => h('b', { class: 'fn-label' }, 'fn'), value: 1 }, { label: h('b', { class: 'vnode-label' }, 'vn'), value: 2 }] },
    })
    expect(wrapper.find('.fn-label').text()).toBe('fn')
    expect(wrapper.find('.vnode-label').text()).toBe('vn')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Selector, {
      props: {
        options,
        rootClass: 'root-cls',
        classes: { root: 'r', item: 'item-cls', label: 'label-cls', description: 'desc-cls' },
        styles: { root: { margin: '2px' }, item: { color: 'red' } },
      },
      attrs: { 'class': 'custom', 'style': 'padding: 1px', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r']))
    expect(wrapper.attributes('style')).toContain('padding: 1px')
    expect(wrapper.attributes('style')).toContain('margin: 2px')
    expect(wrapper.attributes('data-id')).toBe('x')
    const item = wrapper.findAll('.am-selector-item')[1]
    expect(item.classes()).toContain('item-cls')
    expect(item.attributes('style')).toContain('color: red')
    expect(item.find('.am-selector-item-label').classes()).toContain('label-cls')
    expect(item.find('.am-selector-item-description').classes()).toContain('desc-cls')
  })

  it('reports change / blur to FormItem and takes its id', async () => {
    const onFieldChange = vi.fn()
    const onFieldBlur = vi.fn()
    const wrapper = mount({
      setup() {
        provide(formItemInputContextKey, {
          status: { value: '' } as any,
          id: { value: 'form_selector' } as any,
          onFieldChange,
          onFieldBlur,
          isFormItemInput: true,
        })
        return () => h(Selector, { options })
      },
    })
    expect(wrapper.find('.am-selector').attributes('id')).toBe('form_selector')
    const item = wrapper.findAll('.am-selector-item')[0]
    await item.trigger('click')
    expect(onFieldChange).toHaveBeenCalledTimes(1)
    await item.trigger('blur')
    expect(onFieldBlur).toHaveBeenCalledTimes(1)
  })
})
