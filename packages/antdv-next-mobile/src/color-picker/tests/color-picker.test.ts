import type { Color, ColorPickerPanelRenderInfo } from '..'
import { DOMWrapper, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, h, nextTick } from 'vue'
import ColorPicker, { ColorPickerPanel } from '..'
import ConfigProvider from '../../config-provider'
import { formItemInputContextKey } from '../../form/context'
import enUS from '../../locale/en_US'
import { AggregationColor } from '../color'

const RECT = { left: 0, top: 0, right: 200, bottom: 100, width: 200, height: 100, x: 0, y: 0, toJSON: () => ({}) }

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(RECT as DOMRect)
})

const $ = (selector: string, root: ParentNode = document) => new DOMWrapper(root.querySelector<HTMLElement>(selector)!)
const exists = (selector: string) => !!document.querySelector(selector)

async function drag(selector: string, points: [number, number][], root: ParentNode = document, end = true) {
  const el = $(selector, root)
  const [first, ...rest] = points
  await el.trigger('touchstart', { touches: [{ clientX: first[0], clientY: first[1] }] })
  for (const [clientX, clientY] of rest)
    await el.trigger('touchmove', { touches: [{ clientX, clientY }] })
  if (end)
    await el.trigger('touchend', { touches: [] })
}

function clickButton(type: 'confirm' | 'cancel') {
  document.querySelector<HTMLElement>(`.am-picker-popup-${type}`)!.click()
  return nextTick()
}

const lastEmit = (wrapper: { emitted: (name: string) => unknown[][] | undefined }, name: string) => wrapper.emitted(name)!.slice(-1)[0] as any[]

function formItemProvide(overrides: Record<string, unknown> = {}) {
  const onFieldChange = vi.fn()
  const onFieldBlur = vi.fn()
  return {
    onFieldChange,
    onFieldBlur,
    provide: {
      [formItemInputContextKey as symbol]: {
        status: computed(() => 'error'),
        id: computed(() => 'color'),
        onFieldChange,
        onFieldBlur,
        isFormItemInput: true,
        ...overrides,
      },
    },
  }
}

const presets = [
  { label: 'Brand', colors: ['#1677ff', '#52c41a', 'rgba(250, 173, 20, 0.5)'] },
  { label: 'Hidden', colors: ['#000000'], defaultOpen: false, key: 'hidden' },
  { label: 'Nothing', colors: [] },
]

