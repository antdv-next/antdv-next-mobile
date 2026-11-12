import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Tag, { CheckableTag } from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'

describe('Tag', () => {
  it('renders default slot and base classes', () => {
    const wrapper = mount(Tag, { slots: { default: 'Tag' } })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-tag', 'am-tag-filled']))
    expect(wrapper.classes()).not.toContain('am-tag-has-color')
    expect(wrapper.find('.am-tag-content').text()).toBe('Tag')
    expect(wrapper.find('.am-tag-close-icon').exists()).toBe(false)
  })

  it('supports preset, status and custom colors', () => {
    const preset = mount(Tag, { props: { color: 'magenta' } })
    expect(preset.classes()).toEqual(expect.arrayContaining(['am-tag-magenta', 'am-tag-has-color']))
    const status = mount(Tag, { props: { color: 'success' } })
    expect(status.classes()).toEqual(expect.arrayContaining(['am-tag-success', 'am-tag-has-color']))
    const normal = mount(Tag, { props: { color: 'default' } })
    expect(normal.classes()).not.toContain('am-tag-has-color')
    const custom = mount(Tag, { props: { color: '#f50' } })
    expect(custom.classes()).toContain('am-tag-has-color')
    expect((custom.element as HTMLElement).style.getPropertyValue('--am-tag-c')).toBe('#f50')
  })

  it('supports variant, bordered, size and round', () => {
    const wrapper = mount(Tag, { props: { variant: 'solid', bordered: false, size: 'large', round: true } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-tag-solid', 'am-tag-borderless', 'am-tag-lg', 'am-tag-round']))
    expect(mount(Tag, { props: { variant: 'outlined', size: 'small' } }).classes()).toEqual(expect.arrayContaining(['am-tag-outlined', 'am-tag-sm']))
  })

  it('closable: emits close and hides itself', async () => {
    const wrapper = mount(Tag, { props: { closable: true }, slots: { default: 'Tag' } })
    const close = wrapper.find('.am-tag-close-icon')
    expect(close.attributes('aria-label')).toBe('关闭')
    await close.trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.find('.am-tag').exists()).toBe(false)
  })

  it('closable: preventDefault keeps the tag and click does not bubble', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Tag, {
      props: { closable: true },
      attrs: { onClick, onClose: (e: MouseEvent) => e.preventDefault() },
      slots: { default: 'Tag' },
    })
    await wrapper.find('.am-tag-close-icon').trigger('click')
    expect(wrapper.find('.am-tag').exists()).toBe(true)
    expect(onClick).not.toHaveBeenCalled()
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('closeIcon: prop implies closable, config and slot priority', () => {
    const byProp = mount(Tag, { props: { closeIcon: () => h('i', { class: 'prop-close' }) } })
    expect(byProp.find('.am-tag-close-icon .prop-close').exists()).toBe(true)
    const byConfig = mount(Tag, {
      props: { closable: { closeIcon: () => h('i', { class: 'config-close' }), ariaLabel: 'remove' }, closeIcon: () => h('i', { class: 'prop-close' }) },
    })
    expect(byConfig.find('.config-close').exists()).toBe(true)
    expect(byConfig.find('.am-tag-close-icon').attributes('aria-label')).toBe('remove')
    const bySlot = mount(Tag, {
      props: { closable: true, closeIcon: () => h('i', { class: 'prop-close' }) },
      slots: { closeIcon: () => h('i', { class: 'slot-close' }) },
    })
    expect(bySlot.find('.slot-close').exists()).toBe(true)
    expect(bySlot.find('.prop-close').exists()).toBe(false)
    const off = mount(Tag, { props: { closable: false, closeIcon: () => h('i') } })
    expect(off.find('.am-tag-close-icon').exists()).toBe(false)
  })

  it('icon slot takes priority over icon prop', () => {
    const byProp = mount(Tag, { props: { icon: () => h('i', { class: 'prop-icon' }) } })
    expect(byProp.find('.am-tag-icon .prop-icon').exists()).toBe(true)
    const bySlot = mount(Tag, {
      props: { icon: () => h('i', { class: 'prop-icon' }) },
      slots: { icon: () => h('i', { class: 'slot-icon' }) },
    })
    expect(bySlot.find('.slot-icon').exists()).toBe(true)
    expect(bySlot.find('.prop-icon').exists()).toBe(false)
  })

  it('renders anchor when href is set', () => {
    const wrapper = mount(Tag, { props: { href: 'https://antdv-next.com', target: '_blank' } })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://antdv-next.com')
    expect(wrapper.attributes('target')).toBe('_blank')
    const disabled = mount(Tag, { props: { href: 'https://antdv-next.com', disabled: true } })
    expect(disabled.attributes('href')).toBeUndefined()
  })

  it('disabled: blocks click and close', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Tag, { props: { disabled: true, closable: true }, attrs: { onClick }, slots: { default: 'Tag' } })
    expect(wrapper.classes()).toContain('am-tag-disabled')
    await wrapper.trigger('click')
    await wrapper.find('.am-tag-close-icon').trigger('click')
    expect(onClick).not.toHaveBeenCalled()
    expect(wrapper.emitted('close')).toBeUndefined()
    expect(wrapper.find('.am-tag').exists()).toBe(true)
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Tag, {
      props: {
        closable: true,
        icon: 'i',
        rootClass: 'root-cls',
        classes: { root: 'r', icon: 'icon-cls', content: 'content-cls', close: 'close-cls' },
        styles: { root: { margin: '1px' }, content: { color: 'red' } },
      },
      attrs: { 'class': 'custom', 'style': 'padding: 2px', 'data-id': 'x' },
      slots: { default: 'Tag' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r']))
    expect(wrapper.attributes('style')).toContain('margin: 1px')
    expect(wrapper.attributes('style')).toContain('padding: 2px')
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-tag-icon').classes()).toContain('icon-cls')
    expect(wrapper.find('.am-tag-content').classes()).toContain('content-cls')
    expect(wrapper.find('.am-tag-content').attributes('style')).toContain('color: red')
    expect(wrapper.find('.am-tag-close-icon').classes()).toContain('close-cls')
  })

  it('follows ConfigProvider size / disabled / locale', () => {
    const wrapper = mount(ConfigProvider, {
      props: { componentSize: 'small', componentDisabled: true, locale: enUS },
      slots: { default: () => h(Tag, { closable: true }, () => 'Tag') },
    })
    expect(wrapper.find('.am-tag').classes()).toEqual(expect.arrayContaining(['am-tag-sm', 'am-tag-disabled']))
    expect(wrapper.find('.am-tag-close-icon').attributes('aria-label')).toBe(enUS.common.close)
  })
})

describe('CheckableTag', () => {
  it('is exposed as Tag.CheckableTag', () => {
    expect(Tag.CheckableTag).toBe(CheckableTag)
  })

  it('works uncontrolled with defaultChecked', async () => {
    const wrapper = mount(CheckableTag, { props: { defaultChecked: true }, slots: { default: 'Tag' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-tag', 'am-tag-checkable', 'am-tag-checkable-checked']))
    expect(wrapper.attributes('aria-checked')).toBe('true')
    await wrapper.trigger('click')
    expect(wrapper.classes()).not.toContain('am-tag-checkable-checked')
    expect(wrapper.emitted('update:checked')![0]).toEqual([false])
    expect(wrapper.emitted('change')![0]).toEqual([false])
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('works controlled', async () => {
    const wrapper = mount(CheckableTag, { props: { checked: false }, slots: { default: 'Tag' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:checked')![0]).toEqual([true])
    expect(wrapper.classes()).not.toContain('am-tag-checkable-checked')
    await wrapper.setProps({ checked: true })
    expect(wrapper.classes()).toContain('am-tag-checkable-checked')
  })

  it('toggles with keyboard', async () => {
    const wrapper = mount(CheckableTag, { slots: { default: 'Tag' } })
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.classes()).toContain('am-tag-checkable-checked')
    await wrapper.trigger('keydown', { key: 'a' })
    expect(wrapper.classes()).toContain('am-tag-checkable-checked')
  })

  it('does not toggle when disabled (prop or ConfigProvider)', async () => {
    const wrapper = mount(CheckableTag, { props: { disabled: true }, slots: { default: 'Tag' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.classes()).toContain('am-tag-checkable-disabled')
    const provider = mount(ConfigProvider, {
      props: { componentDisabled: true },
      slots: { default: () => h(CheckableTag, null, () => 'Tag') },
    })
    expect(provider.find('.am-tag').classes()).toContain('am-tag-checkable-disabled')
  })

  it('supports icon slot priority, size, round, attrs and rootClass', () => {
    const wrapper = mount(CheckableTag, {
      props: { icon: () => h('i', { class: 'prop-icon' }), size: 'small', round: true, rootClass: 'root-cls' },
      attrs: { 'class': 'custom', 'data-id': 'x' },
      slots: { default: 'Tag', icon: () => h('i', { class: 'slot-icon' }) },
    })
    expect(wrapper.find('.slot-icon').exists()).toBe(true)
    expect(wrapper.find('.prop-icon').exists()).toBe(false)
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'am-tag-sm', 'am-tag-round']))
    expect(wrapper.attributes('data-id')).toBe('x')
  })
})
