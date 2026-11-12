import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Drawer from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'

function touches(clientX: number, clientY: number) {
  return { touches: [{ clientX, clientY }], changedTouches: [{ clientX, clientY }] }
}

describe('Drawer', () => {
  it('renders lazily into body with bottom placement by default', async () => {
    const wrapper = mount(Drawer, { props: { open: false, title: 'Title' }, slots: { default: 'content' } })
    expect(document.querySelector('.am-drawer')).toBeNull()
    await wrapper.setProps({ open: true })
    const section = document.querySelector('.am-drawer')!
    expect(section.classList.contains('am-drawer-bottom')).toBe(true)
    expect(section.classList.contains('am-popup-round')).toBe(true)
    expect(section.querySelector('.am-drawer-title')!.textContent).toBe('Title')
    expect(section.querySelector('.am-drawer-body')!.textContent).toBe('content')
    expect(section.querySelector('.am-drawer-footer')).toBeNull()
  })

  it('emits close and update:open from the close icon, mask and ESC', async () => {
    const wrapper = mount(Drawer, { props: { open: true, getContainer: false } })
    await wrapper.find('.am-drawer-close').trigger('click')
    await wrapper.find('.am-popup-mask').trigger('click')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('close')).toHaveLength(3)
    expect(wrapper.emitted('update:open')).toEqual([[false], [false], [false]])
  })

  it('respects maskClosable / keyboard / closable', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, getContainer: false, maskClosable: false, keyboard: false, closable: false },
    })
    await wrapper.find('.am-popup-mask').trigger('click')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('close')).toBeUndefined()
    expect(wrapper.find('.am-drawer-close').exists()).toBe(false)
    expect(wrapper.find('.am-drawer-header').exists()).toBe(false)

    await wrapper.setProps({ closable: { disabled: true, placement: 'start' } })
    expect(wrapper.find('.am-drawer-header').classes()).toContain('am-drawer-header-close-start')
    await wrapper.find('.am-drawer-close').trigger('click')
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('maps size / width / height to the panel', async () => {
    const wrapper = mount(Drawer, { props: { open: true, getContainer: false, placement: 'right', size: 'large' } })
    expect(wrapper.find('.am-drawer').classes()).toEqual(expect.arrayContaining(['am-drawer-right', 'am-drawer-large']))
    await wrapper.setProps({ size: 300 })
    expect(wrapper.find('.am-drawer').attributes('style')).toContain('width: 300px')
    expect(wrapper.find('.am-drawer').classes()).toContain('am-drawer-sized')
    await wrapper.setProps({ width: '70%' })
    expect(wrapper.find('.am-drawer').attributes('style')).toContain('width: 70%')
    await wrapper.setProps({ placement: 'top', height: 200 })
    expect(wrapper.find('.am-drawer').attributes('style')).toContain('height: 200px')
  })

  it('renders title / extra / footer / closeIcon with slot priority', () => {
    const wrapper = mount(Drawer, {
      props: {
        open: true,
        getContainer: false,
        title: 'prop title',
        extra: () => h('i', { class: 'prop-extra' }),
        footer: 'prop footer',
        closeIcon: () => h('i', { class: 'prop-close' }),
      },
      slots: { title: 'slot title', footer: () => h('b', { class: 'slot-footer' }) },
    })
    expect(wrapper.find('.am-drawer-title').text()).toBe('slot title')
    expect(wrapper.find('.prop-extra').exists()).toBe(true)
    expect(wrapper.find('.am-drawer-footer .slot-footer').exists()).toBe(true)
    expect(wrapper.find('.am-drawer-close .prop-close').exists()).toBe(true)
  })

  it('shows a loading indicator instead of the content', () => {
    const wrapper = mount(Drawer, { props: { open: true, getContainer: false, loading: true }, slots: { default: 'content' } })
    expect(wrapper.find('.am-drawer-loading').exists()).toBe(true)
    expect(wrapper.find('.am-drawer-body').text()).toBe('')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Drawer, {
      props: {
        open: true,
        getContainer: false,
        title: 'T',
        footer: 'F',
        rootClass: 'root-cls',
        rootStyle: { color: 'red' },
        classes: { section: 's', header: 'h', body: 'b', footer: 'f', mask: 'm', title: 't' },
        styles: { body: { padding: '1px' } },
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    const root = wrapper.find('.am-popup-root')
    expect(root.classes()).toEqual(expect.arrayContaining(['am-drawer-root', 'root-cls', 'custom']))
    expect(root.attributes('data-id')).toBe('x')
    expect(root.attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-drawer').classes()).toContain('s')
    expect(wrapper.find('.am-drawer-header').classes()).toContain('h')
    expect(wrapper.find('.am-drawer-title').classes()).toContain('t')
    expect(wrapper.find('.am-drawer-body').classes()).toContain('b')
    expect(wrapper.find('.am-drawer-body').attributes('style')).toContain('padding: 1px')
    expect(wrapper.find('.am-drawer-footer').classes()).toContain('f')
    expect(wrapper.find('.am-popup-mask').classes()).toContain('m')
  })

  it('closes by swiping the handle down (bottom placement only)', async () => {
    const wrapper = mount(Drawer, { props: { open: true, getContainer: false, swipeToClose: true } })
    const handle = wrapper.find('.am-drawer-handle')
    expect(handle.exists()).toBe(true)

    // a short drag springs back
    await handle.trigger('touchstart', touches(100, 100))
    await handle.trigger('touchmove', touches(100, 120))
    expect((wrapper.find('.am-drawer').element as HTMLElement).style.transform).toContain('20px')
    await new Promise(resolve => setTimeout(resolve, 320))
    await handle.trigger('touchend', touches(100, 120))
    expect(wrapper.emitted('close')).toBeUndefined()
    expect((wrapper.find('.am-drawer').element as HTMLElement).style.transform).toBe('')

    // a long drag closes
    await handle.trigger('touchstart', touches(100, 100))
    await handle.trigger('touchmove', touches(100, 150))
    await handle.trigger('touchmove', touches(100, 300))
    await handle.trigger('touchend', touches(100, 300))
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:open')![0]).toEqual([false])

    await wrapper.setProps({ placement: 'right' })
    expect(wrapper.find('.am-drawer-handle').exists()).toBe(false)
  })

  it('destroys the content when hidden with destroyOnHidden', async () => {
    const wrapper = mount(Drawer, { props: { open: true, getContainer: false, destroyOnHidden: true }, slots: { default: 'content' } })
    await wrapper.setProps({ open: false })
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(wrapper.emitted('afterOpenChange')!.slice(-1)[0]).toEqual([false])
    expect(wrapper.find('.am-drawer').exists()).toBe(false)
  })

  it('uses the locale of ConfigProvider for aria labels', () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(Drawer, { open: true, getContainer: false }) },
    })
    expect(wrapper.find('.am-drawer-close').attributes('aria-label')).toBe(enUS.common.close)
  })
})
