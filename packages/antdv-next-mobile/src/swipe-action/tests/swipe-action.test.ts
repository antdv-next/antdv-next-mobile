import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import SwipeAction from '..'
import ConfigProvider from '../../config-provider'

type Wrapper = ReturnType<typeof mount>

const rightActions = [
  { key: 'mute', text: 'Mute', color: 'warning' },
  { key: 'delete', text: 'Delete', color: 'danger' },
]
const leftActions = [{ key: 'pin', text: 'Pin', color: 'primary' }]

const ACTIONS_WIDTH = 120

function fire(el: Element, type: string, x = 0, y = 0) {
  const event = new Event(type, { bubbles: true, cancelable: true }) as any
  event.touches = type === 'touchend' ? [] : [{ clientX: x, clientY: y }]
  el.dispatchEvent(event)
  return event as Event
}

/** drags horizontally by `distance` px, `duration` ms long */
async function drag(wrapper: Wrapper, distance: number, duration = 1000, release = true) {
  const el = wrapper.find('.am-swipe-action').element
  fire(el, 'touchstart', 200, 20)
  fire(el, 'touchmove', 200 + Math.sign(distance) * 12, 21)
  const last = fire(el, 'touchmove', 200 + distance, 22)
  vi.advanceTimersByTime(duration)
  await nextTick()
  if (release) {
    fire(el, 'touchend')
    await nextTick()
  }
  return last
}

const track = (wrapper: Wrapper) => wrapper.find('.am-swipe-action-track')

