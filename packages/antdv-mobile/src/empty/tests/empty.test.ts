import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Empty from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'

describe('Empty', () => {
  it('renders the default illustration and locale description', () => {
    const wrapper = mount(Empty)
    expect(wrapper.classes()).toEqual(['am-empty'])
    expect(wrapper.find('.am-empty-image svg.am-empty-img-default').exists()).toBe(true)
    expect(wrapper.find('.am-empty-description').text()).toBe('暂无数据')
    expect(wrapper.find('.am-empty-footer').exists()).toBe(false)
  })

  it('follows ConfigProvider locale', () => {
    const wrapper = mount(ConfigProvider, { props: { locale: enUS }, slots: { default: () => h(Empty) } })
    expect(wrapper.find('.am-empty-description').text()).toBe(enUS.Empty.description)
  })

  it('supports image url with alt from description', () => {
    const wrapper = mount(Empty, { props: { image: 'empty.png', description: 'Nothing' } })
    const img = wrapper.find('.am-empty-image img')
    expect(img.attributes('src')).toBe('empty.png')
    expect(img.attributes('alt')).toBe('Nothing')
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('supports PRESENTED_IMAGE_SIMPLE / PRESENTED_IMAGE_DEFAULT', () => {
    const simple = mount(Empty, { props: { image: Empty.PRESENTED_IMAGE_SIMPLE } })
    expect(simple.classes()).toContain('am-empty-normal')
    expect(simple.find('svg.am-empty-img-simple').exists()).toBe(true)
    const normal = mount(Empty, { props: { image: Empty.PRESENTED_IMAGE_DEFAULT } })
    expect(normal.classes()).not.toContain('am-empty-normal')
    expect(normal.find('svg.am-empty-img-default').exists()).toBe(true)
  })

  it('image / description slots take priority over props', () => {
    const wrapper = mount(Empty, {
      props: { image: 'empty.png', description: 'prop' },
      slots: { image: () => h('i', { class: 'slot-image' }), description: () => 'slot' },
    })
    expect(wrapper.find('.slot-image').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.am-empty-description').text()).toBe('slot')
  })

  it('supports node description and hiding it with false', () => {
    const node = mount(Empty, { props: { description: () => h('b', 'custom') } })
    expect(node.find('.am-empty-description b').text()).toBe('custom')
    const hidden = mount(Empty, { props: { description: false } })
    expect(hidden.find('.am-empty-description').exists()).toBe(false)
    const noImage = mount(Empty, { props: { image: false } })
    expect(noImage.find('.am-empty-image').exists()).toBe(false)
  })

  it('renders default slot as footer', () => {
    const wrapper = mount(Empty, { slots: { default: () => h('button', 'Create') } })
    expect(wrapper.find('.am-empty-footer button').text()).toBe('Create')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Empty, {
      props: {
        rootClass: 'root-cls',
        classes: { root: 'r', image: 'image-cls', description: 'desc-cls', footer: 'footer-cls' },
        styles: { root: { margin: '1px' }, image: { height: '60px' }, description: { color: 'red' } },
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
      slots: { default: 'footer' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.find('.am-empty-image').classes()).toContain('image-cls')
    expect(wrapper.find('.am-empty-image').attributes('style')).toContain('height: 60px')
    expect(wrapper.find('.am-empty-description').classes()).toContain('desc-cls')
    expect(wrapper.find('.am-empty-description').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-empty-footer').classes()).toContain('footer-cls')
  })
})
