import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import NumberKeyboard from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'

const root = () => document.querySelector<HTMLElement>('.am-number-keyboard')
const keyEls = (scope: ParentNode = document) => [...scope.querySelectorAll<HTMLElement>('.am-number-keyboard-key')]
const keyTexts = (scope: ParentNode = document) => keyEls(scope).map(el => el.textContent!.trim())
function clickKey(text: string, scope: ParentNode = document) {
  keyEls(scope).find(el => el.textContent!.trim() === text)!.click()
  return nextTick()
}
const touches = (x = 0, y = 0) => ({ touches: [{ clientX: x, clientY: y }] })

describe('NumberKeyboard', () => {
  it('renders lazily, fixed to the bottom and teleported to body', async () => {
    const wrapper = mount(NumberKeyboard, { props: { open: false } })
    expect(root()).toBeNull()
    await wrapper.setProps({ open: true })
    const el = root()!
    expect(el.parentElement).toBe(document.body)
    expect(el.classList.contains('am-number-keyboard-fixed')).toBe(true)
    expect(el.classList.contains('am-number-keyboard-default')).toBe(true)
    expect(el.classList.contains('am-number-keyboard-safe-area')).toBe(true)
    expect(Number(el.style.zIndex)).toBeGreaterThan(1000)
    // 1-9, blank, 0, delete
    expect(keyTexts()).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', ''])
    expect(el.querySelector('.am-number-keyboard-key-delete svg')).not.toBeNull()
    expect(el.querySelector('.am-number-keyboard-key-blank')).not.toBeNull()
    // no mask, no scroll lock
    expect(document.querySelector('.am-popup-mask')).toBeNull()
    expect(document.body.classList.contains('am-overflow-hidden')).toBe(false)
  })

  it('emits input / delete and maintains v-model:value (uncontrolled)', async () => {
    const wrapper = mount(NumberKeyboard, { props: { defaultOpen: true } })
    await clickKey('1')
    await clickKey('0')
    expect(wrapper.emitted('input')).toEqual([['1'], ['0']])
    expect(wrapper.emitted('update:value')).toEqual([['1'], ['10']])
    root()!.querySelector<HTMLElement>('.am-number-keyboard-key-delete')!.click()
    await nextTick()
    expect(wrapper.emitted('delete')).toHaveLength(1)
    expect(wrapper.emitted('update:value')!.slice(-1)[0]).toEqual(['1'])
  })

  it('controlled value with maxlength', async () => {
    const wrapper = mount(NumberKeyboard, { props: { open: true, value: '12', maxlength: 3 } })
    await clickKey('3')
    expect(wrapper.emitted('update:value')![0]).toEqual(['123'])
    // parent did not update -> still 12
    await clickKey('4')
    expect(wrapper.emitted('update:value')![1]).toEqual(['124'])
    await wrapper.setProps({ value: '123' })
    await clickKey('5')
    expect(wrapper.emitted('input')).toHaveLength(2)
    expect(wrapper.emitted('update:value')).toHaveLength(2)
  })

  it('renders the header with title and close button', async () => {
    const wrapper = mount(NumberKeyboard, { props: { open: true, title: '安全键盘', closeButtonText: '完成' } })
    expect(root()!.classList.contains('am-number-keyboard-with-header')).toBe(true)
    expect(document.querySelector('.am-number-keyboard-title')!.textContent).toBe('安全键盘')
    document.querySelector<HTMLElement>('.am-number-keyboard-close')!.click()
    await nextTick()
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
    expect(wrapper.emitted('openChange')![0]).toEqual([false])
    expect(wrapper.emitted('confirm')).toBeUndefined()
  })

  it('title slot wins over the prop', () => {
    mount(NumberKeyboard, { props: { open: true, title: 'by-prop' }, slots: { title: () => h('b', { class: 'by-slot' }, 'slot') } })
    expect(document.querySelector('.am-number-keyboard-title')!.textContent).toBe('slot')
  })

  it('supports extraKey and hiding the delete key', async () => {
    const wrapper = mount(NumberKeyboard, { props: { open: true, extraKey: 'X', showDeleteKey: false } })
    expect(keyTexts()).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', 'X', '0', ''])
    expect(document.querySelector('.am-number-keyboard-key-delete')).toBeNull()
    await clickKey('X')
    expect(wrapper.emitted('input')![0]).toEqual(['X'])
  })

  it('custom theme: sidebar with delete and confirm, wide zero', async () => {
    const wrapper = mount(NumberKeyboard, { props: { open: true, theme: 'custom', extraKey: '.' } })
    expect(root()!.classList.contains('am-number-keyboard-custom')).toBe(true)
    const sidebar = document.querySelector('.am-number-keyboard-sidebar')!
    expect(keyTexts(sidebar)).toEqual(['删除', '完成'])
    const main = document.querySelector('.am-number-keyboard-keys')!
    expect(keyTexts(main)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'])
    expect(keyEls(main)[9].parentElement!.style.gridColumn).toBe('span 2')
    await clickKey('删除', sidebar)
    expect(wrapper.emitted('delete')).toHaveLength(1)
    await clickKey('完成', sidebar)
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
  })

  it('custom theme: two extra keys / none, custom confirm text', async () => {
    const wrapper = mount(NumberKeyboard, { props: { open: true, theme: 'custom', extraKey: ['00', '.'], confirmText: '支付' } })
    const main = document.querySelector('.am-number-keyboard-keys')!
    expect(keyTexts(main).slice(9)).toEqual(['00', '0', '.'])
    expect(document.querySelector('.am-number-keyboard-key-confirm')!.textContent!.trim()).toBe('支付')
    await clickKey('00', main)
    expect(wrapper.emitted('update:value')![0]).toEqual(['00'])
    await wrapper.setProps({ extraKey: undefined })
    expect(keyEls(document.querySelector('.am-number-keyboard-keys')!)[9].parentElement!.style.gridColumn).toBe('span 3')
  })

  it('shuffles the digits with randomKeyOrder', async () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0)
    mount(NumberKeyboard, { props: { open: true, randomKeyOrder: true } })
    const digits = keyTexts().slice(0, 9)
    expect(digits.slice().sort()).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9'])
    expect(digits).not.toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9'])
    expect(keyTexts()[10]).toBe('0')
    random.mockRestore()
  })

  it('presses through touch with feedback and without a duplicate click', async () => {
    const wrapper = mount(NumberKeyboard, { props: { open: true }, attachTo: document.body })
    const key = keyEls()[4]
    const start = new Event('touchstart', { bubbles: true }) as any
    start.touches = [{ clientX: 10, clientY: 10 }]
    key.dispatchEvent(start)
    await nextTick()
    expect(key.classList.contains('am-number-keyboard-key-active')).toBe(true)
    const end = new Event('touchend', { bubbles: true, cancelable: true })
    key.dispatchEvent(end)
    await nextTick()
    // the default is prevented so no click follows and the focus stays where it was
    expect(end.defaultPrevented).toBe(true)
    expect(key.classList.contains('am-number-keyboard-key-active')).toBe(false)
    expect(wrapper.emitted('input')).toEqual([['5']])
  })

  it('cancels the press when the finger moves away', async () => {
    const wrapper = mount(NumberKeyboard, { props: { open: true, getContainer: false } })
    const key = wrapper.findAll('.am-number-keyboard-key')[0]
    await key.trigger('touchstart', touches(10, 10))
    await key.trigger('touchmove', touches(10, 60))
    expect(key.classes()).not.toContain('am-number-keyboard-key-active')
    await key.trigger('touchend')
    expect(wrapper.emitted('input')).toBeUndefined()
  })

  it('repeats delete while the key is held', async () => {
    vi.useFakeTimers()
    const wrapper = mount(NumberKeyboard, { props: { open: true, getContainer: false, defaultValue: '12345' } })
    const key = wrapper.find('.am-number-keyboard-key-delete')
    await key.trigger('touchstart', touches())
    vi.advanceTimersByTime(500 + 100 * 2)
    await key.trigger('touchend')
    vi.advanceTimersByTime(1000)
    vi.useRealTimers()
    expect(wrapper.emitted('delete')).toHaveLength(3)
    expect(wrapper.emitted('update:value')!.slice(-1)[0]).toEqual(['12'])
  })

  it('hides and emits blur on outside touch, unless hideOnClickOutside is false', async () => {
    const wrapper = mount(NumberKeyboard, { props: { defaultOpen: true }, attachTo: document.body })
    // inside: nothing
    root()!.dispatchEvent(new Event('touchstart', { bubbles: true }))
    expect(wrapper.emitted('blur')).toBeUndefined()
    document.body.dispatchEvent(new Event('touchstart', { bubbles: true }))
    // the emulated mouse event right after the touch is ignored
    document.body.dispatchEvent(new Event('mousedown', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(wrapper.emitted('update:open')![0]).toEqual([false])

    const sticky = mount(NumberKeyboard, { props: { open: true, hideOnClickOutside: false }, attachTo: document.body })
    document.body.dispatchEvent(new Event('touchstart', { bubbles: true }))
    expect(sticky.emitted('blur')).toBeUndefined()
  })

  it('renders inline when poppable is false', async () => {
    const wrapper = mount(NumberKeyboard, { props: { poppable: false }, attrs: { class: 'custom', 'data-id': 'x' } })
    const el = wrapper.find('.am-number-keyboard')
    expect(el.exists()).toBe(true)
    expect(el.classes()).toContain('custom')
    expect(el.classes()).not.toContain('am-number-keyboard-fixed')
    expect(el.attributes('data-id')).toBe('x')
    expect(el.attributes('style') ?? '').not.toContain('z-index')
    document.body.dispatchEvent(new Event('mousedown', { bubbles: true }))
    expect(wrapper.emitted('blur')).toBeUndefined()
    await wrapper.setProps({ open: false })
    expect((el.element as HTMLElement).style.display).toBe('none')
  })

  it('renders in place with getContainer=false and supports zIndex, safeArea, semantic classes', () => {
    const wrapper = mount(NumberKeyboard, {
      props: { open: true, getContainer: false, zIndex: 3000, safeArea: false, rootClass: 'root-cls', classes: { key: 'key-cls', body: 'body-cls' }, styles: { key: { color: 'red' } } },
    })
    const el = wrapper.find('.am-number-keyboard')
    expect(el.classes()).toEqual(expect.arrayContaining(['root-cls', 'am-number-keyboard-fixed']))
    expect(el.classes()).not.toContain('am-number-keyboard-safe-area')
    expect(el.attributes('style')).toContain('z-index: 3000')
    expect(wrapper.find('.am-number-keyboard-body').classes()).toContain('body-cls')
    expect(wrapper.find('.am-number-keyboard-key').classes()).toContain('key-cls')
    expect(wrapper.find('.am-number-keyboard-key').attributes('style')).toContain('color: red')
  })

  it('follows ConfigProvider locale and theme', () => {
    mount(ConfigProvider, {
      props: { locale: enUS, theme: { algorithm: 'dark' } },
      slots: { default: () => h(NumberKeyboard, { open: true, theme: 'custom' }) },
    })
    expect(root()!.classList.contains('am-theme-dark')).toBe(true)
    expect(keyTexts(document.querySelector('.am-number-keyboard-sidebar')!)).toEqual(['Delete', 'Done'])
    expect(root()!.querySelector('.am-number-keyboard-key-delete')!.getAttribute('aria-label')).toBe('Delete')
  })

  it('delete and extraKey slots', () => {
    mount(NumberKeyboard, {
      props: { open: true },
      slots: { delete: () => h('i', { class: 'del-slot' }), extraKey: () => h('i', { class: 'extra-slot' }) },
    })
    expect(document.querySelector('.am-number-keyboard-key-delete .del-slot')).not.toBeNull()
    expect(document.querySelector('.am-number-keyboard-key-extra .extra-slot')).not.toBeNull()
  })
})
