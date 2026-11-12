import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { computed, h, nextTick } from 'vue'
import Input, { InputOTP, InputPassword, InputSearch, TextArea } from '..'
import ConfigProvider from '../../config-provider'
import { formItemInputContextKey, variantContextKey } from '../../form/context'
import enUS from '../../locale/en_US'

function formItemProvide(overrides: Record<string, any> = {}) {
  const onFieldChange = vi.fn()
  const onFieldBlur = vi.fn()
  return {
    onFieldChange,
    onFieldBlur,
    provide: {
      [formItemInputContextKey as symbol]: {
        status: computed(() => 'error'),
        id: computed(() => 'field_id'),
        onFieldChange,
        onFieldBlur,
        isFormItemInput: true,
        ...overrides,
      },
    },
  }
}

describe('Input', () => {
  it('renders a native input with base classes and statics', () => {
    const wrapper = mount(Input, { props: { placeholder: 'Type' } })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-input', 'am-input-outlined']))
    const input = wrapper.find('input')
    expect(input.classes()).toContain('am-input-input')
    expect(input.attributes('type')).toBe('text')
    expect(input.attributes('placeholder')).toBe('Type')
    expect(Input.TextArea).toBe(TextArea)
    expect(Input.Search).toBe(InputSearch)
    expect(Input.Password).toBe(InputPassword)
    expect(Input.OTP).toBe(InputOTP)
    expect(Input.name).toBe('AmInput')
  })

  it('works uncontrolled with defaultValue and emits update:value / change / input', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Input, { props: { defaultValue: 'a', onChange } })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('a')
    await input.setValue('ab')
    expect(wrapper.emitted('update:value')![0]).toEqual(['ab'])
    expect(wrapper.emitted('input')).toHaveLength(1)
    expect(onChange.mock.calls[0][0].target.value).toBe('ab')
    expect(input.element.value).toBe('ab')
  })

  it('stays in sync with a controlled value that is not updated', async () => {
    const wrapper = mount(Input, { props: { value: 'fixed' } })
    const input = wrapper.find('input')
    await input.setValue('changed')
    await nextTick()
    expect(wrapper.emitted('update:value')![0]).toEqual(['changed'])
    expect(input.element.value).toBe('fixed')
    await wrapper.setProps({ value: 'next' })
    expect(input.element.value).toBe('next')
    await wrapper.setProps({ value: null })
    expect(input.element.value).toBe('')
  })

  it('does not commit while an IME is composing', async () => {
    const wrapper = mount(Input)
    const input = wrapper.find('input')
    await input.trigger('compositionstart')
    input.element.value = 'ni'
    await input.trigger('input')
    expect(wrapper.emitted('update:value')).toBeUndefined()
    input.element.value = '你'
    await input.trigger('compositionend')
    expect(wrapper.emitted('update:value')).toEqual([['你']])
    // trailing input event of some browsers is not reported twice
    await input.trigger('input')
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('shows the clear icon only while focused and non-empty, and clears', async () => {
    const wrapper = mount(Input, { props: { defaultValue: 'abc', allowClear: true }, attachTo: document.body })
    expect(wrapper.find('.am-input-clear').exists()).toBe(false)
    await wrapper.find('input').trigger('focus')
    const clear = wrapper.find('.am-input-clear')
    expect(clear.exists()).toBe(true)
    expect(clear.attributes('aria-label')).toBe('清除')
    await clear.trigger('click')
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(wrapper.emitted('update:value')![0]).toEqual([''])
    expect((wrapper.emitted('change')![0][0] as Event & { target: HTMLInputElement }).target.value).toBe('')
    expect(wrapper.find('input').element.value).toBe('')
    expect(wrapper.find('.am-input-clear').exists()).toBe(false)
  })

  it('clearTrigger="always", custom clear icon by prop and slot', () => {
    const byProp = mount(Input, {
      props: { value: 'a', clearTrigger: 'always', allowClear: { clearIcon: () => h('i', { class: 'prop-clear' }) } },
    })
    expect(byProp.find('.prop-clear').exists()).toBe(true)
    const bySlot = mount(Input, {
      props: { value: 'a', clearTrigger: 'always', allowClear: { clearIcon: () => h('i', { class: 'prop-clear' }) } },
      slots: { clearIcon: () => h('i', { class: 'slot-clear' }) },
    })
    expect(bySlot.find('.slot-clear').exists()).toBe(true)
    expect(bySlot.find('.prop-clear').exists()).toBe(false)
    const disabled = mount(Input, { props: { value: 'a', clearTrigger: 'always', allowClear: true, disabled: true } })
    expect(disabled.find('.am-input-clear').exists()).toBe(false)
  })

  it('prefix / suffix: slot wins over prop', () => {
    const wrapper = mount(Input, {
      props: { prefix: 'P', suffix: () => h('i', { class: 'prop-suffix' }) },
      slots: { suffix: () => h('i', { class: 'slot-suffix' }) },
    })
    expect(wrapper.find('.am-input-prefix').text()).toBe('P')
    expect(wrapper.find('.slot-suffix').exists()).toBe(true)
    expect(wrapper.find('.prop-suffix').exists()).toBe(false)
  })

  it('showCount with maxlength and a custom formatter', async () => {
    const wrapper = mount(Input, { props: { defaultValue: 'ab😀', showCount: true, maxlength: 10 } })
    expect(wrapper.find('.am-input-count').text()).toBe('3 / 10')
    expect(wrapper.find('input').attributes('maxlength')).toBe('10')
    await wrapper.setProps({ showCount: { formatter: ({ count, maxLength }: any) => `${count} of ${maxLength}` } })
    expect(wrapper.find('.am-input-count').text()).toBe('3 of 10')
  })

  it('size, variant, status, align, disabled and readonly classes', () => {
    const wrapper = mount(Input, {
      props: { size: 'small', variant: 'filled', status: 'error', align: 'end', disabled: true, readonly: true },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'am-input-sm',
      'am-input-filled',
      'am-input-status-error',
      'am-input-align-end',
      'am-input-disabled',
      'am-input-readonly',
    ]))
    const input = wrapper.find('input')
    expect(input.attributes('disabled')).toBeDefined()
    expect(input.attributes('readonly')).toBeDefined()
    expect(input.attributes('aria-invalid')).toBe('true')
  })

  it('emits pressEnter / focus / blur and toggles the focused class', async () => {
    const wrapper = mount(Input)
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(wrapper.classes()).toContain('am-input-focused')
    await input.trigger('keydown', { key: 'Enter' })
    await input.trigger('keydown', { key: 'a' })
    expect(wrapper.emitted('pressEnter')).toHaveLength(1)
    expect(wrapper.emitted('keydown')).toHaveLength(2)
    await input.trigger('blur')
    expect(wrapper.classes()).not.toContain('am-input-focused')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
  })

  it('exposes focus (with cursor) / blur / select / input / nativeElement', () => {
    const wrapper = mount(Input, { props: { value: 'hello' }, attachTo: document.body })
    const el = wrapper.find('input').element
    wrapper.vm.focus({ cursor: 'start' })
    expect(document.activeElement).toBe(el)
    expect(el.selectionStart).toBe(0)
    expect(el.selectionEnd).toBe(0)
    wrapper.vm.focus({ cursor: 'all' })
    expect(el.selectionEnd).toBe(5)
    wrapper.vm.select()
    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(el)
    expect(wrapper.vm.input).toBe(el)
    expect(wrapper.vm.nativeElement).toBe(wrapper.element)
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Input, {
      props: { rootClass: 'root-cls', classes: { input: 'input-cls' }, styles: { input: { color: 'red' } }, id: 'my-id', name: 'user', inputmode: 'tel' },
      attrs: { 'class': 'custom', 'style': 'margin: 1px', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.attributes('data-id')).toBe('x')
    const input = wrapper.find('input')
    expect(input.classes()).toContain('input-cls')
    expect(input.attributes('style')).toContain('color: red')
    expect(input.attributes('id')).toBe('my-id')
    expect(input.attributes('name')).toBe('user')
    expect(input.attributes('inputmode')).toBe('tel')
  })

  it('follows ConfigProvider size / disabled / locale and the Form variant', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { componentSize: 'large', componentDisabled: true, locale: enUS },
      slots: { default: () => h(Input, { value: 'a', allowClear: true, clearTrigger: 'always', disabled: false }) },
      global: { provide: { [variantContextKey as symbol]: computed(() => 'borderless') } },
    })
    const root = wrapper.find('.am-input')
    expect(root.classes()).toEqual(expect.arrayContaining(['am-input-lg', 'am-input-borderless']))
    // own prop wins over the provider
    expect(root.classes()).not.toContain('am-input-disabled')
    expect(wrapper.find('.am-input-clear').attributes('aria-label')).toBe(enUS.Input.clear)
  })

  it('implements the FormItem contract: id, status, onFieldChange, onFieldBlur', async () => {
    const ctx = formItemProvide()
    const wrapper = mount(Input, { global: { provide: ctx.provide } })
    const input = wrapper.find('input')
    expect(input.attributes('id')).toBe('field_id')
    expect(wrapper.classes()).toContain('am-input-status-error')
    await input.setValue('a')
    expect(ctx.onFieldChange).toHaveBeenCalledTimes(1)
    await input.trigger('blur')
    expect(ctx.onFieldBlur).toHaveBeenCalledTimes(1)
  })
})

