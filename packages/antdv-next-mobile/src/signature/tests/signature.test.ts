import type { SignatureExpose } from '..'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Signature from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'
import zhCN from '../../locale/zh_CN'

function createContext() {
  return {
    lineCap: '',
    lineJoin: '',
    lineWidth: 0,
    strokeStyle: '',
    fillStyle: '',
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    arc: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    drawImage: vi.fn(),
  }
}

type FakeContext = ReturnType<typeof createContext>

const proto = HTMLCanvasElement.prototype
const originalGetContext = proto.getContext
const originalToDataURL = proto.toDataURL

let contexts: FakeContext[] = []
/** Context of the visible canvas (the first one created). */
const ctx = () => contexts[0]

function mockCanvas(support = true) {
  proto.getContext = vi.fn(function (this: HTMLCanvasElement) {
    if (!support)
      return null
    const cached = (this as any).__ctx as FakeContext | undefined
    if (cached)
      return cached
    const context = createContext()
    ;(this as any).__ctx = context
    contexts.push(context)
    return context
  }) as any
  proto.toDataURL = vi.fn((type?: string) => `data:${type ?? 'image/png'};base64,AAAA`) as any
}

function mockRect(width = 300, height = 200, left = 10, top = 20) {
  return vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockImplementation(
    () => ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON() {} }) as DOMRect,
  )
}

function touches(x: number, y: number) {
  return { touches: [{ clientX: x, clientY: y }] }
}

async function draw(wrapper: any, points: [number, number][] = [[20, 40], [60, 80], [110, 90]]) {
  const canvas = wrapper.find('canvas')
  await canvas.trigger('touchstart', touches(...points[0]))
  for (const point of points.slice(1))
    await canvas.trigger('touchmove', touches(...point))
  await canvas.trigger('touchend', { touches: [] })
}

const expose = (wrapper: any) => wrapper.vm as unknown as SignatureExpose

