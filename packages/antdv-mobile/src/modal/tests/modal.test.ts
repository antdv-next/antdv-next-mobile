import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import Modal from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'
import zhCN from '../../locale/zh_CN'

const wait = (ms = 80) => new Promise(resolve => setTimeout(resolve, ms))
const actions = () => Array.from(document.querySelectorAll<HTMLElement>('.am-modal-action'))

describe('Modal', () => {
  it('names the dialog, contains keyboard focus, and restores focus to each nested opener', async () => {
    const launcher = document.createElement('button')
    document.body.appendChild(launcher)
    launcher.focus()
    const parent = mount(Modal, { props: { open: true, title: 'Edit' } })
    await nextTick()
    const outer = document.querySelector<HTMLElement>('[role="dialog"]')!
    expect(document.getElementById(outer.getAttribute('aria-labelledby')!)?.textContent).toBe('Edit')
    expect(document.activeElement).toBe(outer)
    const [first, last] = Array.from(outer.querySelectorAll('button'))
    // jsdom does not lay out buttons.
    for (const el of [first, last])
      vi.spyOn(el, 'getClientRects').mockReturnValue([el.getBoundingClientRect()] as unknown as DOMRectList)
    last.focus()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', cancelable: true }))
    expect(document.activeElement).toBe(first)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true }))
    expect(document.activeElement).toBe(last)
    const child = mount(Modal, { props: { open: true, title: 'Visible title' }, attrs: { 'aria-label': 'Confirm' } })
    await nextTick()
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Confirm')
    expect(document.activeElement?.hasAttribute('aria-labelledby')).toBe(false)
    await child.setProps({ ariaLabelledby: 'other-title' })
    expect(document.activeElement?.getAttribute('aria-labelledby')).toBe('other-title')
    child.unmount()
    expect(document.activeElement).toBe(last)
    await parent.setProps({ open: false })
    expect(document.activeElement).toBe(launcher)
  })

  it('settles only the displaced holder and disposes each dialog once', async () => {
    const [first, FirstHolder] = Modal.useModal()
    const [second, SecondHolder] = Modal.useModal()
    const w = mount(FirstHolder)
    mount(SecondHolder)
    const afterClose = vi.fn()
    const gone = first.confirmAsync({ title: 'First', afterClose })
    const other = second.confirmAsync({ title: 'Second' })
    await nextTick()
    const queued = first.confirmAsync({ title: 'Unmount before render' })
    w.unmount()
    await expect(gone).resolves.toBe(false)
    await expect(queued).resolves.toBe(false)
    expect(afterClose).toHaveBeenCalledTimes(1)
    const ok = document.querySelector<HTMLButtonElement>('.am-modal-action-ok')!
    ok.click()
    await expect(other).resolves.toBe(true)
    Modal.destroyAll()
    expect(afterClose).toHaveBeenCalledTimes(1)
  })

  afterEach(async () => {
    Modal.destroyAll()
    await wait()
  })

  it('renders title, content and the default footer', () => {
    const wrapper = mount(Modal, { props: { open: true, getContainer: false, title: 'Title' }, slots: { default: 'content' } })
    expect(wrapper.find('.am-popup-root').classes()).toContain('am-modal-root')
    expect(wrapper.find('.am-modal').classes()).toContain('am-popup-center')
    expect(wrapper.find('.am-modal-title').text()).toBe('Title')
    expect(wrapper.find('.am-modal-body').text()).toBe('content')
    const buttons = wrapper.findAll('.am-modal-action')
    expect(buttons.map(b => b.text())).toEqual([zhCN.Modal.cancelText, zhCN.Modal.okText])
    expect(wrapper.find('.am-modal-close').exists()).toBe(false)
  })

  it('emits ok / cancel and only closes on cancel', async () => {
    const wrapper = mount(Modal, { props: { open: true, getContainer: false, closable: true } })
    await wrapper.find('.am-modal-action-ok').trigger('click')
    expect(wrapper.emitted('ok')).toHaveLength(1)
    expect(wrapper.emitted('update:open')).toBeUndefined()
    await wrapper.find('.am-modal-action-cancel').trigger('click')
    await wrapper.find('.am-popup-mask').trigger('click')
    await wrapper.find('.am-modal-close').trigger('click')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('cancel')).toHaveLength(4)
    expect(wrapper.emitted('update:open')).toHaveLength(4)
  })

  it('respects maskClosable and keyboard', async () => {
    const wrapper = mount(Modal, { props: { open: true, getContainer: false, maskClosable: false, keyboard: false } })
    await wrapper.find('.am-popup-mask').trigger('click')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('cancel')).toBeUndefined()
  })

  it('supports okText / cancelText / okType / button props / confirmLoading', async () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        getContainer: false,
        okText: 'Yes',
        cancelText: 'No',
        okType: 'danger',
        cancelButtonProps: { disabled: true },
        confirmLoading: true,
      },
    })
    const [cancel, ok] = wrapper.findAll('.am-modal-action')
    expect(cancel.text()).toBe('No')
    expect(cancel.classes()).toContain('am-button-disabled')
    expect(ok.text()).toBe('Yes')
    expect(ok.classes()).toEqual(expect.arrayContaining(['am-button-color-danger', 'am-button-loading']))
    await ok.trigger('click')
    expect(wrapper.emitted('ok')).toBeUndefined()
  })

  it('renders a single button with okCancel=false and hides the footer with footer=null', async () => {
    const wrapper = mount(Modal, { props: { open: true, getContainer: false, okCancel: false } })
    expect(wrapper.findAll('.am-modal-action').map(b => b.text())).toEqual([zhCN.Modal.justOkText])
    await wrapper.setProps({ footer: null })
    expect(wrapper.find('.am-modal-footer').exists()).toBe(false)
  })

  it('footer slot wins over the footer prop and receives handlers', async () => {
    const wrapper = mount(Modal, {
      props: { open: true, getContainer: false, footer: 'prop footer' },
      slots: {
        footer: ({ ok, cancel }: any) => [
          h('button', { class: 'my-ok', onClick: ok }, 'ok'),
          h('button', { class: 'my-cancel', onClick: cancel }, 'cancel'),
        ],
      },
    })
    expect(wrapper.find('.am-modal-footer').classes()).toContain('am-modal-footer-custom')
    expect(wrapper.find('.am-modal-footer').text()).not.toContain('prop footer')
    await wrapper.find('.my-ok').trigger('click')
    await wrapper.find('.my-cancel').trigger('click')
    expect(wrapper.emitted('ok')).toHaveLength(1)
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  it('renders actions, stacked vertically when more than two', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Modal, {
      props: {
        open: true,
        getContainer: false,
        closeOnAction: true,
        actions: [
          { key: 'a', text: 'A', bold: true, onClick },
          { key: 'b', text: 'B', danger: true },
        ],
      },
    })
    expect(wrapper.find('.am-modal-footer').classes()).not.toContain('am-modal-footer-vertical')
    const [a, b] = wrapper.findAll('.am-modal-action')
    expect(a.classes()).toEqual(expect.arrayContaining(['am-modal-action-bold', 'am-button-color-primary']))
    expect(b.classes()).toContain('am-button-color-danger')
    await a.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('action')![0]).toEqual([expect.objectContaining({ key: 'a' }), 0])
    expect(wrapper.emitted('update:open')![0]).toEqual([false])

    await wrapper.setProps({
      actions: [
        { key: 'a', text: 'A' },
        { key: 'b', text: 'B', disabled: true },
        { key: 'c', text: 'C' },
      ],
    })
    expect(wrapper.find('.am-modal-footer').classes()).toContain('am-modal-footer-vertical')
    await wrapper.findAll('.am-modal-action')[1].trigger('click')
    expect(wrapper.emitted('action')).toHaveLength(1)
  })

  it('keeps an action loading while its promise is pending', async () => {
    let resolve!: () => void
    const wrapper = mount(Modal, {
      props: {
        open: true,
        getContainer: false,
        actions: [{ key: 'a', text: 'A', onClick: () => new Promise<void>(r => (resolve = r)) }],
      },
    })
    await wrapper.find('.am-modal-action').trigger('click')
    expect(wrapper.find('.am-modal-action').classes()).toContain('am-button-loading')
    expect(wrapper.emitted('action')).toBeUndefined()
    resolve()
    await wait(0)
    expect(wrapper.find('.am-modal-action').classes()).not.toContain('am-button-loading')
    expect(wrapper.emitted('action')).toHaveLength(1)
  })

  it('renders image / header slot and passes attrs, rootClass, classes, styles, width', () => {
    const wrapper = mount(Modal, {
      props: {
        open: true,
        getContainer: false,
        title: 'T',
        image: 'a.png',
        width: 280,
        rootClass: 'root-cls',
        classes: { container: 'c', title: 't', body: 'b', footer: 'f', header: 'hd' },
        styles: { title: { color: 'red' } },
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
      slots: { default: 'content' },
    })
    expect(wrapper.find('.am-modal-image').attributes('src')).toBe('a.png')
    expect(wrapper.find('.am-popup-root').classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.find('.am-popup-root').attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-modal').classes()).toContain('c')
    expect(wrapper.find('.am-modal').attributes('style')).toContain('width: calc(280 * var(--am-design-unit))')
    expect(wrapper.find('.am-modal-header').classes()).toContain('hd')
    expect(wrapper.find('.am-modal-title').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-modal-body').classes()).toContain('b')
    expect(wrapper.find('.am-modal-footer').classes()).toContain('f')
  })

  it('emits afterClose once the leave animation finished', async () => {
    const wrapper = mount(Modal, { props: { open: true, getContainer: false } })
    await wrapper.setProps({ open: false })
    await wait()
    expect(wrapper.emitted('afterClose')).toHaveLength(1)
    expect(wrapper.emitted('afterOpenChange')!.slice(-1)[0]).toEqual([false])
  })

  it('uses the locale of ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(Modal, { open: true, getContainer: false }) },
    })
    expect(wrapper.findAll('.am-modal-action').map(b => b.text())).toEqual([enUS.Modal.cancelText, enUS.Modal.okText])
  })

  describe('static methods', () => {
    it('confirm mounts into body and is removed after closing', async () => {
      const onOk = vi.fn()
      const afterClose = vi.fn()
      Modal.confirm({ title: 'Sure?', content: 'content', onOk, afterClose })
      await nextTick()
      expect(document.querySelector('.am-modal-title')!.textContent).toBe('Sure?')
      expect(document.querySelector('.am-modal-body')!.textContent).toBe('content')
      expect(document.querySelector('.am-modal-confirm-confirm')).not.toBeNull()
      expect(actions()).toHaveLength(2)
      actions()[1].click()
      expect(onOk).toHaveBeenCalledTimes(1)
      await wait()
      expect(afterClose).toHaveBeenCalledTimes(1)
      expect(document.querySelector('.am-modal')).toBeNull()
      expect(document.querySelector('.am-static-holder')).toBeNull()
    })

    it('info / success / error / warning render one button and a status icon', async () => {
      Modal.info({ title: 'i' })
      Modal.success({ title: 's' })
      Modal.error({ title: 'e' })
      Modal.warning({ title: 'w' })
      Modal.warn({ title: 'w2', icon: null })
      await nextTick()
      expect(document.querySelectorAll('.am-modal')).toHaveLength(5)
      expect(document.querySelectorAll('.am-modal-icon')).toHaveLength(4)
      expect(document.querySelector('.am-modal-icon-success')).not.toBeNull()
      expect(actions()).toHaveLength(5)
      expect(actions()[0].textContent).toBe(zhCN.Modal.justOkText)
      Modal.destroyAll()
      await wait()
      expect(document.querySelectorAll('.am-modal')).toHaveLength(0)
    })

    it('update and destroy work on the returned handle', async () => {
      const instance = Modal.confirm({ title: 'a' })
      await nextTick()
      instance.update({ title: 'b' })
      await nextTick()
      expect(document.querySelector('.am-modal-title')!.textContent).toBe('b')
      instance.update(prev => ({ ...prev, title: `${prev.title}c` }))
      await nextTick()
      expect(document.querySelector('.am-modal-title')!.textContent).toBe('bc')
      instance.destroy()
      await wait()
      expect(document.querySelector('.am-modal')).toBeNull()
    })

    it('keeps the ok button loading until the returned promise resolves', async () => {
      let resolve!: () => void
      Modal.confirm({ title: 'a', onOk: () => new Promise<void>(r => (resolve = r)) })
      await nextTick()
      actions()[1].click()
      await nextTick()
      expect(actions()[1].classList.contains('am-button-loading')).toBe(true)
      await wait()
      expect(document.querySelector('.am-modal')).not.toBeNull()
      resolve()
      await wait()
      expect(document.querySelector('.am-modal')).toBeNull()
    })

    it('stays open when the promise rejects or until close() is called', async () => {
      Modal.confirm({ title: 'a', onOk: () => Promise.reject(new Error('no')) })
      await nextTick()
      actions()[1].click()
      await wait()
      expect(document.querySelector('.am-modal')).not.toBeNull()
      expect(actions()[1].classList.contains('am-button-loading')).toBe(false)
      Modal.destroyAll()
      await wait()

      let closeFn!: () => void
      Modal.confirm({
        title: 'b',
        onCancel: (close) => {
          closeFn = close
        },
      })
      await nextTick()
      actions()[0].click()
      await wait()
      expect(document.querySelector('.am-modal')).not.toBeNull()
      closeFn()
      await wait()
      expect(document.querySelector('.am-modal')).toBeNull()
    })

    it('confirmAsync resolves true / false and alert resolves on close', async () => {
      const ok = Modal.confirmAsync({ title: 'a' })
      await nextTick()
      actions()[1].click()
      await expect(ok).resolves.toBe(true)
      await wait()

      const cancel = Modal.confirmAsync({ title: 'b' })
      await nextTick()
      actions()[0].click()
      await expect(cancel).resolves.toBe(false)
      await wait()

      const done = vi.fn()
      Modal.alert({ title: 'c' }).then(done)
      await nextTick()
      expect(actions()).toHaveLength(1)
      actions()[0].click()
      await wait()
      expect(done).toHaveBeenCalledTimes(1)
    })

    it('show renders actions and closes on action by default', async () => {
      const onClick = vi.fn()
      Modal.show({ content: 'c', actions: [{ key: 'x', text: 'X', onClick }, { key: 'y', text: 'Y' }, { key: 'z', text: 'Z' }] })
      await nextTick()
      expect(document.querySelector('.am-modal-footer-vertical')).not.toBeNull()
      actions()[0].click()
      expect(onClick).toHaveBeenCalled()
      await wait()
      expect(document.querySelector('.am-modal')).toBeNull()
    })

    it('useModal renders inside the context holder and keeps the provider locale', async () => {
      let api: any
      const Comp = defineComponent({
        setup() {
          const [modal, ContextHolder] = Modal.useModal()
          api = modal
          return () => h(ConfigProvider, { locale: enUS }, { default: () => h(ContextHolder) })
        },
      })
      mount(Comp)
      api.confirm({ title: 'hook' })
      await nextTick()
      expect(document.querySelector('.am-static-holder')).toBeNull()
      expect(actions().map(el => el.textContent)).toEqual([enUS.Modal.cancelText, enUS.Modal.okText])
      actions()[0].click()
      await wait()
      expect(document.querySelector('.am-modal')).toBeNull()
    })
  })
})
