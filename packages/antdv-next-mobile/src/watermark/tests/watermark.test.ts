import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Watermark from '..'
import { getLayerStyle, getMarkSize } from '../utils'

function createContext() {
  return {
    save: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    drawImage: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn((text: string) => ({
      width: text.length * 10,
      fontBoundingBoxAscent: 12,
      fontBoundingBoxDescent: 4,
    })),
    font: '',
    fillStyle: '',
    textAlign: '',
    textBaseline: '',
  }
}

/** jsdom has no canvas: provide a fake 2d context so the whole pipeline can run. */
function mockCanvas() {
  const ctx = createContext()
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => ctx as any)
  vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(() => 'data:image/png;base64,MOCK')
  return ctx
}

async function flushObserver() {
  // MutationObserver callbacks are microtasks
  await Promise.resolve()
  await nextTick()
}

describe('Watermark', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders the default slot and survives without canvas support', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => null)
    const wrapper = mount(Watermark, {
      props: { content: 'antdv-next', rootClass: 'root-cls' },
      slots: { default: () => h('p', { class: 'content' }, 'content') },
      attrs: { 'class': 'custom', 'style': 'height: 100px', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-watermark', 'root-cls', 'custom']))
    expect(wrapper.attributes('style')).toContain('height: 100px')
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.content').exists()).toBe(true)
    expect(wrapper.find('.am-watermark-layer').exists()).toBe(false)
  })

  it('appends a layer with the drawn tile', () => {
    const ctx = mockCanvas()
    const wrapper = mount(Watermark, { props: { content: 'antdv-next', zIndex: 20, gap: [40, 60] } })
    const layer = wrapper.find('.am-watermark-layer')
    expect(layer.exists()).toBe(true)
    expect(layer.attributes('aria-hidden')).toBe('true')
    const style = (layer.element as HTMLElement).style
    expect(style.backgroundImage).toContain('data:image/png;base64,MOCK')
    expect(style.zIndex).toBe('20')
    expect(style.position).toBe('absolute')
    expect(style.pointerEvents).toBe('none')
    expect(style.getPropertyPriority('background-image')).toBe('important')
    expect(ctx.fillText).toHaveBeenCalledWith('antdv-next', expect.any(Number), 0)
    expect(ctx.rotate).toHaveBeenCalledWith((Math.PI / 180) * -22)
  })

  it('draws every line of an array content with the given font', () => {
    const ctx = mockCanvas()
    mount(Watermark, {
      props: { content: ['line 1', 'line 2'], font: { color: 'red', fontSize: 20, fontWeight: 'bold', textAlign: 'left' } },
    })
    expect(ctx.fillText).toHaveBeenCalledTimes(2)
    expect(ctx.fillText).toHaveBeenNthCalledWith(1, 'line 1', 0, 0)
    expect(ctx.fillText).toHaveBeenNthCalledWith(2, 'line 2', 0, 23)
    expect(ctx.fillStyle).toBe('red')
    expect(ctx.textAlign).toBe('left')
    expect(ctx.font).toContain('bold 20px')
  })

  it('renders nothing without content, and removes the layer when content is cleared', async () => {
    mockCanvas()
    const wrapper = mount(Watermark, { props: { content: 'a' } })
    expect(wrapper.find('.am-watermark-layer').exists()).toBe(true)
    await wrapper.setProps({ content: '' })
    vi.runAllTimers()
    expect(wrapper.find('.am-watermark-layer').exists()).toBe(false)
  })

  it('re-draws when props change', async () => {
    const ctx = mockCanvas()
    const wrapper = mount(Watermark, { props: { content: 'a' } })
    await wrapper.setProps({ content: 'b', rotate: 30, fullPage: true })
    vi.runAllTimers()
    expect(ctx.fillText).toHaveBeenLastCalledWith('b', expect.any(Number), 0)
    expect(ctx.rotate).toHaveBeenLastCalledWith((Math.PI / 180) * 30)
    expect(wrapper.classes()).toContain('am-watermark-full-page')
    expect((wrapper.find('.am-watermark-layer').element as HTMLElement).style.position).toBe('fixed')
    expect(wrapper.findAll('.am-watermark-layer')).toHaveLength(1)
  })

  it('loads an image, and falls back to the text when it fails', () => {
    const ctx = mockCanvas()
    const images: HTMLImageElement[] = []
    vi.stubGlobal('Image', class {
      onload?: () => void
      onerror?: () => void
      src = ''
      constructor() {
        images.push(this as any)
      }
    })
    const wrapper = mount(Watermark, { props: { image: 'https://example.com/logo.png', content: 'fallback', width: 120, height: 60 } })
    expect(wrapper.find('.am-watermark-layer').attributes('style') ?? '').not.toContain('background-image')
    expect(images[0]!.src).toBe('https://example.com/logo.png')
    ;(images[0] as any).onload()
    expect(wrapper.find('.am-watermark-layer').attributes('style')).toContain('background-image')
    expect(ctx.fillText).not.toHaveBeenCalled()

    ;(images[0] as any).onerror()
    expect(ctx.fillText).toHaveBeenCalledWith('fallback', expect.any(Number), 0)
    vi.unstubAllGlobals()
  })

  it('restores the layer and emits remove when it is deleted or modified', async () => {
    vi.useRealTimers()
    mockCanvas()
    const onRemove = vi.fn()
    const wrapper = mount(Watermark, { props: { content: 'a' }, attrs: { onRemove }, attachTo: document.body })
    wrapper.find('.am-watermark-layer').element.remove()
    await flushObserver()
    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.am-watermark-layer').exists()).toBe(true)

    wrapper.find('.am-watermark-layer').element.setAttribute('style', 'display: none')
    await flushObserver()
    expect(onRemove).toHaveBeenCalledTimes(2)
    expect((wrapper.find('.am-watermark-layer').element as HTMLElement).style.display).toBe('')
    expect((wrapper.find('.am-watermark-layer').element as HTMLElement).style.backgroundImage).toContain('MOCK')
  })

  it('removes the layer on unmount and exposes render', () => {
    mockCanvas()
    const wrapper = mount(Watermark, { props: { content: 'a' }, attachTo: document.body })
    expect(typeof (wrapper.vm as any).render).toBe('function')
    wrapper.unmount()
    expect(document.querySelector('.am-watermark-layer')).toBeNull()
  })
})

describe('Watermark utils', () => {
  it('getLayerStyle follows gap and offset', () => {
    expect(getLayerStyle([100, 100])).toEqual({ 'background-position': '0px 0px' })
    expect(getLayerStyle([100, 100], [80, 20])).toEqual({
      'left': '30px',
      'width': 'calc(100% - 30px)',
      'background-position': '0px -30px',
    })
  })

  it('getMarkSize measures text and respects explicit size', () => {
    const ctx = createContext() as any
    const font = { color: '', fontSize: 16, fontWeight: 'normal', fontStyle: 'normal', fontFamily: 'sans-serif', textAlign: 'center' } as const
    expect(getMarkSize(ctx, { content: ['ab', 'abcd'], font })).toEqual([40, 35])
    expect(getMarkSize(ctx, { content: 'ab', width: 200, height: 50, font })).toEqual([200, 50])
    expect(getMarkSize(ctx, { image: 'x.png', font })).toEqual([120, 64])
  })
})
