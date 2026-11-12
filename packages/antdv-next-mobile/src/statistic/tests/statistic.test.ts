import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Statistic, { StatisticTimer } from '..'
import { formatNumber, formatTimeStr, parseTime } from '../utils'

describe('Statistic', () => {
  it('renders title and formatted value', () => {
    const wrapper = mount(Statistic, { props: { title: 'Users', value: 1128934.5 } })
    expect(wrapper.classes()).toContain('am-statistic')
    expect(wrapper.find('.am-statistic-title').text()).toBe('Users')
    expect(wrapper.find('.am-statistic-content-value-int').text()).toBe('1,128,934')
    expect(wrapper.find('.am-statistic-content-value-decimal').text()).toBe('.5')
  })

  it('defaults to 0 without title', () => {
    const wrapper = mount(Statistic)
    expect(wrapper.find('.am-statistic-header').exists()).toBe(false)
    expect(wrapper.find('.am-statistic-content-value').text()).toBe('0')
  })

  it('supports precision and separators', () => {
    const wrapper = mount(Statistic, { props: { value: 1234567.891, precision: 2, groupSeparator: '.', decimalSeparator: ',' } })
    expect(wrapper.find('.am-statistic-content-value').text()).toBe('1.234.567,89')
    const padded = mount(Statistic, { props: { value: 12, precision: 2 } })
    expect(padded.find('.am-statistic-content-value').text()).toBe('12.00')
    const zero = mount(Statistic, { props: { value: 12.6, precision: 0 } })
    expect(zero.find('.am-statistic-content-value').text()).toBe('12')
  })

  it('renders non numeric values as is', () => {
    expect(mount(Statistic, { props: { value: 'N/A' } }).find('.am-statistic-content-value').text()).toBe('N/A')
    expect(mount(Statistic, { props: { value: '-12345.6' } }).find('.am-statistic-content-value').text()).toBe('-12,345.6')
  })

  it('renders prefix / suffix; slots win over props', () => {
    const byProp = mount(Statistic, { props: { value: 1, prefix: '$', suffix: '%' } })
    expect(byProp.find('.am-statistic-content-prefix').text()).toBe('$')
    expect(byProp.find('.am-statistic-content-suffix').text()).toBe('%')
    const bySlot = mount(Statistic, {
      props: { value: 1, title: 'prop', prefix: 'p', suffix: 's' },
      slots: { title: 'slot-title', prefix: 'slot-prefix', suffix: 'slot-suffix' },
    })
    expect(bySlot.find('.am-statistic-title').text()).toBe('slot-title')
    expect(bySlot.find('.am-statistic-content-prefix').text()).toBe('slot-prefix')
    expect(bySlot.find('.am-statistic-content-suffix').text()).toBe('slot-suffix')
  })

  it('formatter prop and slot (slot wins)', () => {
    const formatter = vi.fn((value: number | string) => h('b', `#${value}`))
    const byProp = mount(Statistic, { props: { value: 5, precision: 1, formatter } })
    expect(byProp.find('.am-statistic-content-value b').text()).toBe('#5')
    expect(formatter).toHaveBeenCalledWith(5, { groupSeparator: ',', decimalSeparator: '.', precision: 1 })
    const bySlot = mount(Statistic, {
      props: { value: 5, formatter },
      slots: { formatter: ({ value }: any) => `slot ${value}` },
    })
    expect(bySlot.find('.am-statistic-content-value').text()).toBe('slot 5')
  })

  it('shows a skeleton while loading', async () => {
    const wrapper = mount(Statistic, { props: { value: 5, loading: true, title: 't' } })
    expect(wrapper.find('.am-skeleton').exists()).toBe(true)
    expect(wrapper.find('.am-statistic-content').exists()).toBe(false)
    expect(wrapper.find('.am-statistic-title').exists()).toBe(true)
    await wrapper.setProps({ loading: false })
    expect(wrapper.find('.am-skeleton').exists()).toBe(false)
    expect(wrapper.find('.am-statistic-content').exists()).toBe(true)
  })

  it('passes attrs, valueStyle, rootClass, classes and styles', () => {
    const wrapper = mount(Statistic, {
      props: {
        title: 't',
        value: 1,
        prefix: 'p',
        suffix: 's',
        valueStyle: { color: 'red' },
        rootClass: 'root-cls',
        classes: { root: 'r', header: 'h', title: 'tt', content: 'c', prefix: 'pp', value: 'v', suffix: 'ss' },
        styles: { value: { fontWeight: 700 } },
      },
      attrs: { 'class': 'custom', 'style': 'margin: 1px', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r']))
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-statistic-header').classes()).toContain('h')
    expect(wrapper.find('.am-statistic-title').classes()).toContain('tt')
    expect(wrapper.find('.am-statistic-content').classes()).toContain('c')
    expect(wrapper.find('.am-statistic-content').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-statistic-content-prefix').classes()).toContain('pp')
    expect(wrapper.find('.am-statistic-content-value').classes()).toContain('v')
    expect(wrapper.find('.am-statistic-content-value').attributes('style')).toContain('font-weight: 700')
    expect(wrapper.find('.am-statistic-content-suffix').classes()).toContain('ss')
  })

  it('exposes Statistic.Timer', () => {
    expect(Statistic.Timer).toBe(StatisticTimer)
  })
})

describe('Statistic utils', () => {
  it('formatNumber', () => {
    expect(formatNumber(1234.5, {})).toEqual({ isNumber: true, int: '1,234', decimal: '.5' })
    expect(formatNumber('-', {})).toEqual({ isNumber: false, int: '-', decimal: '' })
    expect(formatNumber('.5', { precision: 2 })).toEqual({ isNumber: true, int: '0', decimal: '.50' })
  })

  it('formatTimeStr', () => {
    const duration = ((26 * 60 + 1) * 60 + 2) * 1000 + 34
    expect(formatTimeStr(duration, 'HH:mm:ss')).toBe('26:01:02')
    expect(formatTimeStr(duration, 'D 天 H 时 m 分 s 秒')).toBe('1 天 2 时 1 分 2 秒')
    expect(formatTimeStr(duration, 'mm:ss.SSS')).toBe('1561:02.034')
    expect(formatTimeStr(duration, '[Day] D [H]H')).toBe('Day 1 H2')
  })

  it('parseTime', () => {
    expect(parseTime(((26 * 60 + 1) * 60 + 2) * 1000 + 34)).toEqual({ days: 1, hours: 2, minutes: 1, seconds: 2, milliseconds: 34 })
  })
})

describe('StatisticTimer', () => {
  const now = new Date('2026-01-01T00:00:00Z').getTime()

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(now)
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('counts down and emits change / finish', async () => {
    const onFinish = vi.fn()
    const onChange = vi.fn()
    const wrapper = mount(StatisticTimer, {
      props: { value: now + 3000, title: 'Left' },
      attrs: { onFinish, onChange },
    })
    await nextTick()
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-statistic', 'am-statistic-timer']))
    expect(wrapper.find('.am-statistic-title').text()).toBe('Left')
    expect(wrapper.find('.am-statistic-content-value').text()).toBe('00:00:03')
    vi.advanceTimersByTime(1100)
    await nextTick()
    expect(wrapper.find('.am-statistic-content-value').text()).toBe('00:00:01')
    expect(onChange).toHaveBeenCalled()
    expect(onChange.mock.calls[onChange.mock.calls.length - 1]![0]).toBeLessThan(2000)
    expect(onFinish).not.toHaveBeenCalled()
    vi.advanceTimersByTime(2000)
    await nextTick()
    expect(wrapper.find('.am-statistic-content-value').text()).toBe('00:00:00')
    expect(onFinish).toHaveBeenCalledTimes(1)
    const calls = onChange.mock.calls.length
    vi.advanceTimersByTime(2000)
    expect(onChange.mock.calls.length).toBe(calls)
    expect(onFinish).toHaveBeenCalledTimes(1)
  })

  it('does not finish an already expired countdown', async () => {
    const onFinish = vi.fn()
    const wrapper = mount(StatisticTimer, { props: { value: now - 1000 }, attrs: { onFinish } })
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(wrapper.find('.am-statistic-content-value').text()).toBe('00:00:00')
    expect(onFinish).not.toHaveBeenCalled()
  })

  it('counts up', async () => {
    const onFinish = vi.fn()
    const wrapper = mount(StatisticTimer, {
      props: { type: 'countup', value: now - 61_000, format: 'm 分 s 秒' },
      attrs: { onFinish },
    })
    await nextTick()
    expect(wrapper.find('.am-statistic-content-value').text()).toBe('1 分 1 秒')
    vi.advanceTimersByTime(2050)
    await nextTick()
    expect(wrapper.find('.am-statistic-content-value').text()).toBe('1 分 3 秒')
    expect(onFinish).not.toHaveBeenCalled()
  })

  it('restarts when value changes', async () => {
    const wrapper = mount(StatisticTimer, { props: { value: now + 1000 } })
    vi.advanceTimersByTime(1500)
    await nextTick()
    expect(wrapper.find('.am-statistic-content-value').text()).toBe('00:00:00')
    await wrapper.setProps({ value: Date.now() + 5000 })
    expect(wrapper.find('.am-statistic-content-value').text()).toBe('00:00:05')
    vi.advanceTimersByTime(1050)
    await nextTick()
    expect(wrapper.find('.am-statistic-content-value').text()).toBe('00:00:03')
  })

  it('supports the formatter slot with time data and other slots', async () => {
    const wrapper = mount(StatisticTimer, {
      props: { value: now + 90_061_000, prefix: 'p' },
      slots: {
        formatter: ({ time, formatted }: any) => `${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s | ${formatted}`,
        suffix: 'suffix-slot',
      },
    })
    await nextTick()
    expect(wrapper.find('.am-statistic-content-value').text()).toBe('1d 1h 1m 1s | 25:01:01')
    expect(wrapper.find('.am-statistic-content-prefix').text()).toBe('p')
    expect(wrapper.find('.am-statistic-content-suffix').text()).toBe('suffix-slot')
  })

  it('stops the timer on unmount', () => {
    const onChange = vi.fn()
    const wrapper = mount(StatisticTimer, { props: { value: now + 5000 }, attrs: { onChange } })
    vi.advanceTimersByTime(100)
    const calls = onChange.mock.calls.length
    expect(calls).toBeGreaterThan(0)
    wrapper.unmount()
    vi.advanceTimersByTime(1000)
    expect(onChange.mock.calls.length).toBe(calls)
  })
})
