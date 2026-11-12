import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Masonry from '..'
import { computeMasonryLayout, normalizeColumns } from '../layout'

// ------------------------------------------------------------------ pure layout
describe('computeMasonryLayout', () => {
  const input = (heights: (number | undefined)[], columns: Record<number, number> = {}) =>
    heights.map((height, index) => ({ key: index, height, column: columns[index] }))

  it('places every item in the currently shortest column, first one on a tie', () => {
    const { positions, height, complete } = computeMasonryLayout(input([100, 50, 30, 40, 10]), 2)
    expect([...positions.values()]).toEqual([
      { column: 0, top: 0 },
      { column: 1, top: 0 },
      { column: 1, top: 50 },
      { column: 1, top: 80 },
      { column: 0, top: 100 },
    ])
    expect(height).toBe(120)
    expect(complete).toBe(true)
  })

  it('adds the gutter between rows but not after the last one', () => {
    const { positions, height } = computeMasonryLayout(input([100, 50, 30]), 2, 10)
    expect(positions.get(2)).toEqual({ column: 1, top: 60 })
    expect(height).toBe(100)
    expect(computeMasonryLayout(input([40]), 3, 10).height).toBe(40)
  })

  it('honours a fixed column and clamps it', () => {
    const { positions } = computeMasonryLayout(input([10, 10, 10, 10], { 1: 0, 2: 9, 3: -3 }), 3)
    expect(positions.get(1)).toEqual({ column: 0, top: 10 })
    expect(positions.get(2)).toEqual({ column: 2, top: 0 })
    expect(positions.get(3)).toEqual({ column: 0, top: 20 })
  })

  it('stops at the first unknown height', () => {
    const { positions, height, complete } = computeMasonryLayout(input([20, undefined, 30]), 2)
    expect([...positions.keys()]).toEqual([0])
    expect(height).toBe(20)
    expect(complete).toBe(false)
  })

  it('handles no items and invalid column counts', () => {
    expect(computeMasonryLayout([], 2, 8)).toMatchObject({ height: 0, complete: true })
    expect(computeMasonryLayout(input([10, 20]), 0).positions.get(1)).toEqual({ column: 0, top: 10 })
    expect(normalizeColumns(undefined)).toBe(2)
    expect(normalizeColumns('3')).toBe(3)
    expect(normalizeColumns(2.9)).toBe(2)
    expect(normalizeColumns(-1, 1)).toBe(1)
  })
})

// ------------------------------------------------------------------ component
type Frame = (time: number) => void
let frames = new Map<number, Frame>()
let frameId = 0
let observers: MockResizeObserver[] = []

class MockResizeObserver {
  elements = new Set<Element>()
  constructor(public callback: () => void) {
    observers.push(this)
  }

  observe(el: Element) {
    this.elements.add(el)
  }

  unobserve(el: Element) {
    this.elements.delete(el)
  }

  disconnect() {
    this.elements.clear()
  }
}

/** Runs the pending animation frames (and the frames they request) and lets Vue render. */
async function flushFrames(rounds = 3) {
  for (let i = 0; i < rounds; i += 1) {
    const pending = [...frames.values()]
    frames.clear()
    pending.forEach(fn => fn(0))
    await nextTick()
  }
}

function heightOf(el: Element) {
  return Number((el as HTMLElement).dataset.h ?? el.querySelector<HTMLElement>('[data-h]')?.dataset.h ?? 0)
}

