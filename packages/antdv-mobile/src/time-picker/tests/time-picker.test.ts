import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import TimePicker from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'

const columnsOf = () => [...document.querySelectorAll('.am-picker-view-column')]
const labelsOf = (column: Element) => [...column.querySelectorAll('.am-picker-view-item')].map(el => el.textContent!.trim())
const selectedOf = () => [...document.querySelectorAll('.am-picker-view-item-selected')].map(el => el.textContent!.trim())
function clickOption(column: number, text: string) {
  const el = [...columnsOf()[column].querySelectorAll<HTMLElement>('.am-picker-view-item')].find(item => item.textContent!.trim() === text)!
  el.click()
  return nextTick()
}
function clickButton(type: 'confirm' | 'cancel') {
  document.querySelector<HTMLElement>(`.am-picker-popup-${type}`)!.click()
  return nextTick()
}

describe('TimePicker', () => {
  it('renders the trigger with the TimePicker placeholder and three wheels', async () => {
    const wrapper = mount(TimePicker, { props: { defaultOpenValue: dayjs('2024-05-06 08:09:10'), virtual: false } })
    const trigger = wrapper.find('.am-picker-trigger')
    expect(trigger.classes()).toEqual(expect.arrayContaining(['am-time-picker', 'am-date-picker']))
    expect(trigger.text()).toBe('请选择时间')
    await trigger.trigger('click')
    expect(document.querySelector('.am-time-picker-root')).not.toBeNull()
    expect(columnsOf()).toHaveLength(3)
    expect(labelsOf(columnsOf()[0])).toHaveLength(24)
    expect(selectedOf()).toEqual(['08时', '09分', '10秒'])
  })

  it('commits a dayjs value on confirm (uncontrolled)', async () => {
    const wrapper = mount(TimePicker, { props: { defaultValue: dayjs('2024-05-06 08:09:10') } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    await clickOption(0, '12时')
    expect((wrapper.emitted('select')![0] as any)[1]).toBe('12:09:10')
    await clickButton('confirm')
    const [time, text] = wrapper.emitted('change')![0] as [dayjs.Dayjs, string]
    expect(dayjs.isDayjs(time)).toBe(true)
    expect(text).toBe('12:09:10')
    expect((wrapper.emitted('confirm')![0] as any)[1]).toBe('12:09:10')
    expect(wrapper.emitted('update:open')!.slice(-1)[0]).toEqual([false])
    expect(wrapper.find('.am-picker-trigger').text()).toBe('12:09:10')
  })

  it('format decides the columns; valueFormat binds strings (controlled)', async () => {
    const wrapper = mount(TimePicker, { props: { value: '08:30', format: 'HH:mm', valueFormat: 'HH:mm', minuteStep: 10 } })
    expect(wrapper.find('.am-picker-trigger').text()).toBe('08:30')
    await wrapper.find('.am-picker-trigger').trigger('click')
    expect(columnsOf()).toHaveLength(2)
    expect(labelsOf(columnsOf()[1])).toEqual(['00分', '10分', '20分', '30分', '40分', '50分'])
    await clickOption(1, '50分')
    await clickButton('confirm')
    expect(wrapper.emitted('update:value')![0]).toEqual(['08:50'])
    expect(wrapper.emitted('change')![0]).toEqual(['08:50', '08:50'])
    expect(wrapper.find('.am-picker-trigger').text()).toBe('08:30')
    await wrapper.setProps({ value: '08:50' })
    expect(wrapper.find('.am-picker-trigger').text()).toBe('08:50')
  })

  it('cancel keeps the value', async () => {
    const wrapper = mount(TimePicker, { props: { defaultValue: dayjs('2024-05-06 08:09:10') } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    await clickOption(0, '12时')
    await clickButton('cancel')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.find('.am-picker-trigger').text()).toBe('08:09:10')
  })

  it('supports use12Hours', async () => {
    const wrapper = mount(TimePicker, { props: { defaultValue: dayjs('2024-05-06 15:09:10'), use12Hours: true } })
    expect(wrapper.find('.am-picker-trigger').text()).toBe('3:09:10 pm')
    await wrapper.find('.am-picker-trigger').trigger('click')
    expect(columnsOf()).toHaveLength(4)
    expect(labelsOf(columnsOf()[0])[0]).toBe('12时')
    expect(selectedOf()).toEqual(['03时', '09分', '10秒', '下午'])
    await clickOption(3, '上午')
    await clickButton('confirm')
    expect((wrapper.emitted('change')![0] as any)[1]).toBe('3:09:10 am')
  })

  it('supports showSecond=false and disabledTime', async () => {
    const wrapper = mount(TimePicker, {
      props: {
        defaultValue: dayjs('2024-05-06 01:30:00'),
        showSecond: false,
        disabledTime: () => ({ disabledHours: () => [0, 1, 2, 3] }),
      },
    })
    expect(wrapper.find('.am-picker-trigger').text()).toBe('01:30')
    await wrapper.find('.am-picker-trigger').trigger('click')
    expect(columnsOf()).toHaveLength(2)
    expect(columnsOf()[0].querySelectorAll('.am-picker-view-item-disabled')).toHaveLength(4)
    // the disabled hour is skipped
    expect(selectedOf()).toEqual(['04时', '30分'])
    await clickButton('confirm')
    expect((wrapper.emitted('change')![0] as any)[1]).toBe('04:30')
  })

  it('clears, respects disabled and passes attrs', async () => {
    const wrapper = mount(TimePicker, {
      props: { defaultValue: dayjs('2024-05-06 08:09:10'), allowClear: true, variant: 'filled' },
      attrs: { 'data-id': 'x' },
    })
    const trigger = wrapper.find('.am-picker-trigger')
    expect(trigger.attributes('data-id')).toBe('x')
    expect(trigger.classes()).toContain('am-picker-trigger-filled')
    await wrapper.find('.am-picker-trigger-clear').trigger('click')
    expect(wrapper.emitted('change')![0]).toEqual([null, ''])
    expect(wrapper.emitted('clear')).toHaveLength(1)

    const disabled = mount(TimePicker, { props: { disabled: true } })
    await disabled.find('.am-picker-trigger').trigger('click')
    expect(disabled.emitted('update:open')).toBeUndefined()
  })

  it('forwards the default slot and follows the locale', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: {
        default: () => [
          h(TimePicker, { class: 'plain' }),
          h(TimePicker, { defaultValue: dayjs('2024-05-06 08:09:10'), defaultOpen: true }, {
            default: ({ label, open }: any) => h('span', { class: 'custom' }, `${label}|${open}`),
          }),
        ],
      },
    })
    expect(wrapper.find('.plain').text()).toBe('Select time')
    expect(wrapper.find('.custom').text()).toBe('08:09:10|true')
    await nextTick()
    expect(selectedOf()).toEqual(['08', '09', '10'])
    expect(document.querySelector('.am-picker-popup-confirm')!.textContent!.trim()).toBe('OK')
  })
})
