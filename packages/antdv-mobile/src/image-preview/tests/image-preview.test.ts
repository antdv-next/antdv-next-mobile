import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import ImagePreview from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'

const last = <T>(list: T[] | undefined): T => list![list!.length - 1]

const images = ['a.png', 'b.png', { src: 'c.png', alt: 'third' }]
const WIDTH = 300
const HEIGHT = 600

const q = <T extends Element = HTMLElement>(selector: string) => document.body.querySelector<T>(selector)
const qa = (selector: string) => Array.from(document.body.querySelectorAll<HTMLElement>(selector))

function touchEvent(type: string, points: Array<[number, number]>, changed: Array<[number, number]> = points) {
  const event = new Event(type, { bubbles: true, cancelable: true }) as any
  event.touches = points.map(([clientX, clientY]) => ({ clientX, clientY }))
  event.changedTouches = changed.map(([clientX, clientY]) => ({ clientX, clientY }))
  return event as TouchEvent
}

function fire(el: Element, type: string, points: Array<[number, number]>, changed?: Array<[number, number]>) {
  const event = touchEvent(type, points, changed)
  el.dispatchEvent(event)
  return event
}

async function tap(el: Element, x = 100, y = 100) {
  fire(el, 'touchstart', [[x, y]])
  fire(el, 'touchend', [], [[x, y]])
  await nextTick()
}

function loadImage(img: HTMLImageElement, width = 300, height = 300) {
  Object.defineProperty(img, 'naturalWidth', { value: width, configurable: true })
  Object.defineProperty(img, 'naturalHeight', { value: height, configurable: true })
  img.dispatchEvent(new Event('load'))
}

