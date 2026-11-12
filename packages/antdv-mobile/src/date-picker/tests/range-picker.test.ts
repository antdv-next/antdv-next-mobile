import type { Dayjs } from 'dayjs'
import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import { describe, expect, it, vi } from 'vitest'
import { computed, h, nextTick } from 'vue'
import DatePicker, { DateRangePicker } from '..'
import ConfigProvider from '../../config-provider'
import { formItemInputContextKey } from '../../form/context'
import enUS from '../../locale/en_US'

const minDate = dayjs('2020-01-01')
const maxDate = dayjs('2025-12-31')
const base = { virtual: false, minDate, maxDate }

const columnsOf = () => [...document.querySelectorAll('.am-picker-view-column')]
const labelsOf = (column: Element) => [...column.querySelectorAll('.am-picker-view-item')].map(el => el.textContent!.trim())
const selectedOf = () => [...document.querySelectorAll('.am-picker-view-item-selected')].map(el => el.textContent!.trim())
const tabsOf = () => [...document.querySelectorAll<HTMLElement>('.am-range-picker-tab')]
const tabValues = () => [...document.querySelectorAll('.am-range-picker-tab-value')].map(el => el.textContent!.trim())
const activeTab = () => tabsOf().findIndex(el => el.classList.contains('am-segmented-item-selected'))
function clickOption(column: number, text: string) {
  const el = [...columnsOf()[column].querySelectorAll<HTMLElement>('.am-picker-view-item')].find(item => item.textContent!.trim() === text)!
  el.click()
  return nextTick()
}
function clickTab(index: number) {
  tabsOf()[index].click()
  return nextTick()
}
function clickButton(type: 'confirm' | 'cancel') {
  document.querySelector<HTMLElement>(`.am-picker-popup-${type}`)!.click()
  return nextTick()
}
const range = (start: string, end: string): [Dayjs, Dayjs] => [dayjs(start), dayjs(end)]

