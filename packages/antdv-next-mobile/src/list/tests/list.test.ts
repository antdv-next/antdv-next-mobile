import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import List, { ListItem } from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'

describe('List', () => {
  it('renders header, footer, body and items', () => {
    const wrapper = mount(List, {
      props: { header: 'Header', footer: 'Footer' },
      slots: { default: () => [h(ListItem, null, () => 'One'), h(ListItem, { title: 'Two' })] },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-list', 'am-list-default', 'am-list-bordered']))
    expect(wrapper.find('.am-list-header').text()).toBe('Header')
    expect(wrapper.find('.am-list-footer').text()).toBe('Footer')
    expect(wrapper.findAll('.am-list-body > .am-list-item').map(e => e.text())).toEqual(['One', 'Two'])
    expect(List.Item).toBe(ListItem)
  })

  it('supports mode, bordered and size', async () => {
    const wrapper = mount(List, { props: { mode: 'card', bordered: false, size: 'small' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-list-card', 'am-list-sm']))
    expect(wrapper.classes()).not.toContain('am-list-bordered')
    expect(wrapper.find('.am-list-header').exists()).toBe(false)
    const provider = mount(ConfigProvider, {
      props: { componentSize: 'large' },
      slots: { default: () => h(List) },
    })
    expect(provider.find('.am-list').classes()).toContain('am-list-lg')
  })

  it('header / footer slots take priority', () => {
    const wrapper = mount(List, {
      props: { header: 'prop-header', footer: 'prop-footer' },
      slots: { header: 'slot-header', footer: 'slot-footer' },
    })
    expect(wrapper.find('.am-list-header').text()).toBe('slot-header')
    expect(wrapper.find('.am-list-footer').text()).toBe('slot-footer')
  })

  it('renders dataSource with the renderItem slot or prop', () => {
    const dataSource = [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }]
    const bySlot = mount(List, {
      props: { dataSource, rowKey: 'id', renderItem: () => 'prop' },
      slots: { renderItem: ({ item, index }: any) => h(ListItem, { title: `${index}-${item.name}` }) },
    })
    expect(bySlot.findAll('.am-list-item').map(e => e.text())).toEqual(['0-A', '1-B'])
    const byProp = mount(List, {
      props: { dataSource, rowKey: (item: any) => item.id, renderItem: (item: any) => h(ListItem, { title: item.name }) },
    })
    expect(byProp.findAll('.am-list-item').map(e => e.text())).toEqual(['A', 'B'])
    expect(byProp.find('.am-list-empty').exists()).toBe(false)
  })

  it('renders empty text and loading', async () => {
    const wrapper = mount(List, { props: { dataSource: [] } })
    expect(wrapper.find('.am-list-empty').text()).toBe('暂无数据')
    await wrapper.setProps({ locale: { emptyText: 'Nothing' } })
    expect(wrapper.find('.am-list-empty').text()).toBe('Nothing')
    await wrapper.setProps({ loading: true })
    expect(wrapper.find('.am-list-empty').exists()).toBe(false)
    expect(wrapper.find('.am-list-spin').text()).toBe('加载中')
    expect(wrapper.classes()).toContain('am-list-loading')
    // no data mode -> no empty text
    expect(mount(List).find('.am-list-empty').exists()).toBe(false)

    const en = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(List, { dataSource: [] }) },
    })
    expect(en.find('.am-list-empty').text()).toBe(enUS.Empty.description)
    const slot = mount(List, { props: { dataSource: [] }, slots: { emptyText: 'slot-empty' } })
    expect(slot.find('.am-list-empty').text()).toBe('slot-empty')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(List, {
      props: { header: 'H', rootClass: 'root-cls', classes: { header: 'header-cls', body: 'body-cls' }, styles: { body: { color: 'red' } } },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-list-header').classes()).toContain('header-cls')
    expect(wrapper.find('.am-list-body').classes()).toContain('body-cls')
    expect(wrapper.find('.am-list-body').attributes('style')).toContain('color: red')
  })
})

describe('ListItem', () => {
  it('renders title, description, prefix and extra', () => {
    const wrapper = mount(ListItem, {
      props: { title: 'Title', description: 'Desc', prefix: () => h('i', { class: 'pre' }), extra: 'Extra' },
    })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toContain('am-list-item')
    expect(wrapper.find('.am-list-item-title').text()).toBe('Title')
    expect(wrapper.find('.am-list-item-description').text()).toBe('Desc')
    expect(wrapper.find('.am-list-item-prefix .pre').exists()).toBe(true)
    expect(wrapper.find('.am-list-item-extra').text()).toBe('Extra')
    // not clickable by default: no arrow, no press feedback
    expect(wrapper.find('.am-list-item-arrow').exists()).toBe(false)
    expect(wrapper.classes()).not.toContain('am-list-item-clickable')
  })

  it('slots take priority over props', () => {
    const wrapper = mount(ListItem, {
      props: { title: 'prop-title', description: 'prop-desc', prefix: 'prop-prefix', extra: 'prop-extra', arrow: 'prop-arrow' },
      slots: { default: 'slot-title', description: 'slot-desc', prefix: 'slot-prefix', extra: 'slot-extra', arrow: 'slot-arrow' },
    })
    expect(wrapper.find('.am-list-item-title').text()).toBe('slot-title')
    expect(wrapper.find('.am-list-item-description').text()).toBe('slot-desc')
    expect(wrapper.find('.am-list-item-prefix').text()).toBe('slot-prefix')
    expect(wrapper.find('.am-list-item-extra').text()).toBe('slot-extra')
    expect(wrapper.find('.am-list-item-arrow').text()).toBe('slot-arrow')
    const named = mount(ListItem, { props: { title: 'prop-title' }, slots: { title: 'named-title' } })
    expect(named.find('.am-list-item-title').text()).toBe('named-title')
  })

  it('becomes clickable with a click listener and shows the arrow', async () => {
    const onClick = vi.fn()
    const wrapper = mount(ListItem, { props: { title: 'T', onClick } as any })
    expect(wrapper.classes()).toContain('am-list-item-clickable')
    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.find('.am-list-item-arrow .anticon').exists()).toBe(true)
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('respects explicit clickable and arrow', () => {
    const noFeedback = mount(ListItem, { props: { clickable: false, onClick: () => {} } as any })
    expect(noFeedback.classes()).not.toContain('am-list-item-clickable')
    expect(noFeedback.find('.am-list-item-arrow').exists()).toBe(false)
    const forced = mount(ListItem, { props: { clickable: true, arrow: false } })
    expect(forced.classes()).toContain('am-list-item-clickable')
    expect(forced.find('.am-list-item-arrow').exists()).toBe(false)
    const arrowOnly = mount(ListItem, { props: { arrow: true } })
    expect(arrowOnly.find('.am-list-item-arrow .anticon').exists()).toBe(true)
    const custom = mount(ListItem, { props: { arrow: () => h('i', { class: 'custom-arrow' }) } })
    expect(custom.find('.am-list-item-arrow .custom-arrow').exists()).toBe(true)
  })

  it('does not emit click when disabled', async () => {
    const onClick = vi.fn()
    const wrapper = mount(ListItem, { props: { disabled: true, onClick } as any })
    expect(wrapper.classes()).toContain('am-list-item-disabled')
    expect(wrapper.classes()).not.toContain('am-list-item-clickable')
    await wrapper.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders an anchor with href', async () => {
    const wrapper = mount(ListItem, { props: { href: 'https://antdv-next.com', target: '_blank' } })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://antdv-next.com')
    expect(wrapper.attributes('target')).toBe('_blank')
    expect(wrapper.classes()).toContain('am-list-item-clickable')
    expect(wrapper.find('.am-list-item-arrow').exists()).toBe(true)
    await wrapper.setProps({ disabled: true })
    expect(wrapper.attributes('href')).toBeUndefined()
  })

  it('supports align and passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(ListItem, {
      props: {
        title: 'T',
        extra: 'E',
        align: 'start',
        rootClass: 'root-cls',
        classes: { title: 'title-cls', extra: 'extra-cls' },
        styles: { title: { color: 'red' } },
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'am-list-item-align-start']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-list-item-title').classes()).toContain('title-cls')
    expect(wrapper.find('.am-list-item-title').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-list-item-extra').classes()).toContain('extra-cls')
  })
})
