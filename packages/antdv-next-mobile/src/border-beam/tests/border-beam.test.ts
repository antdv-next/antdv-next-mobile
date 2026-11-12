import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import BorderBeam from '..'
import ConfigProvider from '../../config-provider'
import { getBorderBeamGradient, getInset, MAX_BEAM_COLOR_STOP_PERCENT } from '../util'

const HOST_STYLE = 'position: relative; border: 2px solid red; border-radius: 12px;'

function renderWith(props: Record<string, any> = {}, slot: (() => any) | null = () => h('div', { class: 'host', style: HOST_STYLE }, [h('p', 'child')])) {
  return mount(BorderBeam, { props, slots: slot ? { default: slot } : {}, attachTo: document.body })
}

function getBeams() {
  return Array.from(document.querySelectorAll<HTMLElement>('.host > .am-border-beam'))
}

const cssVar = (el: HTMLElement, name: string) => el.style.getPropertyValue(`--am-border-beam-${name}`)

describe('BorderBeam', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the child untouched and puts an aria-hidden beam inside it', async () => {
    const wrapper = renderWith()
    await nextTick()

    const host = document.querySelector<HTMLElement>('.host')!
    expect(host.querySelector('p')!.textContent).toBe('child')
    // the child is the only element BorderBeam renders in place: no wrapper
    expect(wrapper.element.parentElement!.querySelectorAll(':scope > *')).toHaveLength(1)

    const beams = getBeams()
    expect(beams).toHaveLength(1)
    expect(beams[0].getAttribute('aria-hidden')).toBe('true')
    expect(beams[0].parentElement).toBe(host)
    // defaults come from css: nothing but the inset is written inline
    expect(cssVar(beams[0], 'beam-gradient')).toBe('')
    expect(cssVar(beams[0], 'duration')).toBe('')
    expect(cssVar(beams[0], 'line-width')).toBe('')
    expect(cssVar(beams[0], 'size')).toBe('')
    expect(cssVar(beams[0], 'delay')).toBe('')
  })

  it('offsets the layer by the border width of the host', async () => {
    renderWith({}, () => h('div', { class: 'host', style: 'border-style: solid; border-width: 1px 2px 3px 4px;' }))
    await nextTick()
    expect(cssVar(getBeams()[0], 'inset-offset')).toBe('-1px -2px -3px -4px')
  })

  it('stays inside the border of a host that clips its overflow', async () => {
    renderWith({}, () => h('div', { class: 'host', style: 'border: 2px solid red; overflow: hidden;' }))
    await nextTick()
    expect(cssVar(getBeams()[0], 'inset-offset')).toBe('-0px -0px -0px -0px')
  })

  it('falls back to no offset when the border cannot be measured', async () => {
    vi.spyOn(window, 'getComputedStyle').mockImplementation(() => {
      throw new Error('not supported')
    })
    renderWith()
    await nextTick()
    expect(cssVar(getBeams()[0], 'inset-offset')).toBe('-0px -0px -0px -0px')
  })

  it('outset wins over the measured border width', async () => {
    const wrapper = renderWith({ outset: 4 })
    await nextTick()
    expect(cssVar(getBeams()[0], 'inset-offset')).toBe('-4px')

    await wrapper.setProps({ outset: '0.5rem' })
    expect(cssVar(getBeams()[0], 'inset-offset')).toBe('calc(-1 * 0.5rem)')

    await wrapper.setProps({ outset: 0 })
    expect(cssVar(getBeams()[0], 'inset-offset')).toBe('-0px')
  })

  it('writes color, duration, lineWidth and size as css variables', async () => {
    renderWith({ color: '#ff0000', duration: 3, lineWidth: 2, size: '5rem' })
    await nextTick()
    const [beam] = getBeams()
    expect(cssVar(beam, 'beam-gradient')).toBe('linear-gradient(to left, #ff0000 0%, #ff0000 70%, transparent)')
    expect(cssVar(beam, 'duration')).toBe('3s')
    expect(cssVar(beam, 'line-width')).toBe('2px')
    expect(cssVar(beam, 'size')).toBe('5rem')
  })

  it('ignores an invalid duration', async () => {
    renderWith({ duration: 0, count: 2 })
    await nextTick()
    const beams = getBeams()
    expect(cssVar(beams[0], 'duration')).toBe('')
    // the default duration (6s) is used for the phase
    expect(cssVar(beams[1], 'delay')).toBe('-3s')
  })

  it('renders the configured number of evenly distributed beams', async () => {
    const wrapper = renderWith({ count: 3, duration: 12 })
    await nextTick()
    expect(getBeams().map(beam => cssVar(beam, 'delay'))).toEqual(['', '-4s', '-8s'])

    // the beams are re-created so their phases restart in sync (their DOM order is irrelevant)
    await wrapper.setProps({ count: 2 })
    expect(getBeams().map(beam => cssVar(beam, 'delay')).sort()).toEqual(['', '-6s'])
  })

  it('normalizes invalid or fractional count values', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const cases: Array<[count: any, expected: number]> = [
      [0, 1],
      [-1, 1],
      [Number.NaN, 1],
      [Number.POSITIVE_INFINITY, 1],
      ['3', 1],
      [2.7, 2],
    ]
    for (const [count, expected] of cases) {
      const wrapper = renderWith({ count })
      await nextTick()
      expect(getBeams()).toHaveLength(expected)
      wrapper.unmount()
    }
  })

  it('items win over count and configure individual beams', async () => {
    renderWith({
      color: '#1677ff',
      count: 4,
      duration: 12,
      items: [{ color: '#36cfc9', lineWidth: 3, outset: 4, size: 60 }, {}],
      lineWidth: 2,
      outset: 1,
      size: 80,
    })
    await nextTick()
    expect(getBeams().map(beam => ({
      color: cssVar(beam, 'beam-gradient'),
      lineWidth: cssVar(beam, 'line-width'),
      outset: cssVar(beam, 'inset-offset'),
      size: cssVar(beam, 'size'),
      delay: cssVar(beam, 'delay'),
    }))).toEqual([
      {
        color: 'linear-gradient(to left, #36cfc9 0%, #36cfc9 70%, transparent)',
        lineWidth: '3px',
        outset: '-4px',
        size: '60px',
        delay: '',
      },
      {
        color: 'linear-gradient(to left, #1677ff 0%, #1677ff 70%, transparent)',
        lineWidth: '2px',
        outset: '-1px',
        size: '80px',
        delay: '-6s',
      },
    ])
  })

  it('renders no beam for an empty items array', async () => {
    renderWith({ items: [] })
    await nextTick()
    expect(getBeams()).toHaveLength(0)
  })

  it('passes attrs, rootClass, classes and styles to every beam', async () => {
    mount(BorderBeam, {
      props: { count: 2, rootClass: 'root-class', classes: { root: 'semantic-root' }, styles: { root: { opacity: 0.5 } } },
      attrs: { 'class': 'attr-class', 'style': 'color: red;', 'data-testid': 'beam' },
      slots: { default: () => h('div', { class: 'host' }) },
      attachTo: document.body,
    })
    await nextTick()
    const beams = getBeams()
    expect(beams).toHaveLength(2)
    beams.forEach((beam) => {
      expect(beam.classList.contains('root-class')).toBe(true)
      expect(beam.classList.contains('semantic-root')).toBe(true)
      expect(beam.classList.contains('attr-class')).toBe(true)
      expect(beam.dataset.testid).toBe('beam')
      expect(beam.style.color).toBe('red')
      expect(beam.style.opacity).toBe('0.5')
    })
    // nothing leaks onto the host
    expect(document.querySelector('.host')!.classList.contains('attr-class')).toBe(false)
  })

  it('uses the root element of a component child', async () => {
    const Card = defineComponent({ setup: (_, { slots }) => () => h('section', { class: 'host card' }, slots.default?.()) })
    renderWith({}, () => h(Card, null, { default: () => h('p', 'content') }))
    await nextTick()
    expect(getBeams()).toHaveLength(1)
    expect(document.querySelector('.card > p')!.textContent).toBe('content')
  })

  it('keeps the ref the user put on the child', async () => {
    const userRef = ref<HTMLElement>()
    const Demo = defineComponent({
      setup: () => () => h(BorderBeam, null, { default: () => h('div', { class: 'host', ref: userRef }) }),
    })
    mount(Demo, { attachTo: document.body })
    await nextTick()
    expect(userRef.value).toBe(document.querySelector('.host'))
    expect(getBeams()).toHaveLength(1)
  })

  it('follows a child that is swapped or removed', async () => {
    const tag = ref<'div' | 'section' | null>('div')
    const Demo = defineComponent({
      setup: () => () => h(BorderBeam, null, { default: () => (tag.value ? h(tag.value, { class: 'host', key: tag.value }) : null) }),
    })
    const wrapper = mount(Demo, { attachTo: document.body })
    await nextTick()
    expect(getBeams()[0].parentElement!.tagName).toBe('DIV')

    tag.value = 'section'
    await nextTick()
    await nextTick()
    expect(getBeams()).toHaveLength(1)
    expect(getBeams()[0].parentElement!.tagName).toBe('SECTION')

    tag.value = null
    await nextTick()
    await nextTick()
    expect(document.querySelector('.am-border-beam')).toBeNull()

    wrapper.unmount()
    expect(document.querySelector('.am-border-beam')).toBeNull()
  })

  it('renders no beam without a single element child', async () => {
    renderWith({}, null)
    await nextTick()
    expect(document.querySelector('.am-border-beam')).toBeNull()

    const text = renderWith({}, () => 'plain text')
    await nextTick()
    expect(text.text()).toBe('plain text')
    expect(document.querySelector('.am-border-beam')).toBeNull()

    renderWith({}, () => [h('div', { class: 'host' }), h('div', { class: 'host' })])
    await nextTick()
    expect(document.querySelectorAll('.host')).toHaveLength(2)
    expect(document.querySelector('.am-border-beam')).toBeNull()
  })

  it('removes the beams with the host on unmount', async () => {
    const wrapper = renderWith({ count: 2 })
    await nextTick()
    expect(getBeams()).toHaveLength(2)
    wrapper.unmount()
    expect(document.querySelector('.host')).toBeNull()
    expect(document.querySelector('.am-border-beam')).toBeNull()
  })

  it('works inside a ConfigProvider (theme scope and direction are inherited through the DOM)', async () => {
    mount(ConfigProvider, {
      props: { direction: 'rtl', theme: { components: { BorderBeam: { lineWidth: 3 } } } },
      slots: { default: () => h(BorderBeam, null, { default: () => h('div', { class: 'host' }) }) },
      attachTo: document.body,
    })
    await nextTick()
    const [beam] = getBeams()
    expect(beam.closest('[dir="rtl"]')).not.toBeNull()
    // the component token is delivered by the scoped stylesheet, not inline
    expect(cssVar(beam, 'line-width')).toBe('')
    expect(document.querySelector('.am-config-provider style')!.textContent).toContain('--am-border-beam-line-width:3px')
  })
})

