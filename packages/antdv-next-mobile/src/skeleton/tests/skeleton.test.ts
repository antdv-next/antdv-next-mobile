import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Skeleton, { SkeletonAvatar, SkeletonButton, SkeletonImage, SkeletonInput } from '..'
import ConfigProvider from '../../config-provider'

describe('Skeleton', () => {
  it('renders title and three paragraph rows by default', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.classes()).toContain('am-skeleton')
    expect(wrapper.find('.am-skeleton-header').exists()).toBe(false)
    expect(wrapper.find('.am-skeleton-title').attributes('style')).toContain('width: 38%')
    const rows = wrapper.findAll('.am-skeleton-paragraph > li')
    expect(rows).toHaveLength(3)
    expect(rows[2]!.attributes('style')).toContain('width: 61%')
    expect(rows[0]!.attributes('style')).toBeUndefined()
  })

  it('renders avatar with PC defaults', () => {
    const wrapper = mount(Skeleton, { props: { avatar: true } })
    expect(wrapper.classes()).toContain('am-skeleton-with-avatar')
    const avatar = wrapper.find('.am-skeleton-avatar')
    expect(avatar.classes()).toEqual(expect.arrayContaining(['am-skeleton-avatar-circle', 'am-skeleton-avatar-lg']))
    expect(wrapper.find('.am-skeleton-title').attributes('style')).toContain('width: 50%')
    expect(wrapper.findAll('.am-skeleton-paragraph > li')).toHaveLength(2)

    const square = mount(Skeleton, { props: { avatar: true, paragraph: false } })
    expect(square.find('.am-skeleton-avatar').classes()).toContain('am-skeleton-avatar-square')
    expect(square.find('.am-skeleton-paragraph').exists()).toBe(false)
  })

  it('supports avatar / title / paragraph config', () => {
    const wrapper = mount(Skeleton, {
      props: {
        avatar: { size: 32, shape: 'square' },
        title: { width: 120 },
        paragraph: { rows: 4, width: ['100%', 80, '50%'] },
      },
    })
    expect(wrapper.find('.am-skeleton-avatar').attributes('style')).toContain('width: 32px')
    expect(wrapper.find('.am-skeleton-avatar').classes()).toContain('am-skeleton-avatar-square')
    expect(wrapper.find('.am-skeleton-title').attributes('style')).toContain('width: 120px')
    const rows = wrapper.findAll('.am-skeleton-paragraph > li')
    expect(rows).toHaveLength(4)
    expect(rows[1]!.attributes('style')).toContain('width: 80px')
    expect(rows[3]!.attributes('style')).toBeUndefined()
  })

  it('hides title', () => {
    const wrapper = mount(Skeleton, { props: { title: false } })
    expect(wrapper.find('.am-skeleton-title').exists()).toBe(false)
    expect(wrapper.findAll('.am-skeleton-paragraph > li')).toHaveLength(2)
  })

  it('applies active and round', () => {
    const wrapper = mount(Skeleton, { props: { active: true, round: true } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-skeleton-active', 'am-skeleton-round']))
  })

  it('renders the default slot when loading is false', async () => {
    const wrapper = mount(Skeleton, {
      props: { loading: true },
      slots: { default: () => h('p', { class: 'real' }, 'content') },
    })
    expect(wrapper.find('.am-skeleton').exists()).toBe(true)
    expect(wrapper.find('.real').exists()).toBe(false)
    await wrapper.setProps({ loading: false })
    expect(wrapper.find('.am-skeleton').exists()).toBe(false)
    expect(wrapper.find('.real').text()).toBe('content')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Skeleton, {
      props: {
        avatar: true,
        rootClass: 'root-cls',
        classes: { root: 'sem-root', header: 'h', section: 's', avatar: 'a', title: 't', paragraph: 'p' },
        styles: { title: { height: '20px' } },
      },
      attrs: { 'class': 'custom', 'style': 'margin: 1px', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'sem-root']))
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-skeleton-header').classes()).toContain('h')
    expect(wrapper.find('.am-skeleton-section').classes()).toContain('s')
    expect(wrapper.find('.am-skeleton-avatar').classes()).toContain('a')
    expect(wrapper.find('.am-skeleton-title').classes()).toContain('t')
    expect(wrapper.find('.am-skeleton-title').attributes('style')).toContain('height: 20px')
    expect(wrapper.find('.am-skeleton-paragraph').classes()).toContain('p')
  })

  it('exposes static sub components', () => {
    expect(Skeleton.Button).toBe(SkeletonButton)
    expect(Skeleton.Avatar).toBe(SkeletonAvatar)
    expect(Skeleton.Input).toBe(SkeletonInput)
    expect(Skeleton.Image).toBe(SkeletonImage)
  })
})

describe('Skeleton elements', () => {
  it('button: shape / size / block / active', () => {
    const wrapper = mount(SkeletonButton, { props: { shape: 'round', size: 'small', block: true, active: true } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-skeleton', 'am-skeleton-element', 'am-skeleton-block', 'am-skeleton-active']))
    expect(wrapper.find('.am-skeleton-button').classes()).toEqual(expect.arrayContaining(['am-skeleton-button-round', 'am-skeleton-button-sm']))
  })

  it('button / input follow ConfigProvider componentSize', () => {
    const wrapper = mount(ConfigProvider, {
      props: { componentSize: 'large' },
      slots: { default: () => [h(SkeletonButton), h(SkeletonInput)] },
    })
    expect(wrapper.find('.am-skeleton-button').classes()).toContain('am-skeleton-button-lg')
    expect(wrapper.find('.am-skeleton-input').classes()).toContain('am-skeleton-input-lg')
  })

  it('avatar: numeric size and shape', () => {
    const wrapper = mount(SkeletonAvatar, { props: { size: 20, shape: 'square' } })
    const avatar = wrapper.find('.am-skeleton-avatar')
    expect(avatar.classes()).toContain('am-skeleton-avatar-square')
    expect(avatar.attributes('style')).toContain('height: 20px')
  })

  it('image: size and semantic classes', () => {
    const wrapper = mount(SkeletonImage, {
      props: { size: [120, 80], classes: { content: 'img' }, rootClass: 'r' },
      attrs: { class: 'custom' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'r']))
    const image = wrapper.find('.am-skeleton-image')
    expect(image.classes()).toContain('img')
    expect(image.attributes('style')).toContain('width: 120px')
    expect(image.attributes('style')).toContain('height: 80px')
  })
})
