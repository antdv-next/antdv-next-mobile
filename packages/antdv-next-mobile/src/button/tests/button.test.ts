import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Button from '..'
import ConfigProvider from '../../config-provider'

describe('Button', () => {
  it('renders default slot and base classes', () => {
    const wrapper = mount(Button, { slots: { default: 'Text' } })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.classes()).toContain('am-button')
    expect(wrapper.classes()).toContain('am-button-color-default')
    expect(wrapper.classes()).toContain('am-button-variant-outlined')
    expect(wrapper.text()).toBe('Text')
  })

  it('maps type / danger / color / variant', () => {
    const primary = mount(Button, { props: { type: 'primary' } })
    expect(primary.classes()).toEqual(expect.arrayContaining(['am-button-color-primary', 'am-button-variant-solid']))
    const danger = mount(Button, { props: { type: 'primary', danger: true } })
    expect(danger.classes()).toEqual(expect.arrayContaining(['am-button-color-danger', 'am-button-variant-solid']))
    const custom = mount(Button, { props: { color: 'success', variant: 'filled' } })
    expect(custom.classes()).toEqual(expect.arrayContaining(['am-button-color-success', 'am-button-variant-filled']))
  })

  it('emits click, but not when disabled or loading', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Button, { attrs: { onClick } })
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
    await wrapper.setProps({ disabled: true })
    await wrapper.trigger('click')
    await wrapper.setProps({ disabled: false, loading: true })
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('passes attrs class / style, rootClass, classes and styles', () => {
    const wrapper = mount(Button, {
      props: { rootClass: 'root-cls', classes: { content: 'content-cls' }, styles: { content: { color: 'red' } } },
      attrs: { class: 'custom', style: 'margin: 1px', 'data-id': 'x' },
      slots: { default: 'Text' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.attributes('data-id')).toBe('x')
    const content = wrapper.find('.am-button-content')
    expect(content.classes()).toContain('content-cls')
    expect(content.attributes('style')).toContain('color: red')
  })

  it('icon slot takes priority over icon prop', () => {
    const byProp = mount(Button, { props: { icon: () => h('i', { class: 'prop-icon' }) } })
    expect(byProp.find('.prop-icon').exists()).toBe(true)
    expect(byProp.classes()).toContain('am-button-icon-only')
    const bySlot = mount(Button, {
      props: { icon: () => h('i', { class: 'prop-icon' }) },
      slots: { icon: () => h('i', { class: 'slot-icon' }) },
    })
    expect(bySlot.find('.slot-icon').exists()).toBe(true)
    expect(bySlot.find('.prop-icon').exists()).toBe(false)
  })

  it('supports loading delay', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Button, { props: { loading: { delay: 300 } } })
    expect(wrapper.classes()).not.toContain('am-button-loading')
    vi.advanceTimersByTime(300)
    await nextTick()
    expect(wrapper.classes()).toContain('am-button-loading')
    vi.useRealTimers()
  })

  it('renders anchor when href is set', () => {
    const wrapper = mount(Button, { props: { href: 'https://antdv-next.com', target: '_blank' } })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://antdv-next.com')
    expect(wrapper.attributes('target')).toBe('_blank')
  })

  it('follows ConfigProvider componentSize and componentDisabled', () => {
    const wrapper = mount(ConfigProvider, {
      props: { componentSize: 'large', componentDisabled: true },
      slots: { default: () => h(Button, null, () => 'Text') },
    })
    const btn = wrapper.find('.am-button')
    expect(btn.classes()).toEqual(expect.arrayContaining(['am-button-lg', 'am-button-disabled']))
  })
})
