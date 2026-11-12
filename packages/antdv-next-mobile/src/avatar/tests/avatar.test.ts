import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Avatar, { AvatarGroup } from '..'
import ConfigProvider from '../../config-provider'

describe('Avatar', () => {
  it('renders text avatar with default classes', () => {
    const wrapper = mount(Avatar, { slots: { default: 'U' } })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-avatar', 'am-avatar-circle']))
    expect(wrapper.find('.am-avatar-string').text()).toBe('U')
  })

  it('renders image with alt / srcSet / fit', () => {
    const wrapper = mount(Avatar, { props: { src: 'a.png', alt: 'user', srcSet: 'a@2x.png 2x', fit: 'contain', draggable: false } })
    const img = wrapper.find('img')
    expect(wrapper.classes()).toContain('am-avatar-image')
    expect(img.attributes('src')).toBe('a.png')
    expect(img.attributes('alt')).toBe('user')
    expect(img.attributes('srcset')).toBe('a@2x.png 2x')
    expect(img.attributes('draggable')).toBe('false')
    expect((img.element as HTMLElement).style.objectFit).toBe('contain')
  })

  it('emits error and falls back to icon, then text', async () => {
    const withIcon = mount(Avatar, {
      props: { src: 'broken.png', icon: () => h('i', { class: 'prop-icon' }) },
      slots: { default: 'U' },
    })
    await withIcon.find('img').trigger('error')
    expect(withIcon.emitted('error')).toHaveLength(1)
    expect(withIcon.find('img').exists()).toBe(false)
    expect(withIcon.find('.prop-icon').exists()).toBe(true)
    expect(withIcon.classes()).toContain('am-avatar-icon')

    const withText = mount(Avatar, { props: { src: 'broken.png' }, slots: { default: 'U' } })
    await withText.find('img').trigger('error')
    expect(withText.find('.am-avatar-string').text()).toBe('U')

    // a new src is tried again
    await withText.setProps({ src: 'ok.png' })
    expect(withText.find('img').attributes('src')).toBe('ok.png')
  })

  it('icon slot takes priority over icon prop, src slot over src prop', () => {
    const icon = mount(Avatar, {
      props: { icon: () => h('i', { class: 'prop-icon' }) },
      slots: { icon: () => h('i', { class: 'slot-icon' }) },
    })
    expect(icon.find('.slot-icon').exists()).toBe(true)
    expect(icon.find('.prop-icon').exists()).toBe(false)
    const src = mount(Avatar, { props: { src: 'a.png' }, slots: { src: () => h('picture', { class: 'slot-src' }) } })
    expect(src.find('.slot-src').exists()).toBe(true)
    expect(src.find('img').exists()).toBe(false)
    const node = mount(Avatar, { props: { src: () => h('svg', { class: 'node-src' }) } })
    expect(node.find('.node-src').exists()).toBe(true)
  })

  it('supports shape and size', () => {
    expect(mount(Avatar, { props: { shape: 'square' } }).classes()).toContain('am-avatar-square')
    expect(mount(Avatar, { props: { size: 'small' } }).classes()).toContain('am-avatar-sm')
    expect(mount(Avatar, { props: { size: 'large' } }).classes()).toContain('am-avatar-lg')
    const custom = mount(Avatar, { props: { size: 64 } })
    const style = (custom.element as HTMLElement).style
    expect(style.getPropertyValue('--am-avatar-size')).toBe('64px')
    expect(style.getPropertyValue('--am-avatar-icon-size')).toBe('32px')
  })

  it('scales long text to fit using gap', async () => {
    const wrapper = mount(Avatar, { props: { gap: 4 }, slots: { default: 'LongName' }, attachTo: document.body })
    const text = wrapper.find('.am-avatar-string').element as HTMLElement
    Object.defineProperty(wrapper.element, 'offsetWidth', { configurable: true, value: 40 })
    Object.defineProperty(text, 'offsetWidth', { configurable: true, value: 64 })
    await wrapper.setProps({ gap: 8 })
    await nextTick()
    await nextTick()
    expect(text.style.transform).toBe('scale(0.375)')
  })

  it('passes attrs, rootClass, classes and styles; click listener works', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Avatar, {
      props: { rootClass: 'root-cls', classes: { root: 'r' }, styles: { root: { color: 'red' } } },
      attrs: { 'class': 'custom', 'style': 'margin: 1px', 'data-id': 'x', onClick },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r']))
    expect(wrapper.attributes('style')).toContain('color: red')
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.attributes('data-id')).toBe('x')
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('follows ConfigProvider componentSize', () => {
    const wrapper = mount(ConfigProvider, {
      props: { componentSize: 'large' },
      slots: { default: () => h(Avatar, null, () => 'U') },
    })
    expect(wrapper.find('.am-avatar').classes()).toContain('am-avatar-lg')
  })
})

describe('AvatarGroup', () => {
  const avatars = (n: number) => () => Array.from({ length: n }, (_, i) => h(Avatar, { key: i }, () => `U${i}`))

  it('is exposed as Avatar.Group', () => {
    expect(Avatar.Group).toBe(AvatarGroup)
    expect(AvatarGroup.name).toBe('AmAvatarGroup')
  })

  it('provides size and shape, avatar props win', () => {
    const wrapper = mount(AvatarGroup, {
      props: { size: 'small', shape: 'square' },
      slots: { default: () => [h(Avatar, null, () => 'A'), h(Avatar, { size: 'large', shape: 'circle' }, () => 'B')] },
    })
    const list = wrapper.findAll('.am-avatar')
    expect(wrapper.classes()).toContain('am-avatar-group')
    expect(list[0].classes()).toEqual(expect.arrayContaining(['am-avatar-sm', 'am-avatar-square']))
    expect(list[1].classes()).toEqual(expect.arrayContaining(['am-avatar-lg', 'am-avatar-circle']))
  })

  it('folds avatars over max.count', async () => {
    const wrapper = mount(AvatarGroup, {
      props: { max: { count: 2, style: { color: 'red' } } },
      slots: { default: avatars(5) },
    })
    const list = wrapper.findAll('.am-avatar')
    expect(list).toHaveLength(3)
    expect(list[2].classes()).toContain('am-avatar-group-overflow')
    expect(list[2].text()).toBe('+3')
    expect(list[2].attributes('style')).toContain('color: red')
    await wrapper.setProps({ max: { count: 5 } })
    expect(wrapper.findAll('.am-avatar')).toHaveLength(5)
    expect(wrapper.find('.am-avatar-group-overflow').exists()).toBe(false)
  })

  it('supports overflow slot, attrs and rootClass', () => {
    const wrapper = mount(AvatarGroup, {
      props: { max: { count: 1 }, rootClass: 'root-cls' },
      attrs: { 'class': 'custom', 'data-id': 'x' },
      slots: { default: avatars(3), overflow: ({ count }: { count: number }) => `more ${count}` },
    })
    expect(wrapper.find('.am-avatar-group-overflow').text()).toBe('more 2')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
  })
})
