import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import { describe, expect, it, vi } from 'vitest'
import { computed, h, nextTick } from 'vue'
import DatePicker, { DatePickerView } from '..'
import ConfigProvider from '../../config-provider'
import { formItemInputContextKey } from '../../form/context'
import enUS from '../../locale/en_US'
import zhCN from '../../locale/zh_CN'
import { createDateContext, dateToValues, generateColumns, settleDate, toDayjs, valuesToDate } from '../util'

const min = dayjs('2020-01-01')
const max = dayjs('2025-12-31')

const columnsOf = (root: ParentNode = document) => [...root.querySelectorAll('.am-picker-view-column')]
const labelsOf = (column: Element) => [...column.querySelectorAll('.am-picker-view-item')].map(el => el.textContent!.trim())
const selectedOf = (root: ParentNode = document) => [...root.querySelectorAll('.am-picker-view-item-selected')].map(el => el.textContent!.trim())
function clickOption(column: number, text: string, root: ParentNode = document) {
  const el = [...columnsOf(root)[column].querySelectorAll<HTMLElement>('.am-picker-view-item')].find(item => item.textContent!.trim() === text)!
  el.click()
  return nextTick()
}
function clickButton(type: 'confirm' | 'cancel') {
  document.querySelector<HTMLElement>(`.am-picker-popup-${type}`)!.click()
  return nextTick()
}

