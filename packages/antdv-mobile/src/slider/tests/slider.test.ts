import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, provide } from 'vue'
import Slider from '..'
import ConfigProvider from '../../config-provider'
import { formItemInputContextKey } from '../../form/context'

/** The rail body is 200px wide (x: 0 - 200) and 200px tall (y: 0 - 200). */
function mockRect() {
  return vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => {
    return { left: 0, right: 200, width: 200, top: 0, bottom: 200, height: 200, x: 0, y: 0, toJSON() {} } as DOMRect
  })
}

function touches(x: number, y = 0) {
  return { touches: [{ clientX: x, clientY: y }] }
}

function lastEmit(wrapper: any, name: string) {
  const list = wrapper.emitted(name) ?? []
  return list[list.length - 1]?.[0]
}

describe('Slider', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders rail, track and an accessible handle', () => {
    const wrapper = mount(Slider, { props: { defaultValue: 30 } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-slider', 'am-slider-horizontal']))
    expect(wrapper.find('.am-slider-rail').exists()).toBe(true)
    expect(wrapper.find('.am-slider-track').attributes('style')).toContain('width: 30%')
    const handle = wrapper.find('.am-slider-handle')
    expect(handle.attributes('role')).toBe('slider')
    expect(handle.attributes('aria-valuenow')).toBe('30')
    expect(handle.attributes('aria-valuemin')).toBe('0')
    expect(handle.attributes('aria-valuemax')).toBe('100')
    expect(handle.attributes('tabindex')).toBe('0')
    expect(handle.attributes('style')).toContain('inset-inline-start: 30%')
  })

  it('drags with touch: clamps, snaps to step and emits change / changeComplete', async () => {
    mockRect()
    const wrapper = mount(Slider, { props: { step: 10 } })
    await wrapper.trigger('touchstart', touches(47))
    expect(lastEmit(wrapper, 'change')).toBe(20)
    expect(lastEmit(wrapper, 'update:value')).toBe(20)
    expect(wrapper.classes()).toContain('am-slider-dragging')
    await wrapper.trigger('touchmove', touches(131))
    expect(lastEmit(wrapper, 'change')).toBe(70)
    await wrapper.trigger('touchmove', touches(999))
    expect(lastEmit(wrapper, 'change')).toBe(100)
    await wrapper.trigger('touchmove', touches(-50))
    expect(lastEmit(wrapper, 'change')).toBe(0)
    expect(wrapper.emitted('changeComplete')).toBeUndefined()
    await wrapper.trigger('touchend')
    expect(wrapper.emitted('changeComplete')).toEqual([[0]])
    expect(wrapper.classes()).not.toContain('am-slider-dragging')
  })

  it('does not jump when a handle is grabbed directly', async () => {
    mockRect()
    const wrapper = mount(Slider, { props: { defaultValue: 50 } })
    await wrapper.find('.am-slider-handle').trigger('touchstart', touches(10))
    expect(wrapper.emitted('change')).toBeUndefined()
    await wrapper.trigger('touchmove', touches(20))
    expect(lastEmit(wrapper, 'change')).toBe(10)
  })

  it('is controlled by value', async () => {
    mockRect()
    const wrapper = mount(Slider, { props: { value: 10 } })
    await wrapper.trigger('touchstart', touches(100))
    expect(lastEmit(wrapper, 'change')).toBe(50)
    expect(wrapper.find('.am-slider-handle').attributes('aria-valuenow')).toBe('10')
    await wrapper.setProps({ value: 50 })
    expect(wrapper.find('.am-slider-handle').attributes('aria-valuenow')).toBe('50')
  })

  it('supports min / max and decimal steps without float noise', async () => {
    mockRect()
    const wrapper = mount(Slider, { props: { min: 1, max: 2, step: 0.1 } })
    await wrapper.trigger('touchstart', touches(61))
    expect(lastEmit(wrapper, 'change')).toBe(1.3)
  })

  it('range: moves the closest handle and lets handles cross', async () => {
    mockRect()
    const wrapper = mount(Slider, { props: { range: true, defaultValue: [20, 60] } })
    expect(wrapper.classes()).toContain('am-slider-range')
    expect(wrapper.findAll('.am-slider-handle')).toHaveLength(2)
    expect(wrapper.find('.am-slider-track').attributes('style')).toContain('inset-inline-start: 20%')
    expect(wrapper.find('.am-slider-track').attributes('style')).toContain('width: 40%')

    await wrapper.trigger('touchstart', touches(140))
    expect(lastEmit(wrapper, 'change')).toEqual([20, 70])
    await wrapper.trigger('touchmove', touches(20))
    expect(lastEmit(wrapper, 'change')).toEqual([10, 20])
    await wrapper.trigger('touchend')
    expect(lastEmit(wrapper, 'changeComplete')).toEqual([10, 20])

    await wrapper.trigger('touchstart', touches(0))
    expect(lastEmit(wrapper, 'change')).toEqual([0, 20])
  })

  it('range defaults to [min, min]', () => {
    const wrapper = mount(Slider, { props: { range: true, min: 10 } })
    expect(wrapper.findAll('.am-slider-handle').map(n => n.attributes('aria-valuenow'))).toEqual(['10', '10'])
  })

  it('renders marks, dots and snaps to marks only when step is null', async () => {
    mockRect()
    const wrapper = mount(Slider, {
      props: {
        step: null,
        defaultValue: 26,
        marks: { 0: '0°C', 26: '26°C', 100: { style: { color: 'red' }, label: h('strong', '100°C') }, 200: 'out' },
      },
    })
    expect(wrapper.classes()).toContain('am-slider-with-marks')
    const texts = wrapper.findAll('.am-slider-mark-text')
    expect(texts.map(n => n.text())).toEqual(['0°C', '26°C', '100°C'])
    expect(texts[2].attributes('style')).toContain('color: red')
    expect(texts[1].classes()).toContain('am-slider-mark-text-active')
    expect(texts[2].classes()).not.toContain('am-slider-mark-text-active')
    expect(wrapper.findAll('.am-slider-dot')).toHaveLength(3)
    expect(wrapper.findAll('.am-slider-dot-active')).toHaveLength(2)

    await wrapper.trigger('touchstart', touches(150))
    expect(lastEmit(wrapper, 'change')).toBe(100)
    await wrapper.trigger('touchmove', touches(20))
    expect(lastEmit(wrapper, 'change')).toBe(0)
  })

  it('dots renders one dot per step, included=false hides the track', () => {
    const wrapper = mount(Slider, { props: { dots: true, step: 25, included: false, defaultValue: 50 } })
    expect(wrapper.findAll('.am-slider-dot')).toHaveLength(5)
    expect(wrapper.find('.am-slider-track').exists()).toBe(false)
    expect(wrapper.findAll('.am-slider-dot-active')).toHaveLength(0)
  })

  it('mark slot overrides the label', () => {
    const wrapper = mount(Slider, {
      props: { marks: { 0: 'A', 100: 'B' } },
      slots: { mark: ({ point, label }: any) => h('i', { class: 'slot-mark' }, `${label}:${point}`) },
    })
    expect(wrapper.findAll('.slot-mark').map(n => n.text())).toEqual(['A:0', 'B:100'])
  })

  it('handle slot replaces the thumb', () => {
    const wrapper = mount(Slider, {
      props: { defaultValue: 5 },
      slots: { handle: ({ value, index }: any) => h('i', { class: 'slot-handle' }, `${index}-${value}`) },
    })
    expect(wrapper.find('.am-slider-thumb').exists()).toBe(false)
    expect(wrapper.find('.slot-handle').text()).toBe('0-5')
  })

  it('reverse and RTL mirror the axis', async () => {
    mockRect()
    const reverse = mount(Slider, { props: { reverse: true, defaultValue: 30 } })
    expect(reverse.classes()).toContain('am-slider-reverse')
    expect(reverse.find('.am-slider-handle').attributes('style')).toContain('inset-inline-end: 30%')
    await reverse.trigger('touchstart', touches(40))
    expect(lastEmit(reverse, 'change')).toBe(80)

    const rtl = mount(ConfigProvider, { props: { direction: 'rtl' }, slots: { default: () => h(Slider) } })
    const slider = rtl.findComponent(Slider)
    await slider.trigger('touchstart', touches(40))
    expect(lastEmit(slider, 'change')).toBe(80)
    await slider.find('.am-slider-handle').trigger('keydown', { key: 'ArrowLeft' })
    expect(lastEmit(slider, 'change')).toBe(81)
  })

  it('vertical / orientation use the y axis', async () => {
    mockRect()
    const wrapper = mount(Slider, { props: { vertical: true, defaultValue: 30 } })
    expect(wrapper.classes()).toContain('am-slider-vertical')
    const handle = wrapper.find('.am-slider-handle')
    expect(handle.attributes('aria-orientation')).toBe('vertical')
    expect(handle.attributes('style')).toContain('bottom: 30%')
    expect(wrapper.find('.am-slider-track').attributes('style')).toContain('height: 30%')
    await wrapper.trigger('touchstart', touches(0, 50))
    expect(lastEmit(wrapper, 'change')).toBe(75)

    const byOrientation = mount(Slider, { props: { vertical: true, orientation: 'horizontal' } })
    expect(byOrientation.classes()).toContain('am-slider-horizontal')
  })

  it('shows the value bubble while dragging and respects tooltip config', async () => {
    mockRect()
    const wrapper = mount(Slider, {
      props: { tooltip: { formatter: (v: number) => `${v}%` } },
      global: { stubs: { transition: true } },
    })
    expect(wrapper.find('.am-slider-tooltip').exists()).toBe(false)
    await wrapper.trigger('touchstart', touches(100))
    expect(wrapper.find('.am-slider-tooltip').text()).toBe('50%')
    await wrapper.trigger('touchend')
    expect(wrapper.find('.am-slider-tooltip').exists()).toBe(false)

    const always = mount(Slider, { props: { defaultValue: 8, tooltip: { open: true } } })
    expect(always.find('.am-slider-tooltip').text()).toBe('8')

    const never = mount(Slider, { props: { tooltip: { formatter: null, open: true } } })
    expect(never.find('.am-slider-tooltip').exists()).toBe(false)

    const closed = mount(Slider, { props: { tooltip: { open: false } } })
    await closed.trigger('touchstart', touches(100))
    expect(closed.find('.am-slider-tooltip').exists()).toBe(false)
  })

  it('supports keyboard arrows, Home / End and emits changeComplete on keyup', async () => {
    const wrapper = mount(Slider, { props: { defaultValue: 50, step: 5 } })
    const handle = wrapper.find('.am-slider-handle')
    await handle.trigger('keydown', { key: 'ArrowRight' })
    expect(lastEmit(wrapper, 'change')).toBe(55)
    await handle.trigger('keydown', { key: 'ArrowDown' })
    expect(lastEmit(wrapper, 'change')).toBe(50)
    await handle.trigger('keydown', { key: 'End' })
    expect(lastEmit(wrapper, 'change')).toBe(100)
    await handle.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('change')).toHaveLength(3)
    await handle.trigger('keydown', { key: 'Home' })
    expect(lastEmit(wrapper, 'change')).toBe(0)
    await handle.trigger('keyup', { key: 'Home' })
    expect(wrapper.emitted('changeComplete')).toEqual([[0]])

    const off = mount(Slider, { props: { keyboard: false } })
    await off.find('.am-slider-handle').trigger('keydown', { key: 'ArrowRight' })
    expect(off.emitted('change')).toBeUndefined()
  })

  it('keyboard walks through marks when step is null', async () => {
    const wrapper = mount(Slider, { props: { step: null, marks: { 20: 'a', 60: 'b' }, defaultValue: 20 } })
    const handle = wrapper.find('.am-slider-handle')
    await handle.trigger('keydown', { key: 'ArrowRight' })
    expect(lastEmit(wrapper, 'change')).toBe(60)
    await handle.trigger('keydown', { key: 'ArrowRight' })
    expect(lastEmit(wrapper, 'change')).toBe(100)
  })

  it('supports mouse dragging', async () => {
    mockRect()
    const wrapper = mount(Slider, { attachTo: document.body })
    await wrapper.trigger('mousedown', { button: 0, clientX: 40 })
    expect(lastEmit(wrapper, 'change')).toBe(20)
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 120 }))
    expect(lastEmit(wrapper, 'change')).toBe(60)
    document.dispatchEvent(new MouseEvent('mouseup'))
    expect(wrapper.emitted('changeComplete')).toEqual([[60]])
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 10 }))
    expect(wrapper.emitted('change')).toHaveLength(2)
  })

  it('ignores every interaction when disabled', async () => {
    mockRect()
    const wrapper = mount(Slider, { props: { disabled: true, defaultValue: 10 } })
    expect(wrapper.classes()).toContain('am-slider-disabled')
    const handle = wrapper.find('.am-slider-handle')
    expect(handle.attributes('tabindex')).toBe('-1')
    expect(handle.attributes('aria-disabled')).toBe('true')
    await wrapper.trigger('touchstart', touches(100))
    await wrapper.trigger('touchmove', touches(150))
    await wrapper.trigger('touchend')
    await wrapper.trigger('mousedown', { button: 0, clientX: 40 })
    await handle.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.emitted('changeComplete')).toBeUndefined()
  })

  it('follows ConfigProvider componentDisabled', () => {
    const wrapper = mount(ConfigProvider, { props: { componentDisabled: true }, slots: { default: () => h(Slider) } })
    expect(wrapper.find('.am-slider').classes()).toContain('am-slider-disabled')
  })

  it('passes attrs, rootClass, classes, styles and aria labels', () => {
    const wrapper = mount(Slider, {
      props: {
        range: true,
        rootClass: 'root-cls',
        classes: { rail: 'rail-cls', track: 'track-cls', handle: 'handle-cls' },
        styles: { rail: { height: '6px' }, handle: { color: 'red' } },
        ariaLabelForHandle: ['min', 'max'],
      },
      attrs: { 'class': 'custom', 'style': 'margin: 1px', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-slider-rail').classes()).toContain('rail-cls')
    expect(wrapper.find('.am-slider-rail').attributes('style')).toContain('height: 6px')
    expect(wrapper.find('.am-slider-track').classes()).toContain('track-cls')
    const handles = wrapper.findAll('.am-slider-handle')
    expect(handles[0].classes()).toContain('handle-cls')
    expect(handles[0].attributes('style')).toContain('color: red')
    expect(handles.map(n => n.attributes('aria-label'))).toEqual(['min', 'max'])
  })

  it('exposes focus / blur and emits focus / blur', async () => {
    const wrapper = mount(Slider, { attachTo: document.body })
    ;(wrapper.vm as any).focus()
    await nextTick()
    expect(document.activeElement).toBe(wrapper.find('.am-slider-handle').element)
    expect(wrapper.emitted('focus')).toHaveLength(1)
    ;(wrapper.vm as any).blur()
    await nextTick()
    expect(wrapper.emitted('blur')).toHaveLength(1)
  })

  it('reports change / blur to FormItem and takes its id', async () => {
    mockRect()
    const onFieldChange = vi.fn()
    const onFieldBlur = vi.fn()
    const wrapper = mount({
      setup() {
        provide(formItemInputContextKey, {
          status: { value: '' } as any,
          id: { value: 'form_slider' } as any,
          onFieldChange,
          onFieldBlur,
          isFormItemInput: true,
        })
        return () => h(Slider, { range: true })
      },
    })
    const handles = wrapper.findAll('.am-slider-handle')
    expect(handles[0].attributes('id')).toBe('form_slider')
    expect(handles[1].attributes('id')).toBeUndefined()
    await wrapper.find('.am-slider').trigger('touchstart', touches(100))
    expect(onFieldChange).toHaveBeenCalledTimes(1)
    await handles[0].trigger('blur')
    expect(onFieldBlur).toHaveBeenCalledTimes(1)
  })
})