describe('TextArea', () => {
  it('renders a textarea with rows and base classes', () => {
    const wrapper = mount(TextArea, { props: { rows: 4, placeholder: 'Say something' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-textarea', 'am-textarea-outlined']))
    const el = wrapper.find('textarea')
    expect(el.attributes('rows')).toBe('4')
    expect(el.attributes('placeholder')).toBe('Say something')
    expect(TextArea.name).toBe('AmTextarea')
  })

  it('supports v-model:value, showCount and allowClear', async () => {
    const wrapper = mount(TextArea, { props: { defaultValue: 'abc', showCount: true, maxlength: 20, allowClear: true } })
    expect(wrapper.find('.am-textarea-count').text()).toBe('3 / 20')
    const el = wrapper.find('textarea')
    await el.setValue('abcd')
    expect(wrapper.emitted('update:value')![0]).toEqual(['abcd'])
    expect(wrapper.find('.am-textarea-count').text()).toBe('4 / 20')
    await el.trigger('focus')
    await wrapper.find('.am-textarea-clear').trigger('click')
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(el.element.value).toBe('')
  })

  it('autoSize fits the content height between minRows and maxRows', async () => {
    const wrapper = mount(TextArea, { props: { autoSize: { minRows: 2, maxRows: 4 }, value: '' }, attachTo: document.body })
    const el = wrapper.find('textarea').element
    const style = vi.spyOn(window, 'getComputedStyle').mockReturnValue({ lineHeight: '20px', fontSize: '16px', paddingTop: '0px', paddingBottom: '0px', borderTopWidth: '0px', borderBottomWidth: '0px' } as any)
    let scrollHeight = 20
    Object.defineProperty(el, 'scrollHeight', { configurable: true, get: () => scrollHeight })

    await wrapper.setProps({ value: 'a' })
    await flushPromises()
    expect(el.style.height).toBe('40px')

    scrollHeight = 60
    await wrapper.setProps({ value: 'a\nb\nc' })
    await flushPromises()
    expect(el.style.height).toBe('60px')
    expect(wrapper.emitted('resize')!.slice(-1)[0]).toEqual([{ height: 60 }])

    scrollHeight = 200
    await wrapper.setProps({ value: 'a\nb\nc\nd\ne\nf' })
    await flushPromises()
    expect(el.style.height).toBe('80px')
    expect(el.style.overflowY).toBe('auto')
    expect(wrapper.classes()).toContain('am-textarea-autosize')
    style.mockRestore()
  })

  it('status / variant / disabled / FormItem contract', async () => {
    const ctx = formItemProvide()
    const wrapper = mount(TextArea, { props: { variant: 'borderless', disabled: true }, global: { provide: ctx.provide } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-textarea-borderless', 'am-textarea-disabled', 'am-textarea-status-error']))
    const el = wrapper.find('textarea')
    expect(el.attributes('id')).toBe('field_id')
    expect(el.attributes('disabled')).toBeDefined()
    await wrapper.setProps({ disabled: false })
    await el.setValue('x')
    await el.trigger('blur')
    expect(ctx.onFieldChange).toHaveBeenCalledTimes(1)
    expect(ctx.onFieldBlur).toHaveBeenCalledTimes(1)
  })
})

describe('InputSearch', () => {
  it('renders a filled round search bar with the locale placeholder', () => {
    const wrapper = mount(InputSearch)
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-input-search', 'am-input-search-round']))
    expect(wrapper.attributes('role')).toBe('search')
    expect(wrapper.find('.am-input').classes()).toContain('am-input-filled')
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('搜索')
    expect(input.attributes('type')).toBe('search')
    expect(input.attributes('enterkeyhint')).toBe('search')
    expect(wrapper.find('.am-input-search-icon').exists()).toBe(true)
    expect(wrapper.find('.am-input-search-cancel').exists()).toBe(false)
  })

  it('emits search on enter and on clear with the source', async () => {
    const wrapper = mount(InputSearch, { attachTo: document.body })
    const input = wrapper.find('input')
    await input.setValue('vue')
    expect(wrapper.emitted('update:value')![0]).toEqual(['vue'])
    await input.trigger('keydown', { key: 'Enter' })
    const [value, event, info] = wrapper.emitted('search')![0]
    expect(value).toBe('vue')
    expect(event).toBeInstanceOf(KeyboardEvent)
    expect(info).toEqual({ source: 'input' })
    expect(wrapper.emitted('pressEnter')).toHaveLength(1)

    await wrapper.find('.am-input-clear').trigger('click')
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(wrapper.emitted('search')![1]).toEqual(['', undefined, { source: 'clear' }])
    expect(input.element.value).toBe('')
  })

  it('shows the cancel button while focused and cancels', async () => {
    const wrapper = mount(InputSearch, { props: { showCancel: true }, attachTo: document.body })
    expect(wrapper.find('.am-input-search-cancel').exists()).toBe(false)
    const input = wrapper.find('input')
    await input.trigger('focus')
    const cancel = wrapper.find('.am-input-search-cancel')
    expect(cancel.text()).toBe('取消')
    await input.setValue('abc')
    await cancel.trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:value')!.slice(-1)[0]).toEqual([''])
    expect(input.element.value).toBe('')
  })

  it('cancelText prop / slot, enterButton and loading', async () => {
    const wrapper = mount(InputSearch, {
      props: { showCancel: true, value: 'a', cancelText: 'Prop', enterButton: 'Go', loading: true },
      slots: { cancelText: () => 'Slot' },
    })
    expect(wrapper.find('.am-input-search-cancel').text()).toBe('Slot')
    const button = wrapper.find('.am-input-search-button')
    expect(button.text()).toBe('Go')
    expect(button.attributes('disabled')).toBeDefined()
    expect(wrapper.find('.am-input-search-icon .am-spin-icon').exists()).toBe(true)
    await wrapper.setProps({ loading: false })
    await wrapper.find('.am-input-search-button').trigger('click')
    expect(wrapper.emitted('search')![0][0]).toBe('a')
  })

  it('searchIcon slot wins over prop; attrs and rootClass land on the root', () => {
    const wrapper = mount(InputSearch, {
      props: { searchIcon: () => h('i', { class: 'prop-icon' }), rootClass: 'root-cls', size: 'small' },
      attrs: { class: 'custom' },
      slots: { searchIcon: () => h('i', { class: 'slot-icon' }) },
    })
    expect(wrapper.find('.slot-icon').exists()).toBe(true)
    expect(wrapper.find('.prop-icon').exists()).toBe(false)
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'am-input-search-sm']))
  })

  it('uses the locale of ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(InputSearch, { showCancel: true, value: 'x' }) },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe(enUS.InputSearch.placeholder)
    expect(wrapper.find('.am-input-search-cancel').text()).toBe(enUS.InputSearch.cancelText)
  })
})

describe('InputPassword', () => {
  it('toggles the visibility (uncontrolled) and emits update:iconVisible', async () => {
    const wrapper = mount(InputPassword, { props: { defaultValue: 'secret' } })
    const input = wrapper.find('input')
    expect(wrapper.classes()).toContain('am-input-password')
    expect(input.attributes('type')).toBe('password')
    const icon = wrapper.find('.am-input-password-icon')
    expect(icon.attributes('aria-pressed')).toBe('false')
    await icon.trigger('click')
    expect(input.attributes('type')).toBe('text')
    expect(wrapper.emitted('update:iconVisible')![0]).toEqual([true])
    expect(wrapper.find('.am-input-password-icon').attributes('aria-pressed')).toBe('true')
  })

  it('supports controlled iconVisible, visibilityToggle=false and disabled', async () => {
    const wrapper = mount(InputPassword, { props: { iconVisible: true } })
    expect(wrapper.find('input').attributes('type')).toBe('text')
    await wrapper.find('.am-input-password-icon').trigger('click')
    expect(wrapper.emitted('update:iconVisible')![0]).toEqual([false])
    expect(wrapper.find('input').attributes('type')).toBe('text')
    await wrapper.setProps({ iconVisible: false, disabled: true })
    await wrapper.find('.am-input-password-icon').trigger('click')
    expect(wrapper.emitted('update:iconVisible')).toHaveLength(1)
    await wrapper.setProps({ visibilityToggle: false })
    expect(wrapper.find('.am-input-password-icon').exists()).toBe(false)
  })

  it('iconRender slot wins over prop and value events are forwarded', async () => {
    const wrapper = mount(InputPassword, {
      props: { iconRender: ({ visible }: { visible: boolean }) => h('i', { class: `prop-${visible}` }) },
      slots: { iconRender: ({ visible }: { visible: boolean }) => h('i', { class: `slot-${visible}` }) },
    })
    expect(wrapper.find('.slot-false').exists()).toBe(true)
    expect(wrapper.find('.prop-false').exists()).toBe(false)
    await wrapper.find('input').setValue('abc')
    expect(wrapper.emitted('update:value')![0]).toEqual(['abc'])
    expect(wrapper.emitted('change')).toHaveLength(1)
    const byProp = mount(InputPassword, {
      props: { iconRender: ({ visible }: { visible: boolean }) => h('i', { class: `prop-${visible}` }) },
    })
    expect(byProp.find('.prop-false').exists()).toBe(true)
  })
})

describe('InputOTP', () => {
  it('renders cells driven by one native input ready for SMS autofill', () => {
    const wrapper = mount(InputOTP)
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-otp', 'am-otp-outlined']))
    expect(wrapper.findAll('.am-otp-cell')).toHaveLength(6)
    const inputs = wrapper.findAll('input')
    expect(inputs).toHaveLength(1)
    expect(inputs[0].attributes('autocomplete')).toBe('one-time-code')
    expect(inputs[0].attributes('inputmode')).toBe('numeric')
    expect(inputs[0].attributes('maxlength')).toBe('6')
    expect(InputOTP.name).toBe('AmInputOtp')
  })

  it('fills cells, emits input / update:value, and change only when complete', async () => {
    const wrapper = mount(InputOTP, { props: { length: 4 } })
    const input = wrapper.find('input')
    await input.setValue('12')
    expect(wrapper.findAll('.am-otp-cell').map(cell => cell.text())).toEqual(['1', '2', '', ''])
    expect(wrapper.emitted('update:value')![0]).toEqual(['12'])
    expect(wrapper.emitted('input')![0]).toEqual([['1', '2', '', '']])
    expect(wrapper.emitted('change')).toBeUndefined()
    await input.setValue('123456')
    expect(wrapper.emitted('change')![0]).toEqual(['1234'])
    expect(input.element.value).toBe('1234')
    expect(wrapper.findAll('.am-otp-cell-filled')).toHaveLength(4)
  })

  it('shows the caret on the active cell while focused', async () => {
    const wrapper = mount(InputOTP, { props: { length: 4, defaultValue: '1' } })
    expect(wrapper.find('.am-otp-caret').exists()).toBe(false)
    await wrapper.find('input').trigger('focus')
    const cells = wrapper.findAll('.am-otp-cell')
    expect(cells[1].classes()).toContain('am-otp-cell-active')
    expect(cells[1].find('.am-otp-caret').exists()).toBe(true)
    expect(wrapper.classes()).toContain('am-otp-focused')
    await wrapper.find('input').trigger('blur')
    expect(wrapper.find('.am-otp-cell-active').exists()).toBe(false)
  })

  it('formatter, mask, separator (prop / slot) and controlled value', async () => {
    const wrapper = mount(InputOTP, {
      props: { length: 4, value: 'ab', formatter: (v: string) => v.toUpperCase(), mask: '*', separator: (i: number) => `-${i}` },
    })
    expect(wrapper.findAll('.am-otp-cell-filled').map(cell => cell.text())).toEqual(['*', '*'])
    expect(wrapper.find('input').attributes('type')).toBe('password')
    expect(wrapper.findAll('.am-otp-separator').map(sep => sep.text())).toEqual(['-0', '-1', '-2'])
    await wrapper.find('input').setValue('abc')
    expect(wrapper.emitted('update:value')![0]).toEqual(['ABC'])
    await nextTick()
    // parent did not accept the change
    expect(wrapper.find('input').element.value).toBe('AB')

    const bySlot = mount(InputOTP, {
      props: { length: 3, separator: 'prop' },
      slots: { separator: ({ index }: { index: number }) => `slot${index}` },
    })
    expect(bySlot.findAll('.am-otp-separator').map(sep => sep.text())).toEqual(['slot0', 'slot1'])
  })

  it('size / variant / status / disabled and the FormItem contract', async () => {
    const ctx = formItemProvide()
    const wrapper = mount(InputOTP, {
      props: { size: 'large', variant: 'filled', disabled: true, rootClass: 'root-cls', classes: { cell: 'cell-cls' } },
      attrs: { class: 'custom' },
      global: { provide: ctx.provide },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-otp-lg', 'am-otp-filled', 'am-otp-disabled', 'am-otp-status-error', 'root-cls', 'custom']))
    expect(wrapper.find('.am-otp-cell').classes()).toContain('cell-cls')
    const input = wrapper.find('input')
    expect(input.attributes('id')).toBe('field_id')
    expect(input.attributes('disabled')).toBeDefined()
    await wrapper.setProps({ disabled: false })
    await input.setValue('1')
    await input.trigger('blur')
    expect(ctx.onFieldChange).toHaveBeenCalledTimes(1)
    expect(ctx.onFieldBlur).toHaveBeenCalledTimes(1)
  })
})
