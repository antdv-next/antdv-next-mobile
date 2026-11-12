import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Carousel from '..'
import ConfigProvider from '../../config-provider'

const WIDTH = 300
const HEIGHT = 150

function slides(n: number) {
  return () => Array.from({ length: n }, (_, i) => h('div', { class: 'item' }, `slide ${i}`))
}

async function swipe(wrapper: ReturnType<typeof mount>, from: [number, number], to: [number, number], wait = 0) {
  await wrapper.trigger('touchstart', { touches: [{ clientX: from[0], clientY: from[1] }] })
  const steps = 4
  for (let i = 1; i <= steps; i++) {
    await wrapper.trigger('touchmove', {
      touches: [{ clientX: from[0] + ((to[0] - from[0]) * i) / steps, clientY: from[1] + ((to[1] - from[1]) * i) / steps }],
    })
  }
  if (wait)
    vi.advanceTimersByTime(wait)
  await wrapper.trigger('touchend', { touches: [] })
}

describe('Carousel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(WIDTH)
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(HEIGHT)
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders every direct child as a slide (fragments / v-for flattened) with dots', async () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: () => [h('div', 'a'), [h('div', 'b'), h('div', 'c')], null],
      },
    })
    await nextTick()
    expect(wrapper.classes()).toContain('am-carousel')
    expect(wrapper.findAll('.am-carousel-slide')).toHaveLength(3)
    expect(wrapper.findAll('.am-carousel-dot')).toHaveLength(3)
    expect(wrapper.find('.am-carousel-dots').classes()).toContain('am-carousel-dots-bottom')
    expect(wrapper.findAll('.am-carousel-dot')[0].classes()).toContain('am-carousel-dot-active')
  })

  it('hides dots, supports dots class and placement', async () => {
    const wrapper = mount(Carousel, { props: { dots: false }, slots: { default: slides(3) } })
    await nextTick()
    expect(wrapper.find('.am-carousel-dots').exists()).toBe(false)
    await wrapper.setProps({ dots: { class: 'my-dots' }, dotPlacement: 'top' })
    expect(wrapper.find('.am-carousel-dots').classes()).toEqual(expect.arrayContaining(['my-dots', 'am-carousel-dots-top']))
    await wrapper.setProps({ dotPlacement: undefined, dotPosition: 'left' })
    expect(wrapper.find('.am-carousel-dots').classes()).toContain('am-carousel-dots-start')
    expect(wrapper.classes()).toContain('am-carousel-vertical')
    await wrapper.setProps({ vertical: false })
    expect(wrapper.classes()).not.toContain('am-carousel-vertical')
  })

  it('goTo / next / prev emit beforeChange and afterChange', async () => {
    const wrapper = mount(Carousel, { props: { speed: 200 }, slots: { default: slides(3) } })
    await nextTick()
    const track = wrapper.find('.am-carousel-track')
    ;(wrapper.vm as any).next()
    await nextTick()
    expect(wrapper.emitted('beforeChange')![0]).toEqual([0, 1])
    expect(wrapper.emitted('afterChange')).toBeUndefined()
    expect(track.attributes('style')).toContain('translate3d(-100%, 0, 0)')
    expect(track.attributes('style')).toContain('transition-duration: 200ms')
    vi.advanceTimersByTime(200)
    expect(wrapper.emitted('afterChange')![0]).toEqual([1])

    ;(wrapper.vm as any).goTo(2, true)
    await nextTick()
    expect(wrapper.emitted('afterChange')![1]).toEqual([2])
    expect(track.attributes('style')).toContain('transition-duration: 0ms')

    ;(wrapper.vm as any).prev()
    await nextTick()
    expect(wrapper.emitted('beforeChange')![2]).toEqual([2, 1])
    expect(wrapper.findAll('.am-carousel-dot')[1].classes()).toContain('am-carousel-dot-active')
  })

  it('loops seamlessly: next on the last slide moves the first slide to the end', async () => {
    const wrapper = mount(Carousel, { props: { initialSlide: 2 }, slots: { default: slides(3) } })
    await nextTick()
    expect(wrapper.find('.am-carousel-track').attributes('style')).toContain('translate3d(-200%, 0, 0)')
    ;(wrapper.vm as any).next()
    await nextTick()
    expect(wrapper.emitted('beforeChange')![0]).toEqual([2, 0])
    expect(wrapper.find('.am-carousel-track').attributes('style')).toContain('translate3d(-300%, 0, 0)')
    expect(wrapper.findAll('.am-carousel-slide')[0].attributes('style')).toContain('translate3d(300%, 0, 0)')
    // the transient position is corrected before the following move
    ;(wrapper.vm as any).next()
    vi.advanceTimersByTime(100)
    await nextTick()
    expect(wrapper.emitted('beforeChange')![1]).toEqual([0, 1])
    expect(wrapper.find('.am-carousel-track').attributes('style')).toContain('translate3d(-100%, 0, 0)')
    expect(wrapper.findAll('.am-carousel-slide')[0].attributes('style')).not.toContain('translate3d')
  })

  it('stops at the boundaries when infinite is false', async () => {
    const wrapper = mount(Carousel, { props: { infinite: false }, slots: { default: slides(2) } })
    await nextTick()
    ;(wrapper.vm as any).prev()
    expect(wrapper.emitted('beforeChange')).toBeUndefined()
    ;(wrapper.vm as any).next()
    ;(wrapper.vm as any).next()
    expect(wrapper.emitted('beforeChange')).toHaveLength(1)
  })

  it('follows the finger and switches after a swipe', async () => {
    const wrapper = mount(Carousel, { slots: { default: slides(3) } })
    await nextTick()
    const track = wrapper.find('.am-carousel-track')
    await wrapper.trigger('touchstart', { touches: [{ clientX: 200, clientY: 10 }] })
    await wrapper.trigger('touchmove', { touches: [{ clientX: 170, clientY: 10 }] })
    // 30px of 300px => 10%
    expect(track.attributes('style')).toContain('translate3d(-10%, 0, 0)')
    expect(track.attributes('style')).toContain('transition-duration: 0ms')
    await wrapper.trigger('touchmove', { touches: [{ clientX: 20, clientY: 12 }] })
    await wrapper.trigger('touchend', { touches: [] })
    expect(wrapper.emitted('beforeChange')![0]).toEqual([0, 1])
    expect(track.attributes('style')).toContain('translate3d(-100%, 0, 0)')
  })

  it('swipes back to the last slide from the first one when infinite', async () => {
    const wrapper = mount(Carousel, { slots: { default: slides(3) } })
    await nextTick()
    await swipe(wrapper, [20, 10], [220, 10])
    expect(wrapper.emitted('beforeChange')![0]).toEqual([0, 2])
    expect(wrapper.findAll('.am-carousel-slide')[2].attributes('style')).toContain('translate3d(-300%, 0, 0)')
  })

  it('a slow short drag bounces back, a fast flick switches', async () => {
    const wrapper = mount(Carousel, { slots: { default: slides(3) } })
    await nextTick()
    await swipe(wrapper, [200, 10], [160, 10], 1000)
    expect(wrapper.emitted('beforeChange')).toBeUndefined()
    expect(wrapper.find('.am-carousel-track').attributes('style')).toContain('translate3d(0%, 0, 0)')
    await swipe(wrapper, [200, 10], [160, 10], 20)
    expect(wrapper.emitted('beforeChange')![0]).toEqual([0, 1])
  })

  it('ignores vertical gestures (direction lock) and does not prevent page scroll', async () => {
    const wrapper = mount(Carousel, { slots: { default: slides(3) } })
    await nextTick()
    await wrapper.trigger('touchstart', { touches: [{ clientX: 100, clientY: 10 }] })
    const event = new Event('touchmove', { bubbles: true, cancelable: true }) as any
    event.touches = [{ clientX: 104, clientY: 120 }]
    wrapper.element.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    await wrapper.trigger('touchend', { touches: [] })
    expect(wrapper.emitted('beforeChange')).toBeUndefined()

    await wrapper.trigger('touchstart', { touches: [{ clientX: 200, clientY: 10 }] })
    const horizontal = new Event('touchmove', { bubbles: true, cancelable: true }) as any
    horizontal.touches = [{ clientX: 100, clientY: 12 }]
    wrapper.element.dispatchEvent(horizontal)
    expect(horizontal.defaultPrevented).toBe(true)
  })

  it('does not respond to touch when draggable / allowTouchMove is false', async () => {
    const wrapper = mount(Carousel, { props: { draggable: false }, slots: { default: slides(3) } })
    await nextTick()
    await swipe(wrapper, [220, 10], [20, 10])
    expect(wrapper.emitted('beforeChange')).toBeUndefined()
    await wrapper.setProps({ draggable: true, allowTouchMove: false })
    await swipe(wrapper, [220, 10], [20, 10])
    expect(wrapper.emitted('beforeChange')).toBeUndefined()
  })

  it('vertical carousel swipes along the y axis', async () => {
    const wrapper = mount(Carousel, { props: { vertical: true }, slots: { default: slides(3) } })
    await nextTick()
    await swipe(wrapper, [10, 140], [10, 20])
    expect(wrapper.emitted('beforeChange')![0]).toEqual([0, 1])
    expect(wrapper.find('.am-carousel-track').attributes('style')).toContain('translate3d(0, -100%, 0)')
  })

  it('autoplay switches on an interval, pauses while touching and when the page is hidden', async () => {
    const wrapper = mount(Carousel, { props: { autoplay: true, autoplaySpeed: 1000 }, slots: { default: slides(3) } })
    await nextTick()
    vi.advanceTimersByTime(1000)
    expect(wrapper.emitted('beforeChange')).toHaveLength(1)
    await wrapper.trigger('touchstart', { touches: [{ clientX: 100, clientY: 10 }] })
    vi.advanceTimersByTime(5000)
    expect(wrapper.emitted('beforeChange')).toHaveLength(1)
    await wrapper.trigger('touchend', { touches: [] })
    vi.advanceTimersByTime(1000)
    expect(wrapper.emitted('beforeChange')).toHaveLength(2)

    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    document.dispatchEvent(new Event('visibilitychange'))
    vi.advanceTimersByTime(5000)
    expect(wrapper.emitted('beforeChange')).toHaveLength(2)
    hidden.mockReturnValue(false)
    document.dispatchEvent(new Event('visibilitychange'))
    vi.advanceTimersByTime(1000)
    expect(wrapper.emitted('beforeChange')).toHaveLength(3)
  })

  it('autoplay with dotDuration shows the progress dot', async () => {
    const wrapper = mount(Carousel, {
      props: { autoplay: { dotDuration: true }, autoplaySpeed: 2000 },
      slots: { default: slides(2) },
    })
    await nextTick()
    const dot = wrapper.find('.am-carousel-dot-active')
    expect(dot.classes()).toContain('am-carousel-dot-progress')
    expect(dot.attributes('style')).toContain('--am-carousel-dot-duration: 2000ms')
  })

  it('fade effect toggles opacity instead of moving the track', async () => {
    const wrapper = mount(Carousel, { props: { effect: 'fade' }, slots: { default: slides(3) } })
    await nextTick()
    expect(wrapper.classes()).toContain('am-carousel-fade')
    ;(wrapper.vm as any).next()
    await nextTick()
    const items = wrapper.findAll('.am-carousel-slide')
    expect(items[1].attributes('style')).toContain('opacity: 1')
    expect(items[0].attributes('style')).toContain('opacity: 0')
    expect(wrapper.find('.am-carousel-track').attributes('style') ?? '').not.toContain('translate3d')
    ;(wrapper.vm as any).prev()
    ;(wrapper.vm as any).prev()
    expect(wrapper.emitted('beforeChange')![2]).toEqual([0, 2])
  })

  it('slideSize / trackOffset / stuckAtBoundary', async () => {
    const wrapper = mount(Carousel, {
      props: { infinite: false, slideSize: 80, trackOffset: 10 },
      slots: { default: slides(3) },
    })
    await nextTick()
    const track = wrapper.find('.am-carousel-track')
    expect(wrapper.find('.am-carousel-slide').attributes('style')).toContain('width: 80%')
    expect(track.attributes('style')).toContain('translate3d(0%, 0, 0)')
    ;(wrapper.vm as any).goTo(1)
    await nextTick()
    expect(track.attributes('style')).toContain('translate3d(-70%, 0, 0)')
    ;(wrapper.vm as any).goTo(2)
    await nextTick()
    expect(track.attributes('style')).toContain('translate3d(-140%, 0, 0)')
    await wrapper.setProps({ stuckAtBoundary: false })
    ;(wrapper.vm as any).goTo(0, true)
    await nextTick()
    expect(track.attributes('style')).toContain('translate3d(10%, 0, 0)')
  })

  it('indicator slot wins over the indicator prop and replaces dots', async () => {
    const byProp = mount(Carousel, {
      props: { indicator: ({ current, total }: any) => h('i', { class: 'prop-indicator' }, `${current + 1}/${total}`) },
      slots: { default: slides(3) },
    })
    await nextTick()
    expect(byProp.find('.prop-indicator').text()).toBe('1/3')
    expect(byProp.find('.am-carousel-dots').exists()).toBe(false)

    const bySlot = mount(Carousel, {
      props: { indicator: () => h('i', { class: 'prop-indicator' }) },
      slots: {
        default: slides(3),
        indicator: ({ current, total }: any) => h('i', { class: 'slot-indicator' }, `${current + 1}/${total}`),
      },
    })
    await nextTick()
    ;(bySlot.vm as any).next()
    await nextTick()
    expect(bySlot.find('.slot-indicator').text()).toBe('2/3')
    expect(bySlot.find('.prop-indicator').exists()).toBe(false)
  })

  it('clicking a dot goes to that slide', async () => {
    const wrapper = mount(Carousel, { slots: { default: slides(3) } })
    await nextTick()
    await wrapper.findAll('.am-carousel-dot')[2].trigger('click')
    expect(wrapper.emitted('beforeChange')![0]).toEqual([0, 2])
  })

  it('reacts to a changing number of slides', async () => {
    const Demo = defineComponent({
      setup() {
        const list = ref([1, 2, 3])
        return { list }
      },
      render() {
        return h(Carousel, { initialSlide: 2 }, () => this.list.map(i => h('div', { key: i }, i)))
      },
    })
    const wrapper = mount(Demo)
    await nextTick()
    expect(wrapper.findAll('.am-carousel-dot')).toHaveLength(3)
    ;(wrapper.vm as any).list = [1, 2]
    await nextTick()
    await nextTick()
    expect(wrapper.findAll('.am-carousel-dot')).toHaveLength(2)
    expect(wrapper.findAll('.am-carousel-dot')[1].classes()).toContain('am-carousel-dot-active')
    ;(wrapper.vm as any).list = [1]
    await nextTick()
    await nextTick()
    expect(wrapper.find('.am-carousel-dots').exists()).toBe(false)
  })

  it('passes attrs, rootClass, classes and styles', async () => {
    const wrapper = mount(Carousel, {
      props: { rootClass: 'root-cls', classes: { slide: 'slide-cls', track: 'track-cls' }, styles: { root: { height: '120px' } } },
      attrs: { 'class': 'custom', 'data-id': 'x' },
      slots: { default: slides(2) },
    })
    await nextTick()
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.attributes('style')).toContain('height: 120px')
    expect(wrapper.find('.am-carousel-slide').classes()).toContain('slide-cls')
    expect(wrapper.find('.am-carousel-track').classes()).toContain('track-cls')
  })

  it('mirrors the track in rtl', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: { default: () => h(Carousel, { initialSlide: 1 }, slides(3)) },
    })
    await nextTick()
    expect(wrapper.find('.am-carousel').classes()).toContain('am-carousel-rtl')
    expect(wrapper.find('.am-carousel-track').attributes('style')).toContain('translate3d(100%, 0, 0)')
  })
})
