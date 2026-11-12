import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import { describe, expect, it, vi } from 'vitest'
import { computed, h, nextTick } from 'vue'
import Calendar from '..'
import ConfigProvider from '../../config-provider'
import { formItemInputContextKey } from '../../form/context'
import enUS from '../../locale/en_US'

const minDate = dayjs('2024-01-01')
const maxDate = dayjs('2024-12-31')
const base = { minDate, maxDate, poppable: false } as const

function dayOf(root: ParentNode, month: string, date: number) {
  return root.querySelector(`[data-month="${month}"]`)!.querySelectorAll<HTMLElement>('.am-calendar-day')[date - 1]
}
async function clickDay(root: ParentNode, month: string, date: number) {
  dayOf(root, month, date).click()
  await nextTick()
}
const fmt = (value: any) => (Array.isArray(value) ? value.map(item => item.format('YYYY-MM-DD')) : value?.format('YYYY-MM-DD'))

describe('Calendar', () => {
  it('renders the inline view: title, weekdays and lazily rendered months', () => {
    const wrapper = mount(Calendar, { props: { ...base } })
    expect(wrapper.find('.am-calendar-inline').exists()).toBe(true)
    const root = wrapper.find('.am-calendar')
    expect(root.classes()).toContain('am-calendar-single')
    expect(wrapper.find('.am-calendar-title').text()).toBe('日期选择')
    expect(wrapper.findAll('.am-calendar-weekday').map(item => item.text())).toEqual(['日', '一', '二', '三', '四', '五', '六'])
    // 12 months in range, only the ones near the viewport are in the DOM
    const months = wrapper.findAll('.am-calendar-month')
    expect(months.length).toBeGreaterThan(0)
    expect(months.length).toBeLessThan(6)
    expect(months[0].find('.am-calendar-month-title').text()).toBe('2024年1月')
    expect(months[0].findAll('.am-calendar-day')).toHaveLength(31)
    // 2024-01-01 is a Monday -> one empty cell before it
    expect(months[0].find('.am-calendar-day').attributes('style')).toContain('margin-inline-start')
    expect(wrapper.find('.am-calendar-month-mark').text()).toBe('1')
    // the spacer keeps the scroll height of the months that are not rendered
    const spacers = wrapper.findAll('.am-calendar-spacer')
    expect(Number.parseInt(spacers[1].attributes('style')!.match(/height: (\d+)px/)![1])).toBeGreaterThan(1000)
  })

  it('weekStartsOn rotates the week', () => {
    const wrapper = mount(Calendar, { props: { ...base, weekStartsOn: 1 } })
    expect(wrapper.findAll('.am-calendar-weekday').map(item => item.text())).toEqual(['一', '二', '三', '四', '五', '六', '日'])
    expect(wrapper.find('.am-calendar-day').attributes('style') ?? '').not.toContain('margin-inline-start')
  })

  it('single: select then confirm commits the value (uncontrolled)', async () => {
    const wrapper = mount(Calendar, { props: { ...base } })
    expect(wrapper.find('.am-calendar-confirm').attributes('disabled')).toBeDefined()
    await clickDay(wrapper.find('.am-calendar').element, '2024-01', 15)
    expect(fmt(wrapper.emitted('select')![0][0])).toBe('2024-01-15')
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(dayOf(wrapper.find('.am-calendar').element, '2024-01', 15).classList.contains('am-calendar-day-selected')).toBe(true)
    await wrapper.find('.am-calendar-confirm').trigger('click')
    expect(fmt(wrapper.emitted('update:value')![0][0])).toBe('2024-01-15')
    expect(wrapper.emitted('change')![0][1]).toBe('2024-01-15')
    expect(fmt(wrapper.emitted('confirm')![0][0])).toBe('2024-01-15')
  })

  it('showConfirm=false commits as soon as the selection is complete', async () => {
    const wrapper = mount(Calendar, { props: { ...base, showConfirm: false, valueFormat: 'YYYY/MM/DD' } })
    expect(wrapper.find('.am-calendar-footer').exists()).toBe(false)
    await clickDay(wrapper.find('.am-calendar').element, '2024-01', 3)
    expect(wrapper.emitted('update:value')![0]).toEqual(['2024/01/03'])
    expect(wrapper.emitted('change')![0]).toEqual(['2024/01/03', '2024-01-03'])
  })

  it('controlled value is rendered and stays until the prop changes', async () => {
    const wrapper = mount(Calendar, { props: { ...base, value: '2024-01-10', valueFormat: 'YYYY-MM-DD', showConfirm: false } })
    const root = wrapper.find('.am-calendar').element
    expect(dayOf(root, '2024-01', 10).classList.contains('am-calendar-day-selected')).toBe(true)
    await clickDay(root, '2024-01', 20)
    expect(wrapper.emitted('update:value')![0]).toEqual(['2024-01-20'])
    await wrapper.setProps({ value: '2024-01-20' })
    expect(dayOf(root, '2024-01', 20).classList.contains('am-calendar-day-selected')).toBe(true)
    expect(dayOf(root, '2024-01', 10).classList.contains('am-calendar-day-selected')).toBe(false)
  })

  it('range: start / middle / end with locale texts', async () => {
    const wrapper = mount(Calendar, { props: { ...base, selectionMode: 'range' } })
    const root = wrapper.find('.am-calendar').element
    await clickDay(root, '2024-01', 10)
    expect(dayOf(root, '2024-01', 10).classList.contains('am-calendar-day-start')).toBe(true)
    expect(wrapper.find('.am-calendar-confirm').attributes('disabled')).toBeDefined()
    await clickDay(root, '2024-01', 13)
    expect(dayOf(root, '2024-01', 10).querySelector('.am-calendar-day-bottom')!.textContent).toBe('开始')
    expect(dayOf(root, '2024-01', 13).querySelector('.am-calendar-day-bottom')!.textContent).toBe('结束')
    expect(dayOf(root, '2024-01', 11).classList.contains('am-calendar-day-middle')).toBe(true)
    await wrapper.find('.am-calendar-confirm').trigger('click')
    expect(fmt(wrapper.emitted('update:value')![0][0])).toEqual(['2024-01-10', '2024-01-13'])
    expect(wrapper.emitted('change')![0][1]).toEqual(['2024-01-10', '2024-01-13'])
  })

  it('range: earlier day restarts, same day needs allowSameDay', async () => {
    const wrapper = mount(Calendar, { props: { ...base, selectionMode: 'range' } })
    const root = wrapper.find('.am-calendar').element
    await clickDay(root, '2024-01', 10)
    await clickDay(root, '2024-01', 5)
    expect(fmt(wrapper.emitted('select')!.slice(-1)[0][0])).toEqual(['2024-01-05'])
    await clickDay(root, '2024-01', 5)
    expect(wrapper.emitted('select')).toHaveLength(2)

    await wrapper.setProps({ allowSameDay: true })
    await clickDay(root, '2024-01', 5)
    expect(fmt(wrapper.emitted('select')!.slice(-1)[0][0])).toEqual(['2024-01-05', '2024-01-05'])
    expect(dayOf(root, '2024-01', 5).classList.contains('am-calendar-day-start-end')).toBe(true)
    expect(dayOf(root, '2024-01', 5).querySelector('.am-calendar-day-bottom')!.textContent).toBe('开始/结束')
  })

  it('range: maxRange truncates and prompts, disabled days cut the range', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Calendar, {
      props: { ...base, selectionMode: 'range', maxRange: 3, disabledDate: (date: dayjs.Dayjs) => date.date() === 25 },
      global: { stubs: { transition: true } },
    })
    const root = wrapper.find('.am-calendar').element
    await clickDay(root, '2024-01', 10)
    await clickDay(root, '2024-01', 20)
    expect(fmt(wrapper.emitted('select')!.slice(-1)[0][0])).toEqual(['2024-01-10', '2024-01-12'])
    expect(wrapper.emitted('overRange')).toHaveLength(1)
    expect(wrapper.find('.am-calendar-tip').text()).toBe('最多选择 3 天')
    vi.advanceTimersByTime(2000)
    await nextTick()
    expect(wrapper.find('.am-calendar-tip').exists()).toBe(false)
    vi.useRealTimers()

    await wrapper.setProps({ maxRange: undefined })
    await clickDay(root, '2024-01', 23)
    await clickDay(root, '2024-01', 27)
    expect(fmt(wrapper.emitted('select')!.slice(-1)[0][0])).toEqual(['2024-01-23', '2024-01-24'])
  })

  it('multiple: toggles dates, limited by maxRange', async () => {
    const wrapper = mount(Calendar, { props: { ...base, selectionMode: 'multiple', maxRange: 2, defaultValue: [dayjs('2024-01-03')] } })
    const root = wrapper.find('.am-calendar').element
    await clickDay(root, '2024-01', 1)
    expect(fmt(wrapper.emitted('select')![0][0])).toEqual(['2024-01-01', '2024-01-03'])
    await clickDay(root, '2024-01', 9)
    expect(wrapper.emitted('overRange')).toHaveLength(1)
    await clickDay(root, '2024-01', 3)
    expect(fmt(wrapper.emitted('select')!.slice(-1)[0][0])).toEqual(['2024-01-01'])
    await wrapper.find('.am-calendar-confirm').trigger('click')
    expect(fmt(wrapper.emitted('update:value')![0][0])).toEqual(['2024-01-01'])
  })

  it('disables days out of range / disabledDate and ignores taps on them', async () => {
    const wrapper = mount(Calendar, {
      props: { poppable: false, minDate: dayjs('2024-01-10'), maxDate: dayjs('2024-02-10'), disabledDate: (date: dayjs.Dayjs) => date.day() === 0 },
    })
    const root = wrapper.find('.am-calendar').element
    expect(dayOf(root, '2024-01', 9).classList.contains('am-calendar-day-disabled')).toBe(true)
    expect(dayOf(root, '2024-01', 14).classList.contains('am-calendar-day-disabled')).toBe(true)
    expect(dayOf(root, '2024-01', 15).classList.contains('am-calendar-day-disabled')).toBe(false)
    await clickDay(root, '2024-01', 9)
    expect(wrapper.emitted('select')).toBeUndefined()

    const disabled = mount(Calendar, { props: { ...base, disabled: true } })
    await clickDay(disabled.find('.am-calendar').element, '2024-01', 9)
    expect(disabled.emitted('select')).toBeUndefined()
  })

  it('formatter and the cellRender slot customise days; slot wins over the prop', () => {
    const formatter = (day: any) => (day.date.date() === 1 ? { ...day, topInfo: '假', bottomInfo: '¥99', className: 'holiday' } : day)
    const wrapper = mount(Calendar, { props: { ...base, formatter } })
    const first = dayOf(wrapper.find('.am-calendar').element, '2024-01', 1)
    expect(first.classList.contains('holiday')).toBe(true)
    expect(first.querySelector('.am-calendar-day-top')!.textContent).toBe('假')
    expect(first.querySelector('.am-calendar-day-bottom')!.textContent).toBe('¥99')

    const cellRender = ({ date }: any) => h('i', { class: 'by-prop' }, date.date())
    const byProp = mount(Calendar, { props: { ...base, cellRender } })
    expect(byProp.find('.by-prop').exists()).toBe(true)
    const bySlot = mount(Calendar, { props: { ...base, cellRender }, slots: { cellRender: ({ day }: any) => h('b', { class: 'by-slot' }, day.text) } })
    expect(bySlot.find('.by-slot').exists()).toBe(true)
    expect(bySlot.find('.by-prop').exists()).toBe(false)
  })

  it('marks today and defaults to today … +6 months', () => {
    const wrapper = mount(Calendar, { props: { poppable: false } })
    const todayCell = wrapper.find('.am-calendar-day-today')
    expect(todayCell.exists()).toBe(true)
    expect(todayCell.find('.am-calendar-day-top').text()).toBe('今天')
    expect(wrapper.find('.am-calendar-month-title').text()).toBe(dayjs().format('YYYY年M月'))
  })

  it('exposes scrollToDate / reset and emits monthShow', async () => {
    const wrapper = mount(Calendar, { props: { ...base, defaultValue: dayjs('2024-01-05') } })
    const shown = () => wrapper.emitted('monthShow')!.map(args => (args[0] as any).title)
    expect(shown()).toContain('2024年1月')
    ;(wrapper.vm as any).scrollToDate(dayjs('2024-10-08'))
    await nextTick()
    expect(wrapper.find('[data-month="2024-10"]').exists()).toBe(true)
    expect(wrapper.find('[data-month="2024-01"]').exists()).toBe(false)
    expect(shown()).toContain('2024年10月')

    await clickDay(wrapper.find('.am-calendar').element, '2024-10', 8)
    ;(wrapper.vm as any).reset()
    await nextTick()
    await nextTick()
    expect(wrapper.find('[data-month="2024-01"]').exists()).toBe(true)
    expect(dayOf(wrapper.find('.am-calendar').element, '2024-01', 5).classList.contains('am-calendar-day-selected')).toBe(true)
  })

  it('follows scrolling of the body', async () => {
    const wrapper = mount(Calendar, { props: { ...base } })
    const body = wrapper.find('.am-calendar-body')
    ;(body.element as HTMLElement).scrollTop = 3000
    await body.trigger('scroll')
    expect(wrapper.find('[data-month="2024-01"]').exists()).toBe(false)
    expect(wrapper.findAll('.am-calendar-month').length).toBeLessThan(6)
  })

  it('popup mode: teleports, confirms and closes', async () => {
    const wrapper = mount(Calendar, { props: { minDate, maxDate, open: false, title: '选择日期' } })
    expect(document.querySelector('.am-calendar')).toBeNull()
    await wrapper.setProps({ open: true })
    await nextTick()
    const popup = document.querySelector('.am-calendar-popup')!
    expect(popup.closest('.am-popup-root')!.parentElement).toBe(document.body)
    expect(popup.querySelector('.am-calendar-title')!.textContent!.trim()).toBe('选择日期')
    await clickDay(document, '2024-01', 8)
    popup.querySelector<HTMLElement>('.am-calendar-confirm')!.click()
    await nextTick()
    expect(fmt(wrapper.emitted('update:value')![0][0])).toBe('2024-01-08')
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
    expect(wrapper.emitted('openChange')![0]).toEqual([false])
  })

  it('popup mode: closing without confirm cancels and drops the pending selection', async () => {
    const wrapper = mount(Calendar, { props: { minDate, maxDate, defaultOpen: true, defaultValue: dayjs('2024-01-02') } })
    await nextTick()
    await clickDay(document, '2024-01', 8)
    document.querySelector<HTMLElement>('.am-popup-mask')!.click()
    await nextTick()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:value')).toBeUndefined()
    ;(wrapper.vm as any).toggle(true)
    await nextTick()
    await nextTick()
    expect(dayOf(document, '2024-01', 2).classList.contains('am-calendar-day-selected')).toBe(true)
    expect(dayOf(document, '2024-01', 8).classList.contains('am-calendar-day-selected')).toBe(false)
  })

  it('works as a field with the shared trigger', async () => {
    const onFieldChange = vi.fn()
    const onFieldBlur = vi.fn()
    const wrapper = mount(Calendar, {
      props: { minDate, maxDate, trigger: true, selectionMode: 'range', allowClear: true, placeholder: '入住 - 离店', showConfirm: false },
      attrs: { 'data-id': 'x' },
      global: {
        provide: {
          [formItemInputContextKey as symbol]: {
            status: computed(() => ''),
            id: computed(() => 'stay'),
            onFieldChange,
            onFieldBlur,
            isFormItemInput: true,
          },
        },
      },
    })
    const trigger = wrapper.find('.am-picker-trigger')
    expect(trigger.classes()).toContain('am-calendar-trigger')
    expect(trigger.attributes('data-id')).toBe('x')
    expect(trigger.attributes('id')).toBe('stay')
    expect(trigger.text()).toBe('入住 - 离店')
    await trigger.trigger('click')
    await nextTick()
    await clickDay(document, '2024-01', 8)
    await clickDay(document, '2024-01', 10)
    await nextTick()
    expect(wrapper.find('.am-picker-trigger').text()).toBe('2024-01-08 ~ 2024-01-10')
    expect(onFieldChange).toHaveBeenCalledTimes(1)
    expect(onFieldBlur).toHaveBeenCalledTimes(1)
    await wrapper.find('.am-picker-trigger-clear').trigger('click')
    expect(wrapper.emitted('update:value')!.slice(-1)[0]).toEqual([[]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('default slot is a custom trigger; footer slot replaces the button', async () => {
    const wrapper = mount(Calendar, {
      props: { minDate, maxDate, defaultValue: dayjs('2024-03-04') },
      slots: {
        default: ({ label, toggle }: any) => h('button', { class: 'custom', onClick: () => toggle() }, label),
        footer: ({ confirm, disabled }: any) => h('button', { class: 'my-footer', disabled, onClick: confirm }, 'go'),
      },
    })
    expect(wrapper.find('.custom').text()).toBe('2024-03-04')
    await wrapper.find('.custom').trigger('click')
    await nextTick()
    expect(document.querySelector('.am-calendar-confirm')).toBeNull()
    expect(document.querySelector('.my-footer')).not.toBeNull()
    // opened at the month of the value
    expect(document.querySelector('[data-month="2024-03"]')).not.toBeNull()
  })

  it('passes semantic classes, rowHeight and locale', () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: {
        default: () => h(Calendar, { ...base, rowHeight: 50, rootClass: 'root-cls', classes: { body: 'body-cls', day: 'day-cls' }, class: 'custom', okText: 'Go' }),
      },
    })
    const root = wrapper.find('.am-calendar')
    expect(root.classes()).toEqual(expect.arrayContaining(['root-cls', 'custom']))
    expect(root.attributes('style')).toContain('--am-calendar-row-height: 50px')
    expect(wrapper.find('.am-calendar-body').classes()).toContain('body-cls')
    expect(wrapper.find('.am-calendar-day').classes()).toContain('day-cls')
    expect(wrapper.find('.am-calendar-title').text()).toBe('Calendar')
    expect(wrapper.find('.am-calendar-confirm').text()).toBe('Go')
    expect(wrapper.findAll('.am-calendar-weekday')[0].text()).toBe('Sun')
  })
})

