import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Divider from '..'
import ConfigProvider from '../../config-provider'

describe('Divider', () => {
  it('renders a horizontal solid line by default', () => {
    const wrapper = mount(Divider)
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-divider', 'am-divider-horizontal', 'am-divider-solid']))
    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('aria-orientation')).toBe('horizontal')
    expect(wrapper.find('.am-divider-content').exists()).toBe(false)
  })

  it('renders title with rails and placement', () => {
    const wrapper = mount(Divider, { props: { titlePlacement: 'start' }, slots: { default: 'Title' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-divider-with-text', 'am-divider-with-text-start', 'am-divider-plain']))
    expect(wrapper.find('.am-divider-content').text()).toBe('Title')
    expect(wrapper.findAll('.am-divider-rail')).toHaveLength(2)
  })

  it('maps legacy left / right placement and plain=false', () => {
    const wrapper = mount(Divider, { props: { titlePlacement: 'right', plain: false }, slots: { default: 'Title' } })
    expect(wrapper.classes()).toContain('am-divider-with-text-end')
    expect(wrapper.classes()).not.toContain('am-divider-plain')
  })

  it('supports vertical through orientation / type / vertical and ignores the title', () => {
    const byOrientation = mount(Divider, { props: { orientation: 'vertical' }, slots: { default: 'Title' } })
    expect(byOrientation.classes()).toContain('am-divider-vertical')
    expect(byOrientation.attributes('aria-orientation')).toBe('vertical')
    expect(byOrientation.find('.am-divider-content').exists()).toBe(false)
    expect(mount(Divider, { props: { type: 'vertical' } }).classes()).toContain('am-divider-vertical')
    expect(mount(Divider, { props: { vertical: true } }).classes()).toContain('am-divider-vertical')
    expect(mount(Divider, { props: { vertical: false, orientation: 'vertical' } }).classes()).toContain('am-divider-horizontal')
  })

  it('supports dashed / variant', () => {
    expect(mount(Divider, { props: { dashed: true } }).classes()).toContain('am-divider-dashed')
    expect(mount(Divider, { props: { variant: 'dotted' } }).classes()).toContain('am-divider-dotted')
    expect(mount(Divider, { props: { dashed: true, variant: 'solid' } }).classes()).toContain('am-divider-solid')
  })

  it('supports size and ConfigProvider componentSize', () => {
    expect(mount(Divider, { props: { size: 'small' } }).classes()).toContain('am-divider-sm')
    expect(mount(Divider, { props: { size: 'middle' } }).classes()).toContain('am-divider-md')
    const wrapper = mount(ConfigProvider, {
      props: { componentSize: 'small' },
      slots: { default: () => h(Divider) },
    })
    expect(wrapper.find('.am-divider').classes()).toContain('am-divider-sm')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Divider, {
      props: {
        rootClass: 'root-cls',
        classes: { root: 'r', rail: 'rail-cls', content: 'content-cls' },
        styles: { root: { margin: '4px' }, content: { color: 'red' }, rail: { borderColor: 'blue' } },
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
      slots: { default: 'Title' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.attributes('style')).toContain('margin: 4px')
    expect(wrapper.find('.am-divider-content').classes()).toContain('content-cls')
    expect(wrapper.find('.am-divider-content').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-divider-rail').classes()).toContain('rail-cls')
  })
})
