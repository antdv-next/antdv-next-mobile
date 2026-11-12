import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Pagination from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'

function pageTexts(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('.am-pagination-item').slice(1, -1).map(el => (el.classes().some(c => c.startsWith('am-pagination-jump')) ? '…' : el.text()))
}

describe('Pagination', () => {
  it('renders the numbered pager', () => {
    const wrapper = mount(Pagination, { props: { total: 50 } })
    expect(wrapper.element.tagName).toBe('NAV')
    expect(wrapper.classes()).toContain('am-pagination')
    expect(pageTexts(wrapper)).toEqual(['1', '2', '3', '4', '5'])
    expect(wrapper.find('.am-pagination-item-active').text()).toBe('1')
    expect(wrapper.find('.am-pagination-prev').classes()).toContain('am-pagination-item-disabled')
    expect(wrapper.find('.am-pagination-next').classes()).not.toContain('am-pagination-item-disabled')
    expect(wrapper.find('.am-pagination-prev').attributes('aria-label')).toBe('上一页')
  })

  it('collapses pages with ellipsis', async () => {
    const wrapper = mount(Pagination, { props: { total: 200, current: 1 } })
    expect(pageTexts(wrapper)).toEqual(['1', '2', '3', '4', '5', '…', '20'])
    await wrapper.setProps({ current: 10 })
    expect(pageTexts(wrapper)).toEqual(['1', '…', '9', '10', '11', '…', '20'])
    await wrapper.setProps({ current: 20 })
    expect(pageTexts(wrapper)).toEqual(['1', '…', '16', '17', '18', '19', '20'])
    await wrapper.setProps({ current: 10, showLessItems: true })
    expect(pageTexts(wrapper)).toEqual(['1', '…', '10', '…', '20'])
  })

  it('works uncontrolled: page, prev, next and jump', async () => {
    const wrapper = mount(Pagination, { props: { total: 200, defaultCurrent: 10, pageSize: 10 } })
    await wrapper.find('.am-pagination-next').trigger('click')
    expect(wrapper.emitted('change')![0]).toEqual([11, 10])
    expect(wrapper.emitted('update:current')![0]).toEqual([11])
    expect(wrapper.find('.am-pagination-item-active').text()).toBe('11')
    await wrapper.find('.am-pagination-prev').trigger('click')
    expect(wrapper.find('.am-pagination-item-active').text()).toBe('10')
    await wrapper.find('.am-pagination-jump-next').trigger('click')
    expect(wrapper.find('.am-pagination-item-active').text()).toBe('15')
    await wrapper.find('.am-pagination-jump-prev').trigger('click')
    expect(wrapper.find('.am-pagination-item-active').text()).toBe('10')
    await wrapper.findAll('.am-pagination-page')[0].trigger('click')
    expect(wrapper.find('.am-pagination-item-active').text()).toBe('1')
    // active page & disabled prev do nothing
    const count = wrapper.emitted('change')!.length
    await wrapper.find('.am-pagination-item-active').trigger('click')
    await wrapper.find('.am-pagination-prev').trigger('click')
    expect(wrapper.emitted('change')).toHaveLength(count)
  })

  it('works controlled and clamps out-of-range values', async () => {
    const wrapper = mount(Pagination, { props: { total: 30, current: 1 } })
    await wrapper.find('.am-pagination-next').trigger('click')
    expect(wrapper.emitted('update:current')![0]).toEqual([2])
    expect(wrapper.find('.am-pagination-item-active').text()).toBe('1')
    await wrapper.setProps({ current: 99 })
    expect(wrapper.find('.am-pagination-item-active').text()).toBe('3')
    expect(wrapper.find('.am-pagination-next').classes()).toContain('am-pagination-item-disabled')
  })

  it('renders simple mode with locale texts', async () => {
    const wrapper = mount(Pagination, { props: { total: 45, simple: true, defaultCurrent: 2 } })
    expect(wrapper.classes()).toContain('am-pagination-simple')
    expect(wrapper.find('.am-pagination-simple-pager').text().replace(/\s/g, '')).toBe('2/5')
    expect(wrapper.find('.am-pagination-prev').text()).toBe('上一页')
    expect(wrapper.find('.am-pagination-next').text()).toBe('下一页')
    expect(wrapper.find('.am-pagination-page').exists()).toBe(false)
    await wrapper.find('.am-pagination-next').trigger('click')
    expect(wrapper.find('.am-pagination-simple-current').text()).toBe('3')

    const en = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(Pagination, { total: 45, simple: true }) },
    })
    expect(en.find('.am-pagination-next').text()).toBe(enUS.Pagination.next)
  })

  it('supports disabled, size and hideOnSinglePage', async () => {
    const wrapper = mount(Pagination, { props: { total: 50, disabled: true, size: 'small' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-pagination-disabled', 'am-pagination-sm']))
    await wrapper.find('.am-pagination-next').trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
    const single = mount(Pagination, { props: { total: 5, hideOnSinglePage: true } })
    expect(single.find('.am-pagination').exists()).toBe(false)
    const provider = mount(ConfigProvider, {
      props: { componentDisabled: true, componentSize: 'large' },
      slots: { default: () => h(Pagination, { total: 50 }) },
    })
    expect(provider.find('.am-pagination').classes()).toEqual(expect.arrayContaining(['am-pagination-disabled', 'am-pagination-lg']))
  })

  it('renders showTotal by prop and slot (slot wins)', () => {
    const byProp = mount(Pagination, {
      props: { total: 45, defaultCurrent: 5, showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} of ${total}` },
    })
    expect(byProp.find('.am-pagination-total').text()).toBe('41-45 of 45')
    const bySlot = mount(Pagination, {
      props: { total: 45, showTotal: () => 'prop' },
      slots: { showTotal: ({ total, range }: any) => `slot ${range.join('-')} / ${total}` },
    })
    expect(bySlot.find('.am-pagination-total').text()).toBe('slot 1-10 / 45')
    expect(mount(Pagination, { props: { total: 0 } }).find('.am-pagination-total').exists()).toBe(false)
  })

  it('customizes items with itemRender and icons', () => {
    const byProp = mount(Pagination, {
      props: {
        total: 30,
        itemRender: (page: number, type: string, element: any) => (type === 'page' ? `P${page}` : element),
        prevIcon: () => h('i', { class: 'prev-icon' }),
      },
      slots: { nextIcon: () => h('i', { class: 'next-icon' }) },
    })
    expect(byProp.findAll('.am-pagination-page').map(e => e.text())).toEqual(['P1', 'P2', 'P3'])
    expect(byProp.find('.am-pagination-prev .prev-icon').exists()).toBe(true)
    expect(byProp.find('.am-pagination-next .next-icon').exists()).toBe(true)
    const bySlot = mount(Pagination, {
      props: { total: 30, itemRender: () => 'prop' },
      slots: { itemRender: ({ page, type }: any) => `${type}:${page}` },
    })
    expect(bySlot.findAll('.am-pagination-item').map(e => e.text())).toEqual(['prev:1', 'page:1', 'page:2', 'page:3', 'next:2'])
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Pagination, {
      props: { total: 30, rootClass: 'root-cls', classes: { item: 'item-cls' }, styles: { item: { color: 'red' } } },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-pagination-item').classes()).toContain('item-cls')
    expect(wrapper.find('.am-pagination-item').attributes('style')).toContain('color: red')
  })
})
