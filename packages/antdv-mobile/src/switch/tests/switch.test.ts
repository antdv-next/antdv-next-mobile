import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { computed, h } from 'vue'
import Switch from '..'
import ConfigProvider from '../../config-provider'
import { disabledContextKey } from '../../config-provider/context'
import { formItemInputContextKey } from '../../form/context'

describe('Switch', () => {
  it('renders a switch button with base classes', () => {
    const wrapper = mount(Switch)
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.attributes('role')).toBe('switch')
    expect(wrapper.attributes('aria-checked')).toBe('false')
    expect(wrapper.classes()).toContain('am-switch')
    expect(wrapper.classes()).not.toContain('am-switch-checked')
    expect(wrapper.find('.am-switch-handle').exists()).toBe(true)
    expect(wrapper.find('.am-switch-inner').exists()).toBe(false)
    expect(Switch.name).toBe('AmSwitch')
  })

  it('toggles when uncontrolled and emits change(checked, event) / click', async () => {
    const wrapper = mount(Switch, { props: { defaultChecked: true } })
    expect(wrapper.classes()).toContain('am-switch-checked')
    await wrapper.trigger('click')
    expect(wrapper.classes()).not.toContain('am-switch-checked')
    expect(wrapper.attributes('aria-checked')).toBe('false')
    const [checked, event] = wrapper.emitted('change')![0]
    expect(checked).toBe(false)
    expect(event).toBeInstanceOf(MouseEvent)
    expect(wrapper.emitted('click')![0][0]).toBe(false)
    expect(wrapper.emitted('update:checked')![0]).toEqual([false])
    expect(wrapper.emitted('update:value')![0]).toEqual([false])
  })

  it('stays controlled until the parent updates `checked`', async () => {
    const wrapper = mount(Switch, { props: { checked: false } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:checked')![0]).toEqual([true])
    expect(wrapper.classes()).not.toContain('am-switch-checked')
    await wrapper.setProps({ checked: true })
    expect(wrapper.classes()).toContain('am-switch-checked')
  })

  it('supports the value / defaultValue aliases', async () => {
    expect(mount(Switch, { props: { defaultValue: true } }).classes()).toContain('am-switch-checked')
    const wrapper = mount(Switch, { props: { value: true } })
    expect(wrapper.classes()).toContain('am-switch-checked')
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:value')![0]).toEqual([false])
    expect(wrapper.classes()).toContain('am-switch-checked')
  })

  it('supports checkedValue / unCheckedValue', async () => {
    const wrapper = mount(Switch, { props: { defaultChecked: 'on', checkedValue: 'on', unCheckedValue: 'off' } })
    expect(wrapper.classes()).toContain('am-switch-checked')
    await wrapper.trigger('click')
    expect(wrapper.emitted('change')![0][0]).toBe('off')
    await wrapper.trigger('click')
    expect(wrapper.emitted('change')![1][0]).toBe('on')
  })

  it('does not toggle when disabled or loading', async () => {
    const wrapper = mount(Switch, { props: { disabled: true } })
    expect(wrapper.classes()).toContain('am-switch-disabled')
    expect(wrapper.attributes('disabled')).toBeDefined()
    await wrapper.trigger('click')
    await wrapper.setProps({ disabled: false, loading: true })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-switch-loading', 'am-switch-disabled']))
    expect(wrapper.find('.am-switch-loading-icon').exists()).toBe(true)
    expect(wrapper.attributes('aria-busy')).toBe('true')
    await wrapper.trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('renders checkedChildren / unCheckedChildren, slots win over props', () => {
    const byProp = mount(Switch, { props: { checkedChildren: 'ON', unCheckedChildren: () => h('i', { class: 'off' }, 'OFF') } })
    expect(byProp.find('.am-switch-inner-checked').text()).toBe('ON')
    expect(byProp.find('.am-switch-inner-unchecked .off').text()).toBe('OFF')
    const bySlot = mount(Switch, {
      props: { checkedChildren: 'prop' },
      slots: { checkedChildren: () => 'slot' },
    })
    expect(bySlot.find('.am-switch-inner-checked').text()).toBe('slot')
  })

  it('supports size and ConfigProvider componentSize / componentDisabled', () => {
    expect(mount(Switch, { props: { size: 'small' } }).classes()).toContain('am-switch-small')
    expect(mount(Switch, { props: { size: 'default' } }).classes()).not.toContain('am-switch-small')
    const wrapper = mount(ConfigProvider, {
      props: { componentSize: 'small', componentDisabled: true },
      slots: { default: () => h(Switch) },
    })
    expect(wrapper.find('.am-switch').classes()).toEqual(expect.arrayContaining(['am-switch-small', 'am-switch-disabled']))
    const byForm = mount(Switch, { global: { provide: { [disabledContextKey as symbol]: computed(() => true) } } })
    expect(byForm.classes()).toContain('am-switch-disabled')
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Switch, {
      props: {
        rootClass: 'root-cls',
        classes: { root: 'sem-root', indicator: 'sem-indicator', content: 'sem-content' },
        styles: { indicator: { color: 'red' } },
        checkedChildren: '1',
        id: 'sw',
      },
      attrs: { 'class': 'custom', 'style': 'margin: 1px', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'sem-root']))
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.attributes('id')).toBe('sw')
    expect(wrapper.find('.am-switch-handle').classes()).toContain('sem-indicator')
    expect(wrapper.find('.am-switch-handle').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-switch-inner').classes()).toContain('sem-content')
  })

  it('beforeChange: sync false cancels, sync true / void applies', async () => {
    const reject = mount(Switch, { props: { beforeChange: () => false } })
    await reject.trigger('click')
    expect(reject.emitted('change')).toBeUndefined()
    expect(reject.emitted('click')).toHaveLength(1)
    const beforeChange = vi.fn()
    const accept = mount(Switch, { props: { beforeChange } })
    await accept.trigger('click')
    expect(beforeChange).toHaveBeenCalledWith(true)
    expect(accept.emitted('change')![0][0]).toBe(true)
    const thrown = mount(Switch, {
      props: {
        beforeChange: () => {
          throw new Error('no')
        },
      },
    })
    await thrown.trigger('click')
    expect(thrown.emitted('change')).toBeUndefined()
  })

  it('beforeChange: shows loading while the promise is pending', async () => {
    let resolve!: (v?: boolean) => void
    const wrapper = mount(Switch, { props: { beforeChange: () => new Promise<boolean | void>(r => (resolve = r)) } })
    await wrapper.trigger('click')
    expect(wrapper.classes()).toContain('am-switch-loading')
    expect(wrapper.classes()).not.toContain('am-switch-checked')
    // clicks are ignored while pending
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    resolve()
    await flushPromises()
    expect(wrapper.classes()).not.toContain('am-switch-loading')
    expect(wrapper.classes()).toContain('am-switch-checked')
    expect(wrapper.emitted('change')![0][0]).toBe(true)
  })

  it('beforeChange: a rejected or false promise cancels the change', async () => {
    const rejected = mount(Switch, { props: { beforeChange: () => Promise.reject(new Error('no')) } })
    await rejected.trigger('click')
    await flushPromises()
    expect(rejected.emitted('change')).toBeUndefined()
    expect(rejected.classes()).not.toContain('am-switch-loading')
    const falsy = mount(Switch, { props: { beforeChange: () => Promise.resolve(false) } })
    await falsy.trigger('click')
    await flushPromises()
    expect(falsy.emitted('change')).toBeUndefined()
  })

  it('reports to the FormItem context, takes its id and exposes focus / blur', async () => {
    const onFieldChange = vi.fn()
    const onFieldBlur = vi.fn()
    const wrapper = mount(Switch, {
      attachTo: document.body,
      global: {
        provide: {
          [formItemInputContextKey as symbol]: {
            status: computed(() => ''),
            id: computed(() => 'form_enabled'),
            onFieldChange,
            onFieldBlur,
            isFormItemInput: true,
          },
        },
      },
    })
    expect(wrapper.attributes('id')).toBe('form_enabled')
    await wrapper.trigger('click')
    expect(onFieldChange).toHaveBeenCalledTimes(1)
    ;(wrapper.vm as any).focus()
    expect(document.activeElement).toBe(wrapper.element)
    ;(wrapper.vm as any).blur()
    expect(onFieldBlur).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect((wrapper.vm as any).nativeElement).toBe(wrapper.element)
  })
})