describe('ColorPickerPanel', () => {
  it('renders the palette, sliders, format switch and inputs', () => {
    const wrapper = mount(ColorPickerPanel, { props: { defaultValue: '#1677ff' } })
    expect(wrapper.classes()).toContain('am-color-picker-panel')
    expect(wrapper.find('.am-color-picker-palette').exists()).toBe(true)
    expect(wrapper.findAll('.am-color-picker-slider')).toHaveLength(2)
    expect(wrapper.find('.am-color-picker-slider-hue').exists()).toBe(true)
    expect(wrapper.find('.am-color-picker-slider-alpha').exists()).toBe(true)
    expect(wrapper.findAll('.am-segmented-item').map(item => item.text())).toEqual(['HEX', 'HSB', 'RGB'])
    expect(wrapper.find<HTMLInputElement>('.am-color-picker-hex-input input').element.value).toBe('1677ff')
    expect(wrapper.find<HTMLInputElement>('.am-color-picker-alpha-input input').element.value).toBe('100')
    // no clear button, no presets by default
    expect(wrapper.find('.am-color-picker-clear').exists()).toBe(false)
    expect(wrapper.find('.am-color-picker-presets').exists()).toBe(false)
    // handle follows saturation / brightness
    const handle = wrapper.find<HTMLElement>('.am-color-picker-palette-handle').element
    expect(handle.style.left).toBe(`${(233 / 255) * 100}%`)
    expect(handle.style.top).toBe('0%')
    expect(wrapper.find<HTMLElement>('.am-color-picker-slider-hue .am-color-picker-slider-handle').attributes('aria-valuenow')).toBe('215')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(ColorPickerPanel, {
      props: {
        rootClass: 'my-root',
        classes: { root: 'c-root', palette: 'c-palette', slider: 'c-slider', input: 'c-input', presets: 'c-presets' },
        styles: { root: { margin: '1px' }, palette: { height: '80px' } },
        presets,
      },
      attrs: { 'class': 'from-attrs', 'data-test': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-color-picker-panel', 'my-root', 'c-root', 'from-attrs']))
    expect(wrapper.attributes('data-test')).toBe('x')
    expect((wrapper.element as HTMLElement).style.margin).toBe('1px')
    expect(wrapper.find('.am-color-picker-palette').classes()).toContain('c-palette')
    expect(wrapper.find<HTMLElement>('.am-color-picker-palette').element.style.height).toBe('80px')
    expect(wrapper.find('.am-color-picker-slider-container').classes()).toContain('c-slider')
    expect(wrapper.find('.am-color-picker-input-container').classes()).toContain('c-input')
    expect(wrapper.find('.am-color-picker-presets').classes()).toContain('c-presets')
  })

  it('drags the palette: change while moving, changeComplete on touchend (uncontrolled)', async () => {
    const wrapper = mount(ColorPickerPanel, { props: { defaultValue: '#1677ff' } })
    await drag('.am-color-picker-palette', [[100, 50], [200, 0], [400, -20]], wrapper.element, false)
    expect(wrapper.emitted('change')).toHaveLength(3)
    expect(wrapper.emitted('changeComplete')).toBeUndefined()
    const [first, css] = wrapper.emitted('change')![0] as [Color, string]
    expect(first).toBeInstanceOf(AggregationColor)
    expect(first.toHsb()).toEqual({ h: 215, s: 0.5, b: 0.5, a: 1 })
    expect(css).toBe(first.toRgbString())
    // clamped to the box
    expect((lastEmit(wrapper, 'change')[0] as Color).toHexString()).toBe('#006aff')
    expect(lastEmit(wrapper, 'update:value')[0]).toBe(lastEmit(wrapper, 'change')[0])
    expect(wrapper.find('.am-color-picker-palette').classes()).toContain('am-color-picker-palette-dragging')

    await wrapper.find('.am-color-picker-palette').trigger('touchend', { touches: [] })
    expect(wrapper.emitted('changeComplete')).toHaveLength(1)
    expect((lastEmit(wrapper, 'changeComplete')[0] as Color).toHexString()).toBe('#006aff')
    expect(wrapper.find('.am-color-picker-palette').classes()).not.toContain('am-color-picker-palette-dragging')
    // uncontrolled: the panel follows
    expect(wrapper.find<HTMLInputElement>('.am-color-picker-hex-input input').element.value).toBe('006aff')
    expect(wrapper.find<HTMLElement>('.am-color-picker-palette-handle').element.style.left).toBe('100%')
  })

  it('keeps the hue while the color is black / grey', async () => {
    const wrapper = mount(ColorPickerPanel, { props: { defaultValue: '#1677ff', valueFormat: 'hex' } })
    await drag('.am-color-picker-palette', [[0, 100]], wrapper.element)
    expect(lastEmit(wrapper, 'update:value')[0]).toBe('#000000')
    expect(wrapper.find('.am-color-picker-slider-hue .am-color-picker-slider-handle').attributes('aria-valuenow')).toBe('215')
    await drag('.am-color-picker-palette', [[200, 0]], wrapper.element)
    expect(lastEmit(wrapper, 'update:value')[0]).toBe('#006aff')
  })

  it('is controlled by value and emits the valueFormat output', async () => {
    const wrapper = mount(ColorPickerPanel, { props: { value: '#1677ff', valueFormat: 'rgb' } })
    await drag('.am-color-picker-palette', [[200, 0]], wrapper.element)
    expect(lastEmit(wrapper, 'update:value')[0]).toBe('rgb(0,106,255)')
    // the parent did not accept it
    expect(wrapper.find<HTMLInputElement>('.am-color-picker-hex-input input').element.value).toBe('1677ff')
    await wrapper.setProps({ value: 'rgb(0,106,255)' })
    expect(wrapper.find<HTMLInputElement>('.am-color-picker-hex-input input').element.value).toBe('006aff')

    await wrapper.setProps({ valueFormat: (color: Color) => color.toHexString().toUpperCase() })
    await drag('.am-color-picker-palette', [[0, 0]], wrapper.element)
    expect(lastEmit(wrapper, 'update:value')[0]).toBe('#FFFFFF')
  })

  it('drags the hue and alpha sliders', async () => {
    const wrapper = mount(ColorPickerPanel, { props: { defaultValue: '#1677ff' } })
    await drag('.am-color-picker-slider-hue', [[0, 5], [100, 5]], wrapper.element)
    expect(wrapper.emitted('change')).toHaveLength(2)
    expect((wrapper.emitted('change')![0][0] as Color).toHsb().h).toBe(0)
    expect((lastEmit(wrapper, 'change')[0] as Color).toHsb().h).toBe(180)
    expect(wrapper.emitted('changeComplete')).toHaveLength(1)

    await drag('.am-color-picker-slider-alpha', [[50, 5]], wrapper.element)
    const color = lastEmit(wrapper, 'change')[0] as Color
    expect(color.toHsb().a).toBe(0.25)
    expect(wrapper.emitted('changeComplete')).toHaveLength(2)
    expect(wrapper.find<HTMLInputElement>('.am-color-picker-alpha-input input').element.value).toBe('25')
    expect(wrapper.find('.am-color-picker-slider-alpha .am-color-picker-slider-handle').attributes('aria-valuenow')).toBe('25')
  })

  it('moves a slider with the arrow keys', async () => {
    const wrapper = mount(ColorPickerPanel, { props: { defaultValue: '#1677ff' } })
    await wrapper.find('.am-color-picker-slider-hue .am-color-picker-slider-handle').trigger('keydown', { key: 'ArrowRight' })
    expect((lastEmit(wrapper, 'change')[0] as Color).toHsb().h).toBe(216)
    expect(wrapper.emitted('changeComplete')).toHaveLength(1)
    await wrapper.find('.am-color-picker-slider-alpha .am-color-picker-slider-handle').trigger('keydown', { key: 'ArrowLeft' })
    expect((lastEmit(wrapper, 'change')[0] as Color).toHsb().a).toBe(0.99)
  })

  it('disabledAlpha hides the alpha controls and makes colors opaque', async () => {
    const wrapper = mount(ColorPickerPanel, { props: { defaultValue: '#1677ff', disabledAlpha: true, presets } })
    expect(wrapper.find('.am-color-picker-slider-alpha').exists()).toBe(false)
    expect(wrapper.find('.am-color-picker-alpha-input').exists()).toBe(false)
    await wrapper.findAll('.am-color-picker-presets-color')[2].trigger('click')
    expect((lastEmit(wrapper, 'change')[0] as Color).toRgbString()).toBe('rgb(250,173,20)')
  })

  it('switches the format (uncontrolled, defaultFormat, controlled)', async () => {
    const wrapper = mount(ColorPickerPanel, { props: { defaultValue: '#1677ff', defaultFormat: 'rgb' } })
    const values = () => wrapper.findAll<HTMLInputElement>('.am-color-picker-input input').map(input => input.element.value)
    expect(wrapper.find('.am-color-picker-rgb-input').exists()).toBe(true)
    expect(values()).toEqual(['22', '119', '255'])

    await wrapper.findAll('.am-segmented-item')[1].trigger('click')
    expect(wrapper.emitted('formatChange')![0]).toEqual(['hsb'])
    expect(wrapper.emitted('update:format')![0]).toEqual(['hsb'])
    expect(wrapper.find('.am-color-picker-hsb-input').exists()).toBe(true)
    expect(values()).toEqual(['215', '91', '100'])

    await wrapper.setProps({ format: 'hex' })
    expect(wrapper.find('.am-color-picker-hex-input').exists()).toBe(true)
    await wrapper.findAll('.am-segmented-item')[2].trigger('click')
    expect(lastEmit(wrapper, 'formatChange')).toEqual(['rgb'])
    // controlled: stays until the parent updates
    expect(wrapper.find('.am-color-picker-hex-input').exists()).toBe(true)
  })

  it('disabledFormat hides the format switch', () => {
    const wrapper = mount(ColorPickerPanel, { props: { disabledFormat: true } })
    expect(wrapper.find('.am-segmented').exists()).toBe(false)
    expect(wrapper.find('.am-color-picker-hex-input').exists()).toBe(true)
  })

  it('types a hex value', async () => {
    const wrapper = mount(ColorPickerPanel, { props: { defaultValue: '#1677ff' } })
    const input = wrapper.find<HTMLInputElement>('.am-color-picker-hex-input input')
    await input.setValue('52c4')
    expect(wrapper.emitted('change')).toBeUndefined()
    await input.setValue('#52C41A')
    expect((lastEmit(wrapper, 'change')[0] as Color).toHexString()).toBe('#52c41a')
    expect(wrapper.emitted('changeComplete')).toHaveLength(1)
    await nextTick()
    expect(input.element.value).toBe('52c41a')
    // 8 digits carry the alpha
    await input.setValue('52c41a80')
    expect((lastEmit(wrapper, 'change')[0] as Color).toHexString()).toBe('#52c41a80')
    expect(wrapper.find<HTMLInputElement>('.am-color-picker-alpha-input input').element.value).toBe('50')
  })

  it('types rgb / hsb / alpha numbers', async () => {
    const wrapper = mount(ColorPickerPanel, { props: { defaultValue: '#1677ff', defaultFormat: 'rgb' } })
    await wrapper.findAll<HTMLInputElement>('.am-color-picker-input input')[0].setValue('255')
    expect((lastEmit(wrapper, 'change')[0] as Color).toRgbString()).toBe('rgb(255,119,255)')
    // an emptied field keeps the color
    const count = wrapper.emitted('change')!.length
    await wrapper.findAll<HTMLInputElement>('.am-color-picker-input input')[1].setValue('')
    expect(wrapper.emitted('change')).toHaveLength(count)

    await wrapper.find<HTMLInputElement>('.am-color-picker-alpha-input input').setValue('40')
    expect((lastEmit(wrapper, 'change')[0] as Color).toRgb().a).toBe(0.4)

    await wrapper.setProps({ format: 'hsb' })
    await wrapper.findAll<HTMLInputElement>('.am-color-picker-input input')[1].setValue('50')
    const hsb = (lastEmit(wrapper, 'change')[0] as Color).toHsb()
    expect(hsb.s).toBe(0.5)
    expect(hsb.a).toBe(0.4)
  })

  it('renders presets: groups, checked color, defaultOpen, empty text, select', async () => {
    const wrapper = mount(ColorPickerPanel, { props: { defaultValue: '#52c41a', presets } })
    expect(wrapper.findAll('.am-color-picker-presets-label').map(label => label.text())).toEqual(['Brand', 'Hidden', 'Nothing'])
    const items = wrapper.findAll('.am-collapse-item')
    expect(items[0].classes()).toContain('am-collapse-item-active')
    expect(items[1].classes()).not.toContain('am-collapse-item-active')
    expect(wrapper.find('.am-color-picker-presets-empty').text()).toBe('暂无')

    const colors = wrapper.findAll('.am-color-picker-presets-color')
    expect(colors[1].classes()).toContain('am-color-picker-presets-color-checked')
    expect(colors[0].classes()).not.toContain('am-color-picker-presets-color-checked')
    expect(colors[2].classes()).toContain('am-color-picker-presets-color-translucent')
    expect(colors[0].find<HTMLElement>('.am-color-picker-block-inner').element.style.background).toBe('rgb(22, 119, 255)')

    await colors[0].trigger('click')
    expect((lastEmit(wrapper, 'change')[0] as Color).toHexString()).toBe('#1677ff')
    expect(wrapper.emitted('changeComplete')).toHaveLength(1)
    expect(wrapper.findAll('.am-color-picker-presets-color')[0].classes()).toContain('am-color-picker-presets-color-checked')

    // collapsible
    await items[0].find('.am-collapse-header').trigger('click')
    expect(wrapper.findAll('.am-collapse-item')[0].classes()).not.toContain('am-collapse-item-active')
  })

  it('allowClear: clears the color and picks again from a cleared one', async () => {
    const wrapper = mount(ColorPickerPanel, { props: { defaultValue: '#1677ff', allowClear: true, valueFormat: 'hex' } })
    await wrapper.find('.am-color-picker-clear').trigger('click')
    expect(wrapper.emitted('clear')).toHaveLength(1)
    const cleared = lastEmit(wrapper, 'change')[0] as Color
    expect(cleared.cleared).toBe(true)
    expect(lastEmit(wrapper, 'update:value')[0]).toBe('#1677ff00')
    expect(wrapper.emitted('changeComplete')).toHaveLength(1)
    expect(wrapper.find('.am-color-picker-swatch').classes()).toContain('am-color-picker-block-cleared')
    expect(wrapper.find('.am-color-picker-clear').attributes('disabled')).toBeDefined()

    // picking makes it opaque again
    await drag('.am-color-picker-palette', [[200, 0]], wrapper.element)
    const picked = lastEmit(wrapper, 'change')[0] as Color
    expect(picked.cleared).toBe(false)
    expect(picked.toRgb().a).toBe(1)
  })

  it('starts from a saturated color when a slider moves on an empty value', async () => {
    const wrapper = mount(ColorPickerPanel)
    expect(wrapper.find('.am-color-picker-swatch').classes()).toContain('am-color-picker-block-cleared')
    await drag('.am-color-picker-slider-hue', [[100, 5]], wrapper.element)
    expect((lastEmit(wrapper, 'change')[0] as Color).toHsb()).toEqual({ h: 180, s: 1, b: 1, a: 1 })
  })

  it('ignores gestures when disabled (prop and ConfigProvider)', async () => {
    const wrapper = mount(ColorPickerPanel, { props: { defaultValue: '#1677ff', disabled: true, presets, allowClear: true } })
    expect(wrapper.classes()).toContain('am-color-picker-panel-disabled')
    await drag('.am-color-picker-palette', [[100, 50]], wrapper.element)
    await drag('.am-color-picker-slider-hue', [[100, 5]], wrapper.element)
    await wrapper.find('.am-color-picker-presets-color').trigger('click')
    await wrapper.find('.am-color-picker-clear').trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.emitted('clear')).toBeUndefined()
    expect(wrapper.find<HTMLInputElement>('.am-color-picker-hex-input input').element.disabled).toBe(true)

    const provider = mount(ConfigProvider, {
      props: { componentDisabled: true },
      slots: { default: () => h(ColorPickerPanel, { defaultValue: '#1677ff' }) },
    })
    expect(provider.find('.am-color-picker-panel').classes()).toContain('am-color-picker-panel-disabled')
  })

  it('panelRender: the slot wins over the prop', () => {
    const panelRender = ({ panel }: ColorPickerPanelRenderInfo) => h('div', { class: 'from-prop' }, [panel])
    const withProp = mount(ColorPickerPanel, { props: { panelRender, presets } })
    expect(withProp.find('.from-prop .am-color-picker-palette').exists()).toBe(true)
    expect(withProp.find('.from-prop .am-color-picker-presets').exists()).toBe(true)

    const withSlot = mount(ColorPickerPanel, {
      props: { panelRender, presets },
      slots: {
        panelRender: ({ extra }: ColorPickerPanelRenderInfo) => h('div', { class: 'from-slot' }, [h(extra.components.Presets)]),
      },
    })
    expect(withSlot.find('.from-prop').exists()).toBe(false)
    expect(withSlot.find('.from-slot .am-color-picker-presets').exists()).toBe(true)
    expect(withSlot.find('.am-color-picker-palette').exists()).toBe(false)
  })

  it('reports to the FormItem without leaking its context into the inner inputs', async () => {
    const form = formItemProvide()
    const wrapper = mount(ColorPickerPanel, { props: { defaultValue: '#1677ff' }, global: { provide: form.provide } })
    const input = wrapper.find<HTMLInputElement>('.am-color-picker-hex-input input')
    expect(input.attributes('id')).toBeUndefined()
    expect(wrapper.find('.am-input-status-error').exists()).toBe(false)
    await input.setValue('52c41a')
    await input.trigger('blur')
    expect(form.onFieldChange).toHaveBeenCalledTimes(1)
    expect(form.onFieldBlur).not.toHaveBeenCalled()
  })

  it('uses the locale of the ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(ColorPickerPanel, { allowClear: true, presets: [{ label: 'None', colors: [] }] }) },
    })
    expect(wrapper.find('.am-color-picker-presets-empty').text()).toBe('Empty')
    expect(wrapper.find('.am-color-picker-clear').text()).toBe('Clear')
  })
})