beforeEach(() => {
  frames = new Map()
  observers = []
  vi.stubGlobal('requestAnimationFrame', (fn: Frame) => {
    frameId += 1
    frames.set(frameId, fn)
    return frameId
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
  vi.stubGlobal('ResizeObserver', MockResizeObserver)
  // an item is as tall as the `data-h` of its content
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    return { top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, width: 100, height: heightOf(this), toJSON() {} } as DOMRect
  })
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
    return heightOf(this)
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

const itemRender = (info: any) => h('div', { 'class': 'card', 'data-h': info.data }, `card ${info.key}`)
const makeItems = (heights: number[]) => heights.map((data, index) => ({ key: `k${index}`, data }))

function vars(el: Element) {
  const style = (el as HTMLElement).style
  return { column: style.getPropertyValue('--am-masonry-item-column'), top: style.getPropertyValue('--am-masonry-item-top') }
}

function style(wrapper: { element: Element }) {
  return (wrapper.element as HTMLElement).style
}

describe('Masonry', () => {
  it('exposes install and name', () => {
    expect(Masonry.name).toBe('AmMasonry')
    expect(typeof Masonry.install).toBe('function')
  })

  it('renders items in data order, pending until they are measured', async () => {
    const wrapper = mount(Masonry, { props: { items: makeItems([100, 50, 30]), itemRender } })
    expect(wrapper.classes()).toEqual(['am-masonry'])
    expect(style(wrapper).getPropertyValue('--am-masonry-columns')).toBe('2')
    expect(style(wrapper).height).toBe('0px')
    const nodes = wrapper.findAll('.am-masonry-item')
    expect(nodes.map(node => node.text())).toEqual(['card k0', 'card k1', 'card k2'])
    nodes.forEach(node => expect(node.classes()).toContain('am-masonry-item-pending'))
    expect(wrapper.emitted('layoutChange')).toBeUndefined()

    await flushFrames(1)
    const placed = wrapper.findAll('.am-masonry-item')
    placed.forEach((node) => {
      expect(node.classes()).not.toContain('am-masonry-item-pending')
      // moves are only animated from the next frame on
      expect(node.classes()).not.toContain('am-masonry-item-motion')
    })
    expect(placed.map(node => vars(node.element))).toEqual([
      { column: '0', top: '0px' },
      { column: '1', top: '0px' },
      { column: '1', top: '50px' },
    ])
    expect(style(wrapper).height).toBe('100px')

    await flushFrames(1)
    wrapper.findAll('.am-masonry-item').forEach(node => expect(node.classes()).toContain('am-masonry-item-motion'))
  })

  it('columns and numeric gutter drive the layout and the css variables', async () => {
    const wrapper = mount(Masonry, { props: { items: makeItems([100, 50, 30, 20]), itemRender, columns: 3, gutter: 10 } })
    await flushFrames()
    expect(style(wrapper).getPropertyValue('--am-masonry-columns')).toBe('3')
    expect(style(wrapper).getPropertyValue('--am-masonry-gutter-x')).toBe('10px')
    expect(style(wrapper).getPropertyValue('--am-masonry-gutter-y')).toBe('')
    const nodes = wrapper.findAll('.am-masonry-item')
    expect(vars(nodes[3].element)).toEqual({ column: '2', top: '40px' })
    expect(style(wrapper).height).toBe('100px')

    await wrapper.setProps({ columns: 2, gutter: [4, 20] })
    await flushFrames()
    expect(style(wrapper).getPropertyValue('--am-masonry-gutter-x')).toBe('4px')
    expect(style(wrapper).getPropertyValue('--am-masonry-gutter-y')).toBe('20px')
    expect(wrapper.findAll('.am-masonry-item').map(node => vars(node.element))).toEqual([
      { column: '0', top: '0px' },
      { column: '1', top: '0px' },
      { column: '1', top: '70px' },
      { column: '0', top: '120px' },
    ])
    expect(style(wrapper).height).toBe('140px')
  })

  it('a zero vertical gutter falls back to the horizontal one, invalid columns to 2', async () => {
    const wrapper = mount(Masonry, { props: { items: makeItems([10, 10, 10]), itemRender, columns: 0, gutter: [6, 0] } })
    await flushFrames()
    expect(style(wrapper).getPropertyValue('--am-masonry-columns')).toBe('2')
    expect(style(wrapper).getPropertyValue('--am-masonry-gutter-y')).toBe('')
    expect(vars(wrapper.findAll('.am-masonry-item')[2].element)).toEqual({ column: '0', top: '16px' })
  })

  it('reads css-length gutters back from the computed style', async () => {
    const original = window.getComputedStyle
    vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element, pseudo?: string | null) => {
      if (el.classList.contains('am-masonry'))
        return { rowGap: '12px' } as CSSStyleDeclaration
      return original(el, pseudo)
    })
    const wrapper = mount(Masonry, { props: { items: makeItems([10, 10, 10]), itemRender, gutter: '0.75rem' } })
    await flushFrames()
    expect(style(wrapper).getPropertyValue('--am-masonry-gutter-x')).toBe('0.75rem')
    expect(vars(wrapper.findAll('.am-masonry-item')[2].element)).toEqual({ column: '0', top: '22px' })
    expect(style(wrapper).height).toBe('32px')
  })

  it('places items with a known height before measuring, the measured height wins', async () => {
    const items = [
      { key: 'a', data: 80, height: 60 },
      { key: 'b', data: 20, height: 20 },
      { key: 'c', data: 10 },
      { key: 'd', data: 10, height: 10 },
    ]
    const wrapper = mount(Masonry, { props: { items, itemRender, gutter: 0 } })
    const nodes = wrapper.findAll('.am-masonry-item')
    expect(nodes[0].classes()).not.toContain('am-masonry-item-pending')
    expect(vars(nodes[1].element)).toEqual({ column: '1', top: '0px' })
    // placement stops at the first unknown height
    expect(nodes[2].classes()).toContain('am-masonry-item-pending')
    expect(nodes[3].classes()).toContain('am-masonry-item-pending')
    expect(style(wrapper).height).toBe('60px')

    await flushFrames()
    expect(style(wrapper).height).toBe('80px')
    expect(wrapper.findAll('.am-masonry-item').map(node => vars(node.element).top)).toEqual(['0px', '0px', '20px', '30px'])
  })

  it('pins items to their column', async () => {
    const items = [{ key: 1, data: 10, column: 1 }, { key: 2, data: 10, column: 1 }, { key: 3, data: 10, column: 7 }]
    const wrapper = mount(Masonry, { props: { items, itemRender, gutter: 0 } })
    await flushFrames()
    expect(wrapper.findAll('.am-masonry-item').map(node => vars(node.element))).toEqual([
      { column: '1', top: '0px' },
      { column: '1', top: '10px' },
      { column: '1', top: '20px' },
    ])
  })

  it('emits layoutChange with the items and their column, only when a column changed', async () => {
    const items = makeItems([100, 50, 30])
    const wrapper = mount(Masonry, { props: { items, itemRender, gutter: 0 } })
    await flushFrames()
    expect(wrapper.emitted('layoutChange')).toHaveLength(1)
    expect(wrapper.emitted('layoutChange')![0][0]).toEqual([
      { key: 'k0', data: 100, column: 0 },
      { key: 'k1', data: 50, column: 1 },
      { key: 'k2', data: 30, column: 1 },
    ])

    // same columns: nothing new
    await wrapper.setProps({ items: [...items] })
    await flushFrames()
    expect(wrapper.emitted('layoutChange')).toHaveLength(1)

    await wrapper.setProps({ items: [...items, { key: 'k3', data: 5 }] })
    await flushFrames()
    expect(wrapper.emitted('layoutChange')).toHaveLength(2)
    expect((wrapper.emitted('layoutChange')![1][0] as any[]).map(item => item.column)).toEqual([0, 1, 1, 1])

    await wrapper.setProps({ items: items.slice(1) })
    await flushFrames()
    expect((wrapper.emitted('layoutChange')![2][0] as any[]).map(item => [item.key, item.column])).toEqual([['k1', 0], ['k2', 1]])
    expect(wrapper.findAll('.am-masonry-item')).toHaveLength(2)

    await wrapper.setProps({ items: [] })
    await flushFrames()
    expect(wrapper.emitted('layoutChange')).toHaveLength(3)
    expect(style(wrapper).height).toBe('0px')
  })

  it('itemRender slot wins over the prop and receives item, index and column', async () => {
    const seen: any[] = []
    const wrapper = mount(Masonry, {
      props: { items: makeItems([40, 10]), itemRender: () => 'from prop', gutter: 0 },
      slots: {
        itemRender: (info: any) => {
          seen.push(info)
          return h('div', { 'class': 'from-slot', 'data-h': info.data }, `slot ${info.index}`)
        },
      },
    })
    await flushFrames()
    expect(wrapper.text()).not.toContain('from prop')
    expect(wrapper.findAll('.from-slot').map(node => node.text())).toEqual(['slot 0', 'slot 1'])
    expect(seen[seen.length - 1]).toMatchObject({ key: 'k1', data: 10, index: 1, column: 1 })
  })

  it('item children win over itemRender; item class / style land on the item', () => {
    const items = [
      { key: 'a', data: 1, children: 'plain' },
      { key: 'b', data: 2, children: () => h('b', 'fn'), class: 'custom-item', style: { color: 'red' } },
      { key: 'c', data: 3 },
    ]
    const wrapper = mount(Masonry, { props: { items, itemRender: () => 'rendered' } })
    const nodes = wrapper.findAll('.am-masonry-item')
    expect(nodes.map(node => node.text())).toEqual(['plain', 'fn', 'rendered'])
    expect(nodes[1].classes()).toContain('custom-item')
    expect((nodes[1].element as HTMLElement).style.color).toBe('red')
  })

  it('passes attrs, rootClass, classes and styles through', () => {
    const wrapper = mount(Masonry, {
      props: {
        items: makeItems([10]),
        itemRender,
        rootClass: 'root-class',
        classes: { root: 'sem-root', item: 'sem-item' },
        styles: { root: { color: 'red' }, item: { padding: '4px' } },
      },
      attrs: { 'class': 'attr-class', 'data-testid': 'masonry', 'style': 'height: 300px; margin: 1px' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-masonry', 'root-class', 'sem-root', 'attr-class']))
    expect(wrapper.attributes('data-testid')).toBe('masonry')
    // the user's style wins over the computed height
    expect(style(wrapper).height).toBe('300px')
    expect(style(wrapper).margin).toBe('1px')
    expect(style(wrapper).color).toBe('red')
    const item = wrapper.find('.am-masonry-item')
    expect(item.classes()).toContain('sem-item')
    expect((item.element as HTMLElement).style.padding).toBe('4px')
  })

  it('batches re-layouts into one frame: container resize and media load', async () => {
    const wrapper = mount(Masonry, { props: { items: makeItems([100, 50, 30]), itemRender, gutter: 0 } })
    await flushFrames()
    expect(frames.size).toBe(0)
    const [observer] = observers
    // only the container is observed without `fresh`
    expect([...observer.elements]).toEqual([wrapper.element])

    const card = wrapper.findAll('.card')[1].element as HTMLElement
    card.dataset.h = '200'
    observer.callback()
    observer.callback()
    card.dispatchEvent(new Event('load'))
    card.dispatchEvent(new Event('error'))
    expect(frames.size).toBe(1)
    await flushFrames()
    expect(wrapper.findAll('.am-masonry-item').map(node => vars(node.element))).toEqual([
      { column: '0', top: '0px' },
      { column: '1', top: '0px' },
      { column: '0', top: '100px' },
    ])
    expect(style(wrapper).height).toBe('200px')
    expect(wrapper.emitted('layoutChange')).toHaveLength(2)
    // nothing changed: no further frame is requested
    expect(frames.size).toBe(0)
  })

  it('fresh observes every item and follows added / removed ones', async () => {
    const items = makeItems([10, 20])
    const wrapper = mount(Masonry, { props: { items, itemRender, fresh: true } })
    await flushFrames()
    const [observer] = observers
    expect(observer.elements.size).toBe(3)

    await wrapper.setProps({ items: [...items, { key: 'k2', data: 30 }] })
    await flushFrames()
    expect(observer.elements.size).toBe(4)

    await wrapper.setProps({ items: items.slice(0, 1) })
    await flushFrames()
    expect(observer.elements.size).toBe(2)
    expect([...observer.elements].every(el => wrapper.element.contains(el))).toBe(true)

    await wrapper.setProps({ fresh: false })
    expect([...observer.elements]).toEqual([wrapper.element])
  })

  it('exposes nativeElement and layout()', async () => {
    const wrapper = mount(Masonry, { props: { items: makeItems([10, 20]), itemRender, gutter: 0 } })
    await flushFrames()
    const vm = wrapper.vm as any
    expect(vm.nativeElement).toBe(wrapper.element)
    ;(wrapper.find('.card').element as HTMLElement).dataset.h = '70'
    vm.layout()
    await flushFrames()
    expect(style(wrapper).height).toBe('70px')
  })

  it('cleans up on unmount and works without ResizeObserver', async () => {
    const wrapper = mount(Masonry, { props: { items: makeItems([10]), itemRender } })
    const [observer] = observers
    expect(frames.size).toBe(1)
    wrapper.unmount()
    expect(frames.size).toBe(0)
    expect(observer.elements.size).toBe(0)

    vi.stubGlobal('ResizeObserver', undefined)
    const plain = mount(Masonry, { props: { items: makeItems([10, 30]), itemRender, gutter: 0 } })
    await flushFrames()
    expect(style(plain).height).toBe('30px')
  })
})
