import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import ShimmerText from '..'

describe('ShimmerText', () => {
  it('renders an active span with the content', () => {
    const wrapper = mount(ShimmerText, { props: { content: 'Thinking...' } })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toEqual(['am-shimmer-text', 'am-shimmer-text-active'])
    expect(wrapper.text()).toBe('Thinking...')
    expect(wrapper.attributes('style')).toBeUndefined()
  })

  it('the default slot wins over content, content accepts a render function', () => {
    const slot = mount(ShimmerText, { props: { content: 'prop' }, slots: { default: () => h('b', 'slot') } })
    expect(slot.html()).toContain('<b>slot</b>')
    expect(slot.text()).toBe('slot')
    const node = mount(ShimmerText, { props: { content: () => h('i', 'node') } })
    expect(node.find('i').text()).toBe('node')
  })

  it('active: false renders plain text', async () => {
    const wrapper = mount(ShimmerText, { props: { content: 'Done', active: false } })
    expect(wrapper.classes()).toEqual(['am-shimmer-text'])
    await wrapper.setProps({ active: true })
    expect(wrapper.classes()).toContain('am-shimmer-text-active')
  })

  it('duration, color and shimmerColor become component tokens', () => {
    const wrapper = mount(ShimmerText, { props: { content: 'x', duration: 1.5, color: 'gray', shimmerColor: 'white' } })
    const style = (wrapper.element as HTMLElement).style
    expect(style.getPropertyValue('--am-shimmer-text-duration')).toBe('1.5s')
    expect(style.getPropertyValue('--am-shimmer-text-color')).toBe('gray')
    expect(style.getPropertyValue('--am-shimmer-text-shimmer-color')).toBe('white')
    const text = mount(ShimmerText, { props: { content: 'x', duration: '800ms' } })
    expect((text.element as HTMLElement).style.getPropertyValue('--am-shimmer-text-duration')).toBe('800ms')
  })

  it('passes tag, attrs, rootClass, classes and styles to the root', () => {
    const wrapper = mount(ShimmerText, {
      props: { content: 'x', tag: 'p', rootClass: 'root-a', classes: { root: 'root-b' }, styles: { root: { fontSize: '20px' } } },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-shimmer-text', 'root-a', 'root-b', 'custom']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.attributes('style')).toContain('font-size: 20px')
  })
})
