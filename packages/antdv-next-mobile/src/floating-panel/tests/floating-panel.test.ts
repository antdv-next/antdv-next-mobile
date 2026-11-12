import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import FloatingPanel from '..'

const last = <T>(list: T[] | undefined): T => list![list!.length - 1]

type Wrapper = ReturnType<typeof mount>

function fire(el: Element, type: string, y = 0, x = 100) {
  const event = new Event(type, { bubbles: true, cancelable: true }) as any
  event.touches = type === 'touchend' ? [] : [{ clientX: x, clientY: y }]
  el.dispatchEvent(event)
  return event as Event
}

/** drags `distance` px (negative = up) starting on `selector`, `duration` ms long */
async function drag(wrapper: Wrapper, distance: number, { selector = '.am-floating-panel-header', duration = 1000, release = true } = {}) {
  const el = wrapper.find(selector).element
  fire(el, 'touchstart', 500)
  fire(el, 'touchmove', 500 + Math.sign(distance) * 12)
  const last = fire(el, 'touchmove', 500 + distance)
  vi.advanceTimersByTime(duration)
  await nextTick()
  if (release) {
    fire(el, 'touchend')
    await nextTick()
  }
  return last
}

const style = (wrapper: Wrapper) => wrapper.attributes('style') ?? ''