describe('DatePickerView', () => {
  it('renders year / month / day wheels with locale units', () => {
    const wrapper = mount(DatePickerView, { props: { virtual: false, value: dayjs('2024-02-15'), minDate: min, maxDate: max } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-picker-view', 'am-date-picker-view']))
    const columns = columnsOf(wrapper.element)
    expect(columns).toHaveLength(3)
    expect(labelsOf(columns[0])).toEqual(['2020年', '2021年', '2022年', '2023年', '2024年', '2025年'])
    expect(labelsOf(columns[1])).toHaveLength(12)
    // leap year
    expect(labelsOf(columns[2])).toHaveLength(29)
    expect(selectedOf(wrapper.element)).toEqual(['2024年', '2月', '15日'])
  })

  it('keeps the day valid when the month changes and emits dayjs + string', async () => {
    const wrapper = mount(DatePickerView, { props: { virtual: false, defaultValue: dayjs('2023-01-31'), minDate: min, maxDate: max } })
    await clickOption(1, '2月', wrapper.element)
    const [value, text] = wrapper.emitted('change')![0] as [dayjs.Dayjs, string]
    expect(dayjs.isDayjs(value)).toBe(true)
    expect(text).toBe('2023-02-28')
    expect(labelsOf(columnsOf(wrapper.element)[2])).toHaveLength(28)
    expect(selectedOf(wrapper.element)).toEqual(['2023年', '2月', '28日'])
  })

  it('clamps the columns to minDate / maxDate', async () => {
    const wrapper = mount(DatePickerView, {
      props: { virtual: false, defaultValue: dayjs('2024-06-20'), minDate: dayjs('2024-03-10'), maxDate: dayjs('2025-08-05') },
    })
    let columns = columnsOf(wrapper.element)
    expect(labelsOf(columns[0])).toEqual(['2024年', '2025年'])
    expect(labelsOf(columns[1])[0]).toBe('3月')
    await clickOption(1, '3月', wrapper.element)
    columns = columnsOf(wrapper.element)
    expect(labelsOf(columns[2])[0]).toBe('10日')
    // 20 is still valid in March
    expect(selectedOf(wrapper.element)).toEqual(['2024年', '3月', '20日'])
    await clickOption(0, '2025年', wrapper.element)
    await clickOption(1, '8月', wrapper.element)
    // 20 > max day 5 -> clamped
    expect(selectedOf(wrapper.element)).toEqual(['2025年', '8月', '5日'])
    expect((wrapper.emitted('change')!.slice(-1)[0] as any)[1]).toBe('2025-08-05')
  })

  it('clamps an out-of-range value', () => {
    const wrapper = mount(DatePickerView, { props: { value: dayjs('2030-01-01'), minDate: min, maxDate: max } })
    expect(selectedOf(wrapper.element)).toEqual(['2025年', '12月', '31日'])
  })

  it('supports valueFormat for value and emits', async () => {
    const wrapper = mount(DatePickerView, { props: { value: '2024/05/06', valueFormat: 'YYYY/MM/DD', minDate: '2020/01/01', maxDate: '2025/12/31' } })
    expect(selectedOf(wrapper.element)).toEqual(['2024年', '5月', '6日'])
    await clickOption(2, '7日', wrapper.element)
    expect(wrapper.emitted('update:value')![0]).toEqual(['2024/05/07'])
    expect(wrapper.emitted('change')![0]).toEqual(['2024/05/07', '2024-05-07'])
  })

  it('supports month / year / quarter / week pickers', () => {
    const month = mount(DatePickerView, { props: { virtual: false, picker: 'month', value: dayjs('2024-05-06'), minDate: min, maxDate: max } })
    expect(selectedOf(month.element)).toEqual(['2024年', '5月'])
    const year = mount(DatePickerView, { props: { virtual: false, picker: 'year', value: dayjs('2024-05-06'), minDate: min, maxDate: max } })
    expect(selectedOf(year.element)).toEqual(['2024年'])
    const quarter = mount(DatePickerView, { props: { virtual: false, picker: 'quarter', value: dayjs('2024-05-06'), minDate: min, maxDate: max } })
    expect(selectedOf(quarter.element)).toEqual(['2024年', '2季度'])
    const week = mount(DatePickerView, { props: { virtual: false, picker: 'week', value: dayjs('2024-01-01'), minDate: min, maxDate: max } })
    expect(selectedOf(week.element)).toEqual(['2024年', '1周'])
    // 2020 has 53 ISO weeks
    const long = mount(DatePickerView, { props: { virtual: false, picker: 'week', value: dayjs('2020-06-01'), minDate: min, maxDate: max } })
    expect(labelsOf(columnsOf(long.element)[1])).toHaveLength(53)
  })

  it('quarter picker emits the first day of the quarter', async () => {
    const wrapper = mount(DatePickerView, { props: { picker: 'quarter', defaultValue: dayjs('2024-05-06'), minDate: min, maxDate: max } })
    await clickOption(1, '4季度', wrapper.element)
    const [value, text] = wrapper.emitted('change')![0] as [dayjs.Dayjs, string]
    expect(value.format('YYYY-MM-DD')).toBe('2024-10-01')
    expect(text).toBe('2024-Q4')
  })

  it('adds time wheels with showTime and honours steps', async () => {
    const wrapper = mount(DatePickerView, {
      props: { defaultValue: dayjs('2024-05-06 10:07:00'), showTime: { format: 'HH:mm' }, minuteStep: 15, minDate: min, maxDate: max },
    })
    const columns = columnsOf(wrapper.element)
    expect(columns).toHaveLength(5)
    expect(labelsOf(columns[4])).toEqual(['00分', '15分', '30分', '45分'])
    // 07 is not on a step -> nearest
    expect(selectedOf(wrapper.element).slice(3)).toEqual(['10时', '00分'])
    await clickOption(4, '45分', wrapper.element)
    expect((wrapper.emitted('change')![0] as any)[1]).toBe('2024-05-06 10:45')
  })

  it('bounds the time wheels on the min day', () => {
    const wrapper = mount(DatePickerView, {
      props: { virtual: false, value: dayjs('2024-05-06 09:30:00'), showTime: true, minDate: dayjs('2024-05-06 08:20:10'), maxDate: max },
    })
    const columns = columnsOf(wrapper.element)
    expect(columns).toHaveLength(6)
    expect(labelsOf(columns[3])[0]).toBe('08时')
    expect(labelsOf(columns[4])[0]).toBe('00分')
  })

  it('greys out and skips disabledDate', () => {
    const wrapper = mount(DatePickerView, {
      props: {
        virtual: false,
        value: dayjs('2024-05-06'),
        minDate: min,
        maxDate: max,
        disabledDate: (date: dayjs.Dayjs) => date.date() < 10,
      },
    })
    expect(columnsOf(wrapper.element)[2].querySelectorAll('.am-picker-view-item-disabled')).toHaveLength(9)
    expect(selectedOf(wrapper.element)).toEqual(['2024年', '5月', '10日'])
  })

  it('supports filter and renderLabel', () => {
    const wrapper = mount(DatePickerView, {
      props: {
        value: dayjs('2024-05-06'),
        minDate: min,
        maxDate: max,
        filter: (type: string, options: any[]) => (type === 'month' ? options.filter(option => option.value % 2 === 0) : options),
        renderLabel: (type: string, value: number) => (type === 'year' ? `Y${value}` : value),
      },
    })
    const columns = columnsOf(wrapper.element)
    expect(labelsOf(columns[0])[0]).toBe('Y2020')
    expect(labelsOf(columns[1])).toEqual(['2', '4', '6', '8', '10', '12'])
    // May was filtered out -> nearest remaining month
    expect(['4', '6']).toContain(selectedOf(wrapper.element)[1])
  })

  it('uses the units of the ConfigProvider locale', () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(DatePickerView, { picker: 'quarter', value: dayjs('2024-05-06'), minDate: min, maxDate: max }) },
    })
    expect(selectedOf(wrapper.element)).toEqual(['2024', 'Q2'])
  })

  it('util: 12-hour columns and round trips', () => {
    const ctx = createDateContext({ picker: 'time', format: 'h:mm a' }, zhCN.DatePicker)
    expect(ctx.types).toEqual(['hour', 'minute', 'meridiem'])
    const date = dayjs('2024-05-06 15:20:00')
    const columns = generateColumns(ctx, date)
    expect(columns[0].map(option => option.value)).toEqual([12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    expect(columns[2].map(option => option.label)).toEqual(['上午', '下午'])
    expect(dateToValues(ctx, date)).toEqual([3, 20, 1])
    expect(valuesToDate(ctx, [12, 5, 0], date).format('HH:mm:ss')).toBe('00:05:00')
    expect(valuesToDate(ctx, [12, 5, 1], date).format('HH:mm:ss')).toBe('12:05:00')
  })

  it('util: parsing and disabledTime', () => {
    expect(toDayjs('12:30', 'HH:mm')!.format('HH:mm')).toBe('12:30')
    expect(toDayjs('')).toBeUndefined()
    expect(toDayjs('nope', 'YYYY-MM-DD')).toBeUndefined()
    const ctx = createDateContext({
      picker: 'time',
      disabledTime: () => ({ disabledHours: () => [0, 1, 2], disabledMinutes: hour => (hour === 3 ? [0] : []) }),
    }, zhCN.DatePicker)
    const settled = settleDate(ctx, dayjs('2024-05-06 01:00:00'))
    expect(settled.format('HH:mm')).toBe('03:01')
  })
})

