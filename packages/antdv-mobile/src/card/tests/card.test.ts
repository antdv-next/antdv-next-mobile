import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Card, { CardMeta } from '..'
import ConfigProvider from '../../config-provider'

describe('Card', () => {
  it('renders body only by default', () => {
    const wrapper = mount(Card, { slots: { default: 'Content' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-card', 'am-card-bordered']))
    expect(wrapper.find('.am-card-body').text()).toBe('Content')
    expect(wrapper.find('.am-card-header').exists()).toBe(false)
    expect(wrapper.find('.am-card-cover').exists()).toBe(false)
    expect(wrapper.find('.am-card-footer').exists()).toBe(false)
    expect(wrapper.find('.am-card-actions').exists()).toBe(false)
  })

  it('renders title / extra / cover / footer from props', () => {
    const wrapper = mount(Card, {
      props: { title: 'Title', extra: 'More', cover: () => h('img', { class: 'cover-img' }), footer: 'Footer' },
      slots: { default: 'Content' },
    })
    expect(wrapper.find('.am-card-title').text()).toBe('Title')
    expect(wrapper.find('.am-card-extra').text()).toBe('More')
    expect(wrapper.find('.am-card-cover .cover-img').exists()).toBe(true)
    expect(wrapper.find('.am-card-footer').text()).toBe('Footer')
    expect(wrapper.classes()).toContain('am-card-contain-cover')
  })

  it('slots take priority over props', () => {
    const wrapper = mount(Card, {
      props: { title: 'prop-title', extra: 'prop-extra', cover: 'prop-cover', footer: 'prop-footer', actions: ['prop-action'] },
      slots: {
        title: () => 'slot-title',
        extra: () => 'slot-extra',
        cover: () => 'slot-cover',
        footer: () => 'slot-footer',
        actions: () => [h('span', 'slot-a'), h('span', 'slot-b')],
      },
    })
    expect(wrapper.find('.am-card-title').text()).toBe('slot-title')
    expect(wrapper.find('.am-card-extra').text()).toBe('slot-extra')
    expect(wrapper.find('.am-card-cover').text()).toBe('slot-cover')
    expect(wrapper.find('.am-card-footer').text()).toBe('slot-footer')
    expect(wrapper.findAll('.am-card-action').map(item => item.text())).toEqual(['slot-a', 'slot-b'])
  })

  it('renders actions from the prop', () => {
    const wrapper = mount(Card, { props: { actions: ['Edit', () => h('b', 'Share'), null] } })
    const actions = wrapper.findAll('.am-card-action')
    expect(actions).toHaveLength(2)
    expect(actions[0].text()).toBe('Edit')
    expect(actions[1].find('b').exists()).toBe(true)
  })

  it('shows a skeleton while loading', async () => {
    const wrapper = mount(Card, { props: { loading: true }, slots: { default: 'Content' } })
    expect(wrapper.classes()).toContain('am-card-loading')
    expect(wrapper.find('.am-card-skeleton').exists()).toBe(true)
    expect(wrapper.find('.am-card-body').text()).toBe('')
    await wrapper.setProps({ loading: false })
    expect(wrapper.find('.am-card-skeleton').exists()).toBe(false)
    expect(wrapper.find('.am-card-body').text()).toBe('Content')
  })

  it('supports variant / bordered / size / type / clickable', () => {
    expect(mount(Card, { props: { variant: 'borderless' } }).classes()).toContain('am-card-borderless')
    expect(mount(Card, { props: { bordered: false } }).classes()).toContain('am-card-borderless')
    expect(mount(Card, { props: { bordered: false, variant: 'outlined' } }).classes()).toContain('am-card-bordered')
    const wrapper = mount(Card, { props: { size: 'small', type: 'inner', clickable: true } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-card-small', 'am-card-type-inner', 'am-card-clickable']))
    expect(mount(Card, { props: { size: 'default' } }).classes()).not.toContain('am-card-small')
  })

  it('click listener falls through to the root', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Card, { props: { clickable: true }, attrs: { onClick }, slots: { default: 'Content' } })
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Card, {
      props: {
        title: 'Title',
        extra: 'More',
        footer: 'Footer',
        actions: ['a'],
        rootClass: 'root-cls',
        classes: { root: 'r', header: 'header-cls', title: 'title-cls', extra: 'extra-cls', body: 'body-cls', footer: 'footer-cls', actions: 'actions-cls' },
        styles: { root: { margin: '1px' }, header: { color: 'red' }, body: { padding: '0px' } },
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
      slots: { default: 'Content' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.find('.am-card-header').classes()).toContain('header-cls')
    expect(wrapper.find('.am-card-header').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-card-title').classes()).toContain('title-cls')
    expect(wrapper.find('.am-card-extra').classes()).toContain('extra-cls')
    expect(wrapper.find('.am-card-body').classes()).toContain('body-cls')
    expect(wrapper.find('.am-card-body').attributes('style')).toContain('padding: 0px')
    expect(wrapper.find('.am-card-footer').classes()).toContain('footer-cls')
    expect(wrapper.find('.am-card-actions').classes()).toContain('actions-cls')
  })

  it('follows ConfigProvider componentSize', () => {
    const wrapper = mount(ConfigProvider, {
      props: { componentSize: 'small' },
      slots: { default: () => h(Card, null, () => 'Content') },
    })
    expect(wrapper.find('.am-card').classes()).toContain('am-card-small')
  })
})

describe('Card.Meta', () => {
  it('is exposed as Card.Meta', () => {
    expect(Card.Meta).toBe(CardMeta)
  })

  it('renders avatar / title / description, slots win', () => {
    const byProp = mount(CardMeta, { props: { avatar: () => h('i', { class: 'avatar' }), title: 'Title', description: 'Desc' } })
    expect(byProp.classes()).toContain('am-card-meta')
    expect(byProp.find('.am-card-meta-avatar .avatar').exists()).toBe(true)
    expect(byProp.find('.am-card-meta-title').text()).toBe('Title')
    expect(byProp.find('.am-card-meta-description').text()).toBe('Desc')
    const bySlot = mount(CardMeta, {
      props: { title: 'Title', description: 'Desc' },
      slots: { title: () => 'slot-title', description: () => 'slot-desc' },
    })
    expect(bySlot.find('.am-card-meta-title').text()).toBe('slot-title')
    expect(bySlot.find('.am-card-meta-description').text()).toBe('slot-desc')
    expect(bySlot.find('.am-card-meta-avatar').exists()).toBe(false)
  })

  it('passes attrs, rootClass and classes', () => {
    const wrapper = mount(CardMeta, {
      props: { title: 'Title', rootClass: 'root-cls', classes: { section: 'section-cls', title: 'title-cls' } },
      attrs: { class: 'custom' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.find('.am-card-meta-section').classes()).toContain('section-cls')
    expect(wrapper.find('.am-card-meta-title').classes()).toContain('title-cls')
  })
})
