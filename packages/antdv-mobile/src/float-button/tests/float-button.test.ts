import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import FloatButton, { BackTop, FloatButtonGroup } from '..'

const wait = (ms = 80) => new Promise(resolve => setTimeout(resolve, ms))

function touches(clientX: number, clientY: number) {
  return { touches: [{ clientX, clientY }], changedTouches: [{ clientX, clientY }] }
}

function mockRect(el: Element, rect: { left: number, top: number, width: number, height: number }) {
  el.getBoundingClientRect = () => ({
    ...rect,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
    x: rect.left,
    y: rect.top,
    toJSON() {},
  })
}

describe('FloatButton', () => {
  it('exposes sub components as statics', () => {
    expect(FloatButton.Group).toBe(FloatButtonGroup)
    expect(FloatButton.BackTop).toBe(BackTop)
  })

  it('renders a circle default button with the fallback icon', () => {
    const wrapper = mount(FloatButton)
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-float-button', 'am-float-button-default', 'am-float-button-circle']))
    expect(wrapper.find('.am-float-button-icon .anticon').exists()).toBe(true)
    expect(wrapper.find('.am-float-button-content').exists()).toBe(false)
  })

  it('supports type / shape / content / description / href', () => {
    const wrapper = mount(FloatButton, {
      props: { type: 'primary', shape: 'square', content: 'Help', href: 'https://example.com', target: '_blank' },
    })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://example.com')
    expect(wrapper.attributes('target')).toBe('_blank')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-float-button-primary', 'am-float-button-square', 'am-float-button-with-content']))
    expect(wrapper.find('.am-float-button-content').text()).toBe('Help')
    // content only: no fallback icon
    expect(wrapper.find('.am-float-button-icon').exists()).toBe(false)

    const legacy = mount(FloatButton, { props: { description: 'Desc' } })
    expect(legacy.find('.am-float-button-content').text()).toBe('Desc')
  })

  it('icon / default slots win over props', () => {
    const wrapper = mount(FloatButton, {
      props: { icon: () => h('i', { class: 'prop-icon' }), content: 'prop' },
      slots: { icon: () => h('i', { class: 'slot-icon' }), default: 'slot' },
    })
    expect(wrapper.find('.slot-icon').exists()).toBe(true)
    expect(wrapper.find('.prop-icon').exists()).toBe(false)
    expect(wrapper.find('.am-float-button-content').text()).toBe('slot')
    const byProp = mount(FloatButton, { props: { icon: () => h('i', { class: 'prop-icon' }) } })
    expect(byProp.find('.prop-icon').exists()).toBe(true)
  })

  it('renders the badge', async () => {
    const wrapper = mount(FloatButton, { props: { badge: { count: 5 } } })
    expect(wrapper.find('.am-float-button-badge').text()).toBe('5')
    await wrapper.setProps({ badge: { count: 120, overflowCount: 99, color: 'blue' } })
    expect(wrapper.find('.am-float-button-badge').text()).toBe('99+')
    expect(wrapper.find('.am-float-button-badge').attributes('style')).toContain('background: blue')
    await wrapper.setProps({ badge: { dot: true } })
    expect(wrapper.find('.am-float-button-badge').classes()).toContain('am-float-button-badge-dot')
    expect(wrapper.find('.am-float-button-badge').text()).toBe('')
    await wrapper.setProps({ badge: { count: 0 } })
    expect(wrapper.find('.am-float-button-badge').exists()).toBe(false)
    await wrapper.setProps({ badge: { count: 0, showZero: true } })
    expect(wrapper.find('.am-float-button-badge').text()).toBe('0')
  })

  it('emits click and passes attrs, rootClass, classes and styles', async () => {
    const wrapper = mount(FloatButton, {
      props: {
        content: 'c',
        icon: 'i',
        ariaLabel: 'label',
        rootClass: 'root-cls',
        classes: { root: 'r', icon: 'ic', content: 'ct' },
        styles: { root: { position: 'absolute' }, content: { color: 'red' } },
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.attributes('aria-label')).toBe('label')
    expect(wrapper.attributes('style')).toContain('position: absolute')
    expect(wrapper.find('.am-float-button-icon').classes()).toContain('ic')
    expect(wrapper.find('.am-float-button-content').classes()).toContain('ct')
    expect(wrapper.find('.am-float-button-content').attributes('style')).toContain('color: red')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  describe('draggable', () => {
    it('follows the finger inside the viewport and emits the new offset', async () => {
      const wrapper = mount(FloatButton, { props: { draggable: true, gap: 10 }, attachTo: document.body })
      expect(wrapper.classes()).toContain('am-float-button-draggable')
      mockRect(wrapper.element, { left: 900, top: 600, width: 48, height: 48 })
      await wrapper.trigger('touchstart', touches(910, 610))
      expect(wrapper.classes()).toContain('am-float-button-dragging')
      await wrapper.trigger('touchmove', touches(810, 510))
      expect(wrapper.attributes('style')).toContain('translate3d(800px, 500px, 0)')
      // clamped to the viewport (1024 x 768 in jsdom) minus the gap
      await wrapper.trigger('touchmove', touches(2000, -500))
      expect(wrapper.attributes('style')).toContain('translate3d(966px, 10px, 0)')
      await wrapper.trigger('touchend')
      expect(wrapper.classes()).not.toContain('am-float-button-dragging')
      expect(wrapper.emitted('update:offset')![0]).toEqual([{ x: 966, y: 10 }])
      expect(wrapper.emitted('offsetChange')![0]).toEqual([{ x: 966, y: 10 }])

      // the click that follows a drag is swallowed, later clicks are not
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeUndefined()
      await wait(10)
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('a tap does not move the button', async () => {
      const wrapper = mount(FloatButton, { props: { draggable: true }, attachTo: document.body })
      mockRect(wrapper.element, { left: 900, top: 600, width: 48, height: 48 })
      await wrapper.trigger('touchstart', touches(910, 610))
      await wrapper.trigger('touchmove', touches(912, 611))
      await wrapper.trigger('touchend')
      expect(wrapper.emitted('update:offset')).toBeUndefined()
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('restricts to an axis and snaps to the nearest edge with magnetic', async () => {
      const wrapper = mount(FloatButton, { props: { draggable: true, axis: 'y', gap: 10 }, attachTo: document.body })
      mockRect(wrapper.element, { left: 900, top: 600, width: 48, height: 48 })
      await wrapper.trigger('touchstart', touches(910, 610))
      await wrapper.trigger('touchmove', touches(500, 310))
      await wrapper.trigger('touchend')
      expect(wrapper.emitted('update:offset')![0]).toEqual([{ x: 900, y: 300 }])

      await wrapper.setProps({ axis: 'xy', magnetic: 'x' })
      await wrapper.trigger('touchstart', touches(910, 310))
      await wrapper.trigger('touchmove', touches(210, 310))
      await wrapper.trigger('touchend')
      expect(wrapper.emitted('update:offset')![1]).toEqual([{ x: 10, y: 300 }])
      expect(wrapper.attributes('style')).toContain('translate3d(10px, 300px, 0)')
    })

    it('renders a controlled offset and ignores touches when not draggable', async () => {
      const wrapper = mount(FloatButton, { props: { offset: { x: 20, y: 30 } }, attachTo: document.body })
      expect(wrapper.attributes('style')).toContain('translate3d(20px, 30px, 0)')
      await wrapper.trigger('touchstart', touches(10, 10))
      await wrapper.trigger('touchmove', touches(100, 100))
      await wrapper.trigger('touchend')
      expect(wrapper.emitted('update:offset')).toBeUndefined()
      await wrapper.setProps({ offset: { x: 40, y: 50 } })
      expect(wrapper.attributes('style')).toContain('translate3d(40px, 50px, 0)')
    })
  })
})

describe('FloatButtonGroup', () => {
  const children = () => [h(FloatButton, { class: 'child-a' }), h(FloatButton, { class: 'child-b', shape: 'circle' })]

  it('renders its buttons in a list and hands down the shape', () => {
    const wrapper = mount(FloatButtonGroup, { props: { shape: 'square' }, slots: { default: children } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-float-button-group', 'am-float-button-group-square', 'am-float-button-group-top']))
    expect(wrapper.classes()).not.toContain('am-float-button-group-menu')
    const buttons = wrapper.findAll('.am-float-button')
    expect(buttons).toHaveLength(2)
    buttons.forEach((button) => {
      expect(button.classes()).toEqual(expect.arrayContaining(['am-float-button-in-group', 'am-float-button-square']))
    })
  })

  it('menu mode toggles the list (uncontrolled)', async () => {
    const wrapper = mount(FloatButtonGroup, { props: { trigger: 'click', placement: 'left' }, slots: { default: children } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-float-button-group-menu', 'am-float-button-group-left']))
    const list = wrapper.find('.am-float-button-group-list')
    expect((list.element as HTMLElement).style.display).toBe('none')
    const trigger = wrapper.find('.am-float-button-group-trigger')
    await trigger.trigger('click')
    expect(wrapper.emitted('openChange')![0]).toEqual([true])
    expect(wrapper.emitted('update:open')![0]).toEqual([true])
    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(wrapper.classes()).toContain('am-float-button-group-open')
    expect((list.element as HTMLElement).style.display).not.toBe('none')
    expect(trigger.find('.anticon-close').exists()).toBe(true)
    await trigger.trigger('click')
    expect(wrapper.emitted('openChange')![1]).toEqual([false])
  })

  it('is controlled by open', async () => {
    const wrapper = mount(FloatButtonGroup, { props: { trigger: 'click', open: true }, slots: { default: children } })
    expect(wrapper.classes()).toContain('am-float-button-group-open')
    await wrapper.find('.am-float-button-group-trigger').trigger('click')
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
    expect(wrapper.classes()).toContain('am-float-button-group-open')
    await wrapper.setProps({ open: false })
    expect(wrapper.classes()).not.toContain('am-float-button-group-open')
  })

  it('supports icon / closeIcon props and slots, type, attrs and classes', async () => {
    const wrapper = mount(FloatButtonGroup, {
      props: {
        trigger: 'click',
        type: 'primary',
        icon: () => h('i', { class: 'prop-icon' }),
        closeIcon: () => h('i', { class: 'prop-close' }),
        rootClass: 'root-cls',
        classes: { list: 'l', trigger: 't' },
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
      slots: { default: children, closeIcon: () => h('i', { class: 'slot-close' }) },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-float-button-group-list').classes()).toContain('l')
    const trigger = wrapper.find('.am-float-button-group-trigger')
    expect(trigger.classes()).toEqual(expect.arrayContaining(['t', 'am-float-button-primary']))
    expect(trigger.find('.prop-icon').exists()).toBe(true)
    await trigger.trigger('click')
    expect(trigger.find('.slot-close').exists()).toBe(true)
    expect(trigger.find('.prop-close').exists()).toBe(false)
  })
})

describe('BackTop', () => {
  function createScroller() {
    const el = document.createElement('div')
    document.body.appendChild(el)
    return el
  }

  it('shows up after visibilityHeight and scrolls the target back to top', async () => {
    const scroller = createScroller()
    const wrapper = mount(BackTop, { props: { target: () => scroller, visibilityHeight: 100, duration: 0 }, attachTo: document.body })
    await nextTick()
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-float-button', 'am-back-top']))
    expect((wrapper.element as HTMLElement).style.display).toBe('none')

    scroller.scrollTop = 150
    scroller.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect((wrapper.element as HTMLElement).style.display).not.toBe('none')

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(scroller.scrollTop).toBe(0)
    scroller.dispatchEvent(new Event('scroll'))
    await wait()
    expect((wrapper.element as HTMLElement).style.display).toBe('none')
  })

  it('animates the scroll within duration', async () => {
    vi.useFakeTimers()
    const scroller = createScroller()
    const wrapper = mount(BackTop, { props: { target: () => scroller, visibilityHeight: 0, duration: 200 }, attachTo: document.body })
    await nextTick()
    scroller.scrollTop = 1000
    await wrapper.trigger('click')
    await vi.advanceTimersByTimeAsync(100)
    expect(scroller.scrollTop).toBeGreaterThan(0)
    expect(scroller.scrollTop).toBeLessThan(1000)
    await vi.advanceTimersByTimeAsync(200)
    expect(scroller.scrollTop).toBe(0)
    vi.useRealTimers()
  })

  it('listens on window by default and renders custom icon / content', async () => {
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 0, content: 'Top', type: 'primary', shape: 'square' },
      slots: { icon: () => h('i', { class: 'slot-icon' }) },
      attachTo: document.body,
    })
    await nextTick()
    expect((wrapper.element as HTMLElement).style.display).not.toBe('none')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-float-button-primary', 'am-float-button-square']))
    expect(wrapper.find('.slot-icon').exists()).toBe(true)
    expect(wrapper.find('.am-float-button-content').text()).toBe('Top')
  })
})
