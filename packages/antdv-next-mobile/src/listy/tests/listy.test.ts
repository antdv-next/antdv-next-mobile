import type { ListyRef } from '..'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Listy from '..'
import ConfigProvider from '../../config-provider'
import { flattenRows, getItemKey, toTaggedKey } from '../util'

interface DataItem {
  id: number
  title: string
  group: string
}

function createItems(length: number, groupSize = 10): DataItem[] {
  return Array.from({ length }, (_, index) => ({
    id: index,
    title: `Item ${index}`,
    group: `Group ${Math.floor(index / groupSize)}`,
  }))
}

const items = createItems(100)
const itemRender = (item: DataItem) => item.title
const group = { key: (item: DataItem) => item.group, title: (key: string | number) => `${key}` }

function mountListy(props: Record<string, any> = {}, options: Record<string, any> = {}) {
  return mount(Listy, {
    props: { items, rowKey: 'id', height: 200, itemHeight: 40, itemRender, ...props },
    attachTo: document.body,
    ...options,
  })
}

const ROW = 40
const VIEWPORT = 200

/**
 * jsdom has no layout: every row is `ROW` px tall and positioned from its `data-index`,
 * the scroll container is `VIEWPORT` px tall and starts at the top of the page.
 */
function mockLayout() {
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
    // the sticky layer is a zero-height box (see style/index.css)
    return this.classList.contains('am-virtual-list-header') ? 0 : ROW
  })
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (this: HTMLElement) {
    return this.classList.contains('am-listy') ? VIEWPORT : 0
  })
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    let top = 0
    let height = 0
    if (this.classList.contains('am-virtual-list-item')) {
      const root = this.closest<HTMLElement>('.am-listy')!
      top = Number(this.dataset.index) * ROW - root.scrollTop
      height = ROW
    }
    else if (this.classList.contains('am-listy')) {
      height = VIEWPORT
    }
    return { top, bottom: top + height, height, left: 0, right: 0, width: 0, x: 0, y: top, toJSON() {} } as DOMRect
  })
}

async function scrollListTo(wrapper: ReturnType<typeof mountListy>, top: number) {
  ;(wrapper.element as HTMLElement).scrollTop = top
  await wrapper.trigger('scroll')
  await nextTick()
  await nextTick()
}

const stickyTitle = (wrapper: ReturnType<typeof mountListy>) => wrapper.find('.am-listy-group-header-fixed')

