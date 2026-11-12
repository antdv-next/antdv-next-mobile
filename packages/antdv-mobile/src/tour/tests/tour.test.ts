import type { TourStepItem } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref, shallowRef } from 'vue'
import Tour from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'
import { computeTourPosition } from '../position'

const wait = (ms = 80) => new Promise(resolve => setTimeout(resolve, ms))
async function flush() {
  await nextTick()
  await nextTick()
  await nextTick()
}
const root = () => document.querySelector<HTMLElement>('.am-tour')
const panel = () => document.querySelector<HTMLElement>('.am-tour-panel')
const q = <T extends Element = HTMLElement>(selector: string) => document.querySelector<T>(selector)
const text = (selector: string) => q(selector)?.textContent?.trim()
const isVisible = () => !!root() && root()!.style.display !== 'none'
async function click(selector: string) {
  q(selector)!.click()
  await flush()
}

function createTarget(rect: Partial<DOMRect> = {}) {
  const el = document.createElement('button')
  el.className = 'target'
  document.body.appendChild(el)
  const full = { left: 100, top: 100, width: 80, height: 40, ...rect }
  el.getBoundingClientRect = () => ({
    ...full,
    x: full.left,
    y: full.top,
    right: full.left + full.width,
    bottom: full.top + full.height,
    toJSON: () => ({}),
  }) as DOMRect
  return el
}

function createSteps(target?: HTMLElement | null) {
  return [
    { title: 'Step 1', description: 'Desc 1', target },
    { title: 'Step 2', description: 'Desc 2', target: () => target },
    { title: 'Step 3', description: 'Desc 3' },
  ]
}

function mountTour(props: Record<string, any> = {}, slots: Record<string, any> = {}) {
  return mount(Tour, { props: { steps: createSteps(), ...props }, slots, attachTo: document.body })
}

