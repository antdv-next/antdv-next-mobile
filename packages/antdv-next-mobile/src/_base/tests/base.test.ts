import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { BaseBadge, Portal, Spinner } from '..'
import { isRenderable } from '../../_util'
import { useClickAway, useVirtualRange } from '../../_util/hooks'
import ConfigProvider from '../../config-provider'

describe('base layer', () => {
  it('Portal teleports to body with the provider theme, or renders in place', () => {
    const render = (props: Record<string, any>) => () =>
      h(Portal, props, { default: ({ theme, teleported }: any) => h('div', { class: ['layer', theme.class], style: theme.style, 'data-t': String(teleported) }) })

    const wrapper = mount(ConfigProvider, {
      props: { theme: { algorithm: 'dark', token: { colorPrimary: 'red' } } },
      slots: { default: render({}) },
    })
    const layer = document.body.querySelector<HTMLElement>('.layer')!
    expect(layer.parentElement).toBe(document.body)
    expect(layer.classList.contains('am-theme-dark')).toBe(true)
    expect(layer.style.getPropertyValue('--am-color-primary')).toBe('red')
    expect(layer.dataset.t).toBe('true')
    wrapper.unmount()

    const inline = mount(ConfigProvider, { slots: { default: render({ getContainer: false }) } })
    expect(inline.find('.layer').exists()).toBe(true)
    expect(inline.find('.layer').attributes('data-t')).toBe('false')

    const fallback = mount(ConfigProvider, { slots: { default: render({ fallback: 'inline' }) } })
    expect(fallback.find('.layer').exists()).toBe(true)
  })

  it('Portal honours ConfigProvider getPopupContainer and its own getContainer', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)
    const wrapper = mount(ConfigProvider, {
      props: { getPopupContainer: () => target },
      slots: { default: () => h(Portal, null, { default: () => h('i', { class: 'x' }) }) },
    })
    expect(target.querySelector('.x')).not.toBeNull()
    wrapper.unmount()
  })

  it('Spinner renders the shared spinning icon', () => {
    const wrapper = mount(Spinner)
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-spinner', 'am-spin-icon']))
  })

  it('BaseBadge handles count, overflow, zero, dot and color', () => {
    expect(mount(BaseBadge, { props: { count: 5 } }).text()).toBe('5')
    expect(mount(BaseBadge, { props: { count: 120 } }).text()).toBe('99+')
    expect(mount(BaseBadge, { props: { count: 12, overflowCount: 9 } }).text()).toBe('9+')
    expect(mount(BaseBadge, { props: { count: 'new' } }).text()).toBe('new')
    expect(mount(BaseBadge, { props: { count: 0 } }).find('.am-base-badge').exists()).toBe(false)
    expect(mount(BaseBadge, { props: { count: 0, showZero: true } }).text()).toBe('0')
    expect(mount(BaseBadge).find('.am-base-badge').exists()).toBe(false)
    const dot = mount(BaseBadge, { props: { count: true, color: 'blue' } })
    expect(dot.classes()).toContain('am-base-badge-dot')
    expect(dot.text()).toBe('')
    expect(dot.attributes('style')).toContain('background: blue')
    expect(mount(BaseBadge, { props: { dot: true, count: 3 } }).classes()).toContain('am-base-badge-dot')
  })

  it('isRenderable', () => {
    expect(isRenderable(false)).toBe(false)
    expect(isRenderable('')).toBe(false)
    expect(isRenderable(undefined)).toBe(false)
    expect(isRenderable(0)).toBe(true)
    expect(isRenderable('a')).toBe(true)
  })

  it('useClickAway fires only for outside events while enabled', () => {
    const listener = vi.fn()
    const enabled = ref(true)
    const Comp = defineComponent({
      setup() {
        const el = ref<HTMLElement>()
        useClickAway(el, listener, { enabled: () => enabled.value })
        return () => h('div', { ref: el, class: 'inside' }, [h('b', { class: 'child' })])
      },
    })
    const wrapper = mount(Comp, { attachTo: document.body })
    wrapper.find('.child').element.dispatchEvent(new Event('click', { bubbles: true }))
    expect(listener).not.toHaveBeenCalled()
    document.body.dispatchEvent(new Event('click', { bubbles: true }))
    expect(listener).toHaveBeenCalledTimes(1)
    enabled.value = false
    document.body.dispatchEvent(new Event('click', { bubbles: true }))
    expect(listener).toHaveBeenCalledTimes(1)
    wrapper.unmount()
    document.body.dispatchEvent(new Event('click', { bubbles: true }))
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('useVirtualRange: fixed sizes', () => {
    const scroll = ref(0)
    const range = useVirtualRange({ count: () => 1000, size: () => 40, scrollOffset: () => scroll.value, viewportSize: () => 200, overscan: () => 2 })
    expect([range.start.value, range.end.value]).toEqual([0, 8])
    expect(range.totalSize.value).toBe(40000)
    scroll.value = 4000
    expect([range.start.value, range.end.value]).toEqual([98, 108])
    expect(range.offsetBefore.value).toBe(98 * 40)
    expect(range.offsetAfter.value).toBe(40000 - 108 * 40)
    expect(range.indexAt(85)).toBe(2)
    scroll.value = 1e9
    expect(range.end.value).toBe(1000)
  })

  it('useVirtualRange: variable sizes, empty and disabled', () => {
    const sizes = [100, 20, 20, 300, 50]
    const scroll = ref(0)
    const range = useVirtualRange({ count: () => sizes.length, size: () => (i: number) => sizes[i], scrollOffset: () => scroll.value, viewportSize: () => 100, overscan: () => 0 })
    expect(range.totalSize.value).toBe(490)
    expect([range.start.value, range.end.value]).toEqual([0, 2])
    scroll.value = 150
    expect([range.start.value, range.end.value]).toEqual([3, 4])
    expect(range.offsetOf(3)).toBe(140)
    expect(range.sizeOf(3)).toBe(300)
    expect(range.indexAt(489)).toBe(4)

    const empty = useVirtualRange({ count: () => 0, size: () => 40, scrollOffset: () => 0, viewportSize: () => 100 })
    expect([empty.start.value, empty.end.value, empty.totalSize.value]).toEqual([0, 0, 0])

    const all = useVirtualRange({ count: () => 50, size: () => 40, scrollOffset: () => 0, viewportSize: () => 100, enabled: () => false })
    expect([all.start.value, all.end.value]).toEqual([0, 50])
  })
})
