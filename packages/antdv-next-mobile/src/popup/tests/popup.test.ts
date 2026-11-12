import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Popup from '..'
import ConfigProvider from '../../config-provider'

describe('Popup', () => {
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
})
