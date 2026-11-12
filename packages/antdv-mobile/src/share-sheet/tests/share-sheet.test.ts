import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import ShareSheet from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'
import zhCN from '../../locale/zh_CN'
import Popup from '../../popup/Popup.vue'

const options = [
  { key: 'wechat', label: 'WeChat', icon: h('i', { class: 'icon-wechat' }) },
  { key: 'link', label: 'Link', description: 'Copy', image: 'https://example.com/a.png' },
  { key: 'off', label: 'Disabled', disabled: true },
  { label: 'Poster', class: 'opt-cls', style: { color: 'red' } },
]

describe('ShareSheet', () => {
  it('renders one row, header and the locale cancel button', () => {
    const wrapper = mount(ShareSheet, {
      props: { open: true, getContainer: false, options, title: 'Title', description: 'Desc' },
    })
    expect(wrapper.find('.am-popup-root').classes()).toContain('am-share-sheet-root')
    expect(wrapper.find('.am-share-sheet').classes()).toEqual(expect.arrayContaining(['am-popup-bottom', 'am-popup-round']))
    expect(wrapper.find('.am-share-sheet-title').text()).toBe('Title')
    expect(wrapper.find('.am-share-sheet-description').text()).toBe('Desc')
    expect(wrapper.findAll('.am-share-sheet-row')).toHaveLength(1)
    const items = wrapper.findAll('.am-share-sheet-option')
    expect(items).toHaveLength(4)
    expect(items[0].find('.am-share-sheet-icon .icon-wechat').exists()).toBe(true)
    expect(items[0].find('.am-share-sheet-label').text()).toBe('WeChat')
    expect(items[1].find('img.am-share-sheet-image').attributes('src')).toBe('https://example.com/a.png')
    expect(items[1].find('.am-share-sheet-option-description').text()).toBe('Copy')
    expect(items[2].classes()).toContain('am-share-sheet-option-disabled')
    expect(items[2].attributes('disabled')).toBeDefined()
    expect(items[3].classes()).toContain('opt-cls')
    expect(items[3].attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-share-sheet-cancel').text()).toBe(zhCN.ActionSheet.cancelText)
  })

  it('renders no header / rows without content and prefers icon over image', () => {
    const wrapper = mount(ShareSheet, {
      props: { open: true, getContainer: false, options: [] },
    })
    expect(wrapper.find('.am-share-sheet-header').exists()).toBe(false)
    expect(wrapper.find('.am-share-sheet-rows').exists()).toBe(false)

    const both = mount(ShareSheet, {
      props: { open: true, getContainer: false, options: [{ label: 'a', icon: h('b', { class: 'ic' }), image: 'x.png' }] },
    })
    expect(both.find('.ic').exists()).toBe(true)
    expect(both.find('img').exists()).toBe(false)
  })

  it('renders several rows and reports the row index', async () => {
    const wrapper = mount(ShareSheet, {
      props: { open: true, getContainer: false, options: [options.slice(0, 2), options.slice(2)] },
    })
    const rows = wrapper.findAll('.am-share-sheet-row')
    expect(rows).toHaveLength(2)
    expect(rows[0].findAll('.am-share-sheet-option')).toHaveLength(2)
    await rows[1].findAll('.am-share-sheet-option')[1].trigger('click')
    expect(wrapper.emitted('select')![0]).toEqual([expect.objectContaining({ label: 'Poster' }), 1, 1])
  })

  it('emits select and closes, ignoring disabled options', async () => {
    const wrapper = mount(ShareSheet, { props: { open: true, getContainer: false, options } })
    const items = wrapper.findAll('.am-share-sheet-option')
    await items[2].trigger('click')
    expect(wrapper.emitted('select')).toBeUndefined()
    await items[0].trigger('click')
    expect(wrapper.emitted('select')![0]).toEqual([expect.objectContaining({ key: 'wechat' }), 0, 0])
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
    expect(wrapper.emitted('openChange')![0]).toEqual([false])
    // controlled: stays open until the parent updates the prop
    expect(wrapper.findComponent(Popup).props('open')).toBe(true)
    await wrapper.setProps({ open: false })
    expect(wrapper.findComponent(Popup).props('open')).toBe(false)
  })

  it('keeps open with closeOnSelect=false', async () => {
    const wrapper = mount(ShareSheet, { props: { open: true, getContainer: false, options, closeOnSelect: false } })
    await wrapper.find('.am-share-sheet-option').trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(1)
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('works uncontrolled with defaultOpen', async () => {
    const wrapper = mount(ShareSheet, { props: { defaultOpen: true, getContainer: false, options } })
    expect(wrapper.findComponent(Popup).props('open')).toBe(true)
    await wrapper.find('.am-share-sheet-option').trigger('click')
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
    expect(wrapper.findComponent(Popup).props('open')).toBe(false)

    const closed = mount(ShareSheet, { props: { getContainer: false, options } })
    expect(closed.findComponent(Popup).props('open')).toBe(false)
  })

  it('emits cancel + close from the cancel button, close from the mask', async () => {
    const wrapper = mount(ShareSheet, { props: { open: true, getContainer: false, options } })
    await wrapper.find('.am-share-sheet-cancel').trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    await wrapper.find('.am-popup-mask').trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('close')).toHaveLength(2)

    await wrapper.setProps({ maskClosable: false })
    await wrapper.find('.am-popup-mask').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(2)
  })

  it('supports custom / hidden cancel button', async () => {
    const wrapper = mount(ShareSheet, { props: { open: true, getContainer: false, options, cancelText: 'Dismiss' } })
    expect(wrapper.find('.am-share-sheet-cancel').text()).toBe('Dismiss')
    await wrapper.setProps({ cancelText: null })
    expect(wrapper.find('.am-share-sheet-cancel').exists()).toBe(false)
    await wrapper.setProps({ cancelText: 'x', showCancel: false })
    expect(wrapper.find('.am-share-sheet-cancel').exists()).toBe(false)
  })

  it('slots win over props', () => {
    const wrapper = mount(ShareSheet, {
      props: {
        open: true,
        getContainer: false,
        options,
        title: 'prop',
        description: 'prop desc',
        cancelText: 'prop cancel',
      },
      slots: {
        title: 'slot title',
        description: 'slot desc',
        cancelText: 'slot cancel',
        icon: ({ option, index, rowIndex }: any) => h('i', { class: 'custom-icon' }, `${rowIndex}-${index}-${option.key}`),
        label: ({ option }: any) => h('em', { class: 'custom-label' }, option.label),
        default: () => h('div', { class: 'custom-content' }),
      },
    })
    expect(wrapper.find('.am-share-sheet-title').text()).toBe('slot title')
    expect(wrapper.find('.am-share-sheet-description').text()).toBe('slot desc')
    expect(wrapper.find('.am-share-sheet-cancel').text()).toBe('slot cancel')
    expect(wrapper.findAll('.custom-icon')).toHaveLength(4)
    expect(wrapper.find('.custom-icon').text()).toBe('0-0-wechat')
    expect(wrapper.find('.icon-wechat').exists()).toBe(false)
    expect(wrapper.findAll('.custom-label')).toHaveLength(4)
    expect(wrapper.find('.am-share-sheet-content .custom-content').exists()).toBe(true)
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(ShareSheet, {
      props: {
        open: true,
        getContainer: false,
        options,
        title: 't',
        description: 'd',
        rootClass: 'root-cls',
        classes: { body: 'b', header: 'h', title: 'tt', description: 'dd', row: 'r', option: 'o', icon: 'i', label: 'l', cancel: 'c' },
        styles: { option: { width: '90px' }, icon: { color: 'blue' } },
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.find('.am-popup-root').classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.find('.am-popup-root').attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-share-sheet').classes()).toContain('b')
    expect(wrapper.find('.am-share-sheet-header').classes()).toContain('h')
    expect(wrapper.find('.am-share-sheet-title').classes()).toContain('tt')
    expect(wrapper.find('.am-share-sheet-description').classes()).toContain('dd')
    expect(wrapper.find('.am-share-sheet-row').classes()).toContain('r')
    expect(wrapper.find('.am-share-sheet-option').classes()).toContain('o')
    expect(wrapper.find('.am-share-sheet-option').attributes('style')).toContain('width: 90px')
    expect(wrapper.find('.am-share-sheet-icon').classes()).toContain('i')
    expect(wrapper.find('.am-share-sheet-icon').attributes('style')).toContain('color: blue')
    expect(wrapper.find('.am-share-sheet-label').classes()).toContain('l')
    expect(wrapper.find('.am-share-sheet-cancel').classes()).toContain('c')
  })

  it('uses the locale of ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(ShareSheet, { open: true, getContainer: false, options }) },
    })
    expect(wrapper.find('.am-share-sheet-cancel').text()).toBe(enUS.ActionSheet.cancelText)
  })

  it('teleports to body by default and forwards afterOpenChange', async () => {
    const wrapper = mount(ShareSheet, { props: { open: true, options } })
    await nextTick()
    expect(document.querySelectorAll('.am-share-sheet .am-share-sheet-option')).toHaveLength(4)
    wrapper.findComponent(Popup).vm.$emit('afterOpenChange', true)
    expect(wrapper.emitted('afterOpenChange')![0]).toEqual([true])
  })
})