describe('SwipeAction', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(ACTIONS_WIDTH)
  })
  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders content and action buttons with preset / custom colors', () => {
    const wrapper = mount(SwipeAction, {
      props: { leftActions, rightActions: [...rightActions, { key: 'x', text: () => h('b', 'Custom'), color: '#7c3aed' }] },
      slots: { default: () => h('div', { class: 'cell' }, 'content') },
    })
    expect(wrapper.classes()).toContain('am-swipe-action')
    expect(wrapper.find('.am-swipe-action-content .cell').text()).toBe('content')
    const right = wrapper.findAll('.am-swipe-action-right .am-swipe-action-button')
    expect(right.map(b => b.text())).toEqual(['Mute', 'Delete', 'Custom'])
    expect(right[0].classes()).toContain('am-swipe-action-button-warning')
    expect(right[1].classes()).toContain('am-swipe-action-button-danger')
    expect(right[2].classes()).toContain('am-swipe-action-button-custom')
    expect(right[2].attributes('style')).toContain('background')
    expect(wrapper.find('.am-swipe-action-left .am-swipe-action-button').classes()).toContain('am-swipe-action-button-primary')
  })

  it('does not render a side without actions', () => {
    const wrapper = mount(SwipeAction, { props: { rightActions } })
    expect(wrapper.find('.am-swipe-action-left').exists()).toBe(false)
    expect(wrapper.find('.am-swipe-action-right').exists()).toBe(true)
  })

  it('follows the finger, with resistance beyond the actions width', async () => {
    const wrapper = mount(SwipeAction, { props: { rightActions } })
    const move = await drag(wrapper, -60, 1000, false)
    expect(move.defaultPrevented).toBe(true)
    expect(track(wrapper).attributes('style')).toContain('translate3d(-60px, 0, 0)')
    expect(track(wrapper).attributes('style')).toContain('transition-duration: 0s')
    expect(wrapper.classes()).toContain('am-swipe-action-dragging')

    fire(wrapper.element, 'touchmove', 0, 22)
    await nextTick()
    // -120 + (-200 + 120) * 0.3
    expect(track(wrapper).attributes('style')).toContain('translate3d(-144px, 0, 0)')
    expect(wrapper.find('.am-swipe-action-right').attributes('style')).toContain('width: 144px')

    // no left actions: cannot be dragged to the right
    fire(wrapper.element, 'touchmove', 200 + 80, 22)
    await nextTick()
    expect(track(wrapper).attributes('style') ?? '').not.toContain('translate3d')
  })

  it('opens past the threshold and emits actionsReveal, closes when dragged back', async () => {
    const wrapper = mount(SwipeAction, { props: { leftActions, rightActions } })
    await drag(wrapper, -40)
    expect(track(wrapper).attributes('style')).toContain(`translate3d(-${ACTIONS_WIDTH}px, 0, 0)`)
    expect(wrapper.emitted('actionsReveal')![0]).toEqual(['right'])
    expect(wrapper.classes()).toContain('am-swipe-action-open-right')

    // dragging back a little keeps it open (needs to pass 15%)
    await drag(wrapper, 10)
    expect(wrapper.classes()).toContain('am-swipe-action-open-right')
    await drag(wrapper, 60)
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(track(wrapper).attributes('style') ?? '').not.toContain('translate3d')

    await drag(wrapper, 50)
    expect(wrapper.emitted('actionsReveal')![1]).toEqual(['left'])
    expect(track(wrapper).attributes('style')).toContain(`translate3d(${ACTIONS_WIDTH}px, 0, 0)`)
  })

  it('a short slow drag bounces back, a fast flick opens', async () => {
    const wrapper = mount(SwipeAction, { props: { rightActions } })
    await drag(wrapper, -15, 1000)
    expect(wrapper.emitted('actionsReveal')).toBeUndefined()
    await drag(wrapper, -15, 20)
    expect(wrapper.emitted('actionsReveal')).toHaveLength(1)
    // a fast flick back closes even though most of it is still revealed
    await drag(wrapper, 14, 20)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('ignores vertical gestures', async () => {
    const wrapper = mount(SwipeAction, { props: { rightActions } })
    fire(wrapper.element, 'touchstart', 200, 20)
    const move = fire(wrapper.element, 'touchmove', 195, 120)
    fire(wrapper.element, 'touchend')
    await nextTick()
    expect(move.defaultPrevented).toBe(false)
    expect(wrapper.emitted('actionsReveal')).toBeUndefined()
  })

  it('emits action, calls action.onClick and closes (closeOnAction)', async () => {
    const onClick = vi.fn()
    const wrapper = mount(SwipeAction, { props: { rightActions: [{ key: 'del', text: 'Delete', onClick }] } })
    ;(wrapper.vm as any).show('right')
    await nextTick()
    await wrapper.find('.am-swipe-action-button').trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
    expect((wrapper.emitted('action')![0][0] as any).key).toBe('del')
    expect(wrapper.emitted('close')).toHaveLength(1)

    await wrapper.setProps({ closeOnAction: false })
    ;(wrapper.vm as any).show()
    await wrapper.find('.am-swipe-action-button').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.classes()).toContain('am-swipe-action-open-right')
  })

  it('show / close are exposed; tapping the content of an opened item only closes it', async () => {
    const onCellClick = vi.fn()
    const wrapper = mount(SwipeAction, {
      props: { leftActions, rightActions },
      slots: { default: () => h('div', { class: 'cell', onClick: onCellClick }) },
    })
    await wrapper.find('.cell').trigger('click')
    expect(onCellClick).toHaveBeenCalledTimes(1)

    ;(wrapper.vm as any).show('left')
    await nextTick()
    expect(track(wrapper).attributes('style')).toContain(`translate3d(${ACTIONS_WIDTH}px, 0, 0)`)
    await wrapper.find('.cell').trigger('click')
    expect(onCellClick).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('close')).toHaveLength(1)

    ;(wrapper.vm as any).show('right')
    ;(wrapper.vm as any).close()
    expect(wrapper.emitted('close')).toHaveLength(2)
  })

  it('the click right after a drag does not reach the content', async () => {
    const onCellClick = vi.fn()
    const wrapper = mount(SwipeAction, {
      props: { rightActions },
      slots: { default: () => h('div', { class: 'cell', onClick: onCellClick }) },
    })
    await drag(wrapper, -60)
    await wrapper.find('.cell').trigger('click')
    expect(onCellClick).not.toHaveBeenCalled()
    expect(wrapper.classes()).toContain('am-swipe-action-open-right')
  })

  it('closes when touching outside unless closeOnTouchOutside is false', async () => {
    const wrapper = mount(SwipeAction, { props: { rightActions }, attachTo: document.body })
    ;(wrapper.vm as any).show()
    fire(wrapper.find('.am-swipe-action-content').element, 'touchstart', 10, 10)
    expect(wrapper.emitted('close')).toBeUndefined()
    fire(document.body, 'touchstart', 10, 10)
    expect(wrapper.emitted('close')).toHaveLength(1)

    await wrapper.setProps({ closeOnTouchOutside: false })
    ;(wrapper.vm as any).show()
    fire(document.body, 'touchstart', 10, 10)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('disabled (prop or ConfigProvider) ignores the gesture', async () => {
    const wrapper = mount(SwipeAction, { props: { rightActions, disabled: true } })
    await drag(wrapper, -100)
    expect(wrapper.emitted('actionsReveal')).toBeUndefined()
    expect(wrapper.classes()).toContain('am-swipe-action-disabled')

    const provider = mount(ConfigProvider, {
      props: { componentDisabled: true },
      slots: { default: () => h(SwipeAction, { rightActions }) },
    })
    expect(provider.find('.am-swipe-action').classes()).toContain('am-swipe-action-disabled')
  })

  it('stopPropagation keeps handled touch moves from bubbling', async () => {
    const onMove = vi.fn()
    const wrapper = mount({
      render: () => h('div', { onTouchmove: onMove }, [h(SwipeAction, { rightActions, stopPropagation: true })]),
    })
    vi.advanceTimersByTime(20)
    const inner = wrapper.findComponent(SwipeAction) as unknown as Wrapper
    await drag(inner, -60)
    expect(onMove).not.toHaveBeenCalled()
  })

  it('left / right slots replace the action buttons', () => {
    const wrapper = mount(SwipeAction, {
      props: { leftActions, rightActions },
      slots: {
        left: () => h('i', { class: 'slot-left' }),
        right: () => h('i', { class: 'slot-right' }),
      },
    })
    expect(wrapper.find('.am-swipe-action-left .slot-left').exists()).toBe(true)
    expect(wrapper.find('.am-swipe-action-right .slot-right').exists()).toBe(true)
    expect(wrapper.find('.am-swipe-action-button').exists()).toBe(false)
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(SwipeAction, {
      props: { rightActions, rootClass: 'root-cls', classes: { content: 'content-cls', action: 'action-cls', actions: 'actions-cls' }, styles: { action: { minWidth: '80px' } } },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-swipe-action-content').classes()).toContain('content-cls')
    expect(wrapper.find('.am-swipe-action-right').classes()).toContain('actions-cls')
    expect(wrapper.find('.am-swipe-action-button').classes()).toContain('action-cls')
    expect(wrapper.find('.am-swipe-action-button').attributes('style')).toContain('min-width: 80px')
  })
})
