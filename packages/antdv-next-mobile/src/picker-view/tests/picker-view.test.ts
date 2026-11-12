import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import PickerView from '..'
import { findEnabledIndex, resolvePicker } from '../util'

const columns = [
  [
    { label: 'Mon', value: 'mon' },
    { label: 'Tue', value: 'tue' },
    { label: 'Wed', value: 'wed', disabled: true },
    { label: 'Thu', value: 'thu' },
    { label: 'Fri', value: 'fri' },
  ],
  [
    { label: 'AM', value: 'am' },
    { label: 'PM', value: 'pm' },
  ],
]

function touches(y: number) {
  return { touches: [{ clientX: 0, clientY: y }] }
}

describe('PickerView', () => {
  it('renders columns, options and base classes', () => {
    const wrapper = mount(PickerView, { props: { columns } })
    expect(wrapper.classes()).toContain('am-picker-view')
    expect(wrapper.findAll('.am-picker-view-column')).toHaveLength(2)
    expect(wrapper.findAll('.am-picker-view-item')).toHaveLength(7)
    expect(wrapper.find('.am-picker-view-indicator').exists()).toBe(true)
    // falls back to the first enabled option of every column
    const selected = wrapper.findAll('.am-picker-view-item-selected').map(item => item.text())
    expect(selected).toEqual(['Mon', 'AM'])
  })

  it('sets item height / visible count through css variables', () => {
    const wrapper = mount(PickerView, { props: { columns, itemHeight: 50, visibleItemCount: 3, value: ['tue', 'am'] } })
    const style = wrapper.attributes('style')
    expect(style).toContain('--am-picker-view-item-height: 50px')
    expect(style).toContain('--am-picker-view-visible-count: 3')
    // (3 - 1) / 2 * 50 - 1 * 50 = 0
    expect(wrapper.find('.am-picker-view-column-wrapper').attributes('style')).toContain('translate3d(0, 0px, 0)')
  })

  it('selects by click and emits change with items (uncontrolled)', async () => {
    const wrapper = mount(PickerView, { props: { columns, defaultValue: ['tue', 'pm'] } })
    await wrapper.findAll('.am-picker-view-column')[0].findAll('.am-picker-view-item')[3].trigger('click')
    expect(wrapper.emitted('update:value')![0]).toEqual([['thu', 'pm']])
    const [value, info] = wrapper.emitted('change')![0] as any
    expect(value).toEqual(['thu', 'pm'])
    expect(info.columnIndex).toBe(0)
    expect(info.items.map((item: any) => item.label)).toEqual(['Thu', 'PM'])
    expect(wrapper.findAll('.am-picker-view-item-selected').map(item => item.text())).toEqual(['Thu', 'PM'])
  })

  it('does not move in controlled mode until the value changes', async () => {
    const wrapper = mount(PickerView, { props: { columns, value: ['mon', 'am'] } })
    await wrapper.findAll('.am-picker-view-column')[1].findAll('.am-picker-view-item')[1].trigger('click')
    expect(wrapper.emitted('change')![0][0]).toEqual(['mon', 'pm'])
    expect(wrapper.findAll('.am-picker-view-item-selected').map(item => item.text())).toEqual(['Mon', 'AM'])
    await wrapper.setProps({ value: ['mon', 'pm'] })
    expect(wrapper.findAll('.am-picker-view-item-selected').map(item => item.text())).toEqual(['Mon', 'PM'])
  })

  it('ignores clicks on disabled options', async () => {
    const wrapper = mount(PickerView, { props: { columns } })
    await wrapper.findAll('.am-picker-view-item')[2].trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('drags the wheel and snaps to the nearest enabled option', async () => {
    const wrapper = mount(PickerView, { props: { columns, itemHeight: 40 } })
    const column = wrapper.find('.am-picker-view-column')
    vi.useFakeTimers()
    await column.trigger('touchstart', touches(200))
    await column.trigger('touchmove', touches(180))
    // slow drag: no inertia
    vi.advanceTimersByTime(400)
    await column.trigger('touchmove', touches(125))
    vi.advanceTimersByTime(400)
    await column.trigger('touchend')
    vi.runAllTimers()
    vi.useRealTimers()
    // -75px -> index 2 (disabled) -> snaps to an enabled neighbour
    const value = (wrapper.emitted('change')![0][0] as string[])[0]
    expect(['tue', 'thu']).toContain(value)
  })

  it('keeps rolling after a flick (inertia)', async () => {
    const wrapper = mount(PickerView, { props: { columns, itemHeight: 40 } })
    const column = wrapper.find('.am-picker-view-column')
    await column.trigger('touchstart', touches(200))
    await column.trigger('touchmove', touches(190))
    await column.trigger('touchmove', touches(170))
    await column.trigger('touchend')
    // moved 30px only, but the release speed carries the wheel to the last option
    expect(wrapper.emitted('change')![0][0]).toEqual(['fri', 'am'])
    expect(wrapper.find('.am-picker-view-column-wrapper').attributes('style')).toContain('transition-duration: 1000ms')
  })

  it('supports the mouse wheel and arrow keys, skipping disabled options', async () => {
    const wrapper = mount(PickerView, { props: { columns, defaultValue: ['tue', 'am'] } })
    const column = wrapper.find('.am-picker-view-column')
    await column.trigger('wheel', { deltaY: 100 })
    expect(wrapper.emitted('change')![0][0]).toEqual(['thu', 'am'])
    await column.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('change')![1][0]).toEqual(['tue', 'am'])
  })

  it('supports fieldNames', () => {
    const wrapper = mount(PickerView, {
      props: {
        columns: [[{ name: 'One', id: 1 }, { name: 'Two', id: 2, off: true }]],
        fieldNames: { label: 'name', value: 'id', disabled: 'off' },
        value: [1],
      },
    })
    expect(wrapper.find('.am-picker-view-item-selected').text()).toBe('One')
    expect(wrapper.findAll('.am-picker-view-item')[1].classes()).toContain('am-picker-view-item-disabled')
  })

  it('cascades when columns is a function', async () => {
    const data: Record<string, string[]> = { fruit: ['apple', 'pear'], drink: ['tea', 'cola'] }
    const fn = (value: (string | number)[]) => {
      const first = (value[0] as string) in data ? (value[0] as string) : 'fruit'
      return [Object.keys(data).map(key => ({ label: key, value: key })), data[first].map(key => ({ label: key, value: key }))]
    }
    const wrapper = mount(PickerView, { props: { columns: fn, defaultValue: ['fruit', 'pear'] } })
    expect(wrapper.findAll('.am-picker-view-item-selected').map(item => item.text())).toEqual(['fruit', 'pear'])
    await wrapper.findAll('.am-picker-view-column')[0].findAll('.am-picker-view-item')[1].trigger('click')
    expect(wrapper.emitted('change')![0][0]).toEqual(['drink', 'tea'])
    expect(wrapper.findAll('.am-picker-view-column')[1].text()).toContain('cola')
  })

  it('renders the loading state instead of the wheels', () => {
    const wrapper = mount(PickerView, { props: { columns, loading: true } })
    expect(wrapper.classes()).toContain('am-picker-view-loading')
    expect(wrapper.find('.am-picker-view-spin').exists()).toBe(true)
    expect(wrapper.find('.am-picker-view-column').exists()).toBe(false)
  })

  it('option slot takes priority over optionRender', () => {
    const optionRender = ({ option }: any) => h('i', { class: 'by-prop' }, option.label)
    const byProp = mount(PickerView, { props: { columns, optionRender } })
    expect(byProp.findAll('.by-prop')).toHaveLength(7)
    const bySlot = mount(PickerView, {
      props: { columns, optionRender },
      slots: { option: ({ option, selected }: any) => h('b', { class: ['by-slot', { on: selected }] }, option.label) },
    })
    expect(bySlot.find('.by-prop').exists()).toBe(false)
    expect(bySlot.findAll('.by-slot.on')).toHaveLength(2)
  })

  it('passes attrs, rootClass, classes and styles', async () => {
    const wrapper = mount(PickerView, {
      props: { columns, rootClass: 'root-cls', classes: { column: 'col-cls', item: 'item-cls', indicator: 'ind-cls' }, styles: { item: { color: 'red' } } },
      attrs: { class: 'custom', 'data-id': 'x' },
    })
    await nextTick()
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-picker-view-column').classes()).toContain('col-cls')
    expect(wrapper.find('.am-picker-view-item').classes()).toContain('item-cls')
    expect(wrapper.find('.am-picker-view-item').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-picker-view-indicator').classes()).toContain('ind-cls')
  })

  it('util: resolvePicker / findEnabledIndex', () => {
    expect(findEnabledIndex([{ disabled: true }, {}, { disabled: true }], 0)).toBe(1)
    expect(findEnabledIndex([{ disabled: true }], 0)).toBe(-1)
    const result = resolvePicker(columns, ['wed', 'nope'])
    expect(result.value[1]).toBe('am')
    expect(['tue', 'thu']).toContain(result.value[0])
    expect(resolvePicker(undefined, undefined).value).toEqual([])
  })
})

describe('PickerView virtual', () => {
  const big = [Array.from({ length: 5000 }, (_, i) => ({ label: `Item ${i}`, value: i }))]
  const indexes = (wrapper: ReturnType<typeof mount>) =>
    wrapper.findAll('.am-picker-view-item').map(item => Number(item.attributes('aria-posinset')) - 1)

  it('mounts only the window of a 5,000-option column', () => {
    const wrapper = mount(PickerView, { props: { columns: big } })
    const items = wrapper.findAll('.am-picker-view-item')
    expect(items.length).toBeGreaterThan(5)
    expect(items.length).toBeLessThan(30)
    expect(items[0].text()).toBe('Item 0')
    expect(items[0].attributes('aria-setsize')).toBe('5000')
    expect(wrapper.find('.am-picker-view-column-wrapper').attributes('style')).not.toContain('padding-top')
  })

  it('renders and selects the initial value deep in the list', () => {
    const wrapper = mount(PickerView, { props: { columns: big, value: [4000], itemHeight: 40 } })
    expect(wrapper.findAll('.am-picker-view-item').length).toBeLessThan(30)
    const selected = wrapper.find('.am-picker-view-item-selected')
    expect(selected.text()).toBe('Item 4000')
    expect(selected.attributes('aria-selected')).toBe('true')
    expect(selected.attributes('aria-posinset')).toBe('4001')
    const list = indexes(wrapper)
    const style = wrapper.find('.am-picker-view-column-wrapper').attributes('style')
    // same translate as the full list, the rows before the window are a spacer
    expect(style).toContain(`translate3d(0, ${80 - 4000 * 40}px, 0)`)
    expect(style).toContain(`padding-top: ${list[0] * 40}px`)
    // one viewport of overscan on both sides of the 5 visible rows
    expect(list[0]).toBeLessThanOrEqual(3998 - 5)
    expect(list[list.length - 1]).toBeGreaterThanOrEqual(4002 + 5)
  })

  it('follows a programmatic value change', async () => {
    const wrapper = mount(PickerView, { props: { columns: big, value: [10] } })
    expect(indexes(wrapper)).toContain(10)
    await wrapper.setProps({ value: [2500] })
    await nextTick()
    expect(wrapper.find('.am-picker-view-item-selected').text()).toBe('Item 2500')
    expect(indexes(wrapper)).not.toContain(10)
    expect(wrapper.findAll('.am-picker-view-item').length).toBeLessThan(30)
  })

  it('follows a touch drag and selects a windowed option by click', async () => {
    const wrapper = mount(PickerView, { props: { columns: big, defaultValue: [100], itemHeight: 40 } })
    const column = wrapper.find('.am-picker-view-column')
    vi.useFakeTimers()
    await column.trigger('touchstart', touches(1000))
    vi.advanceTimersByTime(400)
    // 30 rows up: far outside the initial window
    await column.trigger('touchmove', touches(400))
    await column.trigger('touchmove', touches(-200))
    expect(indexes(wrapper)).toContain(130)
    expect(indexes(wrapper)).not.toContain(100)
    vi.advanceTimersByTime(400)
    await column.trigger('touchend')
    vi.runAllTimers()
    expect(wrapper.emitted('change')![0][0]).toEqual([130])
    expect(wrapper.find('.am-picker-view-item-selected').text()).toBe('Item 130')
    expect(wrapper.findAll('.am-picker-view-item').length).toBeLessThan(30)

    const target = wrapper.findAll('.am-picker-view-item').find(item => item.text() === 'Item 133')!
    // (still on fake time: Vue ignores events older than the listener it attached under the mocked clock)
    await target.trigger('click')
    vi.useRealTimers()
    expect(wrapper.emitted('change')![1][0]).toEqual([133])
  })

  it('virtual: false renders every option', () => {
    const wrapper = mount(PickerView, { props: { columns: big, value: [4000], virtual: false } })
    const items = wrapper.findAll('.am-picker-view-item')
    expect(items).toHaveLength(5000)
    expect(items[0].attributes('aria-setsize')).toBeUndefined()
    expect(wrapper.find('.am-picker-view-item-selected').text()).toBe('Item 4000')
    expect(wrapper.find('.am-picker-view-column-wrapper').attributes('style')).not.toContain('padding-top')
  })
})
