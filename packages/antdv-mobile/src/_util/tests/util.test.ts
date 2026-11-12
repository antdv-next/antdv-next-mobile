import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { addUnit, clamp, cls, getSizeStyle, isNumeric, omit, padZero, pick, toArray } from '..'
import { nextZIndex, useControlled, useTouch } from '../hooks'
import { mountComponent } from '../mount'
import RenderNode from '../RenderNode'
import { withInstall } from '../withInstall'

describe('_util', () => {
  it('helpers', () => {
    expect(addUnit(12)).toBe('12px')
    expect(addUnit('12')).toBe('12px')
    expect(addUnit('1rem')).toBe('1rem')
    expect(addUnit(undefined)).toBeUndefined()
    expect(getSizeStyle([10, '2em'])).toEqual({ width: '10px', height: '2em' })
    expect(clamp(5, 0, 3)).toBe(3)
    expect(isNumeric('-1.5')).toBe(true)
    expect(isNumeric('1px')).toBe(false)
    expect(toArray(undefined)).toEqual([])
    expect(toArray(1)).toEqual([1])
    expect(padZero(3)).toBe('03')
    expect(pick({ a: 1, b: 2 }, ['a'])).toEqual({ a: 1 })
    expect(omit({ a: 1, b: 2 }, ['a'])).toEqual({ b: 2 })
    expect(cls('a', ['b', { c: true, d: false }], undefined, { e: 1 })).toBe('a b c e')
    expect(nextZIndex()).toBeLessThan(nextZIndex())
  })

  it('RenderNode renders nodes, functions with params and ignores booleans', () => {
    expect(mount(RenderNode, { props: { node: 'text' } }).text()).toBe('text')
    expect(mount(RenderNode, { props: { node: (ctx: any) => h('b', ctx.n), params: { n: 'x' } } }).html()).toBe('<b>x</b>')
    expect(mount(RenderNode, { props: { node: true } }).html()).toBe('')
  })

  it('useControlled works controlled and uncontrolled', async () => {
    const onChange = vi.fn()
    let state: any
    const Comp = defineComponent({
      props: { value: { type: String, default: undefined } },
      setup(props) {
        state = useControlled(props, 'value', { defaultValue: 'init', onChange })
        return () => h('i', state[0].value)
      },
    })
    const uncontrolled = mount(Comp)
    expect(uncontrolled.text()).toBe('init')
    state[1]('next')
    await nextTick()
    expect(uncontrolled.text()).toBe('next')
    expect(onChange).toHaveBeenCalledWith('next', 'init')

    const controlled = mount(Comp, { props: { value: 'a' } })
    state[1]('b')
    await nextTick()
    expect(controlled.text()).toBe('a')
    await controlled.setProps({ value: 'b' })
    expect(controlled.text()).toBe('b')
  })

  it('useTouch tracks deltas and direction', () => {
    const touch = useTouch()
    touch.start({ touches: [{ clientX: 10, clientY: 10 }] } as any)
    touch.move({ touches: [{ clientX: 40, clientY: 14 }] } as any)
    expect(touch.deltaX.value).toBe(30)
    expect(touch.isHorizontal()).toBe(true)
    expect(touch.isTap.value).toBe(false)
  })

  it('withInstall registers the component and its sub components', () => {
    const Sub = defineComponent({ name: 'AmFooItem', render: () => null })
    const Foo = withInstall(defineComponent({ render: () => null }), 'AmFoo', { Item: Sub, helper: () => 1 })
    const component = vi.fn()
    Foo.install!({ component } as any)
    expect(component).toHaveBeenCalledWith('AmFoo', Foo)
    expect(component).toHaveBeenCalledWith('AmFooItem', Sub)
    expect(component).toHaveBeenCalledTimes(2)
    expect(Foo.Item).toBe(Sub)
  })

  it('mountComponent mounts into body and cleans up', async () => {
    const text = ref('hello')
    const { unmount } = mountComponent(() => h('p', { class: 'static' }, text.value))
    expect(document.querySelector('.am-static-holder .am-config-provider .static')!.textContent).toBe('hello')
    text.value = 'world'
    await nextTick()
    expect(document.querySelector('.static')!.textContent).toBe('world')
    unmount()
    unmount()
    expect(document.querySelector('.am-static-holder')).toBeNull()
  })
})
