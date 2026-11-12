import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import PullToRefresh from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'

const last = <T>(list: T[] | undefined): T => list![list!.length - 1]

type Wrapper = ReturnType<typeof mount>

function fire(wrapper: Wrapper, type: string, x: number, y: number) {
  const event = new Event(type, { bubbles: true, cancelable: true }) as any
  event.touches = type === 'touchend' ? [] : [{ clientX: x, clientY: y }]
  wrapper.find('.am-pull-to-refresh-track').element.dispatchEvent(event)
  return event as Event
}

async function pull(wrapper: Wrapper, distance: number, release = true) {
  fire(wrapper, 'touchstart', 100, 0)
  fire(wrapper, 'touchmove', 100, 12)
  const last = fire(wrapper, 'touchmove', 100, distance)
  await nextTick()
  if (release) {
    fire(wrapper, 'touchend', 0, 0)
    await nextTick()
  }
  return last
}

describe('PullToRefresh', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders content with the normal status', () => {
    const wrapper = mount(PullToRefresh, { slots: { default: () => h('p', 'content') } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-pull-to-refresh', 'am-pull-to-refresh-normal']))
    expect(wrapper.find('.am-pull-to-refresh-content').text()).toBe('content')
    expect(wrapper.find('.am-pull-to-refresh-head').text()).toBe('')
    expect(wrapper.find('.am-pull-to-refresh-head').attributes('style')).toContain('height: 50px')
  })

  it('follows the finger with damping and shows pulling / canRelease texts', async () => {
    const wrapper = mount(PullToRefresh)
    const track = wrapper.find('.am-pull-to-refresh-track')
    const move = await pull(wrapper, 30, false)
    expect(move.defaultPrevented).toBe(true)
    expect(wrapper.classes()).toContain('am-pull-to-refresh-pulling')
    expect(wrapper.find('.am-pull-to-refresh-head').text()).toBe('下拉刷新')
    expect(track.attributes('style')).toContain('translate3d(0, 30px, 0)')
    expect(track.attributes('style')).toContain('transition-duration: 0ms')

    fire(wrapper, 'touchmove', 100, 80)
    await nextTick()
    // 50 + (80 - 50) / 2
    expect(track.attributes('style')).toContain('translate3d(0, 65px, 0)')
    expect(wrapper.classes()).toContain('am-pull-to-refresh-can-release')
    expect(wrapper.find('.am-pull-to-refresh-head').text()).toBe('释放立即刷新')

    fire(wrapper, 'touchmove', 100, 200)
    await nextTick()
    // 75 + (200 - 100) / 4
    expect(track.attributes('style')).toContain('translate3d(0, 100px, 0)')
  })

  it('releasing past the threshold emits update:refreshing + refresh and shows complete afterwards', async () => {
    const wrapper = mount(PullToRefresh, {
      props: { 'refreshing': false, 'onUpdate:refreshing': (value: boolean) => wrapper.setProps({ refreshing: value }) },
    })
    await pull(wrapper, 100)
    expect(wrapper.emitted('update:refreshing')![0]).toEqual([true])
    await nextTick()
    expect(wrapper.emitted('refresh')).toHaveLength(1)
    expect(wrapper.classes()).toContain('am-pull-to-refresh-refreshing')
    expect(wrapper.find('.am-pull-to-refresh-head').text()).toBe('加载中...')
    expect(wrapper.find('.am-pull-to-refresh-head .am-spin-icon').exists()).toBe(true)
    expect(wrapper.find('.am-pull-to-refresh-track').attributes('style')).toContain('translate3d(0, 50px, 0)')

    // pulling again while refreshing is ignored
    await pull(wrapper, 100)
    expect(wrapper.emitted('refresh')).toHaveLength(1)

    await wrapper.setProps({ refreshing: false })
    expect(wrapper.classes()).toContain('am-pull-to-refresh-complete')
    expect(wrapper.find('.am-pull-to-refresh-head').text()).toBe('刷新成功')
    vi.advanceTimersByTime(500)
    await nextTick()
    expect(wrapper.classes()).toContain('am-pull-to-refresh-normal')
    expect(wrapper.find('.am-pull-to-refresh-track').attributes('style')).not.toContain('translate3d')
  })

  it('works uncontrolled and skips the complete state with completeDelay=0', async () => {
    const wrapper = mount(PullToRefresh, { props: { completeDelay: 0 } })
    await pull(wrapper, 100)
    await nextTick()
    expect(wrapper.emitted('refresh')).toHaveLength(1)
    expect(wrapper.classes()).toContain('am-pull-to-refresh-refreshing')
    await wrapper.setProps({ refreshing: true })
    await wrapper.setProps({ refreshing: false })
    expect(wrapper.classes()).toContain('am-pull-to-refresh-normal')
  })

  it('a short pull bounces back without refreshing', async () => {
    const wrapper = mount(PullToRefresh)
    await pull(wrapper, 30)
    expect(wrapper.emitted('refresh')).toBeUndefined()
    expect(wrapper.classes()).toContain('am-pull-to-refresh-normal')
    const statuses = wrapper.emitted('change')!.map(args => (args[0] as any).status)
    expect(statuses).toContain('pulling')
    expect(last(statuses)).toBe('normal')
  })

  it('threshold / headHeight are configurable', async () => {
    const wrapper = mount(PullToRefresh, { props: { headHeight: 80, threshold: 120 } })
    await pull(wrapper, 100, false)
    expect(wrapper.classes()).toContain('am-pull-to-refresh-pulling')
    fire(wrapper, 'touchmove', 100, 130)
    await nextTick()
    expect(wrapper.classes()).toContain('am-pull-to-refresh-can-release')
    fire(wrapper, 'touchend', 0, 0)
    await nextTick()
    expect(wrapper.find('.am-pull-to-refresh-track').attributes('style')).toContain('translate3d(0, 80px, 0)')
  })

  it('does not hijack horizontal swipes or upward scrolls', async () => {
    const wrapper = mount(PullToRefresh)
    fire(wrapper, 'touchstart', 100, 100)
    const horizontal = fire(wrapper, 'touchmove', 160, 104)
    expect(horizontal.defaultPrevented).toBe(false)
    fire(wrapper, 'touchend', 0, 0)
    fire(wrapper, 'touchstart', 100, 100)
    const up = fire(wrapper, 'touchmove', 100, 20)
    expect(up.defaultPrevented).toBe(false)
    await nextTick()
    expect(wrapper.classes()).toContain('am-pull-to-refresh-normal')
  })

  it('only starts when the scroll parent is at the top', async () => {
    const scroller = document.createElement('div')
    scroller.style.overflowY = 'auto'
    document.body.appendChild(scroller)
    const wrapper = mount(PullToRefresh, { attachTo: scroller })
    scroller.scrollTop = 40
    await pull(wrapper, 100)
    expect(wrapper.emitted('refresh')).toBeUndefined()
    expect(wrapper.classes()).toContain('am-pull-to-refresh-normal')
    scroller.scrollTop = 0
    await pull(wrapper, 100)
    await nextTick()
    expect(wrapper.emitted('refresh')).toHaveLength(1)
  })

  it('disabled (prop or ConfigProvider) ignores the gesture', async () => {
    const wrapper = mount(PullToRefresh, { props: { disabled: true } })
    await pull(wrapper, 100)
    expect(wrapper.emitted('refresh')).toBeUndefined()
    expect(wrapper.classes()).toContain('am-pull-to-refresh-disabled')

    const provider = mount(ConfigProvider, {
      props: { componentDisabled: true },
      slots: { default: () => h(PullToRefresh) },
    })
    expect(provider.find('.am-pull-to-refresh').classes()).toContain('am-pull-to-refresh-disabled')
  })

  it('slots win over text props, text props win over locale', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: {
        default: () => h(
          PullToRefresh,
          { pullingText: 'prop pulling', canReleaseText: ({ distance }: any) => `release ${distance}` },
          { pulling: ({ distance }: any) => h('i', { class: 'slot-pulling' }, `slot ${distance}`) },
        ),
      },
    })
    const inner = wrapper.findComponent(PullToRefresh) as unknown as Wrapper
    await pull(inner, 30, false)
    expect(wrapper.find('.slot-pulling').text()).toBe('slot 30')
    expect(wrapper.text()).not.toContain('prop pulling')
    fire(inner, 'touchmove', 100, 60)
    await nextTick()
    expect(wrapper.find('.am-pull-to-refresh-head').text()).toBe('release 55')
    fire(inner, 'touchend', 0, 0)
    await nextTick()
    expect(wrapper.find('.am-pull-to-refresh-head').text()).toBe(enUS.PullToRefresh.refreshing)
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(PullToRefresh, {
      props: { rootClass: 'root-cls', classes: { head: 'head-cls', content: 'content-cls' }, styles: { content: { minHeight: '100px' } } },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-pull-to-refresh-head').classes()).toContain('head-cls')
    expect(wrapper.find('.am-pull-to-refresh-content').attributes('style')).toContain('min-height: 100px')
  })
})
