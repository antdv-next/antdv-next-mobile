import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { computed, h, nextTick, ref } from 'vue'
import Checkbox, { CheckboxGroup } from '..'
import ConfigProvider from '../../config-provider'
import { disabledContextKey } from '../../config-provider/context'
import { formItemInputContextKey } from '../../form/context'

function mountGroup(props: Record<string, any> = {}, children?: () => any) {
  return mount(CheckboxGroup, { props, slots: children ? { default: children } : undefined })
}

describe('Checkbox', () => {
  it('renders label with a native checkbox and base classes', () => {
    const wrapper = mount(Checkbox, { slots: { default: 'Agree' } })
    expect(wrapper.element.tagName).toBe('LABEL')
    expect(wrapper.classes()).toContain('am-checkbox')
    expect(wrapper.classes()).not.toContain('am-checkbox-checked')
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    expect(wrapper.find('.am-checkbox-inner').exists()).toBe(true)
    expect(wrapper.find('.am-checkbox-label').text()).toBe('Agree')
  })

  it('exposes Checkbox.Group', () => {
    expect(Checkbox.Group).toBe(CheckboxGroup)
    expect(Checkbox.name).toBe('AmCheckbox')
    expect(CheckboxGroup.name).toBe('AmCheckboxGroup')
  })

  it('works uncontrolled with defaultChecked and emits the PC event shape', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Checkbox, { props: { defaultChecked: true, value: 'a', onChange } })
    expect(wrapper.classes()).toContain('am-checkbox-checked')
    await wrapper.find('input').trigger('change')
    expect(wrapper.classes()).not.toContain('am-checkbox-checked')
    expect(wrapper.emitted('update:checked')![0]).toEqual([false])
    const event = onChange.mock.calls[0][0]
    expect(event.target.checked).toBe(false)
    expect(event.target.value).toBe('a')
    expect(event.nativeEvent).toBeInstanceOf(Event)
    expect(typeof event.stopPropagation).toBe('function')
    expect(typeof event.preventDefault).toBe('function')
  })

  it('stays controlled until the parent updates `checked`', async () => {
    const wrapper = mount(Checkbox, { props: { checked: false } })
    const input = wrapper.find('input')
    ;(input.element as HTMLInputElement).checked = true
    await input.trigger('change')
    await nextTick()
    expect(wrapper.emitted('update:checked')![0]).toEqual([true])
    expect(wrapper.classes()).not.toContain('am-checkbox-checked')
    expect((input.element as HTMLInputElement).checked).toBe(false)
    await wrapper.setProps({ checked: true })
    expect(wrapper.classes()).toContain('am-checkbox-checked')
    expect((input.element as HTMLInputElement).checked).toBe(true)
  })

  it('supports checkedValue / unCheckedValue', async () => {
    const wrapper = mount(Checkbox, { props: { checked: 'no', checkedValue: 'yes', unCheckedValue: 'no' } })
    expect(wrapper.classes()).not.toContain('am-checkbox-checked')
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('update:checked')![0]).toEqual(['yes'])
    await wrapper.setProps({ checked: 'yes' })
    expect(wrapper.classes()).toContain('am-checkbox-checked')
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('update:checked')![1]).toEqual(['no'])
  })

  it('does not change when disabled', async () => {
    const wrapper = mount(Checkbox, { props: { disabled: true } })
    expect(wrapper.classes()).toContain('am-checkbox-disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('renders indeterminate only while unchecked', async () => {
    const wrapper = mount(Checkbox, { props: { indeterminate: true } })
    await nextTick()
    expect(wrapper.classes()).toContain('am-checkbox-indeterminate')
    expect(wrapper.find('input').attributes('aria-checked')).toBe('mixed')
    expect((wrapper.find('input').element as HTMLInputElement).indeterminate).toBe(true)
    await wrapper.setProps({ checked: true })
    expect(wrapper.classes()).not.toContain('am-checkbox-indeterminate')
  })

  it('supports block and shape', () => {
    const wrapper = mount(Checkbox, { props: { block: true, shape: 'round' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-checkbox-block', 'am-checkbox-round']))
  })

  it('icon slot takes priority over icon prop and receives the state', async () => {
    const byProp = mount(Checkbox, {
      props: { defaultChecked: true, icon: ({ checked }: any) => h('i', { class: 'prop-icon' }, String(checked)) },
    })
    expect(byProp.find('.prop-icon').text()).toBe('true')
    expect(byProp.find('.am-checkbox-inner').exists()).toBe(false)
    const bySlot = mount(Checkbox, {
      props: { icon: () => h('i', { class: 'prop-icon' }) },
      slots: { icon: ({ checked, indeterminate }: any) => h('i', { class: 'slot-icon' }, `${checked}-${indeterminate}`) },
    })
    expect(bySlot.find('.prop-icon').exists()).toBe(false)
    expect(bySlot.find('.slot-icon').text()).toBe('false-false')
    await bySlot.find('input').trigger('change')
    expect(bySlot.find('.slot-icon').text()).toBe('true-false')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Checkbox, {
      props: {
        rootClass: 'root-cls',
        classes: { root: 'sem-root', icon: 'sem-icon', label: 'sem-label' },
        styles: { label: { color: 'red' } },
        name: 'agree',
        id: 'agree-id',
      },
      attrs: { 'class': 'custom', 'style': 'margin: 1px', 'data-id': 'x' },
      slots: { default: 'Text' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'sem-root']))
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-checkbox-icon').classes()).toContain('sem-icon')
    expect(wrapper.find('.am-checkbox-label').classes()).toContain('sem-label')
    expect(wrapper.find('.am-checkbox-label').attributes('style')).toContain('color: red')
    expect(wrapper.find('input').attributes('name')).toBe('agree')
    expect(wrapper.find('input').attributes('id')).toBe('agree-id')
  })

  it('emits click / focus / blur and exposes focus & blur', async () => {
    const wrapper = mount(Checkbox, { attachTo: document.body })
    await wrapper.find('input').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    ;(wrapper.vm as any).focus()
    expect(document.activeElement).toBe(wrapper.find('input').element)
    expect(wrapper.emitted('focus')).toHaveLength(1)
    ;(wrapper.vm as any).blur()
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect((wrapper.vm as any).input).toBe(wrapper.find('input').element)
    expect((wrapper.vm as any).nativeElement).toBe(wrapper.element)
  })

  it('follows ConfigProvider componentDisabled and Form disabled context', () => {
    const byConfig = mount(ConfigProvider, {
      props: { componentDisabled: true },
      slots: { default: () => h(Checkbox) },
    })
    expect(byConfig.find('.am-checkbox').classes()).toContain('am-checkbox-disabled')
    const byForm = mount(Checkbox, {
      global: { provide: { [disabledContextKey as symbol]: computed(() => true) } },
    })
    expect(byForm.classes()).toContain('am-checkbox-disabled')
  })

  it('reports to the FormItem context and takes its id', async () => {
    const onFieldChange = vi.fn()
    const onFieldBlur = vi.fn()
    const wrapper = mount(Checkbox, {
      global: {
        provide: {
          [formItemInputContextKey as symbol]: {
            status: computed(() => ''),
            id: computed(() => 'form_agree'),
            onFieldChange,
            onFieldBlur,
            isFormItemInput: true,
          },
        },
      },
    })
    expect(wrapper.find('input').attributes('id')).toBe('form_agree')
    await wrapper.find('input').trigger('change')
    expect(onFieldChange).toHaveBeenCalledTimes(1)
    await wrapper.find('input').trigger('blur')
    expect(onFieldBlur).toHaveBeenCalledTimes(1)
  })
})

describe('CheckboxGroup', () => {
  it('renders options (string / number / object) and checked state', () => {
    const wrapper = mountGroup({
      options: ['A', 2, { label: 'C', value: 'c', disabled: true }],
      defaultValue: ['A'],
      name: 'letters',
    })
    expect(wrapper.classes()).toContain('am-checkbox-group')
    expect(wrapper.attributes('role')).toBe('group')
    const items = wrapper.findAll('.am-checkbox')
    expect(items).toHaveLength(3)
    expect(items.map(i => i.text())).toEqual(['A', '2', 'C'])
    expect(items[0].classes()).toContain('am-checkbox-checked')
    expect(items[2].classes()).toContain('am-checkbox-disabled')
    expect(items[0].find('input').attributes('name')).toBe('letters')
  })

  it('emits change / update:value sorted by option order (uncontrolled)', async () => {
    const wrapper = mountGroup({ options: ['A', 'B', 'C'], defaultValue: ['C'] })
    const inputs = wrapper.findAll('input')
    await inputs[0].trigger('change')
    expect(wrapper.emitted('change')![0]).toEqual([['A', 'C']])
    expect(wrapper.emitted('update:value')![0]).toEqual([['A', 'C']])
    await inputs[2].trigger('change')
    expect(wrapper.emitted('change')![1]).toEqual([['A']])
    expect(wrapper.findAll('.am-checkbox-checked')).toHaveLength(1)
  })

  it('is controlled by value', async () => {
    const wrapper = mountGroup({ options: ['A', 'B'], value: ['A'] })
    await wrapper.findAll('input')[1].trigger('change')
    expect(wrapper.emitted('change')![0]).toEqual([['A', 'B']])
    expect(wrapper.findAll('.am-checkbox-checked')).toHaveLength(1)
    await wrapper.setProps({ value: ['A', 'B'] })
    expect(wrapper.findAll('.am-checkbox-checked')).toHaveLength(2)
  })

  it('works with slotted checkboxes and v-model', async () => {
    const value = ref<string[]>(['b'])
    const onItemChange = vi.fn()
    const wrapper = mount({
      setup: () => () =>
        h(CheckboxGroup, { 'value': value.value, 'onUpdate:value': (v: string[]) => (value.value = v) }, () => [
          h(Checkbox, { value: 'a', onChange: onItemChange }, () => 'A'),
          h(Checkbox, { value: 'b' }, () => 'B'),
        ]),
    })
    expect(wrapper.findAll('.am-checkbox')[1].classes()).toContain('am-checkbox-checked')
    await wrapper.findAll('input')[0].trigger('change')
    expect(value.value).toEqual(['a', 'b'])
    expect(onItemChange.mock.calls[0][0].target.checked).toBe(true)
    expect(wrapper.findAll('.am-checkbox-checked')).toHaveLength(2)
  })

  it('disables every item, an item can opt out', () => {
    const wrapper = mountGroup({ disabled: true }, () => [
      h(Checkbox, { value: 'a' }),
      h(Checkbox, { value: 'b', disabled: false }),
    ])
    const items = wrapper.findAll('.am-checkbox')
    expect(items[0].classes()).toContain('am-checkbox-disabled')
    expect(items[1].classes()).not.toContain('am-checkbox-disabled')
  })

  it('limits the checked count with max', async () => {
    const wrapper = mountGroup({ options: ['A', 'B', 'C'], defaultValue: ['A'], max: 2 })
    await wrapper.findAll('input')[1].trigger('change')
    const items = wrapper.findAll('.am-checkbox')
    expect(items[2].classes()).toContain('am-checkbox-disabled')
    expect(items[0].classes()).not.toContain('am-checkbox-disabled')
    await wrapper.findAll('input')[2].trigger('change')
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('passes block / shape / semantic classes and the icon slot to items', () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        options: ['A', 'B'],
        block: true,
        shape: 'round',
        rootClass: 'root-cls',
        classes: { item: 'item-cls', itemIcon: 'icon-cls', itemLabel: 'label-cls' },
      },
      attrs: { class: 'custom' },
      slots: { icon: ({ checked }: any) => h('i', { class: 'group-icon' }, String(checked)) },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-checkbox-group-block', 'root-cls', 'custom']))
    const item = wrapper.find('.am-checkbox')
    expect(item.classes()).toEqual(expect.arrayContaining(['am-checkbox-block', 'am-checkbox-round', 'item-cls']))
    expect(item.find('.am-checkbox-icon').classes()).toContain('icon-cls')
    expect(item.find('.am-checkbox-label').classes()).toContain('label-cls')
    expect(item.find('.group-icon').text()).toBe('false')
  })

  it('labelRender slot wins over the prop', () => {
    const byProp = mountGroup({ options: ['A'], labelRender: ({ item, index }: any) => `${index}:${item.label}` })
    expect(byProp.find('.am-checkbox-label').text()).toBe('0:A')
    const bySlot = mount(CheckboxGroup, {
      props: { options: ['A'], labelRender: () => 'prop' },
      slots: { labelRender: ({ item }: any) => `slot-${item.value}` },
    })
    expect(bySlot.find('.am-checkbox-label').text()).toBe('slot-A')
  })

  it('reports to the FormItem context once per change and takes its id', async () => {
    const onFieldChange = vi.fn()
    const wrapper = mount(CheckboxGroup, {
      props: { options: ['A', 'B'] },
      global: {
        provide: {
          [formItemInputContextKey as symbol]: {
            status: computed(() => ''),
            id: computed(() => 'form_letters'),
            onFieldChange,
            onFieldBlur: () => {},
            isFormItemInput: true,
          },
        },
      },
    })
    expect(wrapper.attributes('id')).toBe('form_letters')
    expect(wrapper.find('input').attributes('id')).toBeUndefined()
    await wrapper.find('input').trigger('change')
    expect(onFieldChange).toHaveBeenCalledTimes(1)
  })

  it('skipGroup makes a checkbox ignore the group', async () => {
    const wrapper = mountGroup({ defaultValue: ['a'] }, () => [h(Checkbox, { value: 'a', skipGroup: true })])
    expect(wrapper.find('.am-checkbox').classes()).not.toContain('am-checkbox-checked')
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('change')).toBeUndefined()
  })
})
