import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { computed, h, nextTick } from 'vue'
import Picker from '..'
import ConfigProvider from '../../config-provider'
import { formItemInputContextKey, variantContextKey } from '../../form/context'
import enUS from '../../locale/en_US'

const columns = [
  [
    { label: '周一', value: 'mon' },
    { label: '周二', value: 'tue' },
    { label: '周三', value: 'wed' },
  ],
  [
    { label: '上午', value: 'am' },
    { label: '下午', value: 'pm' },
  ],
]

const popup = () => document.querySelector<HTMLElement>('.am-picker-popup')
const visible = () => !!popup() && popup()!.style.display !== 'none'
function clickOption(column: number, index: number) {
  const el = document.querySelectorAll('.am-picker-view-column')[column].querySelectorAll<HTMLElement>('.am-picker-view-item')[index]
  el.click()
  return nextTick()
}
function clickButton(type: 'confirm' | 'cancel') {
  document.querySelector<HTMLElement>(`.am-picker-popup-${type}`)!.click()
  return nextTick()
}

describe('Picker', () => {
  it('renders an input-like trigger with placeholder and opens a teleported popup', async () => {
    const wrapper = mount(Picker, { props: { columns, title: '标题' } })
    expect(wrapper.find('.am-picker-trigger').classes()).toEqual(expect.arrayContaining(['am-picker', 'am-picker-trigger', 'am-picker-trigger-outlined']))
    expect(wrapper.find('.am-picker-trigger-placeholder').text()).toBe('请选择')
    expect(popup()).toBeNull()
    await wrapper.find('.am-picker-trigger').trigger('click')
    expect(wrapper.emitted('update:open')![0]).toEqual([true])
    expect(wrapper.emitted('openChange')![0]).toEqual([true])
    expect(visible()).toBe(true)
    expect(popup()!.parentElement!.parentElement).toBe(document.body)
    expect(document.querySelector('.am-picker-popup-title')!.textContent).toBe('标题')
    expect(document.querySelector('.am-picker-popup-cancel')!.textContent!.trim()).toBe('取消')
    expect(document.querySelector('.am-picker-popup-confirm')!.textContent!.trim()).toBe('确定')
    expect(wrapper.find('.am-picker-trigger').classes()).toContain('am-picker-trigger-open')
  })

  it('commits the value on confirm (uncontrolled)', async () => {
    const wrapper = mount(Picker, { props: { columns } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    await clickOption(0, 1)
    expect(wrapper.emitted('select')![0][0]).toEqual(['tue', 'am'])
    expect(wrapper.emitted('change')).toBeUndefined()
    await clickButton('confirm')
    expect(wrapper.emitted('update:value')![0]).toEqual([['tue', 'am']])
    const [value, info] = wrapper.emitted('change')![0] as any
    expect(value).toEqual(['tue', 'am'])
    expect(info.items.map((item: any) => item.label)).toEqual(['周二', '上午'])
    expect(wrapper.emitted('confirm')![0][0]).toEqual(['tue', 'am'])
    expect(wrapper.emitted('update:open')!.slice(-1)[0]).toEqual([false])
    expect(wrapper.find('.am-picker-trigger-content').text()).toBe('周二 / 上午')
  })

  it('confirming without moving commits the first options', async () => {
    const wrapper = mount(Picker, { props: { columns } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    await clickButton('confirm')
    expect(wrapper.emitted('change')![0][0]).toEqual(['mon', 'am'])
  })

  it('discards the pending value on cancel and on mask click', async () => {
    const wrapper = mount(Picker, { props: { columns, defaultValue: ['mon', 'am'] } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    await clickOption(0, 2)
    await clickButton('cancel')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.find('.am-picker-trigger-content').text()).toBe('周一 / 上午')

    // reopening starts from the committed value again
    await wrapper.find('.am-picker-trigger').trigger('click')
    expect([...document.querySelectorAll('.am-picker-view-item-selected')].map(el => el.textContent!.trim())).toEqual(['周一', '上午'])
    document.querySelector<HTMLElement>('.am-popup-mask')!.click()
    await nextTick()
    expect(wrapper.emitted('cancel')).toHaveLength(2)
    expect(wrapper.emitted('update:open')!.slice(-1)[0]).toEqual([false])
  })

  it('works controlled: value and open follow the props', async () => {
    const wrapper = mount(Picker, { props: { columns, value: ['wed', 'pm'], open: false } })
    expect(wrapper.find('.am-picker-trigger-content').text()).toBe('周三 / 下午')
    await wrapper.find('.am-picker-trigger').trigger('click')
    expect(wrapper.emitted('update:open')![0]).toEqual([true])
    expect(popup()).toBeNull()
    await wrapper.setProps({ open: true })
    expect(visible()).toBe(true)
    await clickOption(0, 0)
    await clickButton('confirm')
    expect(wrapper.emitted('update:value')![0]).toEqual([['mon', 'pm']])
    // controlled: still the old label until the prop changes
    expect(wrapper.find('.am-picker-trigger-content').text()).toBe('周三 / 下午')
    await wrapper.setProps({ value: ['mon', 'pm'], open: false })
    expect(wrapper.find('.am-picker-trigger-content').text()).toBe('周一 / 下午')
    expect(wrapper.find('.am-picker-trigger').classes()).not.toContain('am-picker-trigger-open')
  })

  it('supports defaultOpen and trigger=false', async () => {
    const wrapper = mount(Picker, { props: { columns, defaultOpen: true, trigger: false } })
    await nextTick()
    expect(wrapper.find('.am-picker-trigger').exists()).toBe(false)
    expect(visible()).toBe(true)
  })

  it('formats the label and clears', async () => {
    const wrapper = mount(Picker, {
      props: { columns, defaultValue: ['tue', 'pm'], allowClear: true, format: (items: any[]) => items.map(item => item.label).join('') },
    })
    expect(wrapper.find('.am-picker-trigger-content').text()).toBe('周二下午')
    await wrapper.find('.am-picker-trigger-clear').trigger('click')
    expect(wrapper.emitted('update:value')![0]).toEqual([[]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
    // clearing does not open the popup
    expect(wrapper.emitted('update:open')).toBeUndefined()
    expect(wrapper.find('.am-picker-trigger-placeholder').exists()).toBe(true)
    expect(wrapper.find('.am-picker-trigger-clear').exists()).toBe(false)
  })

  it('does not open when disabled', async () => {
    const wrapper = mount(Picker, { props: { columns, disabled: true } })
    expect(wrapper.find('.am-picker-trigger').classes()).toContain('am-picker-trigger-disabled')
    await wrapper.find('.am-picker-trigger').trigger('click')
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('default slot replaces the trigger', async () => {
    const wrapper = mount(Picker, {
      props: { columns, defaultValue: ['mon', 'pm'] },
      slots: {
        default: ({ label, open, toggle }: any) => h('button', { class: 'custom', onClick: () => toggle() }, `${label}-${open}`),
      },
    })
    expect(wrapper.find('.am-picker-trigger').exists()).toBe(false)
    expect(wrapper.find('.custom').text()).toBe('周一 / 下午-false')
    await wrapper.find('.custom').trigger('click')
    expect(wrapper.find('.custom').text()).toBe('周一 / 下午-true')
    expect(visible()).toBe(true)
  })

  it('supports variant / size / status, attrs and semantic classes', () => {
    const wrapper = mount(Picker, {
      props: { columns, variant: 'filled', size: 'large', status: 'error', rootClass: 'root-cls', classes: { content: 'content-cls' }, id: 'field' },
      attrs: { class: 'custom', 'data-id': 'x' },
    })
    expect(wrapper.find('.am-picker-trigger').classes()).toEqual(expect.arrayContaining([
      'am-picker-trigger-filled',
      'am-picker-trigger-lg',
      'am-picker-trigger-status-error',
      'root-cls',
      'custom',
    ]))
    expect(wrapper.find('.am-picker-trigger').attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-picker-trigger').attributes('id')).toBe('field')
    expect(wrapper.find('.am-picker-trigger-content').classes()).toContain('content-cls')
  })

  it('follows ConfigProvider locale / size / disabled', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS, componentSize: 'small', componentDisabled: true },
      slots: { default: () => h(Picker, { columns }) },
    })
    const trigger = wrapper.find('.am-picker-trigger')
    expect(trigger.classes()).toEqual(expect.arrayContaining(['am-picker-trigger-sm', 'am-picker-trigger-disabled']))
    expect(trigger.text()).toBe('Please select')
  })

  it('talks to the form item: borderless variant, id, status, change and blur', async () => {
    const onFieldChange = vi.fn()
    const onFieldBlur = vi.fn()
    const wrapper = mount(Picker, {
      props: { columns },
      global: {
        provide: {
          [formItemInputContextKey as symbol]: {
            status: computed(() => 'warning'),
            id: computed(() => 'form_field'),
            onFieldChange,
            onFieldBlur,
            isFormItemInput: true,
          },
          [variantContextKey as symbol]: computed(() => 'borderless'),
        },
      },
    })
    expect(wrapper.find('.am-picker-trigger').classes()).toEqual(expect.arrayContaining(['am-picker-trigger-borderless', 'am-picker-trigger-status-warning']))
    expect(wrapper.find('.am-picker-trigger').attributes('id')).toBe('form_field')
    await wrapper.find('.am-picker-trigger').trigger('click')
    await clickButton('confirm')
    expect(onFieldChange).toHaveBeenCalledTimes(1)
    await nextTick()
    expect(onFieldBlur).toHaveBeenCalledTimes(1)
  })
})
