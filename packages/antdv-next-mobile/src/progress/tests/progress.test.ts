import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Progress from '..'
import ConfigProvider from '../../config-provider'

describe('Progress', () => {
  it('renders a line progress by default', () => {
    const wrapper = mount(Progress, { props: { percent: 30 } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'am-progress',
      'am-progress-line',
      'am-progress-status-normal',
      'am-progress-show-info',
      'am-progress-line-align-end',
      'am-progress-line-position-outer',
    ]))
    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.attributes('aria-valuenow')).toBe('30')
    expect(wrapper.find('.am-progress-track').attributes('style')).toContain('width: 30%')
    expect(wrapper.find('.am-progress-indicator').text()).toBe('30%')
  })

  it('clamps percent', () => {
    expect(mount(Progress, { props: { percent: 130 } }).find('.am-progress-track').attributes('style')).toContain('width: 100%')
    expect(mount(Progress, { props: { percent: -5 } }).find('.am-progress-track').attributes('style')).toContain('width: 0%')
  })

  it('resolves status: auto success, explicit status, icons', () => {
    const success = mount(Progress, { props: { percent: 100 } })
    expect(success.classes()).toContain('am-progress-status-success')
    expect(success.find('.am-progress-indicator .anticon-check-circle').exists()).toBe(true)

    const exception = mount(Progress, { props: { percent: 100, status: 'exception' } })
    expect(exception.classes()).toContain('am-progress-status-exception')
    expect(exception.find('.am-progress-indicator .anticon-close-circle').exists()).toBe(true)

    const active = mount(Progress, { props: { percent: 50, status: 'active' } })
    expect(active.classes()).toContain('am-progress-status-active')

    const bySuccess = mount(Progress, { props: { percent: 60, success: { percent: 100 } } })
    expect(bySuccess.classes()).toContain('am-progress-status-success')
  })

  it('hides info', () => {
    const wrapper = mount(Progress, { props: { percent: 30, showInfo: false } })
    expect(wrapper.find('.am-progress-indicator').exists()).toBe(false)
    expect(wrapper.classes()).not.toContain('am-progress-show-info')
  })

  it('format prop and default slot (slot wins)', () => {
    const byFormat = mount(Progress, { props: { percent: 40, success: { percent: 10 }, format: (p, s) => `${p}/${s}` } })
    expect(byFormat.find('.am-progress-indicator').text()).toBe('40/10')
    const bySlot = mount(Progress, {
      props: { percent: 40, format: () => 'prop' },
      slots: { default: ({ percent }: { percent: number }) => `slot ${percent}` },
    })
    expect(bySlot.find('.am-progress-indicator').text()).toBe('slot 40')
  })

  it('supports strokeColor, railColor, linecap and size on line', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50, strokeColor: 'red', railColor: 'blue', strokeLinecap: 'butt', size: [200, 12] },
    })
    expect(wrapper.attributes('style')).toContain('width: 200px')
    const rail = wrapper.find('.am-progress-rail')
    expect(rail.attributes('style')).toContain('height: 12px')
    expect(rail.attributes('style')).toContain('background: blue')
    expect(rail.attributes('style')).toContain('border-radius: 0')
    expect(wrapper.find('.am-progress-track').attributes('style')).toContain('background: red')

    const thick = mount(Progress, { props: { size: 16, trailColor: 'gray' } })
    expect(thick.find('.am-progress-rail').attributes('style')).toContain('height: 16px')
    expect(thick.find('.am-progress-rail').attributes('style')).toContain('background: gray')
    expect(mount(Progress, { props: { size: 'small' } }).classes()).toContain('am-progress-small')
    expect(mount(Progress, { props: { strokeWidth: 4 } }).find('.am-progress-rail').attributes('style')).toContain('height: 4px')
  })

  it('renders gradients on line', () => {
    const fromTo = mount(Progress, { props: { percent: 50, strokeColor: { from: 'red', to: 'green' } } })
    expect(fromTo.find('.am-progress-track').attributes('style')).toContain('linear-gradient(to right, red 0%, green 100%)')
    const stops = mount(Progress, { props: { percent: 50, strokeColor: { '100%': 'green', '0%': 'red', 'direction': 'to top' } } })
    expect(stops.find('.am-progress-track').attributes('style')).toContain('linear-gradient(to top, red 0%, green 100%)')
    const list = mount(Progress, { props: { percent: 50, strokeColor: ['red', 'green', 'blue'] } })
    expect(list.find('.am-progress-track').attributes('style')).toContain('linear-gradient(to right, red 0%, green 50%, blue 100%)')
    const rtl = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: { default: () => h(Progress, { percent: 50, strokeColor: { from: 'red', to: 'green' } }) },
    })
    expect(rtl.find('.am-progress-track').attributes('style')).toContain('linear-gradient(to left')
  })

  it('renders the success segment', () => {
    const wrapper = mount(Progress, { props: { percent: 60, success: { percent: 30, strokeColor: 'lime' } } })
    const success = wrapper.find('.am-progress-track-success')
    expect(success.attributes('style')).toContain('width: 30%')
    expect(success.attributes('style')).toContain('background: lime')
  })

  it('supports percentPosition', () => {
    const inner = mount(Progress, { props: { percent: 50, percentPosition: { type: 'inner', align: 'center' } } })
    expect(inner.classes()).toEqual(expect.arrayContaining(['am-progress-line-position-inner', 'am-progress-line-align-center']))
    expect(inner.find('.am-progress-track .am-progress-indicator-inner').text()).toBe('50%')
    expect(inner.findAll('.am-progress-indicator')).toHaveLength(1)
    const start = mount(Progress, { props: { percent: 50, percentPosition: { align: 'start' } } })
    expect(start.classes()).toContain('am-progress-line-align-start')
  })

  it('renders steps', () => {
    const wrapper = mount(Progress, { props: { percent: 50, steps: 4, strokeColor: ['red', 'green'], size: [20, 10] } })
    expect(wrapper.classes()).toContain('am-progress-steps')
    const items = wrapper.findAll('.am-progress-steps-item')
    expect(items).toHaveLength(4)
    expect(items.filter(item => item.classes().includes('am-progress-steps-item-active'))).toHaveLength(2)
    expect(items[0]!.attributes('style')).toContain('background: red')
    expect(items[1]!.attributes('style')).toContain('background: green')
    expect(items[0]!.attributes('style')).toContain('width: 20px')
    expect(items[0]!.attributes('style')).toContain('height: 10px')

    const custom = mount(Progress, { props: { percent: 49, steps: { count: 5, gap: 6 }, rounding: Math.ceil } })
    expect(custom.findAll('.am-progress-steps-item-active')).toHaveLength(3)
    expect(custom.find('.am-progress-steps-body').attributes('style')).toContain('gap: 6px')
  })

  it('renders circle', () => {
    const wrapper = mount(Progress, { props: { type: 'circle', percent: 25, size: 80 } })
    expect(wrapper.classes()).toContain('am-progress-circle')
    expect(wrapper.find('.am-progress-body').attributes('style')).toContain('width: 80px')
    const rail = wrapper.find('circle.am-progress-rail')
    const track = wrapper.find('circle.am-progress-track')
    const radius = Number(rail.attributes('r'))
    expect(radius).toBe(47)
    const circumference = 2 * Math.PI * radius
    expect(Number(track.attributes('stroke-dasharray')!.split(' ')[0])).toBeCloseTo(circumference / 4, 3)
    expect(track.attributes('transform')).toBe('rotate(270 50 50)')
    expect(wrapper.find('.am-progress-indicator').text()).toBe('25%')
    expect(wrapper.find('linearGradient').exists()).toBe(false)
  })

  it('renders circle status icons, success segment and gradient', () => {
    const done = mount(Progress, { props: { type: 'circle', percent: 100 } })
    expect(done.find('.am-progress-indicator .anticon-check').exists()).toBe(true)
    const failed = mount(Progress, { props: { type: 'circle', percent: 70, status: 'exception' } })
    expect(failed.find('.am-progress-indicator .anticon-close').exists()).toBe(true)

    const wrapper = mount(Progress, {
      props: { type: 'circle', percent: 60, success: { percent: 30 }, strokeColor: { '0%': 'red', '100%': 'blue' } },
    })
    expect(wrapper.find('.am-progress-track-success').exists()).toBe(true)
    const gradient = wrapper.find('linearGradient')
    expect(gradient.findAll('stop')).toHaveLength(2)
    expect(wrapper.find('circle.am-progress-track').attributes('style')).toContain(`url(#${gradient.attributes('id')})`)
    const empty = mount(Progress, { props: { type: 'circle', percent: 0 } })
    expect(empty.find('circle.am-progress-track').classes()).toContain('am-progress-track-empty')
  })

  it('renders dashboard with gap', () => {
    const wrapper = mount(Progress, { props: { type: 'dashboard', percent: 100 } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-progress-circle', 'am-progress-dashboard']))
    const rail = wrapper.find('circle.am-progress-rail')
    const circumference = 2 * Math.PI * Number(rail.attributes('r'))
    expect(Number(rail.attributes('stroke-dasharray')!.split(' ')[0])).toBeCloseTo(circumference * (285 / 360), 3)
    expect(rail.attributes('transform')).toBe('rotate(127.5 50 50)')

    const custom = mount(Progress, { props: { type: 'dashboard', gapDegree: 90, gapPlacement: 'top' } })
    expect(custom.find('circle.am-progress-rail').attributes('transform')).toBe('rotate(315 50 50)')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Progress, {
      props: {
        percent: 10,
        rootClass: 'root-cls',
        classes: { root: 'r', body: 'b', rail: 'ra', track: 't', indicator: 'i' },
        styles: { indicator: { color: 'red' }, root: { margin: '2px' } },
      },
      attrs: { 'class': 'custom', 'style': 'padding: 1px', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r']))
    expect(wrapper.attributes('style')).toContain('padding: 1px')
    expect(wrapper.attributes('style')).toContain('margin: 2px')
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-progress-body').classes()).toContain('b')
    expect(wrapper.find('.am-progress-rail').classes()).toContain('ra')
    expect(wrapper.find('.am-progress-track').classes()).toContain('t')
    expect(wrapper.find('.am-progress-indicator').classes()).toContain('i')
    expect(wrapper.find('.am-progress-indicator').attributes('style')).toContain('color: red')
  })
})
