import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Affix from '..'

/** viewport rect of the affix wrapper (the placeholder position) */
let rootRect = { top: 200, bottom: 240, left: 16, width: 300, height: 40 }
/** viewport rect of a custom scroll container */
let containerRect = { top: 100, bottom: 500, left: 0, width: 375, height: 400 }

function mockRects() {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const rect = this.classList.contains('am-affix-wrapper') ? rootRect : containerRect
    return { ...rect, right: rect.left + rect.width } as DOMRect
  })
}

async function flush() {
  vi.advanceTimersByTime(50)
  await flushPromises()
}

async function scroll(target: EventTarget = window) {
  target.dispatchEvent(new Event('scroll'))
  await flush()
}

describe('Affix', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    rootRect = { top: 200, bottom: 240, left: 16, width: 300, height: 40 }
    containerRect = { top: 100, bottom: 500, left: 0, width: 375, height: 400 }
    mockRects()
    vi.stubGlobal('innerHeight', 600)
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('renders the content in the normal flow by default', async () => {
    const wrapper = mount(Affix, { slots: { default: () => h('button', 'content') } })
    await flush()
    expect(wrapper.classes()).toContain('am-affix-wrapper')
    expect(wrapper.find('.am-affix').exists()).toBe(false)
    expect(wrapper.find('.am-affix-placeholder').exists()).toBe(false)
    expect(wrapper.text()).toBe('content')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('pins to the top (offsetTop defaults to 0), keeps a placeholder and emits change', async () => {
    const wrapper = mount(Affix, { slots: { default: () => 'content' } })
    await flush()
    rootRect = { ...rootRect, top: -10, bottom: 30 }
    await scroll()
    const affix = wrapper.find('.am-affix')
    expect(affix.attributes('style')).toContain('position: fixed')
    expect(affix.attributes('style')).toContain('top: 0px')
    expect(affix.attributes('style')).toContain('width: 300px')
    expect(affix.attributes('style')).toContain('height: 40px')
    const placeholder = wrapper.find('.am-affix-placeholder')
    expect(placeholder.attributes('style')).toContain('width: 300px')
    expect(placeholder.attributes('style')).toContain('height: 40px')
    expect(wrapper.emitted('change')).toEqual([[true]])

    rootRect = { ...rootRect, top: 20, bottom: 60 }
    await scroll()
    expect(wrapper.find('.am-affix').exists()).toBe(false)
    expect(wrapper.emitted('change')).toEqual([[true], [false]])
  })

  it('respects offsetTop and zIndex', async () => {
    const wrapper = mount(Affix, { props: { offsetTop: 50, zIndex: 99 } })
    await flush()
    expect(wrapper.find('.am-affix').exists()).toBe(false)
    rootRect = { ...rootRect, top: 49, bottom: 89 }
    await scroll()
    expect(wrapper.find('.am-affix').attributes('style')).toContain('top: 50px')
    expect(wrapper.find('.am-affix').attributes('style')).toContain('z-index: 99')
  })

  it('pins to the bottom with offsetBottom', async () => {
    rootRect = { ...rootRect, top: 700, bottom: 740 }
    const wrapper = mount(Affix, { props: { offsetBottom: 20 } })
    await flush()
    expect(wrapper.find('.am-affix').attributes('style')).toContain('bottom: 20px')
    expect(wrapper.emitted('change')).toEqual([[true]])
    // offsetTop is not applied when only offsetBottom is set
    rootRect = { ...rootRect, top: -100, bottom: -60 }
    await scroll()
    expect(wrapper.find('.am-affix').exists()).toBe(false)
  })

  it('works with a custom scroll container', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const wrapper = mount(Affix, { props: { offsetTop: 10, target: () => container }, attachTo: container })
    await flush()
    expect(wrapper.find('.am-affix').exists()).toBe(false)

    rootRect = { ...rootRect, top: 105, bottom: 145 }
    await scroll(container)
    // container top (100) + offsetTop (10)
    expect(wrapper.find('.am-affix').attributes('style')).toContain('top: 110px')

    // the page scrolls: the container (and the pinned element) moves
    containerRect = { ...containerRect, top: 60, bottom: 460 }
    rootRect = { ...rootRect, top: 65, bottom: 105 }
    await scroll(window)
    expect(wrapper.find('.am-affix').attributes('style')).toContain('top: 70px')
  })

  it('pins to the bottom of a custom container', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    rootRect = { ...rootRect, top: 520, bottom: 560 }
    const wrapper = mount(Affix, { props: { offsetBottom: 0, target: () => container }, attachTo: container })
    await flush()
    // innerHeight (600) - container bottom (500)
    expect(wrapper.find('.am-affix').attributes('style')).toContain('bottom: 100px')
  })

  it('re-measures on resize and via updatePosition', async () => {
    const wrapper = mount(Affix)
    await flush()
    rootRect = { ...rootRect, top: -10, bottom: 30 }
    await scroll()
    expect(wrapper.find('.am-affix').attributes('style')).toContain('width: 300px')

    rootRect = { ...rootRect, width: 340 }
    window.dispatchEvent(new Event('resize'))
    await flush()
    expect(wrapper.find('.am-affix').attributes('style')).toContain('width: 340px')
    // still pinned: no extra change event
    expect(wrapper.emitted('change')).toEqual([[true]])

    rootRect = { ...rootRect, top: 300, bottom: 340 }
    ;(wrapper.vm as any).updatePosition()
    await flush()
    expect(wrapper.find('.am-affix').exists()).toBe(false)
    expect(wrapper.emitted('change')).toEqual([[true], [false]])
  })

  it('reacts to offset prop changes', async () => {
    rootRect = { ...rootRect, top: 30, bottom: 70 }
    const wrapper = mount(Affix)
    await flush()
    expect(wrapper.find('.am-affix').exists()).toBe(false)
    await wrapper.setProps({ offsetTop: 40 })
    await flush()
    expect(wrapper.find('.am-affix').attributes('style')).toContain('top: 40px')
  })

  it('removes its listeners on unmount', async () => {
    const remove = vi.spyOn(window, 'removeEventListener')
    const wrapper = mount(Affix)
    await flush()
    wrapper.unmount()
    expect(remove.mock.calls.map(call => call[0])).toEqual(expect.arrayContaining(['scroll', 'resize']))
  })

  it('passes attrs, rootClass, classes and styles', async () => {
    const wrapper = mount(Affix, {
      props: { rootClass: 'root-cls', classes: { affix: 'affix-cls' }, styles: { affix: { background: 'red' } } },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    await flush()
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.affix-cls').attributes('style')).toContain('background: red')
  })
})