describe('FloatingPanel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('innerHeight', 800)
  })
  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('renders header bar + content at the first anchor, default anchors are [100, 60% of the viewport]', async () => {
    const wrapper = mount(FloatingPanel, { slots: { default: () => h('p', 'content') } })
    await nextTick()
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-floating-panel', 'am-floating-panel-safe-area']))
    expect(wrapper.find('.am-floating-panel-bar').exists()).toBe(true)
    expect(wrapper.find('.am-floating-panel-content').text()).toBe('content')
    expect(style(wrapper)).toContain('height: 480px')
    expect(style(wrapper)).toContain('translateY(calc(100% - 100px))')
    expect(style(wrapper)).toContain('transition-duration: 300ms')
  })

  it('follows the finger and snaps to the closest anchor', async () => {
    const wrapper = mount(FloatingPanel, { props: { anchors: [100, 300, 600] } })
    await nextTick()
    const move = await drag(wrapper, -130, { release: false })
    expect(move.defaultPrevented).toBe(true)
    expect(style(wrapper)).toContain('translateY(calc(100% - 230px))')
    expect(style(wrapper)).toContain('transition-duration: 0ms')
    expect(wrapper.classes()).toContain('am-floating-panel-dragging')
    expect(last(wrapper.emitted('heightChange'))).toEqual([230, { animating: false }])

    fire(wrapper.element, 'touchend')
    await nextTick()
    expect(style(wrapper)).toContain('translateY(calc(100% - 300px))')
    expect(last(wrapper.emitted('update:height'))).toEqual([300])
    expect(last(wrapper.emitted('heightChange'))).toEqual([300, { animating: true }])

    // a small drag snaps back
    await drag(wrapper, 40)
    expect(style(wrapper)).toContain('translateY(calc(100% - 300px))')
  })

  it('a fast flick moves to the next anchor in that direction', async () => {
    const wrapper = mount(FloatingPanel, { props: { anchors: [100, 300, 600] } })
    await nextTick()
    await drag(wrapper, -30, { duration: 20 })
    expect(last(wrapper.emitted('update:height'))).toEqual([300])
    await drag(wrapper, -30, { duration: 20 })
    expect(last(wrapper.emitted('update:height'))).toEqual([600])
    await drag(wrapper, 30, { duration: 20 })
    expect(last(wrapper.emitted('update:height'))).toEqual([300])
  })

  it('rubber-bands beyond the first / last anchor', async () => {
    const wrapper = mount(FloatingPanel, {
      props: { 'anchors': [100, 300], 'height': 300, 'onUpdate:height': (value: number) => wrapper.setProps({ height: value }) },
    })
    await nextTick()
    await drag(wrapper, -100, { release: false })
    // 300 + 100 * 0.2
    expect(last(wrapper.emitted('update:height'))).toEqual([320])
    fire(wrapper.element, 'touchend')
    await nextTick()
    expect(last(wrapper.emitted('update:height'))).toEqual([300])

    await wrapper.setProps({ height: 100 })
    await drag(wrapper, 50, { release: false })
    // 100 - 50 * 0.2
    expect(last(wrapper.emitted('update:height'))).toEqual([90])
  })

  it('is controlled by v-model:height', async () => {
    const wrapper = mount(FloatingPanel, {
      props: { 'anchors': [100, 400], 'height': 400, 'onUpdate:height': (value: number) => wrapper.setProps({ height: value }) },
    })
    await nextTick()
    expect(style(wrapper)).toContain('translateY(calc(100% - 400px))')
    await drag(wrapper, 250)
    await nextTick()
    expect(wrapper.props('height')).toBe(100)
    expect(style(wrapper)).toContain('translateY(calc(100% - 100px))')
  })

  it('content drags the panel until it is fully expanded, then scrolls', async () => {
    const wrapper = mount(FloatingPanel, { props: { anchors: [100, 400] }, slots: { default: () => h('p', { class: 'inner' }, 'content') } })
    await nextTick()
    const move = await drag(wrapper, -280, { selector: '.inner' })
    expect(move.defaultPrevented).toBe(true)
    expect(last(wrapper.emitted('update:height'))).toEqual([400])

    // fully expanded: dragging up scrolls the content
    const count = wrapper.emitted('update:height')!.length
    const up = await drag(wrapper, -100, { selector: '.inner' })
    expect(up.defaultPrevented).toBe(false)
    expect(wrapper.emitted('update:height')).toHaveLength(count)

    // content scrolled: dragging down scrolls back first
    const content = wrapper.find('.am-floating-panel-content').element
    content.scrollTop = 50
    await drag(wrapper, 200, { selector: '.inner' })
    expect(wrapper.emitted('update:height')).toHaveLength(count)

    // at scroll top: dragging down collapses the panel
    content.scrollTop = 0
    await drag(wrapper, 250, { selector: '.inner' })
    expect(last(wrapper.emitted('update:height'))).toEqual([100])
  })

  it('contentDraggable=false only drags by the header', async () => {
    const wrapper = mount(FloatingPanel, {
      props: { anchors: [100, 400], contentDraggable: false },
      slots: { default: () => h('p', { class: 'inner' }) },
    })
    await nextTick()
    await drag(wrapper, -280, { selector: '.inner' })
    expect(wrapper.emitted('update:height')).toBeUndefined()
    await drag(wrapper, -280)
    expect(last(wrapper.emitted('update:height'))).toEqual([400])
  })

  it('setHeight is exposed, `immediate` skips the animation', async () => {
    const wrapper = mount(FloatingPanel, { props: { anchors: [100, 400] } })
    await nextTick()
    ;(wrapper.vm as any).setHeight(400)
    await nextTick()
    expect(style(wrapper)).toContain('translateY(calc(100% - 400px))')
    expect(style(wrapper)).toContain('transition-duration: 300ms')
    expect(last(wrapper.emitted('heightChange'))).toEqual([400, { animating: true }])

    ;(wrapper.vm as any).setHeight(100, { immediate: true })
    await nextTick()
    expect(style(wrapper)).toContain('translateY(calc(100% - 100px))')
    expect(style(wrapper)).toContain('transition-duration: 0ms')
    expect(last(wrapper.emitted('heightChange'))).toEqual([100, { animating: false }])
    vi.advanceTimersByTime(100)
    await nextTick()
    expect(style(wrapper)).toContain('transition-duration: 300ms')
  })

  it('snaps to the closest anchor when the anchors change', async () => {
    const wrapper = mount(FloatingPanel, { props: { anchors: [100, 400] } })
    await nextTick()
    await wrapper.setProps({ anchors: [150, 500] })
    expect(last(wrapper.emitted('update:height'))).toEqual([150])
    expect(style(wrapper)).toContain('height: 500px')
  })

  it('locks page scroll while dragging, or always with lockScroll', async () => {
    const wrapper = mount(FloatingPanel, { props: { anchors: [100, 400] } })
    await nextTick()
    expect(document.body.classList.contains('am-overflow-hidden')).toBe(false)
    await drag(wrapper, -50, { release: false })
    expect(document.body.classList.contains('am-overflow-hidden')).toBe(true)
    fire(wrapper.element, 'touchend')
    await nextTick()
    expect(document.body.classList.contains('am-overflow-hidden')).toBe(false)
    await wrapper.setProps({ lockScroll: true })
    expect(document.body.classList.contains('am-overflow-hidden')).toBe(true)
  })

  it('fixed=false positions the panel inside its parent and derives anchors from it', async () => {
    vi.spyOn(HTMLElement.prototype, 'offsetParent', 'get').mockImplementation(function (this: HTMLElement) {
      return this.parentElement
    })
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(500)
    const wrapper = mount(FloatingPanel, { props: { fixed: false, safeArea: false, zIndex: 5 }, attachTo: document.body })
    await nextTick()
    expect(wrapper.classes()).toContain('am-floating-panel-absolute')
    expect(wrapper.classes()).not.toContain('am-floating-panel-safe-area')
    expect(style(wrapper)).toContain('height: 300px')
    expect(style(wrapper)).toContain('z-index: 5')
  })

  it('header slot replaces the bar; passes attrs, rootClass, classes and styles', async () => {
    const wrapper = mount(FloatingPanel, {
      props: { rootClass: 'root-cls', classes: { header: 'header-cls', content: 'content-cls' }, styles: { content: { padding: '8px' } } },
      attrs: { 'class': 'custom', 'data-id': 'x' },
      slots: { header: () => h('i', { class: 'my-header' }) },
    })
    await nextTick()
    expect(wrapper.find('.am-floating-panel-bar').exists()).toBe(false)
    expect(wrapper.find('.am-floating-panel-header .my-header').exists()).toBe(true)
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-floating-panel-header').classes()).toContain('header-cls')
    expect(wrapper.find('.am-floating-panel-content').attributes('style')).toContain('padding: 8px')
  })
})