describe('ImagePreview', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(WIDTH)
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(HEIGHT)
  })
  afterEach(() => {
    ImagePreview.clear()
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders nothing when closed and teleports to body when open', async () => {
    const wrapper = mount(ImagePreview, { props: { images } })
    expect(q('.am-image-preview')).toBeNull()
    await wrapper.setProps({ open: true })
    expect(q('.am-image-preview')).not.toBeNull()
    expect(qa('.am-image-preview-img')).toHaveLength(3)
    expect(qa('.am-image-preview-img')[2].getAttribute('alt')).toBe('third')
    expect(q('.am-image-preview-index')!.textContent!.trim()).toBe('1 / 3')
    expect(q('.am-image-preview-close')).toBeNull()
  })

  it('getContainer={false} renders in place and passes attrs / rootClass / classes', async () => {
    const wrapper = mount(ImagePreview, {
      props: { images, open: true, getContainer: false, rootClass: 'root-cls', classes: { index: 'index-cls', image: 'image-cls' }, zIndex: 2000 },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    await nextTick()
    const root = wrapper.find('.am-image-preview')
    expect(root.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(root.attributes('data-id')).toBe('x')
    expect(root.attributes('style')).toContain('z-index: 2000')
    expect(wrapper.find('.am-image-preview-index').classes()).toContain('index-cls')
    expect(wrapper.find('.am-image-preview-image').classes()).toContain('image-cls')
  })

  it('works uncontrolled with defaultOpen / defaultCurrent', async () => {
    const wrapper = mount(ImagePreview, { props: { images, defaultOpen: true, defaultCurrent: 1, getContainer: false, doubleTapZoom: false } })
    await nextTick()
    expect(wrapper.find('.am-image-preview-index').text()).toBe('2 / 3')
    await tap(wrapper.findAll('.am-image-preview-item')[1].element)
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
    expect(wrapper.emitted('openChange')![0]).toEqual([false])
    await nextTick()
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(wrapper.find('.am-image-preview').exists()).toBe(false)
    expect(last(wrapper.emitted('afterOpenChange'))).toEqual([false])
  })

  it('single tap closes after the double tap window, closeOnClick=false keeps it open', async () => {
    const wrapper = mount(ImagePreview, { props: { images, open: true, getContainer: false } })
    await nextTick()
    const item = wrapper.find('.am-image-preview-item').element
    await tap(item)
    expect(wrapper.emitted('close')).toBeUndefined()
    vi.advanceTimersByTime(250)
    expect(wrapper.emitted('close')).toHaveLength(1)

    await wrapper.setProps({ closeOnClick: false })
    await tap(item)
    vi.advanceTimersByTime(250)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('double tap toggles zoom', async () => {
    const wrapper = mount(ImagePreview, { props: { images, open: true, getContainer: false } })
    await nextTick()
    const item = wrapper.find('.am-image-preview-item')
    loadImage(item.find('img').element as HTMLImageElement)
    await tap(item.element, 150, 300)
    await tap(item.element, 150, 300)
    expect(item.find('.am-image-preview-image').attributes('style')).toContain('scale(2)')
    expect(wrapper.emitted('close')).toBeUndefined()
    vi.advanceTimersByTime(300)
    await tap(item.element, 150, 300)
    await tap(item.element, 150, 300)
    expect(item.find('.am-image-preview-image').attributes('style') ?? '').not.toContain('scale(')
    vi.advanceTimersByTime(300)
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('pinch zooms within minZoom / maxZoom and snaps back', async () => {
    const wrapper = mount(ImagePreview, { props: { images, open: true, getContainer: false, maxZoom: 3 } })
    await nextTick()
    const item = wrapper.find('.am-image-preview-item')
    const image = item.find('.am-image-preview-image')
    loadImage(item.find('img').element as HTMLImageElement)

    fire(item.element, 'touchstart', [[100, 300], [200, 300]])
    const move = fire(item.element, 'touchmove', [[50, 300], [250, 300]])
    await nextTick()
    expect(move.defaultPrevented).toBe(true)
    expect(image.attributes('style')).toContain('scale(2)')
    expect(image.attributes('style')).toContain('transition-duration: 0s')
    fire(item.element, 'touchmove', [[0, 300], [1000, 300]])
    fire(item.element, 'touchend', [])
    await nextTick()
    expect(image.attributes('style')).toContain('scale(3)')

    // pinch in below 1 resets to 1 on release
    fire(item.element, 'touchstart', [[0, 300], [300, 300]])
    fire(item.element, 'touchmove', [[140, 300], [160, 300]])
    await nextTick()
    expect(image.attributes('style')).toMatch(/scale\(0\.\d+\)/)
    fire(item.element, 'touchend', [])
    await nextTick()
    expect(image.attributes('style') ?? '').not.toContain('scale(')
  })

  it('pans a zoomed image within its bounds', async () => {
    const wrapper = mount(ImagePreview, { props: { images, open: true, getContainer: false, doubleTapZoom: 3 } })
    await nextTick()
    const item = wrapper.find('.am-image-preview-item')
    const image = item.find('.am-image-preview-image')
    loadImage(item.find('img').element as HTMLImageElement, 300, 300)
    await tap(item.element, 150, 300)
    await tap(item.element, 150, 300)
    expect(image.attributes('style')).toContain('scale(3)')
    // displayed 300x300, scaled to 900x900 in a 300x600 viewport => max move 300 / 150
    fire(item.element, 'touchstart', [[150, 300]])
    fire(item.element, 'touchmove', [[100, 280]])
    fire(item.element, 'touchmove', [[50, 100]])
    await nextTick()
    expect(image.attributes('style')).toContain('translate3d(-100px, -150px, 0)')
    fire(item.element, 'touchend', [], [[50, 100]])
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('swipes between images and syncs v-model:current', async () => {
    const wrapper = mount(ImagePreview, {
      props: { 'images': images, 'open': true, 'getContainer': false as const, 'current': 0, 'onUpdate:current': (v: number) => wrapper.setProps({ current: v }) },
    })
    await nextTick()
    // Vue ignores a bubbling event whose first handler ran before the outer listener was attached;
    // with frozen timers "before" and "same tick" are indistinguishable, so move the clock on.
    vi.advanceTimersByTime(20)
    const item = wrapper.find('.am-image-preview-item').element
    fire(item, 'touchstart', [[250, 300]])
    fire(item, 'touchmove', [[200, 300]])
    fire(item, 'touchmove', [[40, 300]])
    fire(item, 'touchend', [], [[40, 300]])
    await nextTick()
    expect(wrapper.emitted('change')![0]).toEqual([1])
    expect(wrapper.emitted('update:current')![0]).toEqual([1])
    await nextTick()
    expect(wrapper.find('.am-image-preview-index').text()).toBe('2 / 3')

    await wrapper.setProps({ current: 2 })
    expect(wrapper.find('.am-image-preview-index').text()).toBe('3 / 3')
    expect(wrapper.find('.am-carousel-track').attributes('style')).toContain('translate3d(-200%, 0, 0)')
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('swipe down closes, a short drag bounces back', async () => {
    const wrapper = mount(ImagePreview, { props: { images, open: true, getContainer: false } })
    await nextTick()
    const item = wrapper.find('.am-image-preview-item')
    fire(item.element, 'touchstart', [[150, 100]])
    fire(item.element, 'touchmove', [[150, 120]])
    vi.advanceTimersByTime(400)
    await nextTick()
    expect(item.find('.am-image-preview-image').attributes('style')).toContain('translate3d(0, 20px, 0)')
    expect(wrapper.find('.am-image-preview-backdrop').attributes('style')).toContain('opacity')
    fire(item.element, 'touchend', [], [[150, 120]])
    await nextTick()
    expect(wrapper.emitted('close')).toBeUndefined()
    expect(wrapper.find('.am-image-preview-backdrop').attributes('style')).toBeUndefined()

    fire(item.element, 'touchstart', [[150, 100]])
    fire(item.element, 'touchmove', [[150, 130]])
    fire(item.element, 'touchmove', [[150, 300]])
    fire(item.element, 'touchend', [], [[150, 300]])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('swipeToClose=false ignores the downward drag', async () => {
    const wrapper = mount(ImagePreview, { props: { images, open: true, getContainer: false, swipeToClose: false } })
    await nextTick()
    const item = wrapper.find('.am-image-preview-item')
    fire(item.element, 'touchstart', [[150, 100]])
    fire(item.element, 'touchmove', [[150, 130]])
    fire(item.element, 'touchmove', [[150, 300]])
    fire(item.element, 'touchend', [], [[150, 300]])
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('closable shows a localized close button, closeIcon slot wins over prop', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: {
        default: () => h(
          ImagePreview,
          { images, open: true, getContainer: false, closable: true, closeIcon: () => h('i', { class: 'prop-icon' }) },
          { closeIcon: () => h('i', { class: 'slot-icon' }) },
        ),
      },
    })
    await nextTick()
    const button = wrapper.find('.am-image-preview-close')
    expect(button.attributes('aria-label')).toBe(enUS.common.close)
    expect(button.find('.slot-icon').exists()).toBe(true)
    expect(button.find('.prop-icon').exists()).toBe(false)
    expect(wrapper.findComponent(ImagePreview).emitted('close')).toBeUndefined()
    await button.trigger('click')
    expect(wrapper.findComponent(ImagePreview).emitted('close')).toHaveLength(1)
  })

  it('renders index / footer / image slots and hides the index with showIndex=false', async () => {
    const wrapper = mount(ImagePreview, {
      props: { images, open: true, getContainer: false, defaultCurrent: 1 },
      slots: {
        index: ({ current, total }: any) => `No.${current + 1} of ${total}`,
        footer: ({ current }: any) => h('div', { class: 'my-footer' }, `footer ${current}`),
        image: ({ src, index }: any) => h('div', { class: 'my-image' }, `${index}:${src}`),
      },
    })
    await nextTick()
    expect(wrapper.find('.am-image-preview-index').text()).toBe('No.2 of 3')
    expect(wrapper.find('.my-footer').text()).toBe('footer 1')
    expect(wrapper.findAll('.my-image')[2].text()).toBe('2:c.png')
    expect(wrapper.find('img').exists()).toBe(false)
    await wrapper.setProps({ showIndex: false })
    expect(wrapper.find('.am-image-preview-index').exists()).toBe(false)
  })

  it('shows the localized failure placeholder when an image fails to load', async () => {
    const wrapper = mount(ImagePreview, { props: { images, open: true, getContainer: false } })
    await nextTick()
    expect(wrapper.find('.am-image-preview-status .am-spin-icon').exists()).toBe(true)
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('.am-image-preview-status-text').text()).toBe('加载失败')
  })

  it('locks page scroll while open', async () => {
    const wrapper = mount(ImagePreview, { props: { images, open: true } })
    await nextTick()
    expect(document.body.classList.contains('am-overflow-hidden')).toBe(true)
    await wrapper.setProps({ open: false })
    expect(document.body.classList.contains('am-overflow-hidden')).toBe(false)
  })

  it('ImagePreview.show opens a viewer and the handler closes it', async () => {
    const onChange = vi.fn()
    const onClose = vi.fn()
    const handler = ImagePreview.show({ images, current: 2, onChange, onClose, closable: true })
    await nextTick()
    expect(q('.am-image-preview-index')!.textContent!.trim()).toBe('3 / 3')
    q<HTMLElement>('.am-image-preview-close')!.click()
    expect(onClose).toHaveBeenCalledTimes(1)
    await nextTick()

    ImagePreview.show({ images })
    ImagePreview.show({ images, index: ({ current }) => `custom ${current}` })
    await nextTick()
    expect(qa('.am-image-preview').length).toBeGreaterThanOrEqual(2)
    expect(document.body.textContent).toContain('custom 0')
    ImagePreview.clear()
    handler.close()
    await nextTick()
    expect(qa('.am-image-preview-index').filter(el => !el.closest('.am-fade-leave-active'))).toHaveLength(0)
  })

  it('carries the theme of ConfigProvider when teleported', () => {
    mount(ConfigProvider, {
      props: { theme: { algorithm: 'dark' } },
      slots: { default: () => h(ImagePreview, { images, open: true }) },
    })
    const el = document.body.querySelector<HTMLElement>('.am-image-preview')!
    expect(el.parentElement).toBe(document.body)
    expect(el.classList.contains('am-theme-dark')).toBe(true)
  })
})
