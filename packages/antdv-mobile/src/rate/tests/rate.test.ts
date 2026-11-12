import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, provide } from 'vue'
import Rate from '..'
import ConfigProvider from '../../config-provider'
import { formItemInputContextKey } from '../../form/context'

/** Every star is 20px wide with a 10px gap: star i covers [i * 30, i * 30 + 20]. */
function mockRects(rtl = false) {
  return vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const index = Number(this.dataset.index ?? 0)
    const left = (rtl ? 4 - index : index) * 30
    return { left, right: left + 20, width: 20, top: 0, bottom: 20, height: 20, x: left, y: 0, toJSON() {} } as DOMRect
  })
}

function touches(x: number, y = 10) {
  return { touches: [{ clientX: x, clientY: y }] }
}

function lastChange(wrapper: any) {
  const list = wrapper.emitted('change') ?? []
  return list[list.length - 1]?.[0]
}

describe('Rate', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders 5 stars and base classes', () => {
    const wrapper = mount(Rate)
    expect(wrapper.classes()).toContain('am-rate')
    expect(wrapper.attributes('role')).toBe('radiogroup')
    expect(wrapper.findAll('.am-rate-star')).toHaveLength(5)
    expect(wrapper.findAll('.am-rate-star-zero')).toHaveLength(5)
  })

  it('supports count, defaultValue and allowHalf', () => {
    const wrapper = mount(Rate, { props: { count: 8, defaultValue: 2.5, allowHalf: true } })
    expect(wrapper.findAll('.am-rate-star')).toHaveLength(8)
    expect(wrapper.findAll('.am-rate-star-full')).toHaveLength(2)
    expect(wrapper.findAll('.am-rate-star-half')).toHaveLength(1)
    expect(wrapper.findAll('.am-rate-star-zero')).toHaveLength(5)
  })

  it('works uncontrolled and emits update:value + change on tap', async () => {
    const wrapper = mount(Rate)
    await wrapper.findAll('.am-rate-star')[2].trigger('click')
    expect(wrapper.emitted('update:value')?.[0]).toEqual([3])
    expect(wrapper.emitted('change')?.[0]).toEqual([3])
    expect(wrapper.findAll('.am-rate-star-full')).toHaveLength(3)
  })

  it('is controlled by value', async () => {
    const wrapper = mount(Rate, { props: { value: 1 } })
    await wrapper.findAll('.am-rate-star')[3].trigger('click')
    expect(wrapper.emitted('change')?.[0]).toEqual([4])
    expect(wrapper.findAll('.am-rate-star-full')).toHaveLength(1)
    await wrapper.setProps({ value: 4 })
    expect(wrapper.findAll('.am-rate-star-full')).toHaveLength(4)
  })

  it('clears on tapping the current value only when allowClear', async () => {
    const wrapper = mount(Rate, { props: { defaultValue: 3 } })
    await wrapper.findAll('.am-rate-star')[2].trigger('click')
    expect(wrapper.emitted('change')?.[0]).toEqual([0])

    const keep = mount(Rate, { props: { defaultValue: 3, allowClear: false } })
    await keep.findAll('.am-rate-star')[2].trigger('click')
    expect(keep.emitted('change')).toBeUndefined()
  })

  it('selects half a star when tapping the leading half', async () => {
    mockRects()
    const wrapper = mount(Rate, { props: { allowHalf: true } })
    await wrapper.findAll('.am-rate-star')[1].trigger('click', { clientX: 34 })
    expect(wrapper.emitted('change')?.[0]).toEqual([1.5])
    await wrapper.findAll('.am-rate-star')[1].trigger('click', { clientX: 46 })
    expect(wrapper.emitted('change')?.[1]).toEqual([2])
  })

  it('rates by dragging across the stars', async () => {
    mockRects()
    const wrapper = mount(Rate, { props: { allowHalf: true } })
    await wrapper.trigger('touchstart', touches(5))
    await wrapper.trigger('touchmove', touches(65))
    expect(lastChange(wrapper)).toBe(2.5)
    await wrapper.trigger('touchmove', touches(110))
    expect(lastChange(wrapper)).toBe(4)
    await wrapper.trigger('touchmove', touches(-20))
    expect(lastChange(wrapper)).toBe(0)
    await wrapper.trigger('touchend')
    expect(wrapper.findAll('.am-rate-star-full')).toHaveLength(0)
  })

  it('keeps at least one step while dragging when allowClear is false, ignores vertical moves', async () => {
    mockRects()
    const wrapper = mount(Rate, { props: { allowClear: false, defaultValue: 3 } })
    await wrapper.trigger('touchstart', touches(70))
    await wrapper.trigger('touchmove', touches(-20))
    expect(lastChange(wrapper)).toBe(1)
    await wrapper.trigger('touchend')

    const vertical = mount(Rate)
    await vertical.trigger('touchstart', touches(70, 0))
    await vertical.trigger('touchmove', touches(72, 60))
    expect(vertical.emitted('change')).toBeUndefined()
  })

  it('mirrors the drag direction in RTL', async () => {
    mockRects(true)
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: { default: () => h(Rate, { allowHalf: true }) },
    })
    const rate = wrapper.findComponent(Rate)
    await rate.trigger('touchstart', touches(140))
    // the last star covers [0, 20] and its leading edge is on the right in RTL
    await rate.trigger('touchmove', touches(12))
    expect(lastChange(rate)).toBe(4.5)
    await rate.trigger('touchmove', touches(100))
    expect(lastChange(rate)).toBe(2)
  })

  it('does nothing when disabled', async () => {
    mockRects()
    const wrapper = mount(Rate, { props: { disabled: true, defaultValue: 2 } })
    expect(wrapper.classes()).toContain('am-rate-disabled')
    expect(wrapper.attributes('tabindex')).toBe('-1')
    await wrapper.findAll('.am-rate-star')[4].trigger('click')
    await wrapper.trigger('touchstart', touches(5))
    await wrapper.trigger('touchmove', touches(110))
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('supports keyboard arrows and can turn them off', async () => {
    const wrapper = mount(Rate, { props: { allowHalf: true, defaultValue: 1 } })
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(lastChange(wrapper)).toBe(1.5)
    await wrapper.trigger('keydown', { key: 'ArrowLeft' })
    expect(lastChange(wrapper)).toBe(1)
    expect(wrapper.emitted('keydown')).toHaveLength(2)

    const off = mount(Rate, { props: { keyboard: false } })
    await off.trigger('keydown', { key: 'ArrowRight' })
    expect(off.emitted('change')).toBeUndefined()
  })

  it('renders the default star when no character is given', () => {
    const wrapper = mount(Rate, { props: { count: 2 } })
    expect(wrapper.findAll('.am-rate-star-second .anticon')).toHaveLength(2)
    expect(wrapper.findAll('.am-rate-star-first .anticon')).toHaveLength(2)
  })

  it('character slot takes priority over the character prop and receives context', () => {
    const byProp = mount(Rate, { props: { count: 3, character: ({ index }: { index: number }) => h('i', { class: 'prop-char' }, index + 1) } })
    expect(byProp.findAll('.am-rate-star-second .prop-char').map(n => n.text())).toEqual(['1', '2', '3'])
    const bySlot = mount(Rate, {
      props: { character: 'A', defaultValue: 2 },
      slots: { character: ({ index, value }: { index: number, value: number }) => h('i', { class: 'slot-char' }, `${index}-${value}`) },
    })
    expect(bySlot.find('.am-rate-star-second .slot-char').text()).toBe('0-2')
    expect(bySlot.text()).not.toContain('A')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Rate, {
      props: { rootClass: 'root-cls', classes: { root: 'r', star: 'star-cls' }, styles: { star: { color: 'red' } }, size: 'large' },
      attrs: { 'class': 'custom', 'style': 'margin: 1px', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r', 'am-rate-lg']))
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.attributes('data-id')).toBe('x')
    const star = wrapper.find('.am-rate-star')
    expect(star.classes()).toContain('star-cls')
    expect(star.attributes('style')).toContain('color: red')
  })

  it('follows ConfigProvider componentSize and componentDisabled', () => {
    const wrapper = mount(ConfigProvider, {
      props: { componentSize: 'small', componentDisabled: true },
      slots: { default: () => h(Rate) },
    })
    expect(wrapper.find('.am-rate').classes()).toEqual(expect.arrayContaining(['am-rate-sm', 'am-rate-disabled']))
  })

  it('exposes focus / blur and emits focus / blur', async () => {
    const wrapper = mount(Rate, { attachTo: document.body })
    ;(wrapper.vm as any).focus()
    await nextTick()
    expect(document.activeElement).toBe(wrapper.element)
    expect(wrapper.emitted('focus')).toHaveLength(1)
    ;(wrapper.vm as any).blur()
    await nextTick()
    expect(wrapper.emitted('blur')).toHaveLength(1)
  })

  it('reports change / blur to FormItem and takes its id', async () => {
    const onFieldChange = vi.fn()
    const onFieldBlur = vi.fn()
    const wrapper = mount({
      setup() {
        provide(formItemInputContextKey, {
          status: { value: '' } as any,
          id: { value: 'form_rate' } as any,
          onFieldChange,
          onFieldBlur,
          isFormItemInput: true,
        })
        return () => h(Rate)
      },
    })
    const rate = wrapper.find('.am-rate')
    expect(rate.attributes('id')).toBe('form_rate')
    await rate.findAll('.am-rate-star')[0].trigger('click')
    expect(onFieldChange).toHaveBeenCalledTimes(1)
    await rate.trigger('blur')
    expect(onFieldBlur).toHaveBeenCalledTimes(1)
  })
})
