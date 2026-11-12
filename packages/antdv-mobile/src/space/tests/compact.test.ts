import type { SpaceCompactProps } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Space, { SpaceAddon, SpaceCompact } from '..'
import Button from '../../button'
import ConfigProvider from '../../config-provider'
import Form from '../../form'
import Input, { InputSearch, TextArea } from '../../input'
import InputNumber from '../../input-number'
import Picker from '../../picker'
import Popup from '../../popup'

const options = [[{ label: 'A', value: 'a' }]]

describe('Space.Compact', () => {
  it('exposes Compact and Addon as statics and named exports', () => {
    expect(Space.Compact).toBe(SpaceCompact)
    expect(Space.Addon).toBe(SpaceAddon)
  })

  it('marks every item with its position in the group', () => {
    const wrapper = mount(SpaceCompact, {
      attrs: { 'class': 'custom', 'data-x': '1' },
      props: { rootClass: 'root-cls' },
      slots: {
        default: () => [
          h(SpaceAddon, null, () => '+86'),
          h(Input, { placeholder: 'phone' }),
          h(Picker, { columns: options }),
          h(InputNumber, { mode: 'input' }),
          h(Button, { type: 'primary' }, () => 'Send'),
        ],
      },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-space-compact', 'custom', 'root-cls']))
    expect(wrapper.attributes('data-x')).toBe('1')

    const addon = wrapper.find('.am-space-addon')
    expect(addon.classes()).toEqual(expect.arrayContaining(['am-compact-item', 'am-compact-first-item']))
    expect(addon.classes()).not.toContain('am-compact-last-item')

    for (const selector of ['.am-input', '.am-picker-trigger', '.am-input-number']) {
      const classes = wrapper.find(selector).classes()
      expect(classes).toContain('am-compact-item')
      expect(classes).not.toContain('am-compact-first-item')
      expect(classes).not.toContain('am-compact-last-item')
    }
    expect(wrapper.find('.am-button').classes()).toEqual(expect.arrayContaining(['am-compact-item', 'am-compact-last-item']))
  })

  it('ignores v-if placeholders and unwraps fragments', () => {
    const wrapper = mount(SpaceCompact, {
      slots: {
        default: () => [
          null,
          h(Button, null, () => 'A'),
          [h(Button, null, () => 'B'), h(Button, null, () => 'C')],
        ],
      },
    })
    const buttons = wrapper.findAll('.am-button')
    expect(buttons).toHaveLength(3)
    expect(buttons[0].classes()).toContain('am-compact-first-item')
    expect(buttons[2].classes()).toContain('am-compact-last-item')
    expect(buttons[1].classes()).not.toContain('am-compact-last-item')
  })

  it('a single child is both first and last', () => {
    const wrapper = mount(SpaceCompact, { slots: { default: () => h(Button, null, () => 'Only') } })
    expect(wrapper.find('.am-button').classes()).toEqual(expect.arrayContaining(['am-compact-first-item', 'am-compact-last-item']))
  })

  it('vertical orientation uses the vertical item classes', () => {
    const cases: SpaceCompactProps[] = [{ vertical: true }, { orientation: 'vertical' }, { direction: 'vertical' }]
    for (const props of cases) {
      const wrapper = mount(SpaceCompact, {
        props,
        slots: { default: () => [h(Button, null, () => 'A'), h(Button, null, () => 'B')] },
      })
      expect(wrapper.classes()).toContain('am-space-compact-vertical')
      const buttons = wrapper.findAll('.am-button')
      expect(buttons[0].classes()).toEqual(expect.arrayContaining(['am-compact-vertical-item', 'am-compact-vertical-first-item']))
      expect(buttons[1].classes()).toContain('am-compact-vertical-last-item')
      expect(buttons[0].classes()).not.toContain('am-compact-item')
    }
  })

  it('group size applies to items; an item size still wins; ConfigProvider is the fallback', () => {
    const wrapper = mount(SpaceCompact, {
      props: { size: 'large', block: true },
      slots: {
        default: () => [h(Input), h(Button, { size: 'small' }, () => 'S'), h(SpaceAddon, null, () => 'x')],
      },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-space-compact-lg', 'am-space-compact-block']))
    expect(wrapper.find('.am-input').classes()).toContain('am-input-lg')
    expect(wrapper.find('.am-button').classes()).toContain('am-button-sm')
    expect(wrapper.find('.am-space-addon').classes()).toContain('am-space-addon-lg')

    const provided = mount(ConfigProvider, {
      props: { componentSize: 'small' },
      slots: { default: () => h(SpaceCompact, null, () => [h(Input), h(Button, null, () => 'B')]) },
    })
    expect(provided.find('.am-space-compact').classes()).toContain('am-space-compact-sm')
    expect(provided.find('.am-button').classes()).toContain('am-button-sm')
  })

  it('a nested group continues the outer one', () => {
    const wrapper = mount(SpaceCompact, {
      slots: {
        default: () => [
          h(Button, { class: 'a' }, () => 'A'),
          h(SpaceCompact, null, () => [h(Button, { class: 'b' }, () => 'B'), h(Button, { class: 'c' }, () => 'C')]),
        ],
      },
    })
    expect(wrapper.find('.a').classes()).toContain('am-compact-first-item')
    expect(wrapper.find('.b').classes()).not.toContain('am-compact-first-item')
    expect(wrapper.find('.b').classes()).not.toContain('am-compact-last-item')
    expect(wrapper.find('.c').classes()).toContain('am-compact-last-item')
  })

  it('fields are outlined inside a group even in a borderless Form, unless a variant is set', () => {
    const wrapper = mount(Form, {
      slots: {
        default: () => [
          h(Input, { class: 'plain' }),
          h(SpaceCompact, null, () => [h(Input, { class: 'grouped' }), h(Input, { class: 'explicit', variant: 'filled' })]),
        ],
      },
    })
    expect(wrapper.find('.plain').classes()).toContain('am-input-borderless')
    expect(wrapper.find('.grouped').classes()).toContain('am-input-outlined')
    expect(wrapper.find('.explicit').classes()).toContain('am-input-filled')
  })

  it('content teleported from an item is not part of the group', () => {
    const wrapper = mount(SpaceCompact, {
      slots: {
        default: () => [
          h(Button, { class: 'inside' }, () => 'A'),
          h(Popup, { open: true }, () => h(Button, { class: 'in-popup' }, () => 'B')),
        ],
      },
    })
    expect(wrapper.find('.inside').classes()).toContain('am-compact-item')
    const inPopup = document.querySelector('.in-popup')!
    expect(inPopup.classList.contains('am-compact-item')).toBe(false)
    wrapper.unmount()
  })

  it('InputSearch joins as one item: bordered segment, its inner input is not an item', () => {
    const wrapper = mount(SpaceCompact, {
      props: { size: 'large' },
      slots: { default: () => [h(InputSearch, { class: 'search' }), h(Button, null, () => 'Go')] },
    })
    const search = wrapper.find('.am-input-search')
    expect(search.classes()).toEqual(expect.arrayContaining(['am-compact-item', 'am-compact-first-item', 'am-input-search-lg']))
    expect(search.classes()).not.toContain('am-input-search-round')
    const inner = wrapper.find('.am-input-search-input')
    expect(inner.classes()).toContain('am-input-outlined')
    expect(inner.classes().some(c => c.startsWith('am-compact'))).toBe(false)
    expect(wrapper.findAll('.am-compact-item')).toHaveLength(2)

    // explicit props still win
    const explicit = mount(SpaceCompact, { slots: { default: () => h(InputSearch, { variant: 'filled', round: true }) } })
    expect(explicit.find('.am-input-search').classes()).toContain('am-input-search-round')
    expect(explicit.find('.am-input-search-input').classes()).toContain('am-input-filled')
  })

  it('InputSearch keeps its filled, round look outside a group', () => {
    const wrapper = mount(InputSearch)
    expect(wrapper.classes()).toContain('am-input-search-round')
    expect(wrapper.find('.am-input-search-input').classes()).toContain('am-input-filled')
    expect(wrapper.classes().some(c => c.includes('compact'))).toBe(false)
  })

  it('TextArea joins a group and follows its size', () => {
    const wrapper = mount(SpaceCompact, {
      props: { vertical: true, size: 'small' },
      slots: { default: () => [h(Input), h(TextArea, { rows: 3 })] },
    })
    const textarea = wrapper.find('.am-textarea')
    expect(textarea.classes()).toEqual(expect.arrayContaining(['am-compact-vertical-item', 'am-compact-vertical-last-item', 'am-textarea-sm', 'am-textarea-outlined']))
    expect(mount(TextArea).classes().some(c => c.includes('compact'))).toBe(false)
  })

  it('components outside a group are untouched', () => {
    expect(mount(Button).classes().some(c => c.includes('compact'))).toBe(false)
    expect(mount(Input).classes().some(c => c.includes('compact'))).toBe(false)
  })
})

describe('Space.Addon', () => {
  it('renders content, variant, size, disabled and attrs', () => {
    const wrapper = mount(SpaceAddon, {
      props: { variant: 'filled', size: 'small', disabled: true, rootClass: 'r' },
      attrs: { 'class': 'custom', 'data-x': '1' },
      slots: { default: 'https://' },
    })
    expect(wrapper.text()).toBe('https://')
    expect(wrapper.classes()).toEqual(expect.arrayContaining([
      'am-space-addon',
      'am-space-addon-filled',
      'am-space-addon-sm',
      'am-space-addon-disabled',
      'r',
      'custom',
    ]))
    expect(wrapper.attributes('data-x')).toBe('1')
    expect(mount(SpaceAddon).classes()).toContain('am-space-addon-outlined')
  })
})