describe('Calendar virtual', () => {
  const decade = { minDate: dayjs('2020-01-01'), maxDate: dayjs('2029-12-31'), poppable: false } as const
  const spacerHeights = (wrapper: ReturnType<typeof mount>) =>
    wrapper.findAll('.am-calendar-spacer').map(item => Number.parseInt(item.attributes('style')!.match(/height: (\d+)px/)![1]))

  it('mounts only the visible months of a 10-year range', async () => {
    const wrapper = mount(Calendar, { props: { ...decade, defaultValue: dayjs('2026-06-15') } })
    await nextTick()
    // 120 months in range
    const months = wrapper.findAll('.am-calendar-month')
    expect(months.length).toBeGreaterThan(0)
    expect(months.length).toBeLessThan(6)
    expect(wrapper.findAll('.am-calendar-day').length).toBeLessThan(6 * 31)
    expect(wrapper.find('[data-month="2026-06"]').exists()).toBe(true)
    expect(wrapper.find('[data-month="2020-01"]').exists()).toBe(false)
    expect(dayOf(wrapper.element, '2026-06', 15).classList.contains('am-calendar-day-selected')).toBe(true)
    // spacers + rendered months add up to the height of all 120 months
    const [before, after] = spacerHeights(wrapper)
    const rendered = months.reduce((sum, month) => sum + Number.parseInt(month.attributes('style')!.match(/height: (\d+)px/)![1]), 0)
    expect(before).toBeGreaterThan(20000)
    expect(after).toBeGreaterThan(10000)
    expect(before + rendered + after).toBeGreaterThan(120 * (44 + 4 * 64))
    expect(before + rendered + after).toBeLessThan(120 * (44 + 6 * 64))

    ;(wrapper.vm as any).scrollToDate(dayjs('2029-12-31'))
    await nextTick()
    expect(wrapper.find('[data-month="2029-12"]').exists()).toBe(true)
    expect(wrapper.find('[data-month="2026-06"]').exists()).toBe(false)
    expect(wrapper.findAll('.am-calendar-month').length).toBeLessThan(6)
    expect(spacerHeights(wrapper)[1]).toBe(0)
  })

  it('virtual: false renders every month with the same structure', () => {
    const wrapper = mount(Calendar, { props: { ...decade, virtual: false } })
    expect(wrapper.findAll('.am-calendar-month')).toHaveLength(120)
    expect(spacerHeights(wrapper)).toEqual([0, 0])
  })
})