describe('Tour', () => {
  it('renders nothing until opened, then teleports the layer to body', async () => {
    const wrapper = mountTour()
    await flush()
    expect(root()).toBeNull()
    await wrapper.setProps({ open: true })
    await flush()
    expect(root()!.parentElement).toBe(document.body)
    expect(isVisible()).toBe(true)
    expect(text('.am-tour-title')).toBe('Step 1')
    expect(text('.am-tour-description')).toBe('Desc 1')
    expect(document.querySelectorAll('.am-tour-indicator')).toHaveLength(3)
    expect(document.querySelectorAll('.am-tour-indicator-active')).toHaveLength(1)
    expect(q('.am-tour-close')).not.toBeNull()
    expect(q('.am-tour-mask')).not.toBeNull()
    expect(q('.am-tour-prev-btn')).toBeNull()
    expect(text('.am-tour-next-btn')).toBe('下一步')
    // no target: centered, no arrow, no hole
    expect(panel()!.classList.contains('am-tour-placement-center')).toBe(true)
    expect(q('.am-tour-arrow')).toBeNull()
    expect(q('.am-tour-mask-hole')).toBeNull()
    expect(document.querySelectorAll('.am-tour-mask-cover')).toHaveLength(1)
  })

  it('exposes install and the component name', () => {
    expect(typeof Tour.install).toBe('function')
    expect(Tour.name).toBe('AmTour')
  })

  it('navigates through the steps (uncontrolled) and emits change / finish / close', async () => {
    const wrapper = mountTour({ defaultOpen: true })
    await flush()
    await click('.am-tour-next-btn')
    expect(text('.am-tour-title')).toBe('Step 2')
    expect(wrapper.emitted('change')![0]).toEqual([1])
    expect(wrapper.emitted('update:current')![0]).toEqual([1])
    expect(text('.am-tour-prev-btn')).toBe('上一步')

    await click('.am-tour-prev-btn')
    expect(text('.am-tour-title')).toBe('Step 1')
    expect(wrapper.emitted('change')![1]).toEqual([0])

    await click('.am-tour-next-btn')
    await click('.am-tour-next-btn')
    expect(text('.am-tour-title')).toBe('Step 3')
    expect(text('.am-tour-next-btn')).toBe('结束导览')
    expect(document.querySelectorAll('.am-tour-indicator')[2].classList.contains('am-tour-indicator-active')).toBe(true)

    await click('.am-tour-next-btn')
    expect(wrapper.emitted('finish')).toHaveLength(1)
    expect(wrapper.emitted('close')![0]).toEqual([2])
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
    await wait()
    // destroyed after the leave animation
    expect(root()).toBeNull()
  })

  it('starts from the first step when an uncontrolled tour is opened again', async () => {
    const wrapper = mountTour({ open: true })
    await flush()
    await click('.am-tour-next-btn')
    expect(text('.am-tour-title')).toBe('Step 2')
    await wrapper.setProps({ open: false })
    await wait()
    await wrapper.setProps({ open: true })
    await flush()
    expect(text('.am-tour-title')).toBe('Step 1')
    // the reset is not a user change
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('is controlled by open: the close icon only emits', async () => {
    const wrapper = mountTour({ open: true })
    await flush()
    await click('.am-tour-close')
    expect(wrapper.emitted('close')![0]).toEqual([0])
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
    await wait()
    expect(isVisible()).toBe(true)
    await wrapper.setProps({ open: false })
    await wait()
    expect(root()).toBeNull()
  })

  it('is controlled by current', async () => {
    const wrapper = mountTour({ open: true, current: 1 })
    await flush()
    expect(text('.am-tour-title')).toBe('Step 2')
    await click('.am-tour-next-btn')
    expect(wrapper.emitted('update:current')![0]).toEqual([2])
    expect(text('.am-tour-title')).toBe('Step 2')
    await wrapper.setProps({ current: 2 })
    await flush()
    expect(text('.am-tour-title')).toBe('Step 3')
    // out of range: hidden, like PC
    await wrapper.setProps({ current: 5 })
    await wait()
    expect(root()).toBeNull()
  })

  it('supports defaultCurrent and v-model on both states', async () => {
    const open = ref(true)
    const current = ref(0)
    mount({
      setup: () => () => h(Tour, {
        'steps': createSteps(),
        'open': open.value,
        'onUpdate:open': (value: boolean) => (open.value = value),
        'current': current.value,
        'onUpdate:current': (value: number) => (current.value = value),
      }),
    }, { attachTo: document.body })
    await flush()
    await click('.am-tour-next-btn')
    expect(current.value).toBe(1)
    expect(text('.am-tour-title')).toBe('Step 2')
    await click('.am-tour-close')
    expect(open.value).toBe(false)

    document.body.innerHTML = ''
    mountTour({ defaultOpen: true, defaultCurrent: 2 })
    await flush()
    expect(text('.am-tour-title')).toBe('Step 3')
  })

  it('highlights the target: hole with gap, arrow and placement', async () => {
    const target = createTarget()
    mountTour({ open: true, steps: createSteps(target) })
    await flush()
    const hole = q<SVGRectElement>('.am-tour-mask-hole')!
    expect(hole.getAttribute('x')).toBe('94')
    expect(hole.getAttribute('y')).toBe('94')
    expect(hole.getAttribute('width')).toBe('92')
    expect(hole.getAttribute('height')).toBe('52')
    expect(hole.getAttribute('rx')).toBe('2')
    expect(document.querySelectorAll('.am-tour-mask-cover')).toHaveLength(4)
    const placeholder = q('.am-tour-target-placeholder')!
    expect(placeholder.style.left).toBe('94px')
    expect(placeholder.style.width).toBe('92px')
    expect(placeholder.classList.contains('am-tour-target-disabled')).toBe(false)
    // default placement
    expect(panel()!.classList.contains('am-tour-placement-bottom')).toBe(true)
    expect(panel()!.classList.contains('am-tour-side-bottom')).toBe(true)
    expect(q('.am-tour-arrow')).not.toBeNull()
    // 100 + 40 + 6 (gap offset) + 12 (arrow gap)
    expect(panel()!.style.top).toBe('158px')

    // the second step resolves its target through a function, the third one has none
    await click('.am-tour-next-btn')
    expect(q('.am-tour-mask-hole')).not.toBeNull()
    await click('.am-tour-next-btn')
    expect(q('.am-tour-mask-hole')).toBeNull()
    expect(q('.am-tour-arrow')).toBeNull()
    expect(panel()!.classList.contains('am-tour-placement-center')).toBe(true)
  })

  it('gap, placement and arrow: tour props and step overrides', async () => {
    const target = createTarget({ top: 400 })
    const wrapper = mountTour({
      open: true,
      gap: { offset: [10, 4], radius: 8 },
      placement: 'top',
      arrow: false,
      steps: [
        { title: 'a', target },
        { title: 'b', target: ref(target), placement: 'bottomLeft', arrow: true },
        { title: 'c', target: { $el: target }, placement: 'center' },
      ],
    })
    await flush()
    const hole = q<SVGRectElement>('.am-tour-mask-hole')!
    expect(hole.getAttribute('x')).toBe('90')
    expect(hole.getAttribute('y')).toBe('396')
    expect(hole.getAttribute('width')).toBe('100')
    expect(hole.getAttribute('height')).toBe('48')
    expect(hole.getAttribute('rx')).toBe('8')
    expect(panel()!.classList.contains('am-tour-placement-top')).toBe(true)
    expect(q('.am-tour-arrow')).toBeNull()
    // 396 - 8 (gap without arrow) - 0 (panel height in jsdom)
    expect(panel()!.style.top).toBe('388px')

    await click('.am-tour-next-btn')
    expect(panel()!.classList.contains('am-tour-placement-bottomLeft')).toBe(true)
    expect(q('.am-tour-arrow')).not.toBeNull()
    expect(root()!.classList.contains('am-tour-animated')).toBe(true)

    await click('.am-tour-next-btn')
    // a component instance works as target; `center` keeps the hole but drops the arrow
    expect(q('.am-tour-mask-hole')).not.toBeNull()
    expect(panel()!.classList.contains('am-tour-placement-center')).toBe(true)
    expect(q('.am-tour-arrow')).toBeNull()

    await wrapper.setProps({ current: 0, arrow: { pointAtCenter: true } })
    await flush()
    expect(q('.am-tour-arrow')).not.toBeNull()
  })

  it('accepts every kind of target', async () => {
    const el = createTarget()
    const elementRef = shallowRef<HTMLElement>()
    const looseRef = shallowRef()
    elementRef.value = el
    const steps: TourStepItem[] = [
      { title: 'element', target: el },
      { title: 'typed ref', target: elementRef },
      { title: 'loose ref', target: looseRef },
      { title: 'getter', target: () => elementRef.value },
      { title: 'null', target: null },
    ]
    mount(Tour, { props: { open: true, steps, actionsRender: (originNode, info) => [originNode, info.total] }, attachTo: document.body })
    await flush()
    for (const expected of [true, true, false, true, false]) {
      expect(!!q('.am-tour-mask-hole')).toBe(expected)
      await click('.am-tour-next-btn')
    }
  })

  it('re-measures on scroll / resize and through updatePosition', async () => {
    const target = createTarget()
    const wrapper = mountTour({ open: true, steps: createSteps(target) })
    await flush()
    const move = (top: number) => {
      target.getBoundingClientRect = () => ({ left: 100, top, width: 80, height: 40, right: 180, bottom: top + 40, x: 100, y: top, toJSON: () => ({}) }) as DOMRect
    }
    move(200)
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(q('.am-tour-mask-hole')!.getAttribute('y')).toBe('194')
    move(300)
    window.dispatchEvent(new Event('resize'))
    await nextTick()
    expect(q('.am-tour-mask-hole')!.getAttribute('y')).toBe('294')
    move(50)
    ;(wrapper.vm as any).updatePosition()
    await nextTick()
    expect(q('.am-tour-mask-hole')!.getAttribute('y')).toBe('44')
  })

  it('scrolls a target outside of the viewport into view', async () => {
    const target = createTarget({ top: 5000 })
    const scrollIntoView = vi.fn()
    target.scrollIntoView = scrollIntoView
    const visible = createTarget()
    visible.scrollIntoView = vi.fn()
    const wrapper = mountTour({
      open: true,
      steps: [
        { title: 'a', target },
        { title: 'b', target, scrollIntoViewOptions: { block: 'start' } },
        { title: 'c', target, scrollIntoViewOptions: false },
        { title: 'd', target: visible },
      ],
    })
    await flush()
    expect(scrollIntoView).toHaveBeenLastCalledWith({ block: 'center', inline: 'center' })
    await click('.am-tour-next-btn')
    expect(scrollIntoView).toHaveBeenLastCalledWith({ block: 'start' })
    await click('.am-tour-next-btn')
    expect(scrollIntoView).toHaveBeenCalledTimes(2)
    await click('.am-tour-next-btn')
    expect(visible.scrollIntoView).not.toHaveBeenCalled()

    await wrapper.setProps({ scrollIntoViewOptions: false, current: 0 })
    await flush()
    expect(scrollIntoView).toHaveBeenCalledTimes(2)
  })

  it('mask: false is non-modal, a mask config sets style and color, steps override', async () => {
    const target = createTarget()
    const wrapper = mountTour({
      open: true,
      mask: false,
      steps: [
        { title: 'a', target },
        { title: 'b', target, mask: { color: 'rgb(255 0 0 / 50%)', style: { opacity: 0.5 } } },
      ],
    })
    await flush()
    expect(q('.am-tour-mask')).toBeNull()
    expect(panel()!.getAttribute('aria-modal')).toBe('false')
    expect(document.body.classList.contains('am-overflow-hidden')).toBe(false)

    await click('.am-tour-next-btn')
    expect(q('.am-tour-mask')!.style.opacity).toBe('0.5')
    expect(q('.am-tour-mask-fill')!.style.fill).toBe('rgb(255 0 0 / 50%)')
    // page scroll is locked while the mask is shown
    expect(document.body.classList.contains('am-overflow-hidden')).toBe(true)

    await wrapper.setProps({ lockScroll: false })
    expect(document.body.classList.contains('am-overflow-hidden')).toBe(false)
  })

  it('disabledInteraction blocks taps on the target', async () => {
    const target = createTarget()
    const wrapper = mountTour({ open: true, steps: createSteps(target), disabledInteraction: true })
    await flush()
    expect(q('.am-tour-target-placeholder')!.classList.contains('am-tour-target-disabled')).toBe(true)
    await wrapper.setProps({ disabledInteraction: false })
    expect(q('.am-tour-target-placeholder')!.classList.contains('am-tour-target-disabled')).toBe(false)
  })

  it('type: primary on the tour or on a step', async () => {
    mountTour({ open: true, type: 'primary', steps: [{ title: 'a' }, { title: 'b', type: 'default' }] })
    await flush()
    expect(panel()!.classList.contains('am-tour-primary')).toBe(true)
    await click('.am-tour-next-btn')
    expect(panel()!.classList.contains('am-tour-primary')).toBe(false)
    // the previous button is a ghost button on the primary background only
    expect(q('.am-tour-prev-btn')!.classList.contains('am-button-ghost')).toBe(false)

    document.body.innerHTML = ''
    mountTour({ open: true, defaultCurrent: 1, steps: [{ title: 'a' }, { title: 'b', type: 'primary' }] })
    await flush()
    expect(panel()!.classList.contains('am-tour-primary')).toBe(true)
    expect(q('.am-tour-prev-btn')!.classList.contains('am-button-ghost')).toBe(true)
  })

  it('closable / closeIcon on the tour and on a step', async () => {
    const wrapper = mountTour({
      open: true,
      closeIcon: () => h('i', { class: 'custom-close' }),
      steps: [
        { title: 'a' },
        { title: 'b', closeIcon: false },
        { title: 'c', closable: { closeIcon: h('i', { class: 'step-close' }) } },
      ],
    })
    await flush()
    expect(q('.am-tour-close .custom-close')).not.toBeNull()
    expect(q('.am-tour-close')!.getAttribute('aria-label')).toBe('关闭')
    await click('.am-tour-next-btn')
    expect(q('.am-tour-close')).toBeNull()
    await click('.am-tour-next-btn')
    expect(q('.am-tour-close .step-close')).not.toBeNull()

    await wrapper.setProps({ closable: false, closeIcon: undefined, current: 0 })
    await flush()
    expect(q('.am-tour-close')).toBeNull()
  })

  it('renders cover, and hides empty parts', async () => {
    mountTour({
      open: true,
      steps: [{ cover: h('img', { class: 'cover-img' }), description: 'only description' }],
    })
    await flush()
    expect(q('.am-tour-cover .cover-img')).not.toBeNull()
    expect(q('.am-tour-header')).toBeNull()
    expect(text('.am-tour-description')).toBe('only description')
    // a single step has no indicators and finishes directly
    expect(q('.am-tour-indicators')).toBeNull()
    expect(text('.am-tour-next-btn')).toBe('结束导览')
  })

  it('step buttons: nextButtonProps / prevButtonProps', async () => {
    const onNext = vi.fn()
    const onPrev = vi.fn()
    const wrapper = mountTour({
      open: true,
      steps: [
        { title: 'a', nextButtonProps: { children: 'Go', onClick: onNext, class: 'my-next', style: { minWidth: '60px' } } },
        { title: 'b', prevButtonProps: { children: () => h('b', 'Back'), onClick: onPrev, class: 'my-prev' } },
      ],
    })
    await flush()
    expect(text('.am-tour-next-btn')).toBe('Go')
    expect(q('.am-tour-next-btn')!.classList.contains('my-next')).toBe(true)
    expect(q('.am-tour-next-btn')!.style.minWidth).toBe('60px')
    await click('.am-tour-next-btn')
    expect(onNext).toHaveBeenCalledTimes(1)
    expect(text('.am-tour-prev-btn')).toBe('Back')
    expect(q('.am-tour-prev-btn.my-prev b')).not.toBeNull()
    await click('.am-tour-prev-btn')
    expect(onPrev).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('change')).toEqual([[1], [0]])
  })

  it('indicatorsRender / actionsRender props', async () => {
    const actionsRender = vi.fn((originNode: any, info: { current: number, total: number }) => [
      h('button', { class: 'skip' }, `skip ${info.current}/${info.total}`),
      originNode,
    ])
    mountTour({
      open: true,
      indicatorsRender: (current: number, total: number) => h('span', { class: 'custom-indicator' }, `${current + 1} / ${total}`),
      actionsRender,
    })
    await flush()
    expect(text('.am-tour-indicators .custom-indicator')).toBe('1 / 3')
    expect(q('.am-tour-indicator')).toBeNull()
    expect(text('.am-tour-actions .skip')).toBe('skip 0/3')
    // the origin node still works
    await click('.am-tour-actions .am-tour-next-btn')
    expect(text('.am-tour-indicators .custom-indicator')).toBe('2 / 3')
    expect(text('.am-tour-actions .skip')).toBe('skip 1/3')
  })

  it('slots win over props', async () => {
    mountTour(
      {
        open: true,
        closeIcon: 'prop-close',
        indicatorsRender: () => 'prop-indicators',
        actionsRender: () => 'prop-actions',
        steps: [
          { title: 'prop title', description: 'prop description', cover: 'prop cover', nextButtonProps: { children: 'prop next' } },
          { title: 'second title', prevButtonProps: { children: 'prop prev' } },
        ],
      },
      {
        closeIcon: () => h('i', { class: 'slot-close' }),
        indicatorsRender: ({ current, total }: any) => h('em', { class: 'slot-indicators' }, `${current}-${total}`),
        actionsRender: ({ originNode, current, total }: any) => [h('span', { class: 'slot-actions' }, `${current}-${total}`), originNode],
        nextButton: ({ current, isFirst, isLast }: any) => `next ${current} ${isFirst} ${isLast}`,
        prevButton: ({ current }: any) => `prev ${current}`,
        // renders nothing for the second step: its `title` prop is used
        titleRender: ({ step, index }: any) => (index === 0 ? h('b', { class: 'slot-title' }, `slot ${step.title}`) : null),
        descriptionRender: () => 'slot description',
        coverRender: ({ index }: any) => h('img', { class: `slot-cover-${index}` }),
      },
    )
    await flush()
    expect(q('.am-tour-close .slot-close')).not.toBeNull()
    expect(text('.am-tour-indicators')).toBe('0-2')
    expect(text('.am-tour-actions .slot-actions')).toBe('0-2')
    expect(text('.am-tour-next-btn')).toBe('next 0 true false')
    expect(text('.am-tour-title .slot-title')).toBe('slot prop title')
    expect(text('.am-tour-description')).toBe('slot description')
    expect(q('.am-tour-cover .slot-cover-0')).not.toBeNull()

    await click('.am-tour-next-btn')
    expect(text('.am-tour-title')).toBe('second title')
    expect(text('.am-tour-prev-btn')).toBe('prev 1')
    expect(text('.am-tour-next-btn')).toBe('next 1 false true')
  })

  it('passes attrs, rootClass, classes / styles and step class / style', async () => {
    const target = createTarget()
    mount(Tour, {
      props: {
        open: true,
        rootClass: 'my-root',
        zIndex: 2000,
        classes: { root: 'c-root', mask: 'c-mask', section: 'c-section', title: 'c-title', footer: 'c-footer', indicator: 'c-indicator', close: 'c-close' },
        styles: { section: { minHeight: '10px' }, description: { color: 'red' }, actions: { gap: '4px' } },
        steps: [
          { title: 't', description: 'd', target, class: 'step-class', style: { width: '200px' }, classes: { title: 's-title' }, styles: { description: { color: 'blue' } } },
          { title: 't2' },
        ],
      },
      attrs: { 'class': 'attr-class', 'data-id': 'tour', 'style': 'opacity: 0.9' },
      attachTo: document.body,
    })
    await flush()
    const el = root()!
    expect(el.classList.contains('attr-class')).toBe(true)
    expect(el.classList.contains('my-root')).toBe(true)
    expect(el.classList.contains('c-root')).toBe(true)
    expect(el.dataset.id).toBe('tour')
    expect(el.style.opacity).toBe('0.9')
    expect(el.style.zIndex).toBe('2000')
    expect(q('.am-tour-mask')!.classList.contains('c-mask')).toBe(true)
    expect(q('.am-tour-section')!.classList.contains('c-section')).toBe(true)
    expect(q('.am-tour-section')!.style.minHeight).toBe('10px')
    expect(q('.am-tour-footer')!.classList.contains('c-footer')).toBe(true)
    expect(q('.am-tour-indicator')!.classList.contains('c-indicator')).toBe(true)
    expect(q('.am-tour-close')!.classList.contains('c-close')).toBe(true)
    expect(q('.am-tour-actions')!.style.gap).toBe('4px')
    // the step wins
    expect(q('.am-tour-title')!.classList.contains('s-title')).toBe(true)
    expect(q('.am-tour-title')!.classList.contains('c-title')).toBe(false)
    expect(q('.am-tour-description')!.style.color).toBe('blue')
    expect(panel()!.classList.contains('step-class')).toBe(true)
    expect(panel()!.style.width).toBe('200px')
  })

  it('uses an increasing z-index by default', async () => {
    mountTour({ open: true })
    await flush()
    expect(Number(root()!.style.zIndex)).toBeGreaterThan(1000)
  })

  it('keyboard: ESC closes, arrow keys switch steps', async () => {
    const wrapper = mountTour({ open: true })
    await flush()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    await flush()
    expect(text('.am-tour-title')).toBe('Step 2')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    await flush()
    expect(text('.am-tour-title')).toBe('Step 1')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('close')).toHaveLength(1)

    await wrapper.setProps({ keyboard: false })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('change')).toHaveLength(2)
  })

  it('reads texts and theme from ConfigProvider', async () => {
    mount(ConfigProvider, {
      props: { locale: enUS, theme: { algorithm: 'dark' } },
      slots: { default: () => h(Tour, { open: true, steps: createSteps(), defaultCurrent: 1 }) },
      attachTo: document.body,
    })
    await flush()
    expect(text('.am-tour-prev-btn')).toBe('Previous')
    expect(text('.am-tour-next-btn')).toBe('Next')
    expect(q('.am-tour-close')!.getAttribute('aria-label')).toBe(enUS.common.close)
    expect(root()!.classList.contains('am-theme-dark')).toBe(true)
    await click('.am-tour-next-btn')
    expect(text('.am-tour-next-btn')).toBe('Finish')
  })

  it('mounts into getPopupContainer, or in place with false', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const target = createTarget()
    const getPopupContainer = vi.fn(() => container)
    mountTour({ open: true, steps: createSteps(target), getPopupContainer })
    await flush()
    expect(container.querySelector('.am-tour')).not.toBeNull()
    expect(getPopupContainer).toHaveBeenCalledWith(target)

    document.body.innerHTML = ''
    const wrapper = mount({ render: () => h('div', { class: 'host' }, [h(Tour, { open: true, steps: createSteps(), getPopupContainer: false })]) }, { attachTo: document.body })
    await flush()
    expect(wrapper.find('.host .am-tour').exists()).toBe(true)
  })
})

