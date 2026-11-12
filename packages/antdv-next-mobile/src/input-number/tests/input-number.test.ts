import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { computed, h, nextTick } from 'vue'
import InputNumber from '..'
import ConfigProvider from '../../config-provider'
import { formItemInputContextKey, variantContextKey } from '../../form/context'

const up = (wrapper: ReturnType<typeof mount>) => wrapper.find('.am-input-number-action-up')
const down = (wrapper: ReturnType<typeof mount>) => wrapper.find('.am-input-number-action-down')
const text = (wrapper: ReturnType<typeof mount>) => (wrapper.find('input').element as HTMLInputElement).value

async function press(target: ReturnType<ReturnType<typeof mount>['find']>) {
  await target.trigger('mousedown', { button: 0 })
  await target.trigger('mouseup')
}

describe('InputNumber', () => {
  it('renders a stepper with − / + buttons by default', () => {
    const wrapper = mount(InputNumber, { props: { defaultValue: 1 } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-input-number', 'am-input-number-mode-spinner', 'am-input-number-outlined']))
    expect(wrapper.findAll('.am-input-number-action')).toHaveLength(2)
    const input = wrapper.find('input')
    expect(input.attributes('inputmode')).toBe('decimal')
    expect(input.attributes('role')).toBe('spinbutton')
    expect(input.attributes('aria-valuenow')).toBe('1')
    expect(text(wrapper)).toBe('1')
    expect(InputNumber.name).toBe('AmInputNumber')
  })

  it('steps up / down (uncontrolled) and emits change / update:value / step', async () => {
    const wrapper = mount(InputNumber, { props: { defaultValue: 1, step: 2 } })
    await press(up(wrapper))
    expect(text(wrapper)).toBe('3')
    expect(wrapper.emitted('update:value')![0]).toEqual([3])
    expect(wrapper.emitted('change')![0]).toEqual([3])
    expect(wrapper.emitted('step')![0]).toEqual([3, { offset: 2, type: 'up', emitter: 'handler' }])
    await press(down(wrapper))
    await press(down(wrapper))
    expect(text(wrapper)).toBe('-1')
    expect(wrapper.emitted('step')!.slice(-1)[0]).toEqual([-1, { offset: 2, type: 'down', emitter: 'handler' }])
  })

  it('is controlled by value', async () => {
    const wrapper = mount(InputNumber, { props: { value: 5 } })
    await press(up(wrapper))
    expect(wrapper.emitted('update:value')![0]).toEqual([6])
    expect(text(wrapper)).toBe('5')
    await wrapper.setProps({ value: 6 })
    expect(text(wrapper)).toBe('6')
    await wrapper.setProps({ value: null })
    expect(text(wrapper)).toBe('')
  })

  it('clamps to min / max and disables the buttons at the bounds', async () => {
    const wrapper = mount(InputNumber, { props: { defaultValue: 9, min: 0, max: 10, step: 3 } })
    await press(up(wrapper))
    expect(text(wrapper)).toBe('10')
    expect(up(wrapper).attributes('disabled')).toBeDefined()
    expect(up(wrapper).classes()).toContain('am-input-number-action-disabled')
    await press(up(wrapper))
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(down(wrapper).attributes('disabled')).toBeUndefined()
  })

  it('avoids floating point errors and applies precision', async () => {
    const wrapper = mount(InputNumber, { props: { defaultValue: 0.1, step: 0.2 } })
    await press(up(wrapper))
    expect(wrapper.emitted('change')![0]).toEqual([0.3])
    const precise = mount(InputNumber, { props: { defaultValue: 1, step: 0.5, precision: 2 } })
    expect(text(precise)).toBe('1.00')
    await press(up(precise))
    expect(text(precise)).toBe('1.50')
    expect(precise.emitted('change')![0]).toEqual([1.5])
  })

  it('starts from 0 (or the closest bound) when empty', async () => {
    const wrapper = mount(InputNumber)
    await press(up(wrapper))
    expect(wrapper.emitted('change')![0]).toEqual([1])
    const bounded = mount(InputNumber, { props: { min: 5 } })
    await press(up(bounded))
    expect(bounded.emitted('change')![0]).toEqual([5])
  })

  it('typing updates the value when valid and commits (clamps) on blur', async () => {
    const wrapper = mount(InputNumber, { props: { defaultValue: 1, min: 0, max: 10 } })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.setValue('7')
    expect(wrapper.emitted('input')![0]).toEqual(['7'])
    expect(wrapper.emitted('change')![0]).toEqual([7])
    await input.setValue('70')
    // out of range: not committed while typing
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(text(wrapper)).toBe('70')
    await input.trigger('blur')
    expect(wrapper.emitted('change')!.slice(-1)[0]).toEqual([10])
    expect(text(wrapper)).toBe('10')

    await input.trigger('focus')
    await input.setValue('abc')
    await input.trigger('blur')
    expect(text(wrapper)).toBe('10')
    await input.trigger('focus')
    await input.setValue('')
    expect(wrapper.emitted('change')!.slice(-1)[0]).toEqual([null])
  })

  it('changeOnBlur=false reverts uncommitted text on blur', async () => {
    const wrapper = mount(InputNumber, { props: { defaultValue: 1, max: 10, changeOnBlur: false } })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.setValue('70')
    await input.trigger('blur')
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(text(wrapper)).toBe('1')
  })

  it('formatter / parser and stringMode', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        defaultValue: 50,
        formatter: (value: string | number) => `${value}%`,
        parser: (value: string) => value.replace('%', ''),
      },
    })
    expect(text(wrapper)).toBe('50%')
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.setValue('60%')
    expect(wrapper.emitted('change')![0]).toEqual([60])

    const stringMode = mount(InputNumber, { props: { defaultValue: '1.10', stringMode: true, precision: 2, step: '0.01' } })
    expect(text(stringMode)).toBe('1.10')
    await press(up(stringMode))
    expect(stringMode.emitted('change')![0]).toEqual(['1.11'])
  })

  it('keeps stepping while a button is pressed', async () => {
    vi.useFakeTimers()
    const wrapper = mount(InputNumber, { props: { defaultValue: 0, max: 3 } })
    await up(wrapper).trigger('touchstart', { touches: [{ clientX: 0, clientY: 0 }] })
    expect(wrapper.emitted('change')).toHaveLength(1)
    vi.advanceTimersByTime(500)
    expect(wrapper.emitted('change')).toHaveLength(2)
    vi.advanceTimersByTime(120)
    expect(wrapper.emitted('change')).toHaveLength(3)
    // stops at max
    vi.advanceTimersByTime(1000)
    expect(wrapper.emitted('change')).toHaveLength(3)
    await up(wrapper).trigger('touchend')

    const noLongPress = mount(InputNumber, { props: { defaultValue: 0, longPress: false } })
    await up(noLongPress).trigger('mousedown', { button: 0 })
    vi.advanceTimersByTime(2000)
    expect(noLongPress.emitted('change')).toHaveLength(1)
    vi.useRealTimers()
  })

  it('steps with the arrow keys and emits pressEnter', async () => {
    const wrapper = mount(InputNumber, { props: { defaultValue: 1 } })
    const input = wrapper.find('input')
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('step')![0]).toEqual([2, { offset: 1, type: 'up', emitter: 'keyboard' }])
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(text(wrapper)).toBe('1')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('pressEnter')).toHaveLength(1)
    await wrapper.setProps({ keyboard: false })
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('step')).toHaveLength(2)
  })

  it('disabled / readOnly block every interaction', async () => {
    const wrapper = mount(InputNumber, { props: { defaultValue: 1, disabled: true } })
    expect(wrapper.classes()).toContain('am-input-number-disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    await press(up(wrapper))
    expect(wrapper.emitted('change')).toBeUndefined()
    const readOnly = mount(InputNumber, { props: { defaultValue: 1, readOnly: true } })
    expect(readOnly.find('input').attributes('readonly')).toBeDefined()
    await press(up(readOnly))
    expect(readOnly.emitted('change')).toBeUndefined()
  })

  it('mode="input" and controls=false hide the buttons; custom icons by prop and slot', () => {
    const plain = mount(InputNumber, { props: { mode: 'input' } })
    expect(plain.classes()).toContain('am-input-number-mode-input')
    expect(plain.find('.am-input-number-action').exists()).toBe(false)
    expect(mount(InputNumber, { props: { controls: false } }).find('.am-input-number-action').exists()).toBe(false)

    const custom = mount(InputNumber, {
      props: { controls: { upIcon: () => h('i', { class: 'prop-up' }), downIcon: () => h('i', { class: 'prop-down' }) }, prefix: '¥', suffix: 'RMB' },
      slots: { upIcon: () => h('i', { class: 'slot-up' }) },
    })
    expect(custom.find('.slot-up').exists()).toBe(true)
    expect(custom.find('.prop-up').exists()).toBe(false)
    expect(custom.find('.prop-down').exists()).toBe(true)
    expect(custom.find('.am-input-number-prefix').text()).toBe('¥')
    expect(custom.find('.am-input-number-suffix').text()).toBe('RMB')
  })

  it('size / status / attrs / rootClass / classes', () => {
    const wrapper = mount(InputNumber, {
      props: { size: 'large', status: 'warning', variant: 'filled', rootClass: 'root-cls', classes: { input: 'input-cls' }, id: 'num' },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-input-number-lg', 'am-input-number-status-warning', 'am-input-number-filled', 'root-cls', 'custom']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('input').classes()).toContain('input-cls')
    expect(wrapper.find('input').attributes('id')).toBe('num')
  })

  it('follows ConfigProvider, the Form variant and the FormItem contract', async () => {
    const onFieldChange = vi.fn()
    const onFieldBlur = vi.fn()
    const wrapper = mount(ConfigProvider, {
      props: { componentSize: 'small', componentDisabled: false },
      slots: { default: () => h(InputNumber, { defaultValue: 1 }) },
      global: {
        provide: {
          [variantContextKey as symbol]: computed(() => 'borderless'),
          [formItemInputContextKey as symbol]: {
            status: computed(() => 'error'),
            id: computed(() => 'field_id'),
            onFieldChange,
            onFieldBlur,
            isFormItemInput: true,
          },
        },
      },
    })
    const root = wrapper.find('.am-input-number')
    expect(root.classes()).toEqual(expect.arrayContaining(['am-input-number-sm', 'am-input-number-borderless', 'am-input-number-status-error']))
    expect(wrapper.find('input').attributes('id')).toBe('field_id')
    await press(wrapper.find('.am-input-number-action-up'))
    expect(onFieldChange).toHaveBeenCalledTimes(1)
    await wrapper.find('input').trigger('blur')
    await nextTick()
    expect(onFieldBlur).toHaveBeenCalledTimes(1)
  })
})