describe('DatePicker', () => {
  it('renders the trigger and commits on confirm', async () => {
    const wrapper = mount(DatePicker, { props: { minDate: min, maxDate: max, defaultPickerValue: dayjs('2024-05-06'), title: '选择日期' } })
    const trigger = wrapper.find('.am-picker-trigger')
    expect(trigger.classes()).toContain('am-date-picker')
    expect(trigger.text()).toBe('请选择日期')
    await trigger.trigger('click')
    expect(document.querySelector('.am-picker-popup-title')!.textContent).toBe('选择日期')
    expect(selectedOf()).toEqual(['2024年', '5月', '6日'])
    await clickOption(2, '9日')
    expect((wrapper.emitted('select')![0] as any)[1]).toBe('2024-05-09')
    expect(wrapper.emitted('change')).toBeUndefined()
    await clickButton('confirm')
    const [value, text] = wrapper.emitted('change')![0] as [dayjs.Dayjs, string]
    expect(dayjs.isDayjs(value)).toBe(true)
    expect(text).toBe('2024-05-09')
    expect((wrapper.emitted('update:value')![0][0] as dayjs.Dayjs).format('YYYY-MM-DD')).toBe('2024-05-09')
    expect((wrapper.emitted('confirm')![0] as any)[1]).toBe('2024-05-09')
    expect(wrapper.emitted('update:open')!.slice(-1)[0]).toEqual([false])
    expect(wrapper.find('.am-picker-trigger').text()).toBe('2024-05-09')
  })

  it('discards on cancel', async () => {
    const wrapper = mount(DatePicker, { props: { defaultValue: dayjs('2024-05-06'), minDate: min, maxDate: max } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    await clickOption(2, '9日')
    await clickButton('cancel')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.find('.am-picker-trigger').text()).toBe('2024-05-06')
    await wrapper.find('.am-picker-trigger').trigger('click')
    expect(selectedOf()).toEqual(['2024年', '5月', '6日'])
  })

  it('works controlled with valueFormat strings', async () => {
    const wrapper = mount(DatePicker, {
      props: { value: '2024-05-06', valueFormat: 'YYYY-MM-DD', format: 'YYYY年M月D日', minDate: '2020-01-01', maxDate: '2025-12-31' },
    })
    expect(wrapper.find('.am-picker-trigger').text()).toBe('2024年5月6日')
    await wrapper.find('.am-picker-trigger').trigger('click')
    await clickOption(0, '2025年')
    await clickButton('confirm')
    expect(wrapper.emitted('update:value')![0]).toEqual(['2025-05-06'])
    expect(wrapper.emitted('change')![0]).toEqual(['2025-05-06', '2025年5月6日'])
    // controlled: unchanged until the prop is updated
    expect(wrapper.find('.am-picker-trigger').text()).toBe('2024年5月6日')
    await wrapper.setProps({ value: '2025-05-06' })
    expect(wrapper.find('.am-picker-trigger').text()).toBe('2025年5月6日')
  })

  it('clamps the initial wheel date into the range', async () => {
    const wrapper = mount(DatePicker, { props: { minDate: dayjs('2031-02-03'), maxDate: dayjs('2032-01-01') } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    expect(selectedOf()).toEqual(['2031年', '2月', '3日'])
    await clickButton('confirm')
    expect((wrapper.emitted('change')![0] as any)[1]).toBe('2031-02-03')
  })

  it('clears to null', async () => {
    const wrapper = mount(DatePicker, { props: { defaultValue: dayjs('2024-05-06'), allowClear: true } })
    await wrapper.find('.am-picker-trigger-clear').trigger('click')
    expect(wrapper.emitted('update:value')![0]).toEqual([null])
    expect(wrapper.emitted('change')![0]).toEqual([null, ''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(wrapper.find('.am-picker-trigger-placeholder').exists()).toBe(true)
  })

  it('formats datetime, month and quarter values', () => {
    const datetime = mount(DatePicker, { props: { value: dayjs('2024-05-06 07:08:09'), showTime: true } })
    expect(datetime.find('.am-picker-trigger').text()).toBe('2024-05-06 07:08:09')
    const month = mount(DatePicker, { props: { value: dayjs('2024-05-06'), picker: 'month' } })
    expect(month.find('.am-picker-trigger').text()).toBe('2024-05')
    const quarter = mount(DatePicker, { props: { value: dayjs('2024-05-06'), picker: 'quarter' } })
    expect(quarter.find('.am-picker-trigger').text()).toBe('2024-Q2')
    const fn = mount(DatePicker, { props: { value: dayjs('2024-05-06'), format: (date: dayjs.Dayjs) => `D${date.date()}` } })
    expect(fn.find('.am-picker-trigger').text()).toBe('D6')
  })

  it('default slot replaces the trigger, trigger=false renders none', async () => {
    const wrapper = mount(DatePicker, {
      props: { defaultValue: dayjs('2024-05-06') },
      slots: { default: ({ label, toggle }: any) => h('button', { class: 'custom', onClick: () => toggle() }, label) },
    })
    expect(wrapper.find('.am-picker-trigger').exists()).toBe(false)
    expect(wrapper.find('.custom').text()).toBe('2024-05-06')
    await wrapper.find('.custom').trigger('click')
    expect(document.querySelector('.am-picker-popup')).not.toBeNull()

    const hidden = mount(DatePicker, { props: { trigger: false } })
    expect(hidden.find('.am-picker-trigger').exists()).toBe(false)
  })

  it('exposes DatePicker.View and notifies the form item', async () => {
    expect(DatePicker.View).toBe(DatePickerView)
    const onFieldChange = vi.fn()
    const onFieldBlur = vi.fn()
    const wrapper = mount(DatePicker, {
      props: { disabled: false },
      global: {
        provide: {
          [formItemInputContextKey as symbol]: {
            status: computed(() => 'error'),
            id: computed(() => 'date'),
            onFieldChange,
            onFieldBlur,
            isFormItemInput: true,
          },
        },
      },
    })
    const trigger = wrapper.find('.am-picker-trigger')
    expect(trigger.classes()).toContain('am-picker-trigger-status-error')
    expect(trigger.attributes('id')).toBe('date')
    await trigger.trigger('click')
    await clickButton('confirm')
    await nextTick()
    expect(onFieldChange).toHaveBeenCalledTimes(1)
    expect(onFieldBlur).toHaveBeenCalledTimes(1)
  })
})
