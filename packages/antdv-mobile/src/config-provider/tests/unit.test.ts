import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import ConfigProvider from '..'
import { addUnit, toUnit } from '../../_util'
import { useUnit } from '../../hooks'
import PickerView from '../../picker-view'
import VirtualList from '../../virtual-list'

/** jsdom has no layout: pretend every probe (100 units wide) measures `width` px */
function mockProbeWidth(width: string, height = '') {
  const original = window.getComputedStyle.bind(window)
  return vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element, pseudo?: string | null) => {
    if (el.classList.contains('am-unit-probe'))
      return { width, height } as CSSStyleDeclaration
    return original(el, pseudo)
  })
}

function consumer() {
  const result = {} as { unit: ReturnType<typeof useUnit> }
  const Consumer = defineComponent({
    setup() {
      result.unit = useUnit()
      return () => h('i')
    },
  })
  return { Consumer, result }
}

describe('unit', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    // back to the default unit for the tests that follow
    window.dispatchEvent(new Event('resize'))
  })

  it('toUnit / addUnit express numbers in units and keep hairlines', () => {
    expect(toUnit(16)).toBe('calc(16 * var(--am-unit))')
    expect(toUnit(-4)).toBe('calc(-4 * var(--am-unit))')
    expect(toUnit(1.5)).toBe('calc(1.5 * var(--am-unit))')
    expect(toUnit(1)).toBe('1px')
    expect(toUnit(0)).toBe('0px')
    expect(toUnit(-1)).toBe('-1px')
    expect(toUnit(999)).toBe('999px')
    expect(addUnit('20')).toBe('calc(20 * var(--am-design-unit))')
    expect(addUnit('2rem')).toBe('2rem')
  })

  it('is 1 by default and measures the document through a probe next to <body>', async () => {
    const { Consumer, result } = consumer()
    mount(Consumer)
    expect(result.unit.unit.value).toBe(1)
    expect(result.unit.toPx(40)).toBe(40)
    const probe = document.documentElement.querySelector(':scope > .am-unit-probe')
    expect(probe).not.toBeNull()
    expect(document.body.querySelector('.am-unit-probe')).toBeNull()

    mockProbeWidth('150px')
    window.dispatchEvent(new Event('resize'))
    await nextTick()
    expect(result.unit.unit.value).toBe(1.5)
    expect(result.unit.toPx(40)).toBe(60)
    expect(result.unit.toUnits(60)).toBe(40)
    // a second consumer reuses the same probe
    mount(consumer().Consumer)
    expect(document.documentElement.querySelectorAll('.am-unit-probe')).toHaveLength(1)
  })

  it('a ConfigProvider with theme.token.unit measures its own scope', async () => {
    mockProbeWidth('200px')
    const { Consumer, result } = consumer()
    const wrapper = mount(ConfigProvider, {
      props: { theme: { token: { unit: 2 } } },
      slots: { default: () => h(ConfigProvider, null, () => h(Consumer)) },
    })
    await nextTick()
    expect(wrapper.classes()).toContain('am-theme-unit')
    expect(wrapper.attributes('style')).toContain('--am-unit: 2px')
    expect(wrapper.find('.am-unit-probe').exists()).toBe(true)
    // inherited by the nested provider
    expect(result.unit.unit.value).toBe(2)

    await wrapper.setProps({ theme: {} })
    expect(wrapper.find('.am-unit-probe').exists()).toBe(false)
    expect(wrapper.classes()).not.toContain('am-theme-unit')
  })

  it('no probe is rendered without a unit token', () => {
    const wrapper = mount(ConfigProvider, { props: { theme: { token: { colorPrimary: 'red' } } } })
    expect(wrapper.find('.am-unit-probe').exists()).toBe(false)
  })

  it('virtualList computes its window in real pixels', async () => {
    mockProbeWidth('200px')
    const data = Array.from({ length: 100 }, (_, i) => ({ id: i }))
    const wrapper = mount(ConfigProvider, {
      props: { theme: { token: { unit: 2 } } },
      slots: {
        default: () => h(VirtualList, { data, height: 200, itemHeight: 40, itemKey: 'id', fixed: true }, { default: ({ item }: any) => item.id }),
      },
    })
    await nextTick()
    // 100 rows of 40 units = 80px each
    expect(wrapper.find('.am-virtual-list-holder').attributes('style')).toContain('height: 8000px')
    expect(wrapper.find('.am-virtual-list-item').attributes('style')).toContain('height: 80px')
    // the css height stays in units
    expect(wrapper.find('.am-virtual-list').attributes('style')).toContain('height: calc(200 * var(--am-design-unit))')
  })

  it('pickerView keeps the css item height in units and scrolls in real pixels', async () => {
    mockProbeWidth('200px')
    const wrapper = mount(ConfigProvider, {
      props: { theme: { token: { unit: 2 } } },
      slots: { default: () => h(PickerView, { columns: [['a', 'b', 'c'].map(value => ({ label: value, value }))], defaultValue: ['c'], itemHeight: 40 }) },
    })
    await nextTick()
    const style = (wrapper.find('.am-picker-view').element as HTMLElement).style
    expect(style.getPropertyValue('--am-picker-view-item-height')).toBe('calc(40 * var(--am-design-unit))')
    // third option: 2 rows * 80px above the centre line, which sits (5 - 1) / 2 rows down
    expect(wrapper.find('.am-picker-view-column-wrapper').attributes('style')).toContain('translate3d(0, 0px, 0)')
  })

  it('designWidth: numbers given by the user are read on their design, library defaults stay units', async () => {
    // 750 wide viewport, unit = 100vw / 375 = 2px, design unit = 100vw / 750 = 1px
    mockProbeWidth('200px', '100px')
    const { Consumer, result } = consumer()
    const data = Array.from({ length: 100 }, (_, i) => ({ id: i }))
    const list = (props: Record<string, any>) => h(VirtualList, { data, itemKey: 'id', fixed: true, ...props }, { default: ({ item }: any) => item.id })
    const wrapper = mount(ConfigProvider, {
      props: { theme: { token: { unit: 'calc(100vw / 375)', designWidth: 750 } } },
      slots: {
        default: () => [
          h(Consumer),
          h('div', { class: 'given' }, list({ height: 400, itemHeight: 88 })),
          h('div', { class: 'default' }, list({})),
        ],
      },
    })
    await nextTick()
    expect(wrapper.attributes('style')).toContain('--am-design-unit: calc(var(--am-unit) * 375 / 750)')
    expect(wrapper.find('.am-unit-probe').exists()).toBe(true)
    const { unit } = result
    expect(unit.unit.value).toBe(2)
    expect(unit.designUnit.value).toBe(1)
    expect(unit.toPx(44)).toBe(88)
    expect(unit.designToPx(88)).toBe(88)
    expect(unit.unitsToDesign(44)).toBe(88)
    // 88 on a 750 design = 44 units = 88px here
    expect(wrapper.find('.given .am-virtual-list-item').attributes('style')).toContain('height: 88px')
    expect(wrapper.find('.given .am-virtual-list').attributes('style')).toContain('height: calc(400 * var(--am-design-unit))')
    // the default (44 units) is not read on the design of the user
    expect(wrapper.find('.default .am-virtual-list-item').attributes('style')).toContain('height: 88px')
  })

  it('designWidth alone still measures the scope', async () => {
    mockProbeWidth('100px', '50px')
    const { Consumer, result } = consumer()
    const wrapper = mount(ConfigProvider, {
      props: { theme: { token: { designWidth: 750 } } },
      slots: { default: () => h(Consumer) },
    })
    await nextTick()
    expect(wrapper.classes()).not.toContain('am-theme-unit')
    expect(result.unit.unit.value).toBe(1)
    expect(result.unit.designToPx(88)).toBe(44)
  })
})
