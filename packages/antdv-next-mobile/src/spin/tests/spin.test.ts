import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Spin from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'

describe('Spin', () => {
  it('renders a spinning indicator by default', () => {
    const wrapper = mount(Spin)
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-spin', 'am-spin-spinning']))
    expect(wrapper.find('.am-spin-indicator svg').exists()).toBe(true)
    expect(wrapper.find('.am-spin-description').exists()).toBe(false)
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('toggles spinning', async () => {
    const wrapper = mount(Spin, { props: { spinning: false } })
    expect(wrapper.classes()).not.toContain('am-spin-spinning')
    await wrapper.setProps({ spinning: true })
    expect(wrapper.classes()).toContain('am-spin-spinning')
  })

  it('supports size and ConfigProvider componentSize', () => {
    expect(mount(Spin, { props: { size: 'small' } }).classes()).toContain('am-spin-sm')
    const wrapper = mount(ConfigProvider, {
      props: { componentSize: 'large' },
      slots: { default: () => h(Spin) },
    })
    expect(wrapper.find('.am-spin').classes()).toContain('am-spin-lg')
  })

  it('renders description, deprecated tip and slot priority', () => {
    const byProp = mount(Spin, { props: { description: 'Loading' } })
    expect(byProp.find('.am-spin-description').text()).toBe('Loading')
    expect(byProp.classes()).toContain('am-spin-with-description')

    const byTip = mount(Spin, { props: { tip: 'Tip' } })
    expect(byTip.find('.am-spin-description').text()).toBe('Tip')

    const bySlot = mount(Spin, { props: { description: 'prop' }, slots: { description: 'slot' } })
    expect(bySlot.find('.am-spin-description').text()).toBe('slot')
  })

  it('indicator slot wins over indicator prop', () => {
    const byProp = mount(Spin, { props: { indicator: () => h('i', { class: 'prop-indicator' }) } })
    expect(byProp.find('.prop-indicator').exists()).toBe(true)
    expect(byProp.find('svg').exists()).toBe(false)
    const bySlot = mount(Spin, {
      props: { indicator: () => h('i', { class: 'prop-indicator' }) },
      slots: { indicator: () => h('i', { class: 'slot-indicator' }) },
    })
    expect(bySlot.find('.slot-indicator').exists()).toBe(true)
    expect(bySlot.find('.prop-indicator').exists()).toBe(false)
  })

  it('wraps content and blurs it while spinning', async () => {
    const wrapper = mount(Spin, {
      props: { spinning: true },
      slots: { default: () => h('p', { class: 'content' }, 'content') },
      attrs: { class: 'custom' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-spin-wrapper', 'custom']))
    expect(wrapper.find('.am-spin-section').classes()).toContain('am-spin-spinning')
    expect(wrapper.find('.am-spin-container').classes()).toContain('am-spin-blur')
    expect(wrapper.find('.content').exists()).toBe(true)
    await wrapper.setProps({ spinning: false })
    expect(wrapper.find('.am-spin-section').classes()).not.toContain('am-spin-spinning')
    expect(wrapper.find('.am-spin-container').classes()).not.toContain('am-spin-blur')
  })

  it('delays the spinning state', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Spin, { props: { delay: 300 } })
    expect(wrapper.classes()).not.toContain('am-spin-spinning')
    vi.advanceTimersByTime(299)
    await nextTick()
    expect(wrapper.classes()).not.toContain('am-spin-spinning')
    vi.advanceTimersByTime(1)
    await nextTick()
    expect(wrapper.classes()).toContain('am-spin-spinning')
    await wrapper.setProps({ spinning: false })
    expect(wrapper.classes()).not.toContain('am-spin-spinning')
    vi.useRealTimers()
  })

  it('cancels a pending delay when spinning stops', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Spin, { props: { delay: 300 } })
    await wrapper.setProps({ spinning: false })
    vi.advanceTimersByTime(500)
    await nextTick()
    expect(wrapper.classes()).not.toContain('am-spin-spinning')
    vi.useRealTimers()
  })

  it('fullscreen locks the page scroll', async () => {
    const wrapper = mount(Spin, { props: { fullscreen: true }, slots: { default: 'ignored' }, attachTo: document.body })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-spin', 'am-spin-fullscreen', 'am-spin-spinning']))
    expect(wrapper.find('.am-spin-container').exists()).toBe(false)
    expect(document.body.classList.contains('am-overflow-hidden')).toBe(true)
    await wrapper.setProps({ spinning: false })
    expect(document.body.classList.contains('am-overflow-hidden')).toBe(false)
  })

  it('shows progress with percent', () => {
    const wrapper = mount(Spin, { props: { percent: 50 } })
    expect(wrapper.find('.am-spin-icon-progress').exists()).toBe(true)
    expect(wrapper.find('.am-spin-icon-rail').exists()).toBe(true)
    const track = wrapper.find('.am-spin-icon-track')
    expect(Number(track.attributes('stroke-dashoffset'))).toBeCloseTo(Math.PI * 20, 3)
  })

  it('uses locale for the indicator label', () => {
    const wrapper = mount(ConfigProvider, { props: { locale: enUS }, slots: { default: () => h(Spin) } })
    expect(wrapper.find('svg').attributes('aria-label')).toBe('Loading...')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Spin, {
      props: {
        description: 'x',
        rootClass: 'root-cls',
        classes: { root: 'sem-root', indicator: 'ind', description: 'desc' },
        styles: { description: { color: 'red' } },
      },
      attrs: { 'class': 'custom', 'style': 'margin: 1px', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'sem-root']))
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-spin-indicator').classes()).toContain('ind')
    expect(wrapper.find('.am-spin-description').classes()).toContain('desc')
    expect(wrapper.find('.am-spin-description').attributes('style')).toContain('color: red')
  })
})
