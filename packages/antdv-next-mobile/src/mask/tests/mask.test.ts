import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Mask from '..'

describe('Mask', () => {
  it('renders lazily and toggles visibility', async () => {
    const wrapper = mount(Mask, { props: { open: false }, slots: { default: 'content' } })
    expect(wrapper.find('.am-mask').exists()).toBe(false)
    await wrapper.setProps({ open: true })
    expect(wrapper.find('.am-mask').exists()).toBe(true)
    expect(wrapper.text()).toBe('content')
  })

  it('emits click and closes when closable', async () => {
    const wrapper = mount(Mask, { props: { open: true, closable: true } })
    await wrapper.find('.am-mask').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(wrapper.emitted('update:open')![0]).toEqual([false])
  })

  it('locks body scroll while open', async () => {
    const wrapper = mount(Mask, { props: { open: true } })
    expect(document.body.classList.contains('am-overflow-hidden')).toBe(true)
    await wrapper.setProps({ open: false })
    expect(document.body.classList.contains('am-overflow-hidden')).toBe(false)
  })
})
