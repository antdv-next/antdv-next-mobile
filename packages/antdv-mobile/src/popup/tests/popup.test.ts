import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, KeepAlive, nextTick, ref } from 'vue'
import Popup from '..'
import ConfigProvider from '../../config-provider'
import ImagePreview from '../../image-preview/ImagePreview.vue'

describe('Popup', () => {
  it('lets only the top layer consume Escape across popup types and explicit z-indices', async () => {
    const popup = mount(Popup, { props: { open: true, keyboard: false, zIndex: 3100 } })
    const preview = mount(ImagePreview, { props: { open: true, zIndex: 3000 } })
    await nextTick()
    const escape = () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    escape()
    expect(preview.emitted('close')).toBeUndefined()
    expect(popup.emitted('close')).toBeUndefined()
    await popup.setProps({ zIndex: 2900, keyboard: true })
    escape()
    expect(preview.emitted('close')).toHaveLength(1)
    expect(popup.emitted('close')).toBeUndefined()
    await preview.setProps({ open: false })
    escape()
    expect(popup.emitted('close')).toHaveLength(1)
  })

  it('restores the background scroll lock when an open page is reactivated', async () => {
    const active = ref(true)
    const open = ref(true)
    const Page = defineComponent({ setup: () => () => h(Popup, { open: open.value, getContainer: false }) })
    const wrapper = mount(defineComponent({ setup: () => () => h(KeepAlive, null, () => active.value ? h(Page) : null) }))
    const locked = () => document.body.classList.contains('am-overflow-hidden')
    expect(locked()).toBe(true)
    active.value = false
    await nextTick()
    expect(locked()).toBe(false)
    open.value = false
    await nextTick()
    open.value = true
    await nextTick()
    expect(locked()).toBe(false)
    active.value = true
    await nextTick()
    expect(locked()).toBe(true)
    wrapper.unmount()
    expect(locked()).toBe(false)
  })

  it('leaves focus on the page for a maskless popup', async () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()
    const wrapper = mount(Popup, { props: { open: true, mask: false, getContainer: false }, attachTo: document.body })
    await nextTick()
    expect(document.activeElement).toBe(trigger)
    expect(wrapper.get('[role="dialog"]').attributes('aria-modal')).toBeUndefined()
  })

  it('renders lazily into body', async () => {
    const wrapper = mount(Popup, { props: { open: false }, slots: { default: 'content' } })
    expect(document.querySelector('.am-popup-root')).toBeNull()
    await wrapper.setProps({ open: true })
    const root = document.querySelector('.am-popup-root')!
    expect(root).not.toBeNull()
    expect(root.querySelector('.am-popup-bottom')!.textContent).toContain('content')
    wrapper.unmount()
  })

  it('renders in place when getContainer is false', () => {
    const wrapper = mount(Popup, { props: { open: true, getContainer: false, placement: 'center' } })
    expect(wrapper.find('.am-popup-center').exists()).toBe(true)
  })

  it('closes on mask click only when maskClosable', async () => {
    const wrapper = mount(Popup, { props: { open: true, getContainer: false } })
    await wrapper.find('.am-popup-mask').trigger('click')
    expect(wrapper.emitted('maskClick')).toHaveLength(1)
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
    expect(wrapper.emitted('close')).toHaveLength(1)

    const locked = mount(Popup, { props: { open: true, getContainer: false, maskClosable: false } })
    await locked.find('.am-popup-mask').trigger('click')
    expect(locked.emitted('update:open')).toBeUndefined()
  })

  it('renders close icon and semantic classes', async () => {
    const wrapper = mount(Popup, {
      props: { open: true, getContainer: false, closable: true, rootClass: 'r', classes: { body: 'b', mask: 'm' } },
    })
    expect(wrapper.find('.am-popup-root').classes()).toContain('r')
    expect(wrapper.find('.am-popup').classes()).toContain('b')
    expect(wrapper.find('.am-popup-mask').classes()).toContain('m')
    await wrapper.find('.am-popup-close').trigger('click')
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
  })

  it('carries the theme of ConfigProvider when teleported', () => {
    const wrapper = mount(ConfigProvider, {
      props: { theme: { algorithm: 'dark', token: { colorPrimary: '#00b96b' } } },
      slots: { default: () => h(Popup, { open: true }) },
    })
    const root = document.querySelector<HTMLElement>('.am-popup-root')!
    expect(root.classList.contains('am-theme-dark')).toBe(true)
    expect(root.style.getPropertyValue('--am-color-primary')).toBe('#00b96b')
    wrapper.unmount()
  })

  it('builds its backdrop on Mask and keeps the page scrollable with lockScroll=false', async () => {
    const wrapper = mount(Popup, { props: { open: true, getContainer: false, lockScroll: false, styles: { mask: { opacity: '0.5' } } } })
    const mask = wrapper.find('.am-popup-mask')
    expect(mask.classes()).toContain('am-mask')
    expect(mask.element.parentElement).toBe(wrapper.find('.am-popup-root').element)
    expect((mask.element as HTMLElement).style.opacity).toBe('0.5')
    expect(document.body.classList.contains('am-overflow-hidden')).toBe(false)
    await wrapper.setProps({ mask: false })
    expect(wrapper.find('.am-popup-mask').exists()).toBe(false)
  })
})
