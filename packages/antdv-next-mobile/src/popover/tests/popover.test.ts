import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Popover from '..'
import ConfigProvider from '../../config-provider'
import { computePosition, parsePlacement } from '../position'

const wait = (ms = 80) => new Promise(resolve => setTimeout(resolve, ms))
const popup = () => document.querySelector<HTMLElement>('.am-popover')
const inner = () => document.querySelector<HTMLElement>('.am-popover-inner')
const isVisible = () => !!inner() && inner()!.style.display !== 'none'

function mountPopover(props: Record<string, any> = {}, slots: Record<string, any> = {}) {
  return mount(Popover, {
    props: { content: 'content', ...props },
    slots: { default: () => h('button', { class: 'trigger' }, 'trigger'), ...slots },
    attachTo: document.body,
  })
}

describe('Popover', () => {
  it('renders the trigger only until opened, then teleports the popup to body', async () => {
    const wrapper = mountPopover({ title: 'Title' })
    expect(wrapper.find('.am-popover-trigger .trigger').exists()).toBe(true)
    expect(popup()).toBeNull()
    await wrapper.find('.am-popover-trigger').trigger('click')
    await nextTick()
    expect(popup()!.parentElement).toBe(document.body)
    expect(popup()!.classList.contains('am-popover-light')).toBe(true)
    // the trigger sits at the top edge of the viewport in jsdom: the default `top` placement flips
    expect(popup()!.classList.contains('am-popover-placement-bottom')).toBe(true)
    expect(popup()!.classList.contains('am-popover-side-bottom')).toBe(true)
    expect(popup()!.querySelector('.am-popover-title')!.textContent).toBe('Title')
    expect(popup()!.querySelector('.am-popover-content')!.textContent).toBe('content')
    expect(popup()!.querySelector('.am-popover-arrow')).not.toBeNull()
    expect(wrapper.emitted('openChange')![0]).toEqual([true])
    expect(wrapper.emitted('update:open')![0]).toEqual([true])
  })

  it('toggles on trigger click (uncontrolled) and closes on outside touch', async () => {
    const wrapper = mountPopover()
    const trigger = wrapper.find('.am-popover-trigger')
    await trigger.trigger('click')
    await nextTick()
    expect(isVisible()).toBe(true)
    expect(trigger.classes()).toContain('am-popover-trigger-open')

    // touching the popup or the trigger keeps it open
    inner()!.dispatchEvent(new Event('touchstart', { bubbles: true }))
    trigger.element.dispatchEvent(new Event('touchstart', { bubbles: true }))
    await nextTick()
    expect(isVisible()).toBe(true)

    document.body.dispatchEvent(new Event('touchstart', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('openChange')!.slice(-1)[0]).toEqual([false])
    await wait()
    expect(isVisible()).toBe(false)

    await trigger.trigger('click')
    await nextTick()
    await trigger.trigger('click')
    expect(wrapper.emitted('openChange')).toHaveLength(4)
  })

  it('is controlled by open and does not close itself', async () => {
    const wrapper = mountPopover({ open: true })
    await nextTick()
    expect(isVisible()).toBe(true)
    document.body.dispatchEvent(new Event('mousedown', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
    expect(isVisible()).toBe(true)
    await wrapper.setProps({ open: false })
    await wait()
    expect(isVisible()).toBe(false)
  })

  it('supports defaultOpen, manual trigger and closeOnClickAway=false', async () => {
    const wrapper = mountPopover({ defaultOpen: true, trigger: 'manual', closeOnClickAway: false })
    await nextTick()
    expect(isVisible()).toBe(true)
    await wrapper.find('.am-popover-trigger').trigger('click')
    document.body.dispatchEvent(new Event('touchstart', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('openChange')).toBeUndefined()
    ;(wrapper.vm as any).hide()
    await nextTick()
    expect(wrapper.emitted('openChange')![0]).toEqual([false])
    ;(wrapper.vm as any).show()
    await nextTick()
    expect(wrapper.emitted('openChange')![1]).toEqual([true])
  })

  it('renders mode / color / arrow / placement and semantic classes on the popup', async () => {
    const wrapper = mountPopover({
      open: true,
      mode: 'dark',
      color: 'red',
      arrow: false,
      placement: 'bottomRight',
      zIndex: 3000,
      rootClass: 'root-cls',
      classes: { root: 'r', container: 'c', content: 'ct' },
      styles: { content: { padding: '1px' } },
    })
    await nextTick()
    const el = popup()!
    expect(el.classList.contains('am-popover-dark')).toBe(true)
    expect(el.classList.contains('root-cls')).toBe(true)
    expect(el.classList.contains('r')).toBe(true)
    expect(el.style.getPropertyValue('--am-popover-bg')).toBe('red')
    expect(el.style.zIndex).toBe('3000')
    expect(el.querySelector('.am-popover-arrow')).toBeNull()
    expect(inner()!.classList.contains('c')).toBe(true)
    expect(el.querySelector<HTMLElement>('.am-popover-content')!.classList.contains('ct')).toBe(true)
    expect(el.querySelector<HTMLElement>('.am-popover-content')!.style.padding).toBe('1px')
    expect(wrapper.find('.am-popover-trigger').exists()).toBe(true)
  })

  it('passes attrs to the trigger wrapper', () => {
    const wrapper = mountPopover({}, {})
    const custom = mount(Popover, { attrs: { 'class': 'custom', 'data-id': 'x' }, slots: { default: 'x' } })
    expect(custom.find('.am-popover-trigger').classes()).toContain('custom')
    expect(custom.find('.am-popover-trigger').attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-popover-trigger').exists()).toBe(true)
  })

  it('title / content slots win over props', async () => {
    mountPopover({ open: true, title: 'prop title' }, { title: 'slot title', content: () => h('i', { class: 'slot-content' }) })
    await nextTick()
    expect(popup()!.querySelector('.am-popover-title')!.textContent).toBe('slot title')
    expect(popup()!.querySelector('.am-popover-content .slot-content')).not.toBeNull()
  })

  it('menu mode renders actions, emits action and closes', async () => {
    const onClick = vi.fn()
    const wrapper = mountPopover({
      defaultOpen: true,
      actions: [
        { key: 'scan', text: 'Scan', icon: () => h('i', { class: 'icon' }), onClick },
        { key: 'pay', text: 'Pay', disabled: true },
        { key: 'del', text: 'Delete', danger: true },
      ],
    })
    await nextTick()
    expect(popup()!.classList.contains('am-popover-menu-mode')).toBe(true)
    const items = popup()!.querySelectorAll<HTMLElement>('.am-popover-menu-item')
    expect(items).toHaveLength(3)
    expect(items[0].querySelector('.icon')).not.toBeNull()
    expect(items[1].classList.contains('am-popover-menu-item-disabled')).toBe(true)
    expect(items[2].classList.contains('am-popover-menu-item-danger')).toBe(true)
    expect(popup()!.querySelector('.am-popover-content')).toBeNull()

    items[1].click()
    expect(wrapper.emitted('action')).toBeUndefined()
    items[0].click()
    expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ key: 'scan' }), 0)
    expect(wrapper.emitted('action')![0]).toEqual([expect.objectContaining({ key: 'scan' }), 0])
    expect(wrapper.emitted('openChange')![0]).toEqual([false])
  })

  it('destroys the popup when hidden with destroyOnHidden', async () => {
    const wrapper = mountPopover({ open: true, destroyOnHidden: true })
    await nextTick()
    expect(popup()).not.toBeNull()
    await wrapper.setProps({ open: false })
    await wait()
    expect(popup()).toBeNull()
  })

  it('mounts into getPopupContainer and keeps the theme of ConfigProvider', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    mount(ConfigProvider, {
      props: { theme: { algorithm: 'dark' } },
      slots: {
        default: () => h(Popover, { open: true, content: 'c', getPopupContainer: () => container }, { default: () => 'x' }),
      },
    })
    await nextTick()
    await nextTick()
    const el = container.querySelector('.am-popover')!
    expect(el).not.toBeNull()
    expect(el.classList.contains('am-theme-dark')).toBe(true)
  })

  it('positions the popup next to the trigger', async () => {
    const wrapper = mountPopover({ placement: 'bottom' })
    const trigger = wrapper.find('.am-popover-trigger').element as HTMLElement
    trigger.getBoundingClientRect = () => ({ left: 100, top: 100, width: 40, height: 20, right: 140, bottom: 120, x: 100, y: 100, toJSON() {} })
    await wrapper.find('.am-popover-trigger').trigger('click')
    await nextTick()
    await nextTick()
    // jsdom reports a 0 x 0 popup: centered below the trigger with the arrow gap
    expect(popup()!.style.left).toBe('120px')
    expect(popup()!.style.top).toBe('130px')
  })
})

describe('computePosition', () => {
  const viewport = { width: 375, height: 667 }
  const trigger = { left: 150, top: 300, width: 60, height: 30 }
  const size = { width: 100, height: 40 }

  it('parses the 12 placements', () => {
    expect(parsePlacement('top')).toEqual({ side: 'top', align: 'center' })
    expect(parsePlacement('bottomLeft')).toEqual({ side: 'bottom', align: 'start' })
    expect(parsePlacement('topRight')).toEqual({ side: 'top', align: 'end' })
    expect(parsePlacement('leftTop')).toEqual({ side: 'left', align: 'start' })
    expect(parsePlacement('rightBottom')).toEqual({ side: 'right', align: 'end' })
  })

  it('places the popup on each side with alignment', () => {
    expect(computePosition(trigger, size, { placement: 'top', viewport, gap: 10 })).toEqual({ left: 130, top: 250, placement: 'top', arrowOffset: 50 })
    expect(computePosition(trigger, size, { placement: 'bottomLeft', viewport, gap: 10 })).toMatchObject({ left: 150, top: 340, placement: 'bottomLeft', arrowOffset: 30 })
    expect(computePosition(trigger, size, { placement: 'bottomRight', viewport, gap: 10 })).toMatchObject({ left: 110, top: 340, arrowOffset: 70 })
    expect(computePosition(trigger, size, { placement: 'left', viewport, gap: 10 })).toMatchObject({ left: 40, top: 295, arrowOffset: 20 })
    expect(computePosition(trigger, size, { placement: 'rightTop', viewport, gap: 10 })).toMatchObject({ left: 220, top: 300, arrowOffset: 15 })
  })

  it('flips to the opposite side when there is not enough room', () => {
    const nearTop = { ...trigger, top: 10 }
    expect(computePosition(nearTop, size, { placement: 'topLeft', viewport })).toMatchObject({ placement: 'bottomLeft', top: 48 })
    const nearRight = { ...trigger, left: 300 }
    expect(computePosition(nearRight, size, { placement: 'right', viewport })).toMatchObject({ placement: 'left', left: 192 })
    expect(computePosition(nearTop, size, { placement: 'top', viewport, autoAdjust: false })).toMatchObject({ placement: 'top', top: -38 })
  })

  it('shifts along the edge to stay inside the viewport and keeps the arrow on the trigger', () => {
    const nearEdge = { left: 340, top: 300, width: 30, height: 30 }
    const result = computePosition(nearEdge, size, { placement: 'bottom', viewport, padding: 8 })
    expect(result.left).toBe(267)
    expect(result.arrowOffset).toBe(88)
    const nearStart = { left: 0, top: 300, width: 20, height: 30 }
    const start = computePosition(nearStart, size, { placement: 'top', viewport, padding: 8 })
    expect(start.left).toBe(8)
    // clamped to the arrow inset so it never leaves the rounded corner
    expect(start.arrowOffset).toBe(12)
  })
})