describe('DatePicker.RangePicker', () => {
  it('is exposed like antdv-next', () => {
    expect(DatePicker.RangePicker).toBe(DateRangePicker)
    expect(DateRangePicker.name).toBe('AmRangePicker')
  })

  it('renders the trigger with two placeholders and a separator', () => {
    const wrapper = mount(DateRangePicker, { props: base })
    const trigger = wrapper.find('.am-picker-trigger')
    expect(trigger.classes()).toEqual(expect.arrayContaining(['am-range-picker', 'am-picker-trigger-outlined']))
    const inputs = wrapper.findAll('.am-range-picker-input')
    expect(inputs.map(input => input.text())).toEqual(['开始日期', '结束日期'])
    expect(inputs.every(input => input.classes().includes('am-range-picker-input-placeholder'))).toBe(true)
    expect(wrapper.find('.am-range-picker-separator .anticon').exists()).toBe(true)
    expect(document.querySelector('.am-picker-popup')).toBeNull()
  })

  it('renders the value, custom placeholder, separator prop and slot', async () => {
    const wrapper = mount(DateRangePicker, {
      props: { ...base, defaultValue: [dayjs('2024-05-01'), null], placeholder: ['From', 'To'], separator: '~', format: 'YYYY/MM/DD' },
    })
    const inputs = wrapper.findAll('.am-range-picker-input')
    expect(inputs[0].text()).toBe('2024/05/01')
    expect(inputs[0].classes()).not.toContain('am-range-picker-input-placeholder')
    expect(inputs[1].text()).toBe('To')
    expect(wrapper.find('.am-range-picker-separator').text()).toBe('~')

    const slotted = mount(DateRangePicker, { props: { ...base, separator: '~' }, slots: { separator: () => 'to' } })
    expect(slotted.find('.am-range-picker-separator').text()).toBe('to')
  })

  it('opens on the tapped half, commits both sides on confirm (uncontrolled)', async () => {
    const wrapper = mount(DateRangePicker, { props: { ...base, defaultValue: range('2024-05-10', '2024-05-20') } })
    await wrapper.findAll('.am-range-picker-input')[1].trigger('click')
    expect(wrapper.emitted('openChange')![0]).toEqual([true])
    expect(wrapper.emitted('update:open')![0]).toEqual([true])
    expect(activeTab()).toBe(1)
    expect(wrapper.findAll('.am-range-picker-input')[1].classes()).toContain('am-range-picker-input-active')
    expect(tabsOf().map(tab => tab.querySelector('.am-range-picker-tab-title')!.textContent)).toEqual(['开始', '结束'])
    expect(tabValues()).toEqual(['2024-05-10', '2024-05-20'])
    expect(selectedOf()).toEqual(['2024年', '5月', '20日'])

    await clickOption(2, '25日')
    const [dates, strings, info] = wrapper.emitted('calendarChange')![0] as [Dayjs[], string[], { range: string }]
    expect(dates.every(date => dayjs.isDayjs(date))).toBe(true)
    expect(strings).toEqual(['2024-05-10', '2024-05-25'])
    expect(info).toEqual({ range: 'end' })
    expect(wrapper.emitted('change')).toBeUndefined()

    await clickTab(0)
    expect(selectedOf()).toEqual(['2024年', '5月', '10日'])
    await clickOption(2, '12日')
    expect(tabValues()).toEqual(['2024-05-12', '2024-05-25'])

    await clickButton('confirm')
    expect(wrapper.emitted('change')).toHaveLength(1)
    const [value, dateStrings] = wrapper.emitted('change')![0] as [Dayjs[], string[]]
    expect(value.map(date => date.format('YYYY-MM-DD'))).toEqual(['2024-05-12', '2024-05-25'])
    expect(dateStrings).toEqual(['2024-05-12', '2024-05-25'])
    expect(wrapper.emitted('update:value')).toHaveLength(1)
    expect((wrapper.emitted('confirm')![0] as any)[1]).toEqual(['2024-05-12', '2024-05-25'])
    expect(wrapper.emitted('openChange')!.slice(-1)[0]).toEqual([false])
    expect(wrapper.findAll('.am-range-picker-input').map(input => input.text())).toEqual(['2024-05-12', '2024-05-25'])
  })

  it('opens on the start tab from the start half and does not emit change when nothing changed', async () => {
    const wrapper = mount(DateRangePicker, { props: { ...base, defaultValue: range('2024-05-10', '2024-05-20') } })
    await wrapper.findAll('.am-range-picker-input')[0].trigger('click')
    expect(activeTab()).toBe(0)
    await clickButton('confirm')
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
  })

  it('keeps the end >= start: the end wheel min follows the start', async () => {
    const wrapper = mount(DateRangePicker, { props: { ...base, defaultValue: range('2024-05-10', '2024-05-20') } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    await clickOption(2, '28日')
    // the end is pushed to the start
    expect(tabValues()).toEqual(['2024-05-28', '2024-05-28'])
    await clickTab(1)
    const columns = columnsOf()
    expect(labelsOf(columns[0])).toEqual(['2024年', '2025年'])
    expect(labelsOf(columns[1])[0]).toBe('5月')
    expect(labelsOf(columns[2])[0]).toBe('28日')
    await clickOption(2, '30日')
    await clickButton('confirm')
    expect((wrapper.emitted('change')![0] as any)[1]).toEqual(['2024-05-28', '2024-05-30'])
  })

  it('fills both sides from an empty value and discards on cancel', async () => {
    const wrapper = mount(DateRangePicker, { props: { ...base, defaultPickerValue: dayjs('2023-03-03') } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    expect(tabValues()).toEqual(['2023-03-03', '2023-03-03'])
    await clickOption(2, '8日')
    // an untouched end follows the start
    expect(tabValues()).toEqual(['2023-03-08', '2023-03-08'])
    await clickButton('cancel')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.findAll('.am-range-picker-input-placeholder')).toHaveLength(2)

    await wrapper.find('.am-picker-trigger').trigger('click')
    expect(tabValues()).toEqual(['2023-03-03', '2023-03-03'])
    await clickButton('confirm')
    expect((wrapper.emitted('change')![0] as any)[1]).toEqual(['2023-03-03', '2023-03-03'])
  })

  it('allowEmpty keeps a side that was never opened empty', async () => {
    const wrapper = mount(DateRangePicker, { props: { ...base, allowEmpty: [false, true], defaultPickerValue: dayjs('2023-03-03') } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    expect(tabValues()).toEqual(['2023-03-03', '结束日期'])
    await clickButton('confirm')
    const [value, strings] = wrapper.emitted('change')![0] as [(Dayjs | null)[], string[]]
    expect(value[1]).toBeNull()
    expect(strings).toEqual(['2023-03-03', ''])

    // opening the end tab picks its date
    await wrapper.find('.am-picker-trigger').trigger('click')
    await clickTab(1)
    expect(tabValues()).toEqual(['2023-03-03', '2023-03-03'])
    await clickButton('confirm')
    expect((wrapper.emitted('change')![1] as any)[1]).toEqual(['2023-03-03', '2023-03-03'])
  })

  it('works controlled with v-model:value and v-model:open', async () => {
    const wrapper = mount(DateRangePicker, { props: { ...base, value: range('2024-01-01', '2024-01-05'), open: false } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    expect(wrapper.emitted('update:open')![0]).toEqual([true])
    expect(document.querySelector('.am-picker-popup')).toBeNull()
    await wrapper.setProps({ open: true })
    await nextTick()
    expect(activeTab()).toBe(0)
    await clickOption(2, '3日')
    await clickButton('confirm')
    expect((wrapper.emitted('change')![0] as any)[1]).toEqual(['2024-01-03', '2024-01-05'])
    // the prop still owns the value
    expect(wrapper.findAll('.am-range-picker-input')[0].text()).toBe('2024-01-01')
    await wrapper.setProps({ value: range('2024-01-03', '2024-01-05') })
    expect(wrapper.findAll('.am-range-picker-input')[0].text()).toBe('2024-01-03')
  })

  it('supports valueFormat', async () => {
    const wrapper = mount(DateRangePicker, {
      props: { virtual: false, valueFormat: 'YYYY/MM/DD', minDate: '2020/01/01', maxDate: '2025/12/31', defaultValue: ['2024/05/10', '2024/05/20'] },
    })
    expect(wrapper.findAll('.am-range-picker-input').map(input => input.text())).toEqual(['2024-05-10', '2024-05-20'])
    await wrapper.find('.am-picker-trigger').trigger('click')
    await clickOption(2, '11日')
    await clickButton('confirm')
    expect(wrapper.emitted('update:value')![0]).toEqual([['2024/05/11', '2024/05/20']])
    expect(wrapper.emitted('change')![0]).toEqual([['2024/05/11', '2024/05/20'], ['2024-05-11', '2024-05-20']])
  })

  it('supports picker modes and showTime', async () => {
    const month = mount(DateRangePicker, { props: { ...base, picker: 'month', defaultValue: range('2024-03-15', '2024-06-15') } })
    expect(month.findAll('.am-range-picker-input').map(input => input.text())).toEqual(['2024-03', '2024-06'])
    await month.find('.am-picker-trigger').trigger('click')
    expect(columnsOf()).toHaveLength(2)
    await clickButton('cancel')
    month.unmount()
    document.body.innerHTML = ''

    const time = mount(DateRangePicker, {
      props: { ...base, showTime: { format: 'HH:mm' }, defaultValue: [dayjs('2024-03-15 08:30'), dayjs('2024-03-15 18:00')] },
    })
    expect(time.findAll('.am-range-picker-input')[1].text()).toBe('2024-03-15 18:00')
    await time.find('.am-picker-trigger').trigger('click')
    expect(columnsOf()).toHaveLength(5)
  })

  it('clears with allowClear', async () => {
    const wrapper = mount(DateRangePicker, { props: { ...base, allowClear: true, defaultValue: range('2024-05-10', '2024-05-20') } })
    await wrapper.find('.am-picker-trigger-clear').trigger('click')
    expect(wrapper.emitted('change')![0]).toEqual([null, ['', '']])
    expect(wrapper.emitted('update:value')![0]).toEqual([null])
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(wrapper.emitted('openChange')).toBeUndefined()
    // nothing to clear any more
    expect(wrapper.find('.am-picker-trigger-clear').exists()).toBe(false)
  })

  it('disabled blocks the popup, a disabled side keeps its value', async () => {
    const wrapper = mount(DateRangePicker, { props: { ...base, disabled: true } })
    expect(wrapper.find('.am-picker-trigger').classes()).toContain('am-picker-trigger-disabled')
    await wrapper.find('.am-picker-trigger').trigger('click')
    expect(wrapper.emitted('openChange')).toBeUndefined()

    const partial = mount(DateRangePicker, { props: { ...base, disabled: [true, false], defaultValue: range('2024-05-10', '2024-05-20') } })
    expect(partial.find('.am-picker-trigger').classes()).not.toContain('am-picker-trigger-disabled')
    expect(partial.findAll('.am-range-picker-input')[0].classes()).toContain('am-range-picker-input-disabled')
    await partial.findAll('.am-range-picker-input')[0].trigger('click')
    // the start is fixed: the popup lands on the end tab, bounded by the start
    expect(activeTab()).toBe(1)
    expect(tabsOf()[0].classList.contains('am-segmented-item-disabled')).toBe(true)
    expect(labelsOf(columnsOf()[2])[0]).toBe('10日')
    await clickOption(2, '15日')
    await clickButton('confirm')
    expect((partial.emitted('change')![0] as any)[1]).toEqual(['2024-05-10', '2024-05-15'])
  })

  it('passes attrs, rootClass, classes, size, status and variant to the trigger', () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        ...base,
        size: 'large',
        status: 'error',
        variant: 'filled',
        rootClass: 'my-root',
        classes: { root: 'my-trigger', content: 'my-content', popup: 'my-popup' },
        defaultOpen: true,
      },
      attrs: { 'class': 'from-attrs', 'data-id': 'range' },
    })
    const trigger = wrapper.find('.am-picker-trigger')
    expect(trigger.classes()).toEqual(expect.arrayContaining([
      'from-attrs',
      'my-root',
      'my-trigger',
      'am-picker-trigger-lg',
      'am-picker-trigger-status-error',
      'am-picker-trigger-filled',
      'am-picker-trigger-open',
    ]))
    expect(trigger.attributes('data-id')).toBe('range')
    expect(wrapper.find('.am-picker-trigger-content').classes()).toEqual(expect.arrayContaining(['am-range-picker-content', 'my-content']))
    expect(document.querySelector('.am-picker-popup')!.classList.contains('my-popup')).toBe(true)
  })

  it('renders slots: custom trigger, title, header, footer, suffixIcon', async () => {
    const wrapper = mount(DateRangePicker, {
      props: { ...base, title: 'prop title', defaultValue: range('2024-05-10', '2024-05-20') },
      slots: {
        default: ({ label, labels, toggle }: any) => h('button', { class: 'custom', onClick: () => toggle(true, 'end') }, `${label}|${labels.length}`),
        title: () => 'slot title',
        header: () => h('div', { class: 'my-header' }),
        footer: () => h('div', { class: 'my-footer' }),
      },
    })
    expect(wrapper.find('.am-picker-trigger').exists()).toBe(false)
    expect(wrapper.find('.custom').text()).toBe('2024-05-10 ~ 2024-05-20|2')
    await wrapper.find('.custom').trigger('click')
    expect(activeTab()).toBe(1)
    expect(document.querySelector('.am-picker-popup-title')!.textContent).toBe('slot title')
    expect(document.querySelector('.my-header')).not.toBeNull()
    expect(document.querySelector('.my-footer')).not.toBeNull()

    const icon = mount(DateRangePicker, { props: { ...base, suffixIcon: 'prop' }, slots: { suffixIcon: () => 'slot' } })
    expect(icon.find('.am-picker-trigger-suffix').text()).toBe('slot')
  })

  it('exposes toggle and supports trigger=false', async () => {
    const wrapper = mount(DateRangePicker, { props: { ...base, trigger: false } })
    expect(wrapper.find('.am-picker-trigger').exists()).toBe(false)
    ;(wrapper.vm as any).toggle(true, 'end')
    await nextTick()
    expect(document.querySelector('.am-picker-popup')).not.toBeNull()
    expect(activeTab()).toBe(1)
    ;(wrapper.vm as any).toggle()
    await nextTick()
    expect(wrapper.emitted('openChange')!.map(args => args[0])).toEqual([true, false])
  })

  it('follows ConfigProvider size, disabled and locale', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { componentSize: 'small', componentDisabled: true, locale: enUS },
      slots: { default: () => h(DateRangePicker, base) },
    })
    const trigger = wrapper.find('.am-picker-trigger')
    expect(trigger.classes()).toEqual(expect.arrayContaining(['am-picker-trigger-sm', 'am-picker-trigger-disabled']))
    expect(wrapper.findAll('.am-range-picker-input').map(input => input.text())).toEqual(['Start date', 'End date'])

    const enabled = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(DateRangePicker, { ...base, picker: 'time', defaultOpen: true }) },
    })
    expect(enabled.findAll('.am-range-picker-input').map(input => input.text())).toEqual(['Start', 'End'])
    expect(tabsOf().map(tab => tab.querySelector('.am-range-picker-tab-title')!.textContent)).toEqual(['Start', 'End'])
  })

  it('reports to the form item', async () => {
    const onFieldChange = vi.fn()
    const onFieldBlur = vi.fn()
    const wrapper = mount(DateRangePicker, {
      props: base,
      global: {
        provide: {
          [formItemInputContextKey as symbol]: {
            status: computed(() => 'error'),
            id: computed(() => 'range'),
            onFieldChange,
            onFieldBlur,
            isFormItemInput: true,
          },
        },
      },
    })
    const trigger = wrapper.find('.am-picker-trigger')
    expect(trigger.classes()).toContain('am-picker-trigger-status-error')
    expect(trigger.attributes('id')).toBe('range')
    await trigger.trigger('click')
    await clickButton('confirm')
    await nextTick()
    expect(onFieldChange).toHaveBeenCalledTimes(1)
    expect(onFieldBlur).toHaveBeenCalledTimes(1)
  })
})
