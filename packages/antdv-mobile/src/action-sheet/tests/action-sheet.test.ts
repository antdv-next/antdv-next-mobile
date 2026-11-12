import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import ActionSheet from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'
import zhCN from '../../locale/zh_CN'

const wait = (ms = 80) => new Promise(resolve => setTimeout(resolve, ms))

const actions = [
  { key: 'copy', text: 'Copy' },
  { key: 'edit', text: 'Edit', description: 'desc', bold: true },
  { key: 'disabled', text: 'Disabled', disabled: true },
  { key: 'delete', text: 'Delete', danger: true },
]

describe('ActionSheet', () => {
  it('renders actions, header and the locale cancel button', () => {
    const wrapper = mount(ActionSheet, {
      props: { open: true, getContainer: false, actions, title: 'Title', extra: 'Extra' },
    })
    expect(wrapper.find('.am-popup-root').classes()).toContain('am-action-sheet-root')
    expect(wrapper.find('.am-action-sheet').classes()).toEqual(expect.arrayContaining(['am-popup-bottom', 'am-popup-round']))
    expect(wrapper.find('.am-action-sheet-title').text()).toBe('Title')
    expect(wrapper.find('.am-action-sheet-extra').text()).toBe('Extra')
    const items = wrapper.findAll('.am-action-sheet-list .am-action-sheet-item')
    expect(items).toHaveLength(4)
    expect(items[1].classes()).toContain('am-action-sheet-item-bold')
    expect(items[1].find('.am-action-sheet-item-description').text()).toBe('desc')
    expect(items[2].classes()).toContain('am-action-sheet-item-disabled')
    expect(items[3].classes()).toContain('am-action-sheet-item-danger')
    expect(wrapper.find('.am-action-sheet-cancel').text()).toBe(zhCN.ActionSheet.cancelText)
  })

  it('emits action and closes, ignoring disabled actions', async () => {
    const onClick = vi.fn()
    const wrapper = mount(ActionSheet, {
      props: { open: true, getContainer: false, actions: [{ ...actions[0], onClick }, actions[2]] },
    })
    const items = wrapper.findAll('.am-action-sheet-list .am-action-sheet-item')
    await items[1].trigger('click')
    expect(wrapper.emitted('action')).toBeUndefined()
    await items[0].trigger('click')
    expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ key: 'copy' }), 0)
    expect(wrapper.emitted('action')![0]).toEqual([expect.objectContaining({ key: 'copy' }), 0])
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
  })

  it('keeps open with closeOnAction=false', async () => {
    const wrapper = mount(ActionSheet, { props: { open: true, getContainer: false, actions, closeOnAction: false } })
    await wrapper.find('.am-action-sheet-item').trigger('click')
    expect(wrapper.emitted('action')).toHaveLength(1)
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('emits cancel + close from the cancel button, close from the mask', async () => {
    const wrapper = mount(ActionSheet, { props: { open: true, getContainer: false, actions } })
    await wrapper.find('.am-action-sheet-cancel').trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    await wrapper.find('.am-popup-mask').trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('close')).toHaveLength(2)

    await wrapper.setProps({ maskClosable: false })
    await wrapper.find('.am-popup-mask').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(2)
  })

  it('supports custom / hidden cancel button', async () => {
    const wrapper = mount(ActionSheet, { props: { open: true, getContainer: false, actions, cancelText: 'Dismiss' } })
    expect(wrapper.find('.am-action-sheet-cancel').text()).toBe('Dismiss')
    await wrapper.setProps({ cancelText: null })
    expect(wrapper.find('.am-action-sheet-cancel').exists()).toBe(false)
    await wrapper.setProps({ cancelText: 'x', showCancel: false })
    expect(wrapper.find('.am-action-sheet-cancel').exists()).toBe(false)
  })

  it('slots win over props', () => {
    const wrapper = mount(ActionSheet, {
      props: { open: true, getContainer: false, actions, title: 'prop', cancelText: 'prop cancel' },
      slots: {
        title: 'slot title',
        cancelText: 'slot cancel',
        action: ({ action }: any) => h('i', { class: 'custom-action' }, action.key),
        default: () => h('div', { class: 'custom-content' }),
      },
    })
    expect(wrapper.find('.am-action-sheet-title').text()).toBe('slot title')
    expect(wrapper.find('.am-action-sheet-cancel').text()).toBe('slot cancel')
    expect(wrapper.findAll('.custom-action')).toHaveLength(4)
    expect(wrapper.find('.am-action-sheet-content .custom-content').exists()).toBe(true)
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(ActionSheet, {
      props: {
        open: true,
        getContainer: false,
        actions,
        title: 't',
        rootClass: 'root-cls',
        classes: { body: 'b', header: 'h', list: 'l', item: 'i', cancel: 'c' },
        styles: { item: { color: 'red' } },
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.find('.am-popup-root').classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.find('.am-popup-root').attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-action-sheet').classes()).toContain('b')
    expect(wrapper.find('.am-action-sheet-header').classes()).toContain('h')
    expect(wrapper.find('.am-action-sheet-list').classes()).toContain('l')
    expect(wrapper.find('.am-action-sheet-list .am-action-sheet-item').classes()).toContain('i')
    expect(wrapper.find('.am-action-sheet-list .am-action-sheet-item').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-action-sheet-cancel').classes()).toContain('c')
  })

  it('uses the locale of ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(ActionSheet, { open: true, getContainer: false, actions }) },
    })
    expect(wrapper.find('.am-action-sheet-cancel').text()).toBe(enUS.ActionSheet.cancelText)
  })

  it('ActionSheet.show mounts into body, closes on action and cleans up', async () => {
    const onAction = vi.fn()
    const onClose = vi.fn()
    const afterClose = vi.fn()
    ActionSheet.show({ actions, onAction, onClose, afterClose })
    await nextTick()
    const items = document.querySelectorAll<HTMLElement>('.am-action-sheet-list .am-action-sheet-item')
    expect(items).toHaveLength(4)
    items[0].click()
    expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ key: 'copy' }), 0)
    expect(onClose).toHaveBeenCalledTimes(1)
    await wait()
    expect(afterClose).toHaveBeenCalledTimes(1)
    expect(document.querySelector('.am-action-sheet')).toBeNull()
    expect(document.querySelector('.am-static-holder')).toBeNull()
  })

  it('ActionSheet.show returns a close handler', async () => {
    const onCancel = vi.fn()
    const handler = ActionSheet.show({ actions, onCancel })
    await nextTick()
    expect(document.querySelector('.am-action-sheet')).not.toBeNull()
    handler.close()
    await wait()
    expect(document.querySelector('.am-action-sheet')).toBeNull()
    expect(onCancel).not.toHaveBeenCalled()
  })
})
