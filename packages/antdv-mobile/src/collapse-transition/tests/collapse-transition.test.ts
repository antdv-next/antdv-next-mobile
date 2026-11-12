import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import CollapseTransition from '..'

const content = () => h('p', { class: 'content' }, 'content')
/** let the transition (rAF based in jsdom) finish */
const wait = (ms = 80) => new Promise(resolve => setTimeout(resolve, ms))

describe('CollapseTransition', () => {
  it('renders nothing until it was opened, then keeps the content hidden', async () => {
    const wrapper = mount(CollapseTransition, { slots: { default: content } })
    expect(wrapper.find('.am-collapse-transition').exists()).toBe(false)
    await wrapper.setProps({ open: true })
    const root = wrapper.find('.am-collapse-transition')
    expect(root.element.tagName).toBe('DIV')
    expect(root.isVisible()).toBe(true)
    expect(root.find('.content').text()).toBe('content')
    await wrapper.setProps({ open: false })
    await wait()
    expect(wrapper.find('.am-collapse-transition').exists()).toBe(true)
    expect((wrapper.find('.am-collapse-transition').element as HTMLElement).style.display).toBe('none')
  })

  it('forceRender renders the collapsed content up front', () => {
    const wrapper = mount(CollapseTransition, { props: { forceRender: true }, slots: { default: content } })
    const root = wrapper.find('.am-collapse-transition')
    expect(root.exists()).toBe(true)
    expect((root.element as HTMLElement).style.display).toBe('none')
  })

  it('destroyOnHidden removes the content while collapsed', async () => {
    const wrapper = mount(CollapseTransition, { props: { open: true, destroyOnHidden: true }, slots: { default: content } })
    expect(wrapper.find('.content').exists()).toBe(true)
    await wrapper.setProps({ open: false })
    await wait()
    expect(wrapper.find('.am-collapse-transition').exists()).toBe(false)
  })

  it('passes attrs, tag, rootClass, classes and styles to the root', () => {
    const wrapper = mount(CollapseTransition, {
      props: { open: true, tag: 'section', rootClass: 'root-a', classes: { root: 'root-b' }, styles: { root: { color: 'red' } } },
      attrs: { 'id': 'panel', 'class': 'custom', 'role': 'region' },
      slots: { default: content },
    })
    const root = wrapper.find('.am-collapse-transition')
    expect(root.element.tagName).toBe('SECTION')
    expect(root.classes()).toEqual(expect.arrayContaining(['root-a', 'root-b', 'custom']))
    expect(root.attributes('id')).toBe('panel')
    expect(root.attributes('role')).toBe('region')
    expect(root.attributes('style')).toContain('color: red')
  })

  it('animates the height and emits afterOpenChange', async () => {
    const wrapper = mount(CollapseTransition, { slots: { default: content }, attachTo: document.body })
    await wrapper.setProps({ open: true })
    const el = wrapper.find('.am-collapse-transition').element as HTMLElement
    expect(el.classList.contains('am-collapse-transition-enter-active')).toBe(true)
    // jsdom has no layout: scrollHeight is 0
    expect(el.style.height).toBe('0px')
    await wait()
    expect(el.classList.contains('am-collapse-transition-enter-active')).toBe(false)
    expect(el.style.height).toBe('')
    expect(wrapper.emitted('afterOpenChange')).toEqual([[true]])

    Object.defineProperty(el, 'offsetHeight', { value: 120, configurable: true })
    await wrapper.setProps({ open: false })
    expect(el.classList.contains('am-collapse-transition-leave-active')).toBe(true)
    // collapses from the measured height to 0
    expect(el.style.height).toBe('0px')
    await wait()
    expect(el.style.height).toBe('')
    expect(el.style.display).toBe('none')
    expect(wrapper.emitted('afterOpenChange')).toEqual([[true], [false]])
  })

  it('appear plays the expand animation on first render', async () => {
    const wrapper = mount(CollapseTransition, { props: { open: true, appear: true }, slots: { default: content }, attachTo: document.body })
    const el = wrapper.find('.am-collapse-transition').element as HTMLElement
    expect(el.classList.contains('am-collapse-transition-enter-active')).toBe(true)
    await wait()
    expect(wrapper.emitted('afterOpenChange')).toEqual([[true]])
  })
})
