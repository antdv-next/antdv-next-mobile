import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import NoticeBar from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'

/** jsdom has no layout: fake the measured widths of the wrapper and of the text. */
function mockWidths(wrap: number, content: number) {
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(function (this: HTMLElement) {
    return this.classList.contains('am-notice-bar-content') ? content : 0
  })
  return vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
    if (this.classList.contains('am-notice-bar-wrapper'))
      return wrap
    if (this.classList.contains('am-notice-bar-content'))
      return Math.min(wrap, content)
    return 0
  })
}

async function flush(ms: number) {
  await vi.advanceTimersByTimeAsync(ms)
  await nextTick()
}

describe('NoticeBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders content with default classes and icon', () => {
    const wrapper = mount(NoticeBar, { props: { content: 'Notice' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'am-notice-bar',
      'am-notice-bar-warning',
      'am-notice-bar-rectangular',
      'am-notice-bar-bordered-block',
    ]))
    expect(wrapper.find('.am-notice-bar-content').text()).toBe('Notice')
    expect(wrapper.find('.am-notice-bar-icon .anticon').exists()).toBe(true)
    expect(wrapper.find('.am-notice-bar-close').exists()).toBe(false)
    expect(wrapper.find('.am-notice-bar-extra').exists()).toBe(false)
  })

  it('supports color / shape / bordered / wrap', () => {
    const wrapper = mount(NoticeBar, { props: { color: 'error', shape: 'rounded', bordered: true, wrap: true } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'am-notice-bar-error',
      'am-notice-bar-rounded',
      'am-notice-bar-bordered',
      'am-notice-bar-wrap',
    ]))
    const none = mount(NoticeBar, { props: { bordered: false } })
    expect(none.classes()).not.toContain('am-notice-bar-bordered')
    expect(none.classes()).not.toContain('am-notice-bar-bordered-block')
  })

  it('slots win over props; icon can be hidden', () => {
    const wrapper = mount(NoticeBar, {
      props: { content: 'prop', icon: () => h('i', { class: 'prop-icon' }), extra: 'prop-extra' },
      slots: { default: 'slot', icon: () => h('i', { class: 'slot-icon' }), extra: 'slot-extra' },
    })
    expect(wrapper.find('.am-notice-bar-content').text()).toBe('slot')
    expect(wrapper.find('.slot-icon').exists()).toBe(true)
    expect(wrapper.find('.prop-icon').exists()).toBe(false)
    expect(wrapper.find('.am-notice-bar-extra').text()).toBe('slot-extra')

    const byProp = mount(NoticeBar, { props: { icon: () => h('i', { class: 'prop-icon' }), extra: 'prop-extra' } })
    expect(byProp.find('.prop-icon').exists()).toBe(true)
    expect(byProp.find('.am-notice-bar-extra').text()).toBe('prop-extra')

    expect(mount(NoticeBar, { props: { icon: null } }).find('.am-notice-bar-icon').exists()).toBe(false)
    expect(mount(NoticeBar, { props: { icon: false } }).find('.am-notice-bar-icon').exists()).toBe(false)
  })

  it('emits click and close, then hides', async () => {
    const onClick = vi.fn()
    const onClose = vi.fn()
    const wrapper = mount(NoticeBar, {
      props: { content: 'Notice', closable: true, closeIcon: () => h('i', { class: 'x' }) },
      attrs: { onClick, onClose },
    })
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.am-notice-bar-close .x').exists()).toBe(true)
    await wrapper.find('.am-notice-bar-close').trigger('click')
    expect(onClose).toHaveBeenCalledTimes(1)
    // closing does not count as a click on the bar
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.am-notice-bar').exists()).toBe(false)
  })

  it('does not scroll when the text fits', async () => {
    mockWidths(300, 120)
    const wrapper = mount(NoticeBar, { props: { content: 'short', delay: 100 } })
    await flush(1000)
    expect(wrapper.classes()).not.toContain('am-notice-bar-scrolling')
    expect(wrapper.find('.am-notice-bar-content').attributes('style')).toBeUndefined()
  })

  it('scrolls after the delay when the text overflows, then loops', async () => {
    mockWidths(300, 600)
    const onReplay = vi.fn()
    const wrapper = mount(NoticeBar, { props: { content: 'long', delay: 500, speed: 100 }, attrs: { onReplay } })
    await flush(100)
    expect(wrapper.classes()).not.toContain('am-notice-bar-scrolling')
    await flush(600)
    expect(wrapper.classes()).toContain('am-notice-bar-scrolling')
    const content = wrapper.find('.am-notice-bar-content')
    // first round: 0 -> -600px at 100px/s
    expect(content.attributes('style')).toContain('translate3d(-600px, 0, 0)')
    expect(content.attributes('style')).toContain('transition-duration: 6s')

    await content.trigger('transitionend')
    expect(onReplay).toHaveBeenCalledTimes(1)
    // next rounds enter from the end edge
    expect(content.attributes('style')).toContain('translate3d(300px, 0, 0)')
    expect(content.attributes('style')).toContain('transition-duration: 0s')
    await flush(100)
    expect(content.attributes('style')).toContain('translate3d(-600px, 0, 0)')
    expect(content.attributes('style')).toContain('transition-duration: 9s')
  })

  it('scrollable forces / disables the marquee', async () => {
    mockWidths(300, 120)
    const forced = mount(NoticeBar, { props: { content: 'short', scrollable: true, delay: 0 } })
    await flush(100)
    expect(forced.classes()).toContain('am-notice-bar-scrolling')

    vi.restoreAllMocks()
    mockWidths(300, 600)
    const disabled = mount(NoticeBar, { props: { content: 'long', scrollable: false, delay: 0 } })
    await flush(100)
    expect(disabled.classes()).not.toContain('am-notice-bar-scrolling')
    const wrapped = mount(NoticeBar, { props: { content: 'long', wrap: true, delay: 0 } })
    await flush(100)
    expect(wrapped.classes()).not.toContain('am-notice-bar-scrolling')
  })

  it('scrolls to the other side in rtl', async () => {
    mockWidths(300, 600)
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: { default: () => h(NoticeBar, { content: 'long', delay: 0, speed: 100 }) },
    })
    await flush(100)
    expect(wrapper.find('.am-notice-bar-content').attributes('style')).toContain('translate3d(600px, 0, 0)')
  })

  it('restarts when content changes and exposes reset', async () => {
    const spy = mockWidths(300, 600)
    const wrapper = mount(NoticeBar, { props: { content: 'long', delay: 0 } })
    await flush(100)
    expect(wrapper.classes()).toContain('am-notice-bar-scrolling')
    spy.mockRestore()
    vi.restoreAllMocks()
    mockWidths(300, 100)
    await wrapper.setProps({ content: 'short' })
    await flush(100)
    expect(wrapper.classes()).not.toContain('am-notice-bar-scrolling')
    expect(typeof (wrapper.vm as any).reset).toBe('function')
  })

  it('uses locale for the close label', () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(NoticeBar, { closable: true }) },
    })
    expect(wrapper.find('.am-notice-bar-close').attributes('aria-label')).toBe('Close')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(NoticeBar, {
      props: {
        content: 'c',
        extra: 'e',
        closable: true,
        rootClass: 'root-cls',
        classes: { root: 'r', icon: 'i', content: 'c', extra: 'e', close: 'x' },
        styles: { content: { color: 'red' } },
      },
      attrs: { 'class': 'custom', 'style': 'margin: 1px', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r']))
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-notice-bar-icon').classes()).toContain('i')
    expect(wrapper.find('.am-notice-bar-content').classes()).toContain('c')
    expect(wrapper.find('.am-notice-bar-content').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-notice-bar-extra').classes()).toContain('e')
    expect(wrapper.find('.am-notice-bar-close').classes()).toContain('x')
  })
})