describe('Listy', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the root on VirtualList and only a window of rows', () => {
    const wrapper = mountListy()
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-virtual-list', 'am-listy', 'am-listy-hoverable']))
    expect(wrapper.classes()).not.toContain('am-listy-rtl')
    expect(wrapper.attributes('dir')).toBeUndefined()

    const rows = wrapper.findAll('.am-listy-item')
    // 200 / 40 = 5 visible + the partially visible one + overscan 4
    expect(rows).toHaveLength(10)
    expect(rows[0].text()).toBe('Item 0')
    expect(wrapper.find('.am-virtual-list-holder').attributes('style')).toContain('height: 4000px')
    expect(wrapper.find('.am-listy-group-header').exists()).toBe(false)
    expect(wrapper.find('.am-virtual-list-header').exists()).toBe(false)
  })

  it('treats height as a max height', async () => {
    const wrapper = mountListy()
    expect((wrapper.element as HTMLElement).style.height).toBe('auto')
    expect((wrapper.element as HTMLElement).style.maxHeight).toBe('200px')

    await wrapper.setProps({ height: '60vh' })
    expect((wrapper.element as HTMLElement).style.maxHeight).toBe('60vh')

    await wrapper.setProps({ height: undefined })
    expect((wrapper.element as HTMLElement).style.maxHeight).toBe('')
    expect((wrapper.element as HTMLElement).style.height).toBe('')
  })

  it('virtual: false renders every row with the same structure', () => {
    const wrapper = mountListy({ virtual: false, group })
    expect(wrapper.findAll('.am-listy-item')).toHaveLength(100)
    expect(wrapper.findAll('.am-listy-group-header')).toHaveLength(10)
    expect(wrapper.find('.am-virtual-list-holder > .am-virtual-list-inner > .am-virtual-list-item > .am-listy-item').exists()).toBe(true)
    expect(wrapper.find('.am-virtual-list-holder').attributes('style')).toBeUndefined()
  })

  it('supports rowHoverable', async () => {
    const wrapper = mountListy({ rowHoverable: false })
    expect(wrapper.classes()).not.toContain('am-listy-hoverable')
    await wrapper.setProps({ rowHoverable: true })
    expect(wrapper.classes()).toContain('am-listy-hoverable')
  })

  it('wraps each itemRender result in a single item element', () => {
    const wrapper = mountListy({ itemRender: (item: DataItem) => h('span', { class: 'custom-content' }, item.title) })
    const rows = wrapper.findAll('.am-listy-item')
    expect(rows.length).toBeGreaterThan(0)
    rows.forEach((row) => {
      expect(row.element.children).toHaveLength(1)
      expect(row.element.firstElementChild!.classList.contains('custom-content')).toBe(true)
    })
  })

  it('passes item and index to itemRender and to the rowKey getter', () => {
    const render = vi.fn((item: DataItem, index: number) => `${index}:${item.title}`)
    const rowKey = vi.fn((item: DataItem, index: number) => `${item.id}-${index}`)
    const wrapper = mountListy({ itemRender: render, rowKey })
    expect(wrapper.findAll('.am-listy-item')[3].text()).toBe('3:Item 3')
    expect(render).toHaveBeenCalledWith(items[3], 3)
    expect(rowKey).toHaveBeenCalledWith(items[3], 3)
  })

  it('the itemRender slot wins over the prop and receives the item itself', () => {
    const slot = vi.fn((item: DataItem) => h('b', item.title.toUpperCase()))
    const wrapper = mountListy({}, { slots: { itemRender: slot } })
    expect(wrapper.find('.am-listy-item').html()).toContain('<b>ITEM 0</b>')
    // called like the PC slot: (item, index)
    expect(slot.mock.calls[2][0]).toStrictEqual(items[2])
    expect((slot.mock.calls[2] as any[])[1]).toBe(2)
  })

  it('renders primitive items', () => {
    const wrapper = mountListy({ items: ['a', 'b', 'c'], rowKey: (item: string) => item, itemRender: (item: string) => item })
    expect(wrapper.findAll('.am-listy-item').map(row => row.text())).toEqual(['a', 'b', 'c'])
  })

  it('follows items and itemRender changes', async () => {
    const wrapper = mountListy({ items: items.slice(0, 2) })
    expect(wrapper.findAll('.am-listy-item')).toHaveLength(2)

    await wrapper.setProps({ items: items.slice(0, 4) })
    expect(wrapper.findAll('.am-listy-item')).toHaveLength(4)

    await wrapper.setProps({ itemRender: (item: DataItem) => `#${item.id}` })
    expect(wrapper.findAll('.am-listy-item').map(row => row.text())).toEqual(['#0', '#1', '#2', '#3'])
  })

  it('re-renders rows when a non-reactive parent value used by the slot changes', async () => {
    const suffix = ref('a')
    const Parent = defineComponent({
      setup: () => () => {
        const text = suffix.value
        return h(Listy, { items: items.slice(0, 3), rowKey: 'id' }, { itemRender: (item: DataItem) => `${item.id}${text}` })
      },
    })
    const wrapper = mount(Parent)
    expect(wrapper.findAll('.am-listy-item').map(row => row.text())).toEqual(['0a', '1a', '2a'])
    suffix.value = 'b'
    await nextTick()
    await nextTick()
    expect(wrapper.findAll('.am-listy-item').map(row => row.text())).toEqual(['0b', '1b', '2b'])
  })

  it('renders nothing but the root without items', () => {
    const wrapper = mountListy({ items: undefined })
    expect(wrapper.classes()).toContain('am-listy')
    expect(wrapper.findAll('.am-virtual-list-item')).toHaveLength(0)
  })

  describe('group', () => {
    it('collects items under group headers in order of first appearance', () => {
      const data = [
        { id: 1, team: 'B' },
        { id: 2, team: 'A' },
        { id: 3, team: 'B' },
      ]
      const title = vi.fn((key: string | number, list: any[]) => `${key} (${list.length})`)
      const wrapper = mountListy({
        items: data,
        group: { key: (item: any) => item.team, title },
        itemRender: (item: any, index: number) => `${item.id}@${index}`,
      })
      expect(wrapper.findAll('.am-virtual-list-item').map(row => row.text())).toEqual(['B (2)', '1@0', '3@2', 'A (1)', '2@1'])
      expect(title).toHaveBeenCalledWith('B', [data[0], data[2]])
      const header = wrapper.find('.am-listy-group-header')
      expect(header.classes()).not.toContain('am-listy-group-header-fixed')
      expect(header.element.parentElement!.classList.contains('am-virtual-list-item')).toBe(true)
    })

    it('supports a fixed group key and falls back to the key as title', () => {
      const wrapper = mountListy({ items: items.slice(0, 3), group: { key: 'All' } })
      expect(wrapper.findAll('.am-listy-group-header').map(row => row.text())).toEqual(['All'])
      expect(wrapper.findAll('.am-listy-item')).toHaveLength(3)
    })

    it('the groupTitle slot wins over group.title', () => {
      const wrapper = mountListy(
        { group },
        { slots: { groupTitle: ({ groupKey, items: list }: any) => h('em', `${groupKey}/${list.length}`) } },
      )
      expect(wrapper.find('.am-listy-group-header').html()).toContain('<em>Group 0/10</em>')
    })

    it('keeps item and group keys apart', () => {
      const wrapper = mountListy({
        items: [{ id: 'x' }, { id: 'y' }],
        group: { key: (item: any) => item.id },
        itemRender: (item: any) => `item ${item.id}`,
      })
      expect(wrapper.findAll('.am-virtual-list-item').map(row => row.text())).toEqual(['x', 'item x', 'y', 'item y'])
    })
  })

  describe('sticky', () => {
    it('renders the pinned header only with sticky and groups', async () => {
      const wrapper = mountListy({ sticky: true })
      expect(stickyTitle(wrapper).exists()).toBe(false)

      await wrapper.setProps({ group })
      expect(stickyTitle(wrapper).exists()).toBe(true)
      expect(stickyTitle(wrapper).element.parentElement!.classList.contains('am-virtual-list-header')).toBe(true)
      expect(stickyTitle(wrapper).text()).toBe('Group 0')

      await wrapper.setProps({ sticky: false })
      expect(stickyTitle(wrapper).exists()).toBe(false)
      expect(wrapper.find('.am-virtual-list-header').exists()).toBe(false)
    })

    it('pins the header of the group at the top edge and lets the next one push it out', async () => {
      mockLayout()
      // a group = 1 header + 10 items = 440px; the header of group 1 sits at 440px
      const wrapper = mountListy({ sticky: true, group })
      await nextTick()
      expect(stickyTitle(wrapper).text()).toBe('Group 0')
      expect(stickyTitle(wrapper).attributes('style') ?? '').not.toContain('translate3d')

      await scrollListTo(wrapper, 300)
      expect(stickyTitle(wrapper).text()).toBe('Group 0')
      expect(stickyTitle(wrapper).attributes('style') ?? '').not.toContain('translate3d')

      // the next header is 20px below the top edge: the pinned one (40px) is pushed up by 20px
      await scrollListTo(wrapper, 420)
      expect(stickyTitle(wrapper).text()).toBe('Group 0')
      expect(stickyTitle(wrapper).attributes('style')).toContain('translate3d(0, -20px, 0)')

      await scrollListTo(wrapper, 440)
      expect(stickyTitle(wrapper).text()).toBe('Group 1')
      expect(stickyTitle(wrapper).attributes('style') ?? '').not.toContain('translate3d')

      await scrollListTo(wrapper, 2000)
      expect(stickyTitle(wrapper).text()).toBe('Group 4')

      await scrollListTo(wrapper, 0)
      expect(stickyTitle(wrapper).text()).toBe('Group 0')
    })

    it('works the same with virtual: false', async () => {
      mockLayout()
      const wrapper = mountListy({ sticky: true, group, virtual: false })
      await scrollListTo(wrapper, 900)
      expect(stickyTitle(wrapper).text()).toBe('Group 2')
      await scrollListTo(wrapper, 1300)
      expect(stickyTitle(wrapper).text()).toBe('Group 2')
      expect(stickyTitle(wrapper).attributes('style')).toContain('translate3d(0, -20px, 0)')
    })

    it('follows the content while it rubber-bands above the top', async () => {
      mockLayout()
      const wrapper = mountListy({ sticky: true, group })
      await nextTick()
      const root = wrapper.element as HTMLElement
      Object.defineProperty(root, 'scrollTop', { value: -30, configurable: true })
      await wrapper.trigger('scroll')
      await nextTick()
      expect(stickyTitle(wrapper).attributes('style')).toContain('translate3d(0, 30px, 0)')
    })

    it('keeps the pinned header in range when groups are removed', async () => {
      mockLayout()
      const wrapper = mountListy({ sticky: true, group })
      await scrollListTo(wrapper, 2000)
      expect(stickyTitle(wrapper).text()).toBe('Group 4')
      await wrapper.setProps({ items: items.slice(0, 15) })
      await nextTick()
      expect(['Group 0', 'Group 1']).toContain(stickyTitle(wrapper).text())
    })

    it('applies the groupHeader semantics and scrollWidth to the pinned header', () => {
      const wrapper = mountListy({
        sticky: true,
        group,
        scrollWidth: 800,
        classes: { groupHeader: 'custom-header' },
        styles: { groupHeader: { color: 'rgb(0, 0, 255)' } },
      })
      const header = stickyTitle(wrapper)
      expect(header.classes()).toEqual(expect.arrayContaining(['am-listy-group-header', 'custom-header']))
      expect((header.element as HTMLElement).style.color).toBe('rgb(0, 0, 255)')
      expect((header.element as HTMLElement).style.width).toBe('800px')
    })
  })

  describe('scrollTo', () => {
    function mountWithRef(props: Record<string, any> = {}) {
      const wrapper = mountListy(props)
      return { wrapper, root: wrapper.element as HTMLElement, listy: wrapper.vm as unknown as ListyRef }
    }

    it('scrolls to a pixel position', () => {
      const { root, listy } = mountWithRef()
      listy.scrollTo(120)
      expect(root.scrollTop).toBe(120)
      listy.scrollTo({ top: 300, left: 16 })
      expect(root.scrollTop).toBe(300)
      expect(root.scrollLeft).toBe(16)
      listy.scrollTo({ left: 8 })
      expect(root.scrollTop).toBe(300)
      expect(root.scrollLeft).toBe(8)
    })

    it('ignores null / undefined and unknown keys', () => {
      const { root, listy } = mountWithRef()
      listy.scrollTo(50)
      expect(() => listy.scrollTo()).not.toThrow()
      expect(() => listy.scrollTo(null)).not.toThrow()
      listy.scrollTo({ key: 'nope', align: 'top' })
      listy.scrollTo({ groupKey: 'nope' })
      expect(root.scrollTop).toBe(50)
    })

    it('scrolls to an item by rowKey with align and offset', () => {
      mockLayout()
      const { root, listy } = mountWithRef()
      listy.scrollTo({ key: 50, align: 'top' })
      expect(root.scrollTop).toBe(2000)
      listy.scrollTo({ key: 50, align: 'top', offset: 10 })
      expect(root.scrollTop).toBe(1990)
      listy.scrollTo({ key: 50, align: 'bottom' })
      expect(root.scrollTop).toBe(2000 + ROW - VIEWPORT)
      listy.scrollTo({ key: 50, align: 'bottom', offset: 10 })
      expect(root.scrollTop).toBe(2000 + ROW - VIEWPORT + 10)
    })

    it('align defaults to auto: the nearest edge, nothing when the item is in view', async () => {
      mockLayout()
      const { wrapper, root, listy } = mountWithRef()
      await nextTick()
      listy.scrollTo({ key: 2 })
      expect(root.scrollTop).toBe(0)
      listy.scrollTo({ key: 50 })
      expect(root.scrollTop).toBe(2000 + ROW - VIEWPORT)
      await scrollListTo(wrapper, root.scrollTop)
      listy.scrollTo({ key: 10 })
      expect(root.scrollTop).toBe(400)
    })

    it('scrolls to a group header', () => {
      mockLayout()
      const { root, listy } = mountWithRef({ group })
      // group 3 starts after 3 * (1 header + 10 items)
      listy.scrollTo({ groupKey: 'Group 3', align: 'top' })
      expect(root.scrollTop).toBe(33 * ROW)
      listy.scrollTo({ groupKey: 'Group 3', align: 'bottom' })
      expect(root.scrollTop).toBe(34 * ROW - VIEWPORT)
    })

    it('keeps a top-aligned item below the sticky header', async () => {
      mockLayout()
      const { root, listy } = mountWithRef({ group, sticky: true })
      await nextTick()
      // item 25 is flat row 3 headers + 25 items = 28; the pinned header covers 40px
      listy.scrollTo({ key: 25, align: 'top' })
      expect(root.scrollTop).toBe(28 * ROW - ROW)
      listy.scrollTo({ key: 25, align: 'top', offset: 4 })
      expect(root.scrollTop).toBe(28 * ROW - ROW - 4)
      // the bottom edge is not covered
      listy.scrollTo({ key: 25, align: 'bottom' })
      expect(root.scrollTop).toBe(29 * ROW - VIEWPORT)
    })

    it('auto align takes the sticky header into account', async () => {
      mockLayout()
      const { wrapper, root, listy } = mountWithRef({ group, sticky: true })
      await nextTick()
      // below the viewport: aligned to the bottom edge
      listy.scrollTo({ key: 25 })
      expect(root.scrollTop).toBe(29 * ROW - VIEWPORT)
      await scrollListTo(wrapper, root.scrollTop)

      // fully visible below the pinned header: stays
      listy.scrollTo({ key: 24 })
      expect(root.scrollTop).toBe(29 * ROW - VIEWPORT)

      // rendered but hidden behind the pinned header (row 24 is at the top edge): moved below it
      await scrollListTo(wrapper, 24 * ROW)
      listy.scrollTo({ key: 21 })
      expect(root.scrollTop).toBe(24 * ROW - ROW)

      // far above the rendered window
      listy.scrollTo({ key: 2 })
      expect(root.scrollTop).toBe(3 * ROW - ROW)
    })

    it('is exposed on the component ref', () => {
      const listyRef = ref<ListyRef>()
      const Demo = defineComponent({
        setup: () => () => h(Listy, { ref: listyRef, items, rowKey: 'id', height: 200, itemRender }),
      })
      mount(Demo)
      expect(typeof listyRef.value!.scrollTo).toBe('function')
      expect(() => listyRef.value!.scrollTo({ key: 5, align: 'top' })).not.toThrow()
    })
  })

  it('emits scroll exactly once with the native event', async () => {
    const onScroll = vi.fn()
    const wrapper = mountListy({ onScroll })
    wrapper.element.dispatchEvent(new Event('scroll'))
    expect(onScroll).toHaveBeenCalledTimes(1)
    expect(onScroll).toHaveBeenCalledWith(expect.any(Event))
    expect(wrapper.emitted('scroll')).toHaveLength(1)
  })

  it('emits reachEnd near the bottom', async () => {
    const wrapper = mountListy()
    const root = wrapper.element as HTMLElement
    Object.defineProperty(root, 'clientHeight', { value: 200, configurable: true })
    Object.defineProperty(root, 'scrollHeight', { value: 4000, configurable: true })
    root.scrollTop = 3800
    await wrapper.trigger('scroll')
    await wrapper.trigger('scroll')
    expect(wrapper.emitted('reachEnd')).toHaveLength(1)
  })

  it('supports scrollWidth', async () => {
    const wrapper = mountListy({ scrollWidth: 1000 })
    expect(wrapper.classes()).toContain('am-listy-scroll-x')
    expect((wrapper.find('.am-virtual-list-holder').element as HTMLElement).style.width).toBe('1000px')

    await wrapper.setProps({ scrollWidth: undefined })
    expect(wrapper.classes()).not.toContain('am-listy-scroll-x')
    expect((wrapper.find('.am-virtual-list-holder').element as HTMLElement).style.width).toBe('')
  })

  it('applies attrs, rootClass, classes and styles to each semantic node', () => {
    const wrapper = mountListy(
      {
        group,
        rootClass: 'root-class',
        classes: { root: 'custom-root', item: 'custom-item', groupHeader: 'custom-header' },
        styles: {
          root: { backgroundColor: 'rgb(255, 0, 0)' },
          item: { color: 'rgb(0, 128, 0)' },
          groupHeader: { color: 'rgb(0, 0, 255)' },
        },
      },
      { attrs: { 'class': 'attr-class', 'style': 'margin: 4px;', 'data-testid': 'listy' } },
    )
    const root = wrapper.element as HTMLElement
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-listy', 'root-class', 'custom-root', 'attr-class']))
    expect(root.dataset.testid).toBe('listy')
    expect(root.style.margin).toBe('4px')
    expect(root.style.backgroundColor).toBe('rgb(255, 0, 0)')
    expect(root.style.maxHeight).toBe('200px')

    const rows = wrapper.findAll('.am-listy-item')
    expect(rows.length).toBeGreaterThan(0)
    rows.forEach((row) => {
      expect(row.classes()).toContain('custom-item')
      expect((row.element as HTMLElement).style.color).toBe('rgb(0, 128, 0)')
    })
    const header = wrapper.find('.am-listy-group-header')
    expect(header.classes()).toContain('custom-header')
    expect((header.element as HTMLElement).style.color).toBe('rgb(0, 0, 255)')
  })

  it('follows the ConfigProvider direction', () => {
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: { default: () => h(Listy, { items, rowKey: 'id', height: 200, itemRender }) },
    })
    const root = wrapper.find('.am-listy')
    expect(root.classes()).toContain('am-listy-rtl')
    expect(root.attributes('dir')).toBe('rtl')
  })

  it('stays cheap with thousands of rows', () => {
    const wrapper = mountListy({ items: createItems(10000, 100), group, sticky: true })
    expect(wrapper.findAll('.am-virtual-list-item').length).toBeLessThan(20)
    expect(wrapper.find('.am-virtual-list-holder').attributes('style')).toContain(`height: ${(10000 + 100) * 40}px`)
  })
})