describe('Signature', () => {
  beforeEach(() => {
    contexts = []
    mockCanvas()
    mockRect()
  })

  afterEach(() => {
    proto.getContext = originalGetContext
    proto.toDataURL = originalToDataURL
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('renders the canvas, the footer buttons and base classes', () => {
    const wrapper = mount(Signature)
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-signature', 'am-signature-empty']))
    expect(wrapper.find('.am-signature-content > canvas.am-signature-canvas').exists()).toBe(true)
    const buttons = wrapper.findAll('.am-signature-footer .am-button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].classes()).toContain('am-signature-clear')
    expect(buttons[0].text()).toBe(zhCN.Signature.clear)
    expect(buttons[1].classes()).toEqual(expect.arrayContaining(['am-signature-confirm', 'am-button-color-primary']))
    expect(buttons[1].text()).toBe(zhCN.Signature.confirm)
    expect(wrapper.find('.am-signature-placeholder').exists()).toBe(false)
  })

  it('sizes the backing store with devicePixelRatio', () => {
    vi.stubGlobal('devicePixelRatio', 2)
    const wrapper = mount(Signature)
    const canvas = wrapper.find('canvas').element
    expect(canvas.width).toBe(600)
    expect(canvas.height).toBe(400)
    expect(ctx().setTransform).toHaveBeenLastCalledWith(2, 0, 0, 2, 0, 0)
  })

  it('draws smooth strokes on touch and emits start / signing / end', async () => {
    const wrapper = mount(Signature, { props: { penColor: 'red', lineWidth: 5 } })
    const canvas = wrapper.find('canvas')

    await canvas.trigger('touchstart', touches(20, 40))
    expect(wrapper.emitted('start')).toHaveLength(1)
    expect(wrapper.classes()).toContain('am-signature-signing')
    expect(wrapper.classes()).not.toContain('am-signature-empty')
    expect(ctx().strokeStyle).toBe('red')
    expect(ctx().lineWidth).toBe(5)
    expect(ctx().lineCap).toBe('round')
    expect(ctx().lineJoin).toBe('round')

    await canvas.trigger('touchmove', touches(60, 80))
    // relative to the canvas rect (left 10, top 20)
    expect(ctx().moveTo).toHaveBeenLastCalledWith(10, 20)
    expect(ctx().quadraticCurveTo).toHaveBeenLastCalledWith(10, 20, 30, 40)
    await canvas.trigger('touchmove', touches(110, 90))
    expect(ctx().moveTo).toHaveBeenLastCalledWith(30, 40)
    expect(ctx().quadraticCurveTo).toHaveBeenLastCalledWith(50, 60, 75, 65)
    expect(wrapper.emitted('signing')).toHaveLength(2)
    expect(wrapper.emitted('end')).toBeUndefined()

    await canvas.trigger('touchend', { touches: [] })
    expect(ctx().lineTo).toHaveBeenLastCalledWith(100, 70)
    expect(wrapper.emitted('end')).toHaveLength(1)
    expect(wrapper.classes()).not.toContain('am-signature-signing')
    expect(expose(wrapper).isEmpty()).toBe(false)
  })

  it('draws a dot for a tap and ignores moves without a start', async () => {
    const wrapper = mount(Signature, { props: { lineWidth: 4 } })
    const canvas = wrapper.find('canvas')
    await canvas.trigger('touchmove', touches(60, 80))
    expect(wrapper.emitted('signing')).toBeUndefined()
    await canvas.trigger('touchstart', touches(20, 40))
    await canvas.trigger('touchend', { touches: [] })
    expect(ctx().arc).toHaveBeenCalledWith(10, 20, 2, 0, Math.PI * 2)
    expect(ctx().fill).toHaveBeenCalledTimes(1)
  })

  it('prevents the page from scrolling while signing', async () => {
    const wrapper = mount(Signature)
    const canvas = wrapper.find('canvas').element
    const start = new Event('touchstart', { cancelable: true, bubbles: true })
    Object.assign(start, touches(20, 40))
    canvas.dispatchEvent(start)
    const move = new Event('touchmove', { cancelable: true, bubbles: true })
    Object.assign(move, touches(30, 60))
    canvas.dispatchEvent(move)
    expect(move.defaultPrevented).toBe(true)
  })

  it('supports the mouse', async () => {
    const wrapper = mount(Signature)
    await wrapper.find('canvas').trigger('mousedown', { button: 0, clientX: 20, clientY: 40 })
    expect(wrapper.emitted('start')).toHaveLength(1)
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 60, clientY: 80 }))
    expect(wrapper.emitted('signing')).toHaveLength(1)
    expect(ctx().quadraticCurveTo).toHaveBeenLastCalledWith(10, 20, 30, 40)
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 60, clientY: 80 }))
    expect(wrapper.emitted('end')).toHaveLength(1)
    // listeners are removed after the stroke
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 90, clientY: 90 }))
    expect(wrapper.emitted('signing')).toHaveLength(1)
    // only the primary button draws
    await wrapper.find('canvas').trigger('mousedown', { button: 2, clientX: 20, clientY: 40 })
    expect(wrapper.emitted('start')).toHaveLength(1)
  })

  it('ignores the mouse events emulated after a touch', async () => {
    const wrapper = mount(Signature)
    await draw(wrapper)
    await wrapper.find('canvas').trigger('mousedown', { button: 0, clientX: 20, clientY: 40 })
    expect(wrapper.emitted('start')).toHaveLength(1)
  })

  it('confirm emits an empty image when nothing was drawn', async () => {
    const wrapper = mount(Signature)
    await wrapper.find('.am-signature-confirm').trigger('click')
    const [result] = wrapper.emitted('confirm')![0] as any[]
    expect(result.image).toBe('')
    expect(result.canvas).toBe(wrapper.find('canvas').element)
    expect(expose(wrapper).toDataURL()).toBe('')
  })

  it('confirm exports a transparent png by default', async () => {
    const wrapper = mount(Signature)
    await draw(wrapper)
    await wrapper.find('.am-signature-confirm').trigger('click')
    const [result] = wrapper.emitted('confirm')![0] as any[]
    expect(result.image).toBe('data:image/png;base64,AAAA')
    expect(proto.toDataURL).toHaveBeenLastCalledWith('image/png')
    // no background: exported straight from the visible canvas
    expect(contexts).toHaveLength(1)
  })

  it('exports jpg on a white background with quality', async () => {
    const wrapper = mount(Signature, { props: { type: 'jpg', quality: 0.5 } })
    await draw(wrapper)
    expect(expose(wrapper).toDataURL()).toBe('data:image/jpeg;base64,AAAA')
    expect(proto.toDataURL).toHaveBeenLastCalledWith('image/jpeg', 0.5)
    expect(contexts).toHaveLength(2)
    expect(contexts[1].fillStyle).toBe('#fff')
    expect(contexts[1].fillRect).toHaveBeenCalledWith(0, 0, 300, 200)
    expect(contexts[1].drawImage).toHaveBeenCalledWith(wrapper.find('canvas').element, 0, 0)
  })

  it('uses backgroundColor for the exported image', async () => {
    const wrapper = mount(Signature, { props: { backgroundColor: 'yellow' } })
    await draw(wrapper)
    expect(expose(wrapper).confirm().image).toBe('data:image/png;base64,AAAA')
    expect(contexts[1].fillStyle).toBe('yellow')
    expect(wrapper.emitted('confirm')).toHaveLength(1)
  })

  it('clear wipes the canvas, emits clear and shows the placeholder again', async () => {
    const wrapper = mount(Signature, { props: { placeholder: 'Sign here' } })
    expect(wrapper.find('.am-signature-placeholder').text()).toBe('Sign here')
    await draw(wrapper)
    expect(wrapper.find('.am-signature-placeholder').exists()).toBe(false)
    await wrapper.find('.am-signature-clear').trigger('click')
    expect(ctx().clearRect).toHaveBeenCalledWith(0, 0, 300, 200)
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(expose(wrapper).isEmpty()).toBe(true)
    expect(wrapper.classes()).toContain('am-signature-empty')
    expect(wrapper.find('.am-signature-placeholder').exists()).toBe(true)
  })

  it('resize() refits the canvas and replays the strokes', async () => {
    const wrapper = mount(Signature)
    await draw(wrapper)
    const rect = vi.mocked(HTMLCanvasElement.prototype.getBoundingClientRect)
    rect.mockImplementation(() => ({ left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, x: 0, y: 0, toJSON() {} }) as DOMRect)
    const curves = ctx().quadraticCurveTo.mock.calls.length
    expose(wrapper).resize()
    expect(wrapper.find('canvas').element.width).toBe(200)
    expect(wrapper.find('canvas').element.height).toBe(100)
    expect(ctx().quadraticCurveTo.mock.calls.length).toBe(curves * 2)
  })

  it('refits on window resize only when the size changed', async () => {
    const wrapper = mount(Signature)
    const calls = ctx().setTransform.mock.calls.length
    window.dispatchEvent(new Event('resize'))
    expect(ctx().setTransform.mock.calls.length).toBe(calls)
    mockRect(150, 100)
    window.dispatchEvent(new Event('resize'))
    expect(wrapper.find('canvas').element.width).toBe(150)
    expect(ctx().setTransform.mock.calls.length).toBe(calls + 1)
  })

  it('disabled blocks drawing and the buttons', async () => {
    const wrapper = mount(Signature, { props: { disabled: true } })
    expect(wrapper.classes()).toContain('am-signature-disabled')
    await draw(wrapper)
    expect(wrapper.emitted('start')).toBeUndefined()
    await wrapper.find('canvas').trigger('mousedown', { button: 0, clientX: 20, clientY: 40 })
    expect(wrapper.emitted('start')).toBeUndefined()
    const buttons = wrapper.findAll('.am-signature-footer .am-button')
    expect(buttons.every(button => button.attributes('disabled') !== undefined)).toBe(true)
    await buttons[1].trigger('click')
    expect(wrapper.emitted('confirm')).toBeUndefined()
  })

  it('follows ConfigProvider disabled and locale', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS, componentDisabled: true },
      slots: { default: () => h(Signature) },
    })
    expect(wrapper.find('.am-signature').classes()).toContain('am-signature-disabled')
    expect(wrapper.find('.am-signature-clear').text()).toBe(enUS.Signature.clear)
    expect(wrapper.find('.am-signature-confirm').text()).toBe(enUS.Signature.confirm)
    await wrapper.setProps({ locale: zhCN })
    expect(wrapper.find('.am-signature-clear').text()).toBe(zhCN.Signature.clear)
    expect(wrapper.find('.am-signature-confirm').text()).toBe(zhCN.Signature.confirm)
  })

  it('shows localized tips when canvas is not supported', async () => {
    mockCanvas(false)
    const wrapper = mount(Signature, { props: { placeholder: 'Sign here' } })
    await nextTick()
    expect(wrapper.find('.am-signature-placeholder').text()).not.toBe('Sign here')
    expect(wrapper.classes()).toContain('am-signature-unsupported')
    expect(wrapper.find('.am-signature-tips').text()).toBe(zhCN.Signature.tips)
    expect(expose(wrapper).toDataURL()).toBe('')

    const custom = mount(Signature, { props: { tips: 'No canvas' } })
    await nextTick()
    expect(custom.find('.am-signature-tips').text()).toBe('No canvas')
    const slotted = mount(Signature, { props: { tips: 'No canvas' }, slots: { tips: () => 'Slot tips' } })
    await nextTick()
    expect(slotted.find('.am-signature-tips').text()).toBe('Slot tips')
  })

  it('does not draw when canvas is not supported', async () => {
    mockCanvas(false)
    const wrapper = mount(Signature)
    await draw(wrapper)
    expect(wrapper.emitted('start')).toBeUndefined()
    expect(expose(wrapper).isEmpty()).toBe(true)
  })

  it('supports clearText / confirmText / placeholder props, slots win', () => {
    const wrapper = mount(Signature, { props: { clearText: 'Reset', confirmText: () => h('b', 'Done'), placeholder: 'Sign here' } })
    expect(wrapper.find('.am-signature-clear').text()).toBe('Reset')
    expect(wrapper.find('.am-signature-confirm b').text()).toBe('Done')

    const slotted = mount(Signature, {
      props: { clearText: 'Reset', confirmText: 'Done', placeholder: 'Sign here' },
      slots: { clearText: () => 'Slot clear', confirmText: () => 'Slot confirm', placeholder: () => 'Slot placeholder' },
    })
    expect(slotted.find('.am-signature-clear').text()).toBe('Slot clear')
    expect(slotted.find('.am-signature-confirm').text()).toBe('Slot confirm')
    expect(slotted.find('.am-signature-placeholder').text()).toBe('Slot placeholder')
  })

  it('footer: false hides the buttons, footer prop / slot replace them', async () => {
    const hidden = mount(Signature, { props: { footer: false } })
    expect(hidden.find('.am-signature-footer').exists()).toBe(false)

    const custom = mount(Signature, { props: { footer: () => h('i', 'custom') } })
    expect(custom.find('.am-signature-footer i').text()).toBe('custom')
    expect(custom.find('.am-button').exists()).toBe(false)

    const slotted = mount(Signature, {
      props: { footer: false },
      slots: {
        footer: ({ clear, confirm, empty }: any) => [
          h('button', { class: 'my-clear', onClick: clear }, String(empty)),
          h('button', { class: 'my-confirm', onClick: confirm }),
        ],
      },
    })
    expect(slotted.find('.am-signature-footer .am-button').exists()).toBe(false)
    expect(slotted.find('.my-clear').text()).toBe('true')
    await draw(slotted)
    expect(slotted.find('.my-clear').text()).toBe('false')
    await slotted.find('.my-confirm').trigger('click')
    expect((slotted.emitted('confirm')![0] as any[])[0].image).toBe('data:image/png;base64,AAAA')
    await slotted.find('.my-clear').trigger('click')
    expect(slotted.emitted('clear')).toHaveLength(1)
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Signature, {
      props: {
        placeholder: 'Sign here',
        rootClass: 'my-root',
        classes: { root: 'c-root', content: 'c-content', canvas: 'c-canvas', placeholder: 'c-placeholder', footer: 'c-footer' },
        styles: { root: { margin: '1px' }, content: { height: '120px' }, footer: { marginTop: '2px' } },
      },
      attrs: { 'class': 'custom', 'data-foo': 'bar', 'style': 'padding: 3px' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-signature', 'my-root', 'c-root', 'custom']))
    expect(wrapper.attributes('data-foo')).toBe('bar')
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.attributes('style')).toContain('padding: 3px')
    expect(wrapper.find('.am-signature-content').classes()).toContain('c-content')
    expect(wrapper.find('.am-signature-content').attributes('style')).toContain('height: 120px')
    expect(wrapper.find('canvas').classes()).toContain('c-canvas')
    expect(wrapper.find('.am-signature-placeholder').classes()).toContain('c-placeholder')
    expect(wrapper.find('.am-signature-footer').classes()).toContain('c-footer')
    expect(wrapper.find('.am-signature-footer').attributes('style')).toContain('margin-top: 2px')
  })

  it('removes the mouse listeners on unmount', async () => {
    const wrapper = mount(Signature)
    await wrapper.find('canvas').trigger('mousedown', { button: 0, clientX: 20, clientY: 40 })
    const remove = vi.spyOn(document, 'removeEventListener')
    wrapper.unmount()
    expect(remove).toHaveBeenCalledWith('mousemove', expect.any(Function))
    expect(remove).toHaveBeenCalledWith('mouseup', expect.any(Function))
  })
})