describe('computeTourPosition', () => {
  const viewport = { width: 375, height: 667 }
  const size = { width: 300, height: 160 }

  it('centers the panel without a target or with placement center', () => {
    expect(computeTourPosition(null, size, { viewport })).toEqual({ left: 38, top: 254, placement: 'center', arrowOffset: 0, arrow: false })
    const centered = computeTourPosition({ left: 0, top: 0, width: 50, height: 50 }, size, { viewport, placement: 'center' })
    expect(centered.placement).toBe('center')
    expect(centered.arrow).toBe(false)
  })

  it('defaults to bottom and points the arrow at the target', () => {
    const pos = computeTourPosition({ left: 20, top: 100, width: 60, height: 40 }, size, { viewport })
    expect(pos.placement).toBe('bottom')
    expect(pos.top).toBe(152)
    // shifted into the screen
    expect(pos.left).toBe(16)
    expect(pos.arrowOffset).toBe(34)
    expect(pos.arrow).toBe(true)
  })

  it('flips when there is not enough room', () => {
    const pos = computeTourPosition({ left: 100, top: 560, width: 60, height: 40 }, size, { viewport, placement: 'bottom' })
    expect(pos.placement).toBe('top')
    expect(pos.top).toBe(560 - 160 - 12)
  })

  it('never leaves a 375px screen', () => {
    const placements = ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight', 'left', 'leftTop', 'leftBottom', 'right', 'rightTop', 'rightBottom', 'center'] as const
    const targets = [
      { left: 0, top: 0, width: 40, height: 40 },
      { left: 335, top: 0, width: 40, height: 40 },
      { left: 160, top: 300, width: 60, height: 40 },
      { left: 0, top: 627, width: 375, height: 40 },
      { left: 335, top: 627, width: 40, height: 40 },
      { left: -200, top: -500, width: 40, height: 40 },
      { left: 0, top: 0, width: 375, height: 667 },
    ]
    placements.forEach((placement) => {
      targets.forEach((target) => {
        const pos = computeTourPosition(target, size, { viewport, placement })
        expect(pos.left).toBeGreaterThanOrEqual(16)
        expect(pos.left + size.width).toBeLessThanOrEqual(375 - 16)
        expect(pos.top).toBeGreaterThanOrEqual(16)
        expect(pos.top + size.height).toBeLessThanOrEqual(667 - 16)
      })
    })
  })

  it('falls back from left / right to top / bottom on a narrow screen', () => {
    const pos = computeTourPosition({ left: 160, top: 100, width: 60, height: 40 }, size, { viewport, placement: 'right' })
    expect(pos.placement).toBe('bottom')
    const above = computeTourPosition({ left: 160, top: 500, width: 60, height: 40 }, size, { viewport, placement: 'leftTop' })
    expect(above.placement).toBe('top')
    // a small panel still fits beside the target
    const beside = computeTourPosition({ left: 20, top: 300, width: 60, height: 40 }, { width: 120, height: 80 }, { viewport, placement: 'right' })
    expect(beside.placement).toBe('right')
    expect(beside.left).toBe(92)
  })

  it('drops the arrow when the panel has to cover the target', () => {
    const pos = computeTourPosition({ left: 0, top: 0, width: 375, height: 667 }, size, { viewport, placement: 'bottom' })
    expect(pos.arrow).toBe(false)
  })

  it('keeps out of the safe areas', () => {
    const target = { left: 100, top: 420, width: 60, height: 40 }
    expect(computeTourPosition(target, size, { viewport, placement: 'bottom' }).placement).toBe('bottom')
    // the home indicator takes the room that was left below the target
    expect(computeTourPosition(target, size, { viewport, placement: 'bottom', safeBottom: 34 }).placement).toBe('top')
    const top = computeTourPosition({ left: 100, top: 10, width: 60, height: 300 }, { width: 300, height: 400 }, { viewport, placement: 'top', safeTop: 44, safeBottom: 34 })
    expect(top.top).toBeGreaterThanOrEqual(60)
    expect(top.top + 400).toBeLessThanOrEqual(667 - 34 - 16)
  })
})
