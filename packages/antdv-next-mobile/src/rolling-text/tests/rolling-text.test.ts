import type { RollingTextExpose } from '..'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import RollingText from '..'
import { formatNumbers, getNumberColumns, getTextColumns } from '../utils'

type Wrapper = ReturnType<typeof mount>

function items(wrapper: Wrapper) {
  return wrapper.findAll('.am-rolling-text-item')
}

function figures(wrapper: Wrapper, index: number) {
  return items(wrapper)[index].findAll('.am-rolling-text-item-figure').map(item => item.text())
}

function cssVar(wrapper: Wrapper, index: number, name: string) {
  return (items(wrapper)[index].element as HTMLElement).style.getPropertyValue(name)
}

function mockReducedMotion(matches: boolean) {
  return vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  }))
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('RollingText', () => {
  it('renders one rolling column per digit with default classes', () => {
    const wrapper = mount(RollingText, { props: { value: 123 } })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toEqual(['am-rolling-text', 'am-rolling-text-down', 'am-rolling-text-rolling'])
    expect(items(wrapper)).toHaveLength(3)
    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('123')
    expect(items(wrapper).every(item => item.attributes('aria-hidden') === 'true')).toBe(true)
    expect((wrapper.element as HTMLElement).style.getPropertyValue('--am-rolling-text-duration')).toBe('2s')
  })

  it('direction: target is the last figure when rolling up, the first when rolling down', () => {
    const up = mount(RollingText, { props: { value: 7, from: 3, direction: 'up' } })
    expect(up.classes()).toContain('am-rolling-text-up')
    const upFigures = figures(up, 0)
    expect(upFigures[0]).toBe('3')
    expect(upFigures[upFigures.length - 1]).toBe('7')
    // 3..9 + two loops + 0..7
    expect(upFigures).toHaveLength(7 + 20 + 8)
    expect(cssVar(up, 0, '--am-rolling-text-steps')).toBe(String(upFigures.length - 1))

    const down = mount(RollingText, { props: { value: 7, from: 3 } })
    const downFigures = figures(down, 0)
    expect(downFigures[0]).toBe('7')
    expect(downFigures[downFigures.length - 1]).toBe('3')
  })

  it('pads from / value to the same length and keeps decimals and the sign static', () => {
    const wrapper = mount(RollingText, { props: { value: -12.5, from: 3, direction: 'up' } })
    expect(wrapper.attributes('aria-label')).toBe('-12.5')
    expect(wrapper.findAll('.am-rolling-text-separator').map(item => item.text())).toEqual(['-', '.'])
    expect(items(wrapper)).toHaveLength(3)
    // 03.0 -> 12.5
    expect([0, 1, 2].map(i => figures(wrapper, i)[0])).toEqual(['0', '3', '0'])
    expect([0, 1, 2].map(i => figures(wrapper, i).pop())).toEqual(['1', '2', '5'])

    const longer = mount(RollingText, { props: { value: 5, from: 1000 } })
    expect(items(longer)).toHaveLength(4)
    expect(longer.attributes('aria-label')).toBe('5')
  })

  it('stopOrder decides the delay of every column', async () => {
    const wrapper = mount(RollingText, { props: { value: 123 } })
    expect([0, 1, 2].map(i => cssVar(wrapper, i, '--am-rolling-text-delay'))).toEqual(['0s', '0.2s', '0.4s'])
    await wrapper.setProps({ stopOrder: 'rtl' })
    expect([0, 1, 2].map(i => cssVar(wrapper, i, '--am-rolling-text-delay'))).toEqual(['0.4s', '0.2s', '0s'])
  })

  it('duration and height set css variables', () => {
    const wrapper = mount(RollingText, { props: { value: 1, duration: 0.5, height: 54 } })
    const style = (wrapper.element as HTMLElement).style
    expect(style.getPropertyValue('--am-rolling-text-duration')).toBe('0.5s')
    expect(style.getPropertyValue('--am-rolling-text-item-height')).toBe('54px')
    const rem = mount(RollingText, { props: { value: 1, height: '2rem' } })
    expect((rem.element as HTMLElement).style.getPropertyValue('--am-rolling-text-item-height')).toBe('2rem')
    const auto = mount(RollingText, { props: { value: 1 } })
    expect((auto.element as HTMLElement).style.getPropertyValue('--am-rolling-text-item-height')).toBe('')
  })

  it('texts: rolls through the strings, the last one is the target', () => {
    const texts = ['aaaaa', 'bbbbb', 'hello']
    const wrapper = mount(RollingText, { props: { texts, direction: 'up' } })
    expect(wrapper.attributes('aria-label')).toBe('hello')
    expect(items(wrapper)).toHaveLength(5)
    expect(figures(wrapper, 0)).toEqual(['a', 'b', 'h'])
    expect(figures(wrapper, 4)).toEqual(['a', 'b', 'o'])
    const down = mount(RollingText, { props: { texts } })
    expect(figures(down, 1)).toEqual(['e', 'b', 'a'])
  })

  it('autoStart: false waits for start(), reset() goes back', async () => {
    const wrapper = mount(RollingText, { props: { value: 99, autoStart: false } })
    expect(wrapper.classes()).not.toContain('am-rolling-text-rolling')
    const vm = wrapper.vm as unknown as RollingTextExpose
    const before = items(wrapper)[0].element
    vm.start()
    await nextTick()
    expect(wrapper.classes()).toContain('am-rolling-text-rolling')
    // columns are re-created so the css animation restarts
    expect(items(wrapper)[0].element).not.toBe(before)
    vm.reset()
    await nextTick()
    expect(wrapper.classes()).not.toContain('am-rolling-text-rolling')
    await wrapper.setProps({ autoStart: true })
    expect(wrapper.classes()).toContain('am-rolling-text-rolling')
  })

  it('restarts when the value changes (autoStart) or resets (manual)', async () => {
    const auto = mount(RollingText, { props: { value: 10 } })
    const before = items(auto)[0].element
    await auto.setProps({ value: 25 })
    expect(auto.attributes('aria-label')).toBe('25')
    expect(items(auto)[0].element).not.toBe(before)
    expect(auto.classes()).toContain('am-rolling-text-rolling')

    const manual = mount(RollingText, { props: { value: 10, autoStart: false } })
    ;(manual.vm as unknown as RollingTextExpose).start()
    await nextTick()
    await manual.setProps({ value: 25 })
    expect(manual.classes()).not.toContain('am-rolling-text-rolling')
  })

  it('emits finish when the last column stops', async () => {
    const wrapper = mount(RollingText, { props: { value: 123 } })
    const boxes = () => wrapper.findAll('.am-rolling-text-item-box')
    await boxes()[0].trigger('animationend')
    expect(wrapper.emitted('finish')).toBeUndefined()
    await boxes()[2].trigger('animationend')
    expect(wrapper.emitted('finish')).toHaveLength(1)

    await wrapper.setProps({ stopOrder: 'rtl' })
    await boxes()[2].trigger('animationend')
    expect(wrapper.emitted('finish')).toHaveLength(1)
    await boxes()[0].trigger('animationend')
    expect(wrapper.emitted('finish')).toHaveLength(2)
  })

  it('reduced motion: emits finish without waiting for an animation', async () => {
    mockReducedMotion(true)
    const wrapper = mount(RollingText, { props: { value: 5 } })
    await nextTick()
    expect(wrapper.emitted('finish')).toHaveLength(1)
    ;(wrapper.vm as unknown as RollingTextExpose).start()
    await nextTick()
    expect(wrapper.emitted('finish')).toHaveLength(2)
    const idle = mount(RollingText, { props: { value: 5, autoStart: false } })
    await nextTick()
    expect(idle.emitted('finish')).toBeUndefined()
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(RollingText, {
      props: {
        value: 12,
        rootClass: 'root-cls',
        classes: { root: 'r', item: 'i' },
        styles: { root: { margin: '1px' }, item: { color: 'red' } },
      },
      attrs: { 'class': 'custom', 'style': 'padding: 2px; --am-rolling-text-duration: 9s', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-rolling-text', 'custom', 'root-cls', 'r']))
    expect(wrapper.attributes('data-id')).toBe('x')
    const style = (wrapper.element as HTMLElement).style
    expect(style.margin).toBe('1px')
    expect(style.padding).toBe('2px')
    expect(style.getPropertyValue('--am-rolling-text-duration')).toBe('9s')
    const item = items(wrapper)[0]
    expect(item.classes()).toContain('i')
    expect((item.element as HTMLElement).style.color).toBe('red')
    expect(cssVar(wrapper, 0, '--am-rolling-text-steps')).not.toBe('')
  })

  it('utils', () => {
    expect(formatNumbers(0, 1234)).toEqual({ start: '0000', target: '1234', negative: false, label: '1234' })
    expect(formatNumbers(1.25, 3)).toMatchObject({ start: '1.25', target: '3.00', label: '3.00' })
    expect(formatNumbers(Number.NaN, undefined)).toMatchObject({ start: '0', target: '0' })
    expect(getNumberColumns(0, 5, 'up')[0]).toMatchObject({ rolling: true, order: 0 })
    expect(getTextColumns([], 'up')).toEqual([])
    expect(getTextColumns(['a', 'xyz'], 'up').map(column => column.figures)).toEqual([['a', 'x'], ['', 'y'], ['', 'z']])
  })
})
