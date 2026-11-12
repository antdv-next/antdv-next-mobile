import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import IndexBar, { IndexBarAnchor } from '..'

const letters = ['A', 'B', 'C', 'D']

/** natural top of every anchor in the document, 100px apart */
function mockLayout(scrollY = { value: 0 }) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    let top = 0
    let height = 0
    if (this.classList.contains('am-index-bar-anchor-sentinel')) {
      const index = (this.nextElementSibling as HTMLElement).dataset.index!
      top = letters.indexOf(index) * 100 - scrollY.value
    }
    else if (this.classList.contains('am-index-bar-sidebar')) {
      top = 100
      height = 80
    }
    return { top, height, bottom: top + height, left: 0, right: 0, width: 0, x: 0, y: top, toJSON: () => ({}) } as DOMRect
  })
  vi.spyOn(window, 'scrollY', 'get').mockImplementation(() => scrollY.value)
  window.scrollTo = vi.fn((_x: any, y: any) => {
    scrollY.value = y
  }) as any
  return scrollY
}

function mountBar(props: Record<string, any> = {}) {
  return mount(IndexBar, {
    props,
    attachTo: document.body,
    slots: {
      default: () => letters.flatMap(letter => [
        h(IndexBarAnchor, { index: letter, key: letter }),
        h('div', { class: 'content', key: `c-${letter}` }, `content ${letter}`),
      ]),
    },
  })
}

describe('IndexBar', () => {
  let scrollY: { value: number }

  beforeEach(() => {
    scrollY = mockLayout()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the side bar from its anchors', async () => {
    const wrapper = mountBar()
    await nextTick()
    expect(wrapper.classes()).toContain('am-index-bar')
    expect(wrapper.findAll('.am-index-bar-index').map(e => e.text())).toEqual(letters)
    expect(wrapper.findAll('.am-index-bar-anchor').map(e => e.text())).toEqual(letters)
    expect(wrapper.find('.am-index-bar-anchor').classes()).toContain('am-index-bar-anchor-sticky')
    expect(IndexBar.Anchor).toBe(IndexBarAnchor)
  })

  it('uses indexList when provided and renders the anchor slot', async () => {
    const wrapper = mount(IndexBar, {
      props: { indexList: ['#', 'A'], sticky: false },
      slots: { default: () => h(IndexBarAnchor, { index: 'A', rootClass: 'anchor-cls' }, () => 'Title A') },
    })
    await nextTick()
    expect(wrapper.findAll('.am-index-bar-index').map(e => e.text())).toEqual(['#', 'A'])
    const anchor = wrapper.find('.am-index-bar-anchor')
    expect(anchor.text()).toBe('Title A')
    expect(anchor.classes()).toContain('anchor-cls')
    expect(anchor.classes()).not.toContain('am-index-bar-anchor-sticky')
  })

  it('tracks the active anchor while scrolling and emits change', async () => {
    const wrapper = mountBar()
    await nextTick()
    expect(wrapper.emitted('change')![0]).toEqual(['A'])
    expect(wrapper.findAll('.am-index-bar-index')[0].classes()).toContain('am-index-bar-index-active')
    scrollY.value = 210
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(wrapper.emitted('change')![1]).toEqual(['C'])
    expect(wrapper.findAll('.am-index-bar-index')[2].classes()).toContain('am-index-bar-index-active')
    expect(wrapper.findAll('.am-index-bar-anchor')[2].classes()).toContain('am-index-bar-anchor-active')
  })

  it('respects stickyOffsetTop', async () => {
    const wrapper = mountBar({ stickyOffsetTop: 50 })
    await nextTick()
    expect(wrapper.attributes('style')).toContain('--am-index-bar-sticky-offset-top: 50px')
    scrollY.value = 60
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    // B sits at 100 - 60 = 40 <= 50
    expect(wrapper.emitted('change')!.slice(-1)[0]).toEqual(['B'])
  })

  it('scrolls to an anchor on click and emits select', async () => {
    const wrapper = mountBar()
    await nextTick()
    await wrapper.findAll('.am-index-bar-index')[3].trigger('click')
    expect(wrapper.emitted('select')![0]).toEqual(['D'])
    expect(window.scrollTo).toHaveBeenCalledWith(0, 300)
    expect(wrapper.emitted('change')!.slice(-1)[0]).toEqual(['D'])
  })

  it('jumps while dragging over the side bar and shows a hint', async () => {
    const wrapper = mountBar()
    await nextTick()
    const sidebar = wrapper.find('.am-index-bar-sidebar')
    // side bar: top 100, 4 indexes, 20px each
    await sidebar.trigger('touchstart', { touches: [{ clientX: 0, clientY: 105 }] })
    expect(wrapper.emitted('select')![0]).toEqual(['A'])
    expect(wrapper.find('.am-index-bar-hint').text()).toBe('A')
    await sidebar.trigger('touchmove', { touches: [{ clientX: 0, clientY: 150 }] })
    await sidebar.trigger('touchmove', { touches: [{ clientX: 0, clientY: 155 }] })
    expect(wrapper.emitted('select')).toHaveLength(2)
    expect(wrapper.emitted('select')![1]).toEqual(['C'])
    expect(window.scrollTo).toHaveBeenLastCalledWith(0, 200)
    // clamps outside of the bar
    await sidebar.trigger('touchmove', { touches: [{ clientX: 0, clientY: 999 }] })
    expect(wrapper.emitted('select')![2]).toEqual(['D'])
    await sidebar.trigger('touchend')
    await nextTick()
    // the click synthesized after a touch is ignored
    await wrapper.findAll('.am-index-bar-index')[0].trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(3)
  })

  it('exposes scrollTo', async () => {
    const wrapper = mountBar({ stickyOffsetTop: 40 })
    await nextTick()
    ;(wrapper.vm as any).scrollTo('C')
    expect(window.scrollTo).toHaveBeenCalledWith(0, 160)
    ;(wrapper.vm as any).scrollTo('Z')
    expect(window.scrollTo).toHaveBeenCalledTimes(1)
  })

  it('passes attrs, rootClass, classes, styles and zIndex', async () => {
    const wrapper = mountBar({
      rootClass: 'root-cls',
      zIndex: 20,
      classes: { sidebar: 'sidebar-cls', index: 'index-cls' },
      styles: { index: { color: 'red' } },
    })
    await nextTick()
    await wrapper.setProps({ class: 'custom' } as any)
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['root-cls']))
    expect(wrapper.attributes('style')).toContain('--am-index-bar-z-index: 20')
    expect(wrapper.find('.am-index-bar-sidebar').classes()).toContain('sidebar-cls')
    expect(wrapper.find('.am-index-bar-index').classes()).toContain('index-cls')
    expect(wrapper.find('.am-index-bar-index').attributes('style')).toContain('color: red')
  })

  it('an anchor works outside of IndexBar', () => {
    const wrapper = mount({ render: () => h('div', [h(IndexBarAnchor, { 'index': 'A', 'data-id': 'x' })]) })
    expect(wrapper.find('.am-index-bar-anchor').text()).toBe('A')
    expect(wrapper.find('.am-index-bar-anchor').attributes('data-id')).toBe('x')
  })
})
