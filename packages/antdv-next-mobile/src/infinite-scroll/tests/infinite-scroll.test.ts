import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import InfiniteScroll from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'

/** bottom of the list sentinel relative to the viewport */
let sentinelBottom = 0
let sentinelTop = 0

function mockRect() {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    if (this.classList.contains('am-infinite-scroll-placeholder'))
      return { top: sentinelTop, bottom: sentinelBottom, left: 0, right: 0, width: 0, height: 0 } as DOMRect
    // scroll container
    return { top: 100, bottom: 500, left: 0, right: 0, width: 0, height: 400 } as DOMRect
  })
}

describe('InfiniteScroll', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    sentinelBottom = 0
    sentinelTop = 0
  })

  it('checks on mount and emits load + update:loading when the end is within the threshold', async () => {
    const wrapper = mount(InfiniteScroll, { slots: { default: () => h('p', 'list') } })
    await flushPromises()
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-infinite-scroll', 'am-infinite-scroll-down']))
    expect(wrapper.text()).toContain('list')
    expect(wrapper.emitted('load')).toHaveLength(1)
    expect(wrapper.emitted('update:loading')![0]).toEqual([true])
    // uncontrolled: shows the loading indicator by itself
    expect(wrapper.find('.am-infinite-scroll-loading').text()).toBe('加载中...')
    expect(wrapper.find('.am-infinite-scroll-loading .am-spin-icon').exists()).toBe(true)
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('immediateCheck=false waits for a scroll', async () => {
    const wrapper = mount(InfiniteScroll, { props: { immediateCheck: false } })
    await flushPromises()
    expect(wrapper.emitted('load')).toBeUndefined()
    window.dispatchEvent(new Event('scroll'))
    await flushPromises()
    expect(wrapper.emitted('load')).toHaveLength(1)
  })

  it('does not load while loading, and loads the next page when loading turns false', async () => {
    const wrapper = mount(InfiniteScroll, { props: { loading: true } })
    await flushPromises()
    expect(wrapper.emitted('load')).toBeUndefined()
    await wrapper.setProps({ loading: false })
    await flushPromises()
    expect(wrapper.emitted('load')).toHaveLength(1)
    // controlled: still false until the parent applies it, and exposed check() works
    ;(wrapper.vm as any).check()
    await flushPromises()
    expect(wrapper.emitted('load')).toHaveLength(2)
  })

  it('stops when finished / hasMore=false and shows the finished text', async () => {
    const wrapper = mount(InfiniteScroll, { props: { hasMore: false } })
    await flushPromises()
    expect(wrapper.emitted('load')).toBeUndefined()
    expect(wrapper.find('.am-infinite-scroll-finished').text()).toBe('没有更多了')

    const finished = mount(InfiniteScroll, { props: { finished: true, finishedText: 'the end' } })
    await flushPromises()
    expect(finished.emitted('load')).toBeUndefined()
    expect(finished.find('.am-infinite-scroll-finished').text()).toBe('the end')
  })

  it('shows the error hint and retries on tap', async () => {
    const wrapper = mount(InfiniteScroll, {
      props: { 'error': true, 'onUpdate:error': (value: boolean) => wrapper.setProps({ error: value }) },
    })
    await flushPromises()
    expect(wrapper.emitted('load')).toBeUndefined()
    const hint = wrapper.find('.am-infinite-scroll-error')
    expect(hint.text()).toContain('加载失败')
    expect(hint.find('.am-infinite-scroll-retry').text()).toBe('重新加载')
    await hint.trigger('click')
    await flushPromises()
    expect(wrapper.emitted('update:error')![0]).toEqual([false])
    expect(wrapper.emitted('load')).toHaveLength(1)
    expect(wrapper.find('.am-infinite-scroll-error').exists()).toBe(false)
  })

  it('disabled (prop or ConfigProvider) never loads', async () => {
    const wrapper = mount(InfiniteScroll, { props: { disabled: true } })
    await flushPromises()
    window.dispatchEvent(new Event('scroll'))
    await flushPromises()
    expect(wrapper.emitted('load')).toBeUndefined()

    const provider = mount(ConfigProvider, {
      props: { componentDisabled: true },
      slots: { default: () => h(InfiniteScroll) },
    })
    await flushPromises()
    expect(provider.findComponent(InfiniteScroll).emitted('load')).toBeUndefined()
  })

  it('listens to the nearest scroll container and respects the threshold', async () => {
    mockRect()
    sentinelBottom = 900
    const scroller = document.createElement('div')
    scroller.style.overflowY = 'auto'
    document.body.appendChild(scroller)
    const wrapper = mount(InfiniteScroll, { props: { threshold: 100 }, attachTo: scroller })
    await flushPromises()
    expect(wrapper.emitted('load')).toBeUndefined()

    // 601 - 500 > 100
    sentinelBottom = 601
    scroller.dispatchEvent(new Event('scroll'))
    await flushPromises()
    expect(wrapper.emitted('load')).toBeUndefined()

    sentinelBottom = 600
    scroller.dispatchEvent(new Event('scroll'))
    await flushPromises()
    expect(wrapper.emitted('load')).toHaveLength(1)
  })

  it('direction=up renders the indicator before the list and loads near the top', async () => {
    mockRect()
    sentinelTop = -400
    const scroller = document.createElement('div')
    scroller.style.overflowY = 'scroll'
    document.body.appendChild(scroller)
    const wrapper = mount(InfiniteScroll, {
      props: { direction: 'up', threshold: 50 },
      slots: { default: () => h('p', { class: 'list' }) },
      attachTo: scroller,
    })
    await flushPromises()
    expect(wrapper.classes()).toContain('am-infinite-scroll-up')
    const children = (Array.from(wrapper.element.children) as Element[]).map(el => el.className)
    expect(children.indexOf('list')).toBeGreaterThan(children.indexOf('am-infinite-scroll-placeholder'))
    expect(wrapper.emitted('load')).toBeUndefined()
    // 100 - 60 <= 50
    sentinelTop = 60
    scroller.dispatchEvent(new Event('scroll'))
    await flushPromises()
    expect(wrapper.emitted('load')).toHaveLength(1)
  })

  it('does not load while hidden', async () => {
    const wrapper = mount(InfiniteScroll, { attrs: { style: 'display: none' }, attachTo: document.body })
    await flushPromises()
    expect(wrapper.emitted('load')).toBeUndefined()
  })

  it('slots win over text props, text props win over locale', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: {
        default: () => h(
          InfiniteScroll,
          { loading: true, loadingText: 'prop loading' },
          { loading: () => h('i', { class: 'slot-loading' }) },
        ),
      },
    })
    await nextTick()
    expect(wrapper.find('.slot-loading').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('prop loading')

    const byProp = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => [h(InfiniteScroll, { loading: true, loadingText: 'prop loading' }), h(InfiniteScroll, { finished: true })] },
    })
    expect(byProp.findAll('.am-infinite-scroll')[0].text()).toBe('prop loading')
    expect(byProp.findAll('.am-infinite-scroll')[1].text()).toBe(enUS.InfiniteScroll.noMore)

    const errorSlot = mount(InfiniteScroll, { props: { error: true, errorText: 'prop error' }, slots: { error: () => 'slot error' } })
    expect(errorSlot.find('.am-infinite-scroll-error').text()).toBe('slot error')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(InfiniteScroll, {
      props: { rootClass: 'root-cls', classes: { indicator: 'ind-cls' }, styles: { indicator: { minHeight: '10px' } } },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-infinite-scroll-indicator').classes()).toContain('ind-cls')
    expect(wrapper.find('.am-infinite-scroll-indicator').attributes('style')).toContain('min-height: 10px')
  })
})
