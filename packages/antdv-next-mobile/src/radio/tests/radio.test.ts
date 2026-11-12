import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { computed, h, nextTick, ref } from 'vue'
import Radio, { RadioButton, RadioGroup } from '..'
import ConfigProvider from '../../config-provider'
import { disabledContextKey } from '../../config-provider/context'
import { formItemInputContextKey } from '../../form/context'

function formItemProvide(overrides: Record<string, any> = {}) {
  return {
    [formItemInputContextKey as symbol]: {
      status: computed(() => ''),
      id: computed(() => 'form_field'),
      onFieldChange: () => {},
      onFieldBlur: () => {},
      isFormItemInput: true,
      ...overrides,
    },
  }
}

describe('Radio', () => {
  it('renders label with a native radio and base classes', () => {
    const wrapper = mount(Radio, { slots: { default: 'Option' } })
    expect(wrapper.element.tagName).toBe('LABEL')
    expect(wrapper.classes()).toContain('am-radio')
    expect(wrapper.find('input[type="radio"]').exists()).toBe(true)
    expect(wrapper.find('.am-radio-inner').exists()).toBe(true)
    expect(wrapper.find('.am-radio-label').text()).toBe('Option')
  })

  it('exposes Radio.Group and Radio.Button', () => {
    expect(Radio.Group).toBe(RadioGroup)
    expect(Radio.Button).toBe(RadioButton)
    expect(Radio.name).toBe('AmRadio')
    expect(RadioGroup.name).toBe('AmRadioGroup')
    expect(RadioButton.name).toBe('AmRadioButton')
  })

  it('checks once when uncontrolled and emits the PC event shape', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Radio, { props: { value: 'a', onChange } })
    await wrapper.find('input').trigger('change')
    expect(wrapper.classes()).toContain('am-radio-checked')
    expect(wrapper.emitted('update:checked')![0]).toEqual([true])
    const event = onChange.mock.calls[0][0]
    expect(event.target.checked).toBe(true)
    expect(event.target.value).toBe('a')
    expect(event.nativeEvent).toBeInstanceOf(Event)
    // an already checked radio never fires again
    await wrapper.find('input').trigger('change')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('supports defaultChecked and controlled checked', async () => {
    expect(mount(Radio, { props: { defaultChecked: true } }).classes()).toContain('am-radio-checked')
    const wrapper = mount(Radio, { props: { checked: false } })
    const input = wrapper.find('input')
    ;(input.element as HTMLInputElement).checked = true
    await input.trigger('change')
    await nextTick()
    expect(wrapper.emitted('update:checked')![0]).toEqual([true])
    expect(wrapper.classes()).not.toContain('am-radio-checked')
    expect((input.element as HTMLInputElement).checked).toBe(false)
    await wrapper.setProps({ checked: true })
    expect(wrapper.classes()).toContain('am-radio-checked')
  })

  it('does not change when disabled', async () => {
    const wrapper = mount(Radio, { props: { disabled: true } })
    expect(wrapper.classes()).toContain('am-radio-disabled')
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('icon slot takes priority over icon prop', () => {
    const byProp = mount(Radio, { props: { icon: ({ checked }: any) => h('i', { class: 'prop-icon' }, String(checked)) } })
    expect(byProp.find('.prop-icon').text()).toBe('false')
    const bySlot = mount(Radio, {
      props: { icon: () => h('i', { class: 'prop-icon' }) },
      slots: { icon: () => h('i', { class: 'slot-icon' }) },
    })
    expect(bySlot.find('.slot-icon').exists()).toBe(true)
    expect(bySlot.find('.prop-icon').exists()).toBe(false)
  })

  it('passes attrs, rootClass, classes, styles and block', () => {
    const wrapper = mount(Radio, {
      props: {
        block: true,
        rootClass: 'root-cls',
        classes: { icon: 'sem-icon', label: 'sem-label' },
        styles: { root: { color: 'red' } },
        name: 'n',
        id: 'i',
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
      slots: { default: 'Text' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'am-radio-block']))
    expect(wrapper.attributes('style')).toContain('color: red')
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-radio-icon').classes()).toContain('sem-icon')
    expect(wrapper.find('.am-radio-label').classes()).toContain('sem-label')
    expect(wrapper.find('input').attributes('name')).toBe('n')
    expect(wrapper.find('input').attributes('id')).toBe('i')
  })

  it('follows ConfigProvider componentDisabled and Form disabled context', () => {
    const byConfig = mount(ConfigProvider, { props: { componentDisabled: true }, slots: { default: () => h(Radio) } })
    expect(byConfig.find('.am-radio').classes()).toContain('am-radio-disabled')
    const byForm = mount(Radio, { global: { provide: { [disabledContextKey as symbol]: computed(() => true) } } })
    expect(byForm.classes()).toContain('am-radio-disabled')
  })

  it('reports to the FormItem context and exposes focus / blur', async () => {
    const onFieldChange = vi.fn()
    const onFieldBlur = vi.fn()
    const wrapper = mount(Radio, {
      attachTo: document.body,
      global: { provide: formItemProvide({ onFieldChange, onFieldBlur }) },
    })
    expect(wrapper.find('input').attributes('id')).toBe('form_field')
    await wrapper.find('input').trigger('change')
    expect(onFieldChange).toHaveBeenCalledTimes(1)
    ;(wrapper.vm as any).focus()
    expect(document.activeElement).toBe(wrapper.find('input').element)
    ;(wrapper.vm as any).blur()
    expect(onFieldBlur).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
  })
})

describe('RadioButton', () => {
  it('renders the button style and forwards props / events', async () => {
    const wrapper = mount(RadioButton, { props: { value: 'a' }, attrs: { class: 'custom' }, slots: { default: 'A' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-radio-button', 'custom']))
    expect(wrapper.classes()).not.toContain('am-radio')
    expect(wrapper.find('.am-radio-icon').exists()).toBe(false)
    expect(wrapper.find('.am-radio-button-label').text()).toBe('A')
    await wrapper.find('input').trigger('change')
    expect(wrapper.classes()).toContain('am-radio-button-checked')
    expect((wrapper.emitted('change')![0][0] as any).target.value).toBe('a')
    expect(wrapper.emitted('update:checked')![0]).toEqual([true])
  })

  it('follows ConfigProvider componentSize', () => {
    const wrapper = mount(ConfigProvider, {
      props: { componentSize: 'small' },
      slots: { default: () => h(RadioButton, { value: 1 }, () => 'A') },
    })
    expect(wrapper.find('.am-radio-button').classes()).toContain('am-radio-button-sm')
  })
})

describe('RadioGroup', () => {
  it('renders options and the checked item, radios share a name', () => {
    const wrapper = mount(RadioGroup, {
      props: { options: ['A', 2, { label: 'C', value: 'c', disabled: true }], defaultValue: 2 },
    })
    expect(wrapper.classes()).toContain('am-radio-group')
    expect(wrapper.attributes('role')).toBe('radiogroup')
    const items = wrapper.findAll('.am-radio')
    expect(items.map(i => i.text())).toEqual(['A', '2', 'C'])
    expect(items[1].classes()).toContain('am-radio-checked')
    expect(items[2].classes()).toContain('am-radio-disabled')
    const names = wrapper.findAll('input').map(i => i.attributes('name'))
    expect(names[0]).toBeTruthy()
    expect(new Set(names).size).toBe(1)
    const named = mount(RadioGroup, { props: { options: ['A'], name: 'fruit' } })
    expect(named.find('input').attributes('name')).toBe('fruit')
  })

  it('emits change(e) and update:value (uncontrolled)', async () => {
    const wrapper = mount(RadioGroup, { props: { options: ['A', 'B'], defaultValue: 'A' } })
    await wrapper.findAll('input')[1].trigger('change')
    expect(wrapper.emitted('update:value')![0]).toEqual(['B'])
    const event = wrapper.emitted('change')![0][0] as any
    expect(event.target.value).toBe('B')
    expect(event.target.checked).toBe(true)
    const items = wrapper.findAll('.am-radio')
    expect(items[0].classes()).not.toContain('am-radio-checked')
    expect(items[1].classes()).toContain('am-radio-checked')
    // selecting the current value again does nothing
    await wrapper.findAll('input')[1].trigger('change')
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('is controlled by value', async () => {
    const wrapper = mount(RadioGroup, { props: { options: ['A', 'B'], value: 'A' } })
    await wrapper.findAll('input')[1].trigger('change')
    expect(wrapper.emitted('update:value')![0]).toEqual(['B'])
    expect(wrapper.findAll('.am-radio')[0].classes()).toContain('am-radio-checked')
    await wrapper.setProps({ value: 'B' })
    expect(wrapper.findAll('.am-radio')[1].classes()).toContain('am-radio-checked')
  })

  it('works with slotted radios and v-model', async () => {
    const value = ref('a')
    const onItemChange = vi.fn()
    const wrapper = mount({
      setup: () => () =>
        h(RadioGroup, { 'value': value.value, 'onUpdate:value': (v: string) => (value.value = v) }, () => [
          h(Radio, { value: 'a' }, () => 'A'),
          h(Radio, { value: 'b', onChange: onItemChange }, () => 'B'),
        ]),
    })
    await wrapper.findAll('input')[1].trigger('change')
    expect(value.value).toBe('b')
    expect(onItemChange).toHaveBeenCalledTimes(1)
    expect(wrapper.findAll('.am-radio-checked')).toHaveLength(1)
  })

  it('renders button options with buttonStyle, size and block', () => {
    const wrapper = mount(RadioGroup, {
      props: { options: ['A', 'B'], optionType: 'button', buttonStyle: 'solid', size: 'large', block: true, value: 'A' },
    })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['am-radio-group-button', 'am-radio-group-solid', 'am-radio-group-lg', 'am-radio-group-block']),
    )
    const buttons = wrapper.findAll('.am-radio-button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].classes()).toEqual(
      expect.arrayContaining(['am-radio-button-checked', 'am-radio-button-solid', 'am-radio-button-lg', 'am-radio-button-block']),
    )
    expect(wrapper.find('.am-radio').exists()).toBe(false)
  })

  it('supports Radio.Button children', async () => {
    const wrapper = mount(RadioGroup, {
      props: { defaultValue: 'a' },
      slots: { default: () => [h(RadioButton, { value: 'a' }, () => 'A'), h(RadioButton, { value: 'b' }, () => 'B')] },
    })
    const buttons = wrapper.findAll('.am-radio-button')
    expect(buttons[0].classes()).toContain('am-radio-button-checked')
    await buttons[1].find('input').trigger('change')
    expect(wrapper.emitted('update:value')![0]).toEqual(['b'])
    expect(wrapper.findAll('.am-radio-button')[1].classes()).toContain('am-radio-button-checked')
  })

  it('supports vertical / orientation and list style block', () => {
    expect(mount(RadioGroup, { props: { vertical: true } }).classes()).toContain('am-radio-group-vertical')
    const byOrientation = mount(RadioGroup, { props: { orientation: 'vertical' } })
    expect(byOrientation.classes()).toContain('am-radio-group-vertical')
    expect(byOrientation.attributes('aria-orientation')).toBe('vertical')
    const block = mount(RadioGroup, { props: { options: ['A'], block: true } })
    expect(block.find('.am-radio').classes()).toContain('am-radio-block')
  })

  it('disables every item, an item can opt out', async () => {
    const wrapper = mount(RadioGroup, {
      props: { disabled: true },
      slots: { default: () => [h(Radio, { value: 'a' }), h(Radio, { value: 'b', disabled: false })] },
    })
    const items = wrapper.findAll('.am-radio')
    expect(items[0].classes()).toContain('am-radio-disabled')
    expect(items[1].classes()).not.toContain('am-radio-disabled')
    await items[0].find('input').trigger('change')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('passes semantic classes, attrs, icon and labelRender slots', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        options: ['A'],
        rootClass: 'root-cls',
        classes: { item: 'item-cls', itemIcon: 'icon-cls', itemLabel: 'label-cls' },
        labelRender: () => 'prop',
      },
      attrs: { class: 'custom' },
      slots: {
        icon: ({ checked }: any) => h('i', { class: 'group-icon' }, String(checked)),
        labelRender: ({ item, index }: any) => `${index}-${item.value}`,
      },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['root-cls', 'custom']))
    const item = wrapper.find('.am-radio')
    expect(item.classes()).toContain('item-cls')
    expect(item.find('.am-radio-icon').classes()).toContain('icon-cls')
    expect(item.find('.am-radio-label').classes()).toContain('label-cls')
    expect(item.find('.group-icon').text()).toBe('false')
    expect(item.find('.am-radio-label').text()).toBe('0-A')
  })

  it('reports to the FormItem context and takes its id', async () => {
    const onFieldChange = vi.fn()
    const wrapper = mount(RadioGroup, {
      props: { options: ['A', 'B'] },
      global: { provide: formItemProvide({ onFieldChange }) },
    })
    expect(wrapper.attributes('id')).toBe('form_field')
    expect(wrapper.find('input').attributes('id')).toBeUndefined()
    await wrapper.find('input').trigger('change')
    expect(onFieldChange).toHaveBeenCalledTimes(1)
  })
})
