import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { computed, h, nextTick } from 'vue'
import Select from '..'
import ConfigProvider from '../../config-provider'
import { formItemInputContextKey } from '../../form/context'
import enUS from '../../locale/en_US'

const options = [
  { label: '苹果', value: 'apple', description: '红富士' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange', disabled: true },
  { label: '葡萄', value: 'grape' },
]

const optionEls = () => [...document.querySelectorAll<HTMLElement>('.am-select-option')]
const optionTexts = () => optionEls().map(el => el.querySelector('.am-select-option-label')?.textContent!.trim() ?? el.textContent!.trim())
function clickOption(text: string) {
  optionEls().find(el => el.textContent!.includes(text))!.click()
  return nextTick()
}
function clickButton(type: 'confirm' | 'cancel') {
  document.querySelector<HTMLElement>(`.am-picker-popup-${type}`)!.click()
  return nextTick()
}

describe('Select', () => {
  it('renders the trigger and a teleported option list', async () => {
    const wrapper = mount(Select, { props: { options, title: '选择水果' } })
    const trigger = wrapper.find('.am-picker-trigger')
    expect(trigger.classes()).toContain('am-select')
    expect(trigger.text()).toBe('请选择')
    await trigger.trigger('click')
    expect(document.querySelector('.am-select-panel')!.closest('.am-popup-root')!.parentElement).toBe(document.body)
    expect(document.querySelector('.am-picker-popup-title')!.textContent).toBe('选择水果')
    expect(optionTexts()).toEqual(['苹果', '香蕉', '橙子', '葡萄'])
    expect(document.querySelector('.am-select-option-description')!.textContent!.trim()).toBe('红富士')
    expect(optionEls()[2].classList.contains('am-select-option-disabled')).toBe(true)
    // single mode has no confirm button
    expect(document.querySelector('.am-picker-popup-confirm')).toBeNull()
  })

  it('single: picks and closes immediately (uncontrolled)', async () => {
    const wrapper = mount(Select, { props: { options } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    await clickOption('香蕉')
    expect(wrapper.emitted('update:value')![0]).toEqual(['banana'])
    expect(wrapper.emitted('change')![0]).toEqual(['banana', options[1]])
    expect(wrapper.emitted('select')![0]).toEqual(['banana', options[1]])
    expect(wrapper.emitted('confirm')![0]).toEqual(['banana'])
    expect(wrapper.emitted('update:open')!.slice(-1)[0]).toEqual([false])
    expect(wrapper.find('.am-picker-trigger').text()).toBe('香蕉')
    // picking the same option again closes without a change
    await wrapper.find('.am-picker-trigger').trigger('click')
    expect(optionEls()[1].classList.contains('am-select-option-selected')).toBe(true)
    await clickOption('香蕉')
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('ignores disabled options and cancels on mask click', async () => {
    const wrapper = mount(Select, { props: { options, defaultValue: 'apple' } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    await clickOption('橙子')
    expect(wrapper.emitted('change')).toBeUndefined()
    document.querySelector<HTMLElement>('.am-popup-mask')!.click()
    await nextTick()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.find('.am-picker-trigger').text()).toBe('苹果')
  })

  it('works controlled', async () => {
    const wrapper = mount(Select, { props: { options, value: 'apple' } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    await clickOption('葡萄')
    expect(wrapper.emitted('update:value')![0]).toEqual(['grape'])
    expect(wrapper.find('.am-picker-trigger').text()).toBe('苹果')
    await wrapper.setProps({ value: 'grape' })
    expect(wrapper.find('.am-picker-trigger').text()).toBe('葡萄')
  })

  it('multiple: checklist committed on confirm, discarded on cancel', async () => {
    const wrapper = mount(Select, { props: { options, mode: 'multiple', defaultValue: ['apple'] } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    expect(document.querySelector('.am-select-panel-multiple')).not.toBeNull()
    await clickOption('香蕉')
    expect(wrapper.emitted('select')![0]).toEqual(['banana', options[1]])
    await clickOption('苹果')
    expect(wrapper.emitted('deselect')![0]).toEqual(['apple', options[0]])
    expect(wrapper.emitted('change')).toBeUndefined()
    await clickButton('cancel')
    expect(wrapper.find('.am-picker-trigger').text()).toBe('苹果')

    await wrapper.find('.am-picker-trigger').trigger('click')
    expect(optionEls().filter(el => el.classList.contains('am-select-option-selected'))).toHaveLength(1)
    await clickOption('葡萄')
    await clickButton('confirm')
    expect(wrapper.emitted('update:value')![0]).toEqual([['apple', 'grape']])
    expect(wrapper.emitted('change')![0]).toEqual([['apple', 'grape'], [options[0], options[3]]])
    expect(wrapper.emitted('confirm')![0]).toEqual([['apple', 'grape']])
    expect(wrapper.find('.am-picker-trigger').text()).toBe('苹果、葡萄')
  })

  it('multiple: maxCount disables the rest, maxTagCount shortens the label', async () => {
    const wrapper = mount(Select, { props: { options, mode: 'multiple', maxCount: 2, maxTagCount: 1, defaultValue: ['apple', 'banana'] } })
    expect(wrapper.find('.am-picker-trigger').text()).toBe('苹果 +1...')
    await wrapper.find('.am-picker-trigger').trigger('click')
    expect(optionEls()[3].classList.contains('am-select-option-disabled')).toBe(true)
    await clickOption('葡萄')
    expect(wrapper.emitted('select')).toBeUndefined()
    await clickOption('香蕉')
    expect(optionEls()[3].classList.contains('am-select-option-disabled')).toBe(false)

    const custom = mount(Select, {
      props: { options, mode: 'multiple', maxTagCount: 1, value: ['apple', 'banana', 'grape'], maxTagPlaceholder: (omitted: any[]) => `等 ${omitted.length + 1} 项` },
    })
    expect(custom.find('.am-picker-trigger').text().replace(/\s+/g, ' ')).toBe('苹果等 3 项')
  })

  it('supports labelInValue', async () => {
    const wrapper = mount(Select, { props: { options, labelInValue: true, defaultValue: { value: 'x', label: '未知' } } })
    expect(wrapper.find('.am-picker-trigger').text()).toBe('未知')
    await wrapper.find('.am-picker-trigger').trigger('click')
    await clickOption('苹果')
    expect(wrapper.emitted('update:value')![0]).toEqual([{ value: 'apple', label: '苹果' }])
  })

  it('searches: filters locally, emits search and resets on close', async () => {
    const wrapper = mount(Select, { props: { options, showSearch: { placeholder: '搜索水果' } } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    const input = document.querySelector<HTMLInputElement>('.am-select-search-input')!
    expect(input.placeholder).toBe('搜索水果')
    input.value = '蕉'
    input.dispatchEvent(new Event('input'))
    await nextTick()
    expect(wrapper.emitted('search')![0]).toEqual(['蕉'])
    expect(optionTexts()).toEqual(['香蕉'])
    // description is searched too
    input.value = '富士'
    input.dispatchEvent(new Event('input'))
    await nextTick()
    expect(optionTexts()).toEqual(['苹果'])
    input.value = 'zzz'
    input.dispatchEvent(new Event('input'))
    await nextTick()
    expect(document.querySelector('.am-select-empty')!.textContent!.trim()).toBe('暂无数据')
    await clickButton('cancel')
    expect(wrapper.emitted('search')!.slice(-1)[0]).toEqual([''])
    expect(optionTexts()).toHaveLength(4)
  })

  it('supports custom filterOption and remote search (filterOption=false)', async () => {
    const wrapper = mount(Select, {
      props: { options, showSearch: true, filterOption: (input: string, option: any) => option.value.startsWith(input) },
    })
    await wrapper.find('.am-picker-trigger').trigger('click')
    const input = document.querySelector<HTMLInputElement>('.am-select-search-input')!
    expect(input.placeholder).toBe('搜索')
    input.value = 'gr'
    input.dispatchEvent(new Event('input'))
    await nextTick()
    expect(optionTexts()).toEqual(['葡萄'])
    await wrapper.setProps({ filterOption: false })
    expect(optionTexts()).toHaveLength(4)
  })

  it('renders groups and fieldNames', async () => {
    const wrapper = mount(Select, {
      props: {
        options: [
          { name: '水果', children: [{ name: '苹果', id: 1 }, { name: '香蕉', id: 2 }] },
          { name: '蔬菜', children: [{ name: '番茄', id: 3 }] },
        ],
        fieldNames: { label: 'name', value: 'id', options: 'children' },
        showSearch: true,
        defaultValue: 3,
      },
    })
    expect(wrapper.find('.am-picker-trigger').text()).toBe('番茄')
    await wrapper.find('.am-picker-trigger').trigger('click')
    expect([...document.querySelectorAll('.am-select-group')].map(el => el.textContent!.trim())).toEqual(['水果', '蔬菜'])
    expect(optionEls()).toHaveLength(3)
    const input = document.querySelector<HTMLInputElement>('.am-select-search-input')!
    input.value = '番'
    input.dispatchEvent(new Event('input'))
    await nextTick()
    // groups without a match are dropped
    expect([...document.querySelectorAll('.am-select-group')].map(el => el.textContent!.trim())).toEqual(['蔬菜'])
  })

  it('loading and notFoundContent (slot wins)', async () => {
    const wrapper = mount(Select, { props: { options: [], loading: true, defaultOpen: true, notFoundContent: 'by-prop' } })
    await nextTick()
    expect(document.querySelector('.am-select-loading .am-spin-icon')).not.toBeNull()
    await wrapper.setProps({ loading: false })
    expect(document.querySelector('.am-select-empty')!.textContent!.trim()).toBe('by-prop')
    wrapper.unmount()
    document.body.innerHTML = ''

    mount(Select, { props: { options: [], defaultOpen: true, notFoundContent: 'by-prop' }, slots: { notFoundContent: () => 'by-slot' } })
    await nextTick()
    expect(document.querySelector('.am-select-empty')!.textContent!.trim()).toBe('by-slot')
  })

  it('option / labelRender: slot wins over prop', async () => {
    const optionRender = ({ option }: any) => h('i', { class: 'opt-prop' }, option.label)
    const labelRender = ({ label }: any) => h('i', { class: 'label-prop' }, label)
    const byProp = mount(Select, { props: { options, optionRender, labelRender, defaultValue: 'apple', defaultOpen: true } })
    await nextTick()
    expect(document.querySelectorAll('.opt-prop')).toHaveLength(4)
    expect(byProp.find('.label-prop').text()).toBe('苹果')
    byProp.unmount()
    document.body.innerHTML = ''

    const bySlot = mount(Select, {
      props: { options, optionRender, labelRender, defaultValue: 'apple', defaultOpen: true },
      slots: {
        option: ({ option, selected }: any) => h('b', { class: ['opt-slot', { on: selected }] }, option.label),
        labelRender: ({ label }: any) => h('b', { class: 'label-slot' }, label),
      },
    })
    await nextTick()
    expect(document.querySelector('.opt-prop')).toBeNull()
    expect(document.querySelectorAll('.opt-slot.on')).toHaveLength(1)
    expect(bySlot.find('.label-slot').text()).toBe('苹果')
    expect(bySlot.find('.label-prop').exists()).toBe(false)
  })

  it('clears: null in single mode, [] in multiple mode', async () => {
    const single = mount(Select, { props: { options, defaultValue: 'apple', allowClear: true } })
    await single.find('.am-picker-trigger-clear').trigger('click')
    expect(single.emitted('update:value')![0]).toEqual([null])
    expect(single.emitted('change')![0]).toEqual([null, undefined])
    expect(single.emitted('clear')).toHaveLength(1)
    const multiple = mount(Select, { props: { options, mode: 'multiple', defaultValue: ['apple'], allowClear: true } })
    await multiple.find('.am-picker-trigger-clear').trigger('click')
    expect(multiple.emitted('update:value')![0]).toEqual([[]])
  })

  it('disabled, default slot, trigger=false and attrs', async () => {
    const disabled = mount(Select, { props: { options, disabled: true }, attrs: { 'data-id': 'x', class: 'custom' } })
    expect(disabled.find('.am-picker-trigger').attributes('data-id')).toBe('x')
    expect(disabled.find('.am-picker-trigger').classes()).toEqual(expect.arrayContaining(['custom', 'am-picker-trigger-disabled']))
    await disabled.find('.am-picker-trigger').trigger('click')
    expect(disabled.emitted('update:open')).toBeUndefined()

    const custom = mount(Select, {
      props: { options, defaultValue: 'grape' },
      slots: { default: ({ label, toggle }: any) => h('button', { class: 'custom-trigger', onClick: () => toggle() }, label) },
    })
    expect(custom.find('.custom-trigger').text()).toBe('葡萄')
    await custom.find('.custom-trigger').trigger('click')
    expect(custom.emitted('update:open')![0]).toEqual([true])

    const hidden = mount(Select, { props: { options, trigger: false } })
    expect(hidden.find('.am-picker-trigger').exists()).toBe(false)
  })

  it('follows locale and notifies the form item', async () => {
    const onFieldChange = vi.fn()
    const onFieldBlur = vi.fn()
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(Select, { options, mode: 'multiple', defaultValue: ['apple', 'banana'] }) },
      global: {
        provide: {
          [formItemInputContextKey as symbol]: {
            status: computed(() => 'warning'),
            id: computed(() => 'fruit'),
            onFieldChange,
            onFieldBlur,
            isFormItemInput: true,
          },
        },
      },
    })
    const trigger = wrapper.find('.am-picker-trigger')
    expect(trigger.text()).toBe('苹果, 香蕉')
    expect(trigger.classes()).toContain('am-picker-trigger-status-warning')
    expect(trigger.attributes('id')).toBe('fruit')
    await trigger.trigger('click')
    await clickOption('葡萄')
    await clickButton('confirm')
    await nextTick()
    expect(onFieldChange).toHaveBeenCalledTimes(1)
    expect(onFieldBlur).toHaveBeenCalledTimes(1)
  })
})
