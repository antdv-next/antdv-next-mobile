import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Draggable from '..'
import ConfigProvider from '../../config-provider'

function touches(clientX: number, clientY: number) {
  return { touches: [{ clientX, clientY }] }
}

function mockRect(el: Element, rect: { left: number, top: number, width: number, height: number }) {
  el.getBoundingClientRect = () => ({
    ...rect,
    x: rect.left,
    y: rect.top,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
    toJSON() {},
  }) as DOMRect
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function mountDraggable(props: Record<string, any> = {}, attrs: Record<string, any> = {}) {
  const wrapper = mount(Draggable, {
    props,
    attrs,
    slots: { default: ({ dragging }: { dragging: boolean }) => h('span', { class: 'inner' }, dragging ? 'dragging' : 'idle') },
    attachTo: document.body,
  })
  const root = wrapper.find('.am-draggable')
  mockRect(root.element, { left: 100, top: 200, width: 50, height: 50 })
  return { wrapper, root }
}

describe('Draggable', () => {
  it('renders the slot in place with attrs, rootClass, classes and styles on the root', () => {
    const { wrapper, root } = mountDraggable(
      { rootClass: 'root-a', classes: { root: 'root-b' }, styles: { root: { color: 'red' } }, zIndex: 5 },
      { 'class': 'custom', 'data-id': 'x' },
    )
    expect(root.classes()).toEqual(expect.arrayContaining(['am-draggable', 'root-a', 'root-b', 'custom']))
    expect(root.attributes('data-id')).toBe('x')
    expect(root.attributes('style')).toContain('color: red')
    expect(root.attributes('style')).toContain('z-index: 5')
    expect(root.find('.inner').text()).toBe('idle')
    // rendered where it was declared
    expect(wrapper.element.parentElement?.querySelector('.am-draggable')).toBe(root.element)
  })

  it('follows the finger, stays inside the viewport and emits', async () => {
    const { wrapper, root } = mountDraggable()
    await root.trigger('touchstart', touches(110, 210))
    expect(root.classes()).toContain('am-draggable-dragging')
    expect(root.find('.inner').text()).toBe('dragging')
    expect(wrapper.emitted('dragStart')).toHaveLength(1)
    await root.trigger('touchmove', touches(210, 260))
    expect(root.attributes('style')).toContain('translate3d(200px, 250px, 0)')
    // jsdom viewport: 1024 x 768
    await root.trigger('touchmove', touches(5000, -5000))
    expect(root.attributes('style')).toContain('translate3d(974px, 0px, 0)')
    await root.trigger('touchend')
    expect(root.classes()).not.toContain('am-draggable-dragging')
    expect(wrapper.emitted('update:offset')![0]).toEqual([{ x: 974, y: 0 }])
    expect(wrapper.emitted('offsetChange')![0]).toEqual([{ x: 974, y: 0 }])
    expect(wrapper.emitted('dragEnd')![0]).toEqual([{ x: 974, y: 0 }])
  })

  it('swallows the click that ends a drag, keeps plain taps', async () => {
    const { wrapper, root } = mountDraggable()
    await root.trigger('touchstart', touches(110, 210))
    await root.trigger('touchmove', touches(112, 211))
    await root.trigger('touchend')
    expect(wrapper.emitted('update:offset')).toBeUndefined()
    await root.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)

    await root.trigger('touchstart', touches(110, 210))
    await root.trigger('touchmove', touches(300, 300))
    await root.trigger('touchend')
    await root.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    await wait(10)
    await root.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(2)
  })

  it('axis restricts the direction', async () => {
    const { wrapper, root } = mountDraggable({ axis: 'x' })
    await root.trigger('touchstart', touches(110, 210))
    await root.trigger('touchmove', touches(310, 510))
    await root.trigger('touchend')
    expect(wrapper.emitted('update:offset')![0]).toEqual([{ x: 300, y: 200 }])
    await wrapper.setProps({ axis: 'y' })
    await root.trigger('touchstart', touches(310, 210))
    await root.trigger('touchmove', touches(10, 310))
    await root.trigger('touchend')
    expect(wrapper.emitted('update:offset')![1]).toEqual([{ x: 300, y: 300 }])
  })

  it('magnetic snaps to the nearest edge, respecting a per-side gap', async () => {
    const { wrapper, root } = mountDraggable({ magnetic: 'x', gap: { left: 8, right: 24, top: 40 } })
    await root.trigger('touchstart', touches(110, 210))
    await root.trigger('touchmove', touches(210, 10))
    await root.trigger('touchend')
    expect(wrapper.emitted('update:offset')![0]).toEqual([{ x: 8, y: 40 }])
    await root.trigger('touchstart', touches(110, 210))
    await root.trigger('touchmove', touches(910, 210))
    await root.trigger('touchend')
    // 1024 - 50 - 24
    expect(wrapper.emitted('update:offset')![1]).toEqual([{ x: 950, y: 40 }])

    await wrapper.setProps({ magnetic: 'y', gap: 10 })
    await root.trigger('touchstart', touches(0, 0))
    await root.trigger('touchmove', touches(0, 600))
    await root.trigger('touchend')
    // 768 - 50 - 10
    expect(wrapper.emitted('update:offset')![2]).toEqual([{ x: 950, y: 708 }])
  })

  it('disabled ignores gestures', async () => {
    const { wrapper, root } = mountDraggable({ disabled: true })
    expect(root.classes()).toContain('am-draggable-disabled')
    await root.trigger('touchstart', touches(110, 210))
    await root.trigger('touchmove', touches(300, 300))
    await root.trigger('touchend')
    expect(wrapper.emitted('dragStart')).toBeUndefined()
    expect(wrapper.emitted('update:offset')).toBeUndefined()
    expect(root.attributes('style') ?? '').not.toContain('translate3d')
  })

  it('renders a controlled offset and follows its changes', async () => {
    const { wrapper, root } = mountDraggable({ offset: { x: 20, y: 30 } })
    expect(root.attributes('style')).toContain('translate3d(20px, 30px, 0)')
    await wrapper.setProps({ offset: { x: 40, y: 50 } })
    expect(root.attributes('style')).toContain('translate3d(40px, 50px, 0)')
  })

  it('works with the mouse', async () => {
    const { wrapper, root } = mountDraggable()
    await root.trigger('mousedown', { button: 0, clientX: 110, clientY: 210 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 210, clientY: 310, cancelable: true }))
    document.dispatchEvent(new MouseEvent('mouseup'))
    expect(wrapper.emitted('update:offset')![0]).toEqual([{ x: 200, y: 300 }])
    // released: further moves are ignored
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 500, clientY: 500 }))
    expect(wrapper.emitted('update:offset')).toHaveLength(1)
  })

  it('reset() goes back to the initial position, resize() clamps into the bounds', async () => {
    const { wrapper, root } = mountDraggable()
    await root.trigger('touchstart', touches(110, 210))
    await root.trigger('touchmove', touches(910, 610))
    await root.trigger('touchend')
    expect(root.attributes('style')).toContain('translate3d(900px, 600px, 0)')

    const innerWidth = window.innerWidth
    Object.defineProperty(window, 'innerWidth', { value: 400, configurable: true })
    window.dispatchEvent(new Event('resize'))
    await wrapper.vm.$nextTick()
    expect(root.attributes('style')).toContain('translate3d(350px, 600px, 0)')
    Object.defineProperty(window, 'innerWidth', { value: innerWidth, configurable: true })

    ;(wrapper.vm as any).reset()
    await wrapper.vm.$nextTick()
    expect(root.attributes('style') ?? '').not.toContain('translate3d')
    expect((wrapper.vm as any).nativeElement).toBe(root.element)
  })

  it('moves inside the offset parent when positioned absolutely', async () => {
    const box = document.createElement('div')
    document.body.appendChild(box)
    const wrapper = mount(Draggable, { attrs: { style: 'position: absolute' }, slots: { default: 'x' }, attachTo: box })
    const root = wrapper.find('.am-draggable')
    mockRect(root.element, { left: 110, top: 120, width: 50, height: 50 })
    mockRect(box, { left: 100, top: 100, width: 300, height: 200 })
    Object.defineProperty(root.element, 'offsetParent', { value: box, configurable: true })
    Object.defineProperty(box, 'clientWidth', { value: 300 })
    Object.defineProperty(box, 'clientHeight', { value: 200 })
    await root.trigger('touchstart', touches(120, 130))
    await root.trigger('touchmove', touches(1000, 1000))
    await root.trigger('touchend')
    expect(wrapper.emitted('update:offset')![0]).toEqual([{ x: 250, y: 150 }])
  })

  it('keeps the scope id of the parent so scoped styles can position it', () => {
    const Parent = {
      __scopeId: 'data-v-test',
      render: () => h(Draggable, { class: 'scoped' }, () => 'x'),
    }
    const wrapper = mount(Parent)
    expect(wrapper.find('.am-draggable').attributes('data-v-test')).toBe('')
  })

  it('getContainer teleports the element and keeps the ConfigProvider theme', () => {
    mount(ConfigProvider, {
      props: { theme: { token: { colorPrimary: '#ff0000' } } },
      slots: { default: () => h(Draggable, { getContainer: () => document.body, class: 'tele' }, () => 'x') },
      attachTo: document.body,
    })
    const el = document.body.querySelector<HTMLElement>(':scope > .tele')!
    expect(el).toBeTruthy()
    expect(el.classList.contains('am-draggable')).toBe(true)
    expect(el.classList.length).toBeGreaterThan(2)
  })
})