describe('getBorderBeamGradient', () => {
  it('returns undefined for no value', () => {
    expect(getBorderBeamGradient()).toBeUndefined()
    expect(getBorderBeamGradient('')).toBeUndefined()
    expect(getBorderBeamGradient([])).toBeUndefined()
  })

  it('builds a linear-gradient from a solid color value', () => {
    expect(getBorderBeamGradient('#1677ff')).toBe(`linear-gradient(to left, #1677ff 0%, #1677ff ${MAX_BEAM_COLOR_STOP_PERCENT}%, transparent)`)
  })

  it('scales explicit gradient stops into the reserved beam segment', () => {
    expect(getBorderBeamGradient([
      { color: '#ff0000', percent: 0 },
      { color: '#00ff00', percent: 50 },
      { color: '#0000ff', percent: 100 },
    ])).toBe('linear-gradient(to left, #ff0000 0%, #00ff00 35%, #0000ff 70%, transparent)')
  })

  it('extends the last stop to the end and clamps out-of-range percents', () => {
    expect(getBorderBeamGradient([
      { color: '#abc', percent: -10 },
      { color: '#def', percent: 60 },
    ])).toBe('linear-gradient(to left, #abc 0%, #def 42%, #def 70%, transparent)')
    expect(getBorderBeamGradient([{ color: '#def', percent: 200 }])).toBe('linear-gradient(to left, #def 70%, #def 70%, transparent)')
  })
})

describe('getInset', () => {
  it('negates numbers and css lengths', () => {
    expect(getInset(2)).toBe('-2px')
    expect(getInset('1em')).toBe('calc(-1 * 1em)')
  })
})