describe('listy util', () => {
  it('tags keys by type', () => {
    expect(toTaggedKey(1, 'item')).toBe('item:1')
    expect(toTaggedKey(1, 'group')).toBe('group:1')
  })

  it('resolves the row key from a field, a getter or the index', () => {
    expect(getItemKey('id', { id: 7 }, 0)).toBe(7)
    expect(getItemKey((item, index) => `${item.id}-${index}`, { id: 7 }, 2)).toBe('7-2')
    expect(getItemKey('id', {}, 3)).toBe(3)
    expect(getItemKey('id', 'text', 4)).toBe(4)
    expect(getItemKey(undefined, { id: 7 }, 5)).toBe(5)
  })

  it('flattens plain and grouped data', () => {
    const data = [{ id: 'a', g: 1 }, { id: 'b', g: 2 }, { id: 'c', g: 1 }]
    const plain = flattenRows(data, 'id')
    expect(plain.rows.map(row => row.taggedKey)).toEqual(['item:a', 'item:b', 'item:c'])
    expect(plain.groups).toEqual([])
    expect(plain.rowGroups).toEqual([])

    const grouped = flattenRows(data, 'id', { key: item => item.g })
    expect(grouped.rows.map(row => row.taggedKey)).toEqual(['group:1', 'item:a', 'item:c', 'group:2', 'item:b'])
    expect(grouped.groups).toEqual([
      { key: 1, items: [data[0], data[2]], rowIndex: 0 },
      { key: 2, items: [data[1]], rowIndex: 3 },
    ])
    expect(grouped.rowGroups).toEqual([0, 0, 0, 1, 1])
  })
})