describe('ColorPicker', () => {
  it('renders a swatch trigger', () => {
    const wrapper = mount(ColorPicker, { props: { defaultValue: '#1677ff' } })
    const trigger = wrapper.find('.am-color-picker')
    expect(trigger.classes()).toEqual(expect.arrayContaining(['am-picker-trigger', 'am-color-picker']))
    expect(trigger.find<HTMLElement>('.am-color-picker-block-inner').element.style.background).toBe('rgb(22, 119, 255)')
    expect(trigger.find('.am-color-picker-trigger-text').exists()).toBe(false)
    expect(trigger.find('.am-picker-trigger-suffix').exists()).toBe(false)
    expect(exists('.am-color-picker-palette')).toBe(false)
  })

  it('shows the "no color" mark without a value', () => {
    const wrapper = mount(ColorPicker, { props: { showText: true } })
    expect(wrapper.find('.am-color-picker-block').classes()).toContain('am-color-picker-block-cleared')
    expect(wrapper.find('.am-color-picker-trigger-text').text()).toBe('无色')
  })

  it('showText follows the format', async () => {
    const wrapper = mount(ColorPicker, { props: { value: '#1677ff', showText: true } })
    const text = () => wrapper.find('.am-color-picker-trigger-text').text()
    expect(text()).toBe('#1677FF')
    await wrapper.setProps({ value: '#1677ff80' })
    expect(text()).toBe('#1677FF,50%')
    await wrapper.setProps({ format: 'rgb' })
    expect(text()).toBe('rgba(22,119,255,0.5019607843137255)')
    await wrapper.setProps({ format: 'hsb', value: 'hsb(215, 91%, 100%)' })
    expect(text()).toBe('hsb(215, 91%, 100%)')
  })

  it('showText: function prop, and the slot wins', () => {
    const showText = ({ color }: { color: Color }) => `fn ${color.toHexString()}`
    const withProp = mount(ColorPicker, { props: { value: '#1677ff', showText } })
    expect(withProp.find('.am-color-picker-trigger-text').text()).toBe('fn #1677ff')

    const withSlot = mount(ColorPicker, {
      props: { value: '#1677ff', showText },
      slots: { showText: ({ color }: { color: Color }) => `slot ${color.toRgbString()}` },
    })
    expect(withSlot.find('.am-color-picker-trigger-text').text()).toBe('slot rgb(22,119,255)')
  })

  it('passes attrs, rootClass, classes and styles', async () => {
    const wrapper = mount(ColorPicker, {
      props: {
        value: '#1677ff',
        showText: true,
        defaultOpen: true,
        rootClass: 'my-root',
        classes: { root: 'c-root', body: 'c-body', content: 'c-content', description: 'c-desc', popup: 'c-popup' },
        styles: { root: { margin: '1px' }, description: { color: 'red' } },
      },
      attrs: { 'class': 'from-attrs', 'data-test': 'x' },
    })
    await nextTick()
    const trigger = wrapper.find('.am-color-picker')
    expect(trigger.classes()).toEqual(expect.arrayContaining(['my-root', 'c-root', 'from-attrs']))
    expect(trigger.attributes('data-test')).toBe('x')
    expect((trigger.element as HTMLElement).style.margin).toBe('1px')
    expect(trigger.find('.am-color-picker-block').classes()).toContain('c-body')
    expect(trigger.find('.am-color-picker-block-inner').classes()).toContain('c-content')
    expect(trigger.find('.am-color-picker-trigger-text').classes()).toContain('c-desc')
    expect(trigger.find<HTMLElement>('.am-color-picker-trigger-text').element.style.color).toBe('red')
    expect(exists('.am-picker-popup.c-popup')).toBe(true)
    expect(exists('.am-picker-popup-root.my-root')).toBe(true)
  })

  it('opens / closes (uncontrolled) and emits openChange', async () => {
    const wrapper = mount(ColorPicker, { props: { defaultValue: '#1677ff' } })
    await wrapper.find('.am-color-picker').trigger('click')
    expect(wrapper.emitted('update:open')![0]).toEqual([true])
    expect(wrapper.emitted('openChange')![0]).toEqual([true])
    expect(wrapper.find('.am-color-picker').classes()).toContain('am-picker-trigger-open')
    expect(exists('.am-color-picker-popup-panel .am-color-picker-palette')).toBe(true)
    await clickButton('cancel')
    expect(lastEmit(wrapper, 'openChange')).toEqual([false])
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.find('.am-color-picker').classes()).not.toContain('am-picker-trigger-open')
  })

  it('is controlled by open', async () => {
    const wrapper = mount(ColorPicker, { props: { open: false } })
    await wrapper.find('.am-color-picker').trigger('click')
    expect(wrapper.emitted('update:open')![0]).toEqual([true])
    expect(wrapper.find('.am-color-picker').classes()).not.toContain('am-picker-trigger-open')
    await wrapper.setProps({ open: true })
    expect(wrapper.find('.am-color-picker').classes()).toContain('am-picker-trigger-open')
    expect(exists('.am-color-picker-palette')).toBe(true)
  })

  it('keeps a pending color while dragging and commits it on confirm', async () => {
    const wrapper = mount(ColorPicker, { props: { defaultValue: '#1677ff', showText: true, defaultOpen: true } })
    await nextTick()
    await drag('.am-color-picker-palette', [[100, 50], [200, 0]], document, false)
    expect(wrapper.emitted('select')).toHaveLength(2)
    expect(lastEmit(wrapper, 'select')[1]).toBe('rgb(0,106,255)')
    expect(wrapper.emitted('changeComplete')).toBeUndefined()
    await $('.am-color-picker-palette').trigger('touchend', { touches: [] })
    expect((lastEmit(wrapper, 'changeComplete')[0] as Color).toHexString()).toBe('#006aff')
    // nothing committed yet
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.emitted('update:value')).toBeUndefined()
    expect(wrapper.find('.am-color-picker-trigger-text').text()).toBe('#1677FF')
    expect(document.querySelector<HTMLInputElement>('.am-color-picker-hex-input input')!.value).toBe('006aff')

    await clickButton('confirm')
    const [color, css] = lastEmit(wrapper, 'change') as [Color, string]
    expect(color.toHexString()).toBe('#006aff')
    expect(css).toBe('rgb(0,106,255)')
    expect(lastEmit(wrapper, 'update:value')[0]).toBe(color)
    expect(lastEmit(wrapper, 'confirm')[0]).toBe(color)
    expect(lastEmit(wrapper, 'openChange')).toEqual([false])
    expect(wrapper.find('.am-color-picker-trigger-text').text()).toBe('#006AFF')
  })

  it('discards the pending color on cancel and does not emit change for an unchanged confirm', async () => {
    const wrapper = mount(ColorPicker, { props: { defaultValue: '#1677ff', showText: true } })
    await wrapper.find('.am-color-picker').trigger('click')
    await drag('.am-color-picker-palette', [[0, 100]])
    await clickButton('cancel')
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.find('.am-color-picker-trigger-text').text()).toBe('#1677FF')

    await wrapper.find('.am-color-picker').trigger('click')
    // reopened with the committed color
    expect(document.querySelector<HTMLInputElement>('.am-color-picker-hex-input input')!.value).toBe('1677ff')
    await clickButton('confirm')
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
  })

  it('is controlled by value and formats update:value with valueFormat', async () => {
    const wrapper = mount(ColorPicker, { props: { value: '#1677ff', valueFormat: 'hex', showText: true, defaultOpen: true } })
    await nextTick()
    await drag('.am-color-picker-slider-hue', [[0, 5]])
    await clickButton('confirm')
    expect(lastEmit(wrapper, 'update:value')).toEqual(['#ff1616'])
    expect(wrapper.find('.am-color-picker-trigger-text').text()).toBe('#1677FF')
    await wrapper.setProps({ value: '#ff1616' })
    expect(wrapper.find('.am-color-picker-trigger-text').text()).toBe('#FF1616')
  })

  it('allowClear commits the cleared color on confirm', async () => {
    const wrapper = mount(ColorPicker, { props: { defaultValue: '#1677ff', allowClear: true, showText: true, valueFormat: 'hex', defaultOpen: true } })
    await nextTick()
    await $('.am-color-picker-clear').trigger('click')
    expect(wrapper.emitted('clear')).toBeUndefined()
    expect((lastEmit(wrapper, 'select')[0] as Color).cleared).toBe(true)
    await clickButton('confirm')
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect((lastEmit(wrapper, 'change')[0] as Color).cleared).toBe(true)
    expect(lastEmit(wrapper, 'update:value')).toEqual(['#1677ff00'])
    expect(wrapper.find('.am-color-picker-block').classes()).toContain('am-color-picker-block-cleared')
    expect(wrapper.find('.am-color-picker-trigger-text').text()).toBe('无色')
  })

  it('selects a preset and switches the format from the sheet', async () => {
    const wrapper = mount(ColorPicker, { props: { defaultValue: '#1677ff', presets, showText: true, defaultOpen: true } })
    await nextTick()
    await $('.am-color-picker-presets-color:nth-child(2)').trigger('click')
    expect((lastEmit(wrapper, 'select')[0] as Color).toHexString()).toBe('#52c41a')
    expect(wrapper.emitted('changeComplete')).toHaveLength(1)
    await new DOMWrapper(document.querySelectorAll<HTMLElement>('.am-segmented-item')[2]).trigger('click')
    expect(wrapper.emitted('formatChange')![0]).toEqual(['rgb'])
    expect(wrapper.emitted('update:format')![0]).toEqual(['rgb'])
    await clickButton('confirm')
    expect(wrapper.find('.am-color-picker-trigger-text').text()).toBe('rgb(82,196,26)')
  })

  it('size: prop and ConfigProvider', () => {
    const small = mount(ColorPicker, { props: { size: 'small' } })
    expect(small.find('.am-color-picker').classes()).toContain('am-picker-trigger-sm')
    const provider = mount(ConfigProvider, {
      props: { componentSize: 'large' },
      slots: { default: () => h(ColorPicker) },
    })
    expect(provider.find('.am-color-picker').classes()).toContain('am-picker-trigger-lg')
  })

  it('does not open when disabled (prop and ConfigProvider)', async () => {
    const wrapper = mount(ColorPicker, { props: { disabled: true } })
    expect(wrapper.find('.am-color-picker').classes()).toContain('am-picker-trigger-disabled')
    await wrapper.find('.am-color-picker').trigger('click')
    expect(wrapper.emitted('openChange')).toBeUndefined()

    const provider = mount(ConfigProvider, {
      props: { componentDisabled: true },
      slots: { default: () => h(ColorPicker) },
    })
    expect(provider.find('.am-color-picker').classes()).toContain('am-picker-trigger-disabled')
  })

  it('uses the locale of the ConfigProvider', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(ColorPicker, { showText: true, defaultOpen: true }) },
    })
    await nextTick()
    expect(wrapper.find('.am-color-picker-trigger-text').text()).toBe('Transparent')
    expect(document.querySelector('.am-picker-popup-confirm')!.textContent!.trim()).toBe('OK')
  })

  it('renders a custom trigger through the default slot and exposes toggle', async () => {
    const wrapper = mount(ColorPicker, {
      props: { defaultValue: '#1677ff' },
      slots: {
        default: ({ value, label, open, toggle }: any) =>
          h('button', { class: 'custom', onClick: () => toggle() }, `${label} ${value.toRgbString()} ${open}`),
      },
    })
    expect(wrapper.find('.am-color-picker').exists()).toBe(false)
    expect(wrapper.find('.custom').text()).toBe('#1677FF rgb(22,119,255) false')
    await wrapper.find('.custom').trigger('click')
    expect(wrapper.find('.custom').text()).toContain('true')
    ;(wrapper.vm as any).toggle(false)
    await nextTick()
    expect(wrapper.find('.custom').text()).toContain('false')
  })

  it('title: prop and slot', async () => {
    const wrapper = mount(ColorPicker, { props: { title: 'Pick', defaultOpen: true }, slots: { title: () => 'From slot' } })
    await nextTick()
    expect(document.querySelector('.am-picker-popup-title')!.textContent!.trim()).toBe('From slot')
    wrapper.unmount()
  })

  it('works inside a FormItem: id, status, change on confirm, blur on close', async () => {
    const form = formItemProvide()
    const wrapper = mount(ColorPicker, { props: { defaultValue: '#1677ff' }, global: { provide: form.provide } })
    const trigger = wrapper.find('.am-color-picker')
    expect(trigger.attributes('id')).toBe('color')
    expect(trigger.classes()).toContain('am-picker-trigger-status-error')
    await trigger.trigger('click')
    await drag('.am-color-picker-palette', [[200, 0]])
    const input = $('.am-color-picker-hex-input input')
    expect(input.attributes('id')).toBeUndefined()
    await input.trigger('blur')
    expect(form.onFieldChange).not.toHaveBeenCalled()
    expect(form.onFieldBlur).not.toHaveBeenCalled()
    await clickButton('confirm')
    await nextTick()
    expect(form.onFieldChange).toHaveBeenCalledTimes(1)
    expect(form.onFieldBlur).toHaveBeenCalledTimes(1)
  })

  it('exposes the panel as a static', () => {
    expect(ColorPicker.Panel).toBe(ColorPickerPanel)
    expect(ColorPicker.name).toBe('AmColorPicker')
    expect(ColorPickerPanel.name).toBe('AmColorPickerPanel')
  })
})
