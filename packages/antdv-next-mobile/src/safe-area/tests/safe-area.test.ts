import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SafeArea from '..'

describe('SafeArea', () => {
  it('reserves the bottom inset by default', () => {
    const wrapper = mount(SafeArea)
    expect(wrapper.classes()).toEqual(['am-safe-area', 'am-safe-area-position-bottom'])
  })

  it('supports position top', async () => {
    const wrapper = mount(SafeArea, { props: { position: 'top' } })
    expect(wrapper.classes()).toContain('am-safe-area-position-top')
    await wrapper.setProps({ position: 'bottom' })
    expect(wrapper.classes()).toContain('am-safe-area-position-bottom')
    expect(wrapper.classes()).not.toContain('am-safe-area-position-top')
  })

  it('renders default slot', () => {
    const wrapper = mount(SafeArea, { slots: { default: '<button>ok</button>' } })
    expect(wrapper.find('button').text()).toBe('ok')
  })

  it('passes attrs and rootClass', () => {
    const wrapper = mount(SafeArea, {
      props: { rootClass: 'root-cls' },
      attrs: { 'class': 'custom', 'style': 'background: red', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('style')).toContain('background: red')
    expect(wrapper.attributes('data-id')).toBe('x')
  })
})
