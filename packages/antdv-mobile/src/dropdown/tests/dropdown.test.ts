import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Dropdown, { DropdownItem } from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'
import zhCN from '../../locale/zh_CN'

const wait = (ms = 80) => new Promise(resolve => setTimeout(resolve, ms))

function touchStart() {
  const event = new Event('touchstart', { bubbles: true })
  ;(event as any).touches = [{ clientX: 0, clientY: 0 }]
  return event
}

const options = [
  { label: 'Default', value: 'default' },
  { label: 'Newest', value: 'new' },
  { label: 'Disabled', value: 'disabled', disabled: true },
]

function mountDropdown(props: Record<string, any> = {}, itemProps: Record<string, any> = {}) {
  return mount(Dropdown, {
    props: { getContainer: false, ...props },
    slots: {
      default: () => [
        h(DropdownItem, { key: 'sort', title: 'Sort', options, ...itemProps }),
        h(DropdownItem, { key: 'filter', title: 'Filter', showFooter: true }, { default: () => h('div', { class: 'custom-panel' }, 'custom') }),
        h(DropdownItem, { key: 'more', title: 'More', disabled: true }),
      ],
    },
    attachTo: document.body,
  })
}

describe('Dropdown', () => {
  it('exposes Item as a static', () => {
    expect(Dropdown.Item).toBe(DropdownItem)
  })

  it('renders the bar from its items, collapsed by default', async () => {
    const wrapper = mountDropdown()
    await nextTick()
    expect(wrapper.classes()).toContain('am-dropdown')
    const navItems = wrapper.findAll('.am-dropdown-nav-item')
    expect(navItems.map(i => i.text())).toEqual(['Sort', 'Filter', 'More'])
    expect(navItems[2].classes()).toContain('am-dropdown-nav-item-disabled')
    expect(wrapper.find('.am-dropdown-layer').exists()).toBe(false)
    expect(wrapper.classes()).not.toContain('am-dropdown-open')
  })

  it('expands / collapses on bar click (uncontrolled) and emits change', async () => {
    const wrapper = mountDropdown()
    await nextTick()
    const navItems = wrapper.findAll('.am-dropdown-nav-item')
    await navItems[0].trigger('click')
    expect(wrapper.emitted('change')![0]).toEqual(['sort'])
    expect(wrapper.emitted('update:activeKey')![0]).toEqual(['sort'])
    expect(navItems[0].classes()).toContain('am-dropdown-nav-item-active')
    expect(wrapper.classes()).toContain('am-dropdown-open')
    expect(wrapper.findAll('.am-dropdown-layer')).toHaveLength(1)
    expect(wrapper.findAll('.am-dropdown-option')).toHaveLength(3)

    // switching to another item
    await navItems[1].trigger('click')
    expect(wrapper.emitted('change')![1]).toEqual(['filter'])
    expect(wrapper.find('.custom-panel').exists()).toBe(true)

    // disabled items are ignored
    await navItems[2].trigger('click')
    expect(wrapper.emitted('change')).toHaveLength(2)

    await navItems[1].trigger('click')
    expect(wrapper.emitted('change')![2]).toEqual([null])
    expect(wrapper.classes()).not.toContain('am-dropdown-open')
  })

  it('is controlled by activeKey', async () => {
    const wrapper = mountDropdown({ activeKey: 'sort' })
    await nextTick()
    expect(wrapper.find('.am-dropdown-nav-item').classes()).toContain('am-dropdown-nav-item-active')
    await wrapper.find('.am-dropdown-mask').trigger('click')
    expect(wrapper.emitted('update:activeKey')![0]).toEqual([null])
    // still open until the parent updates the prop
    expect(wrapper.find('.am-dropdown-nav-item').classes()).toContain('am-dropdown-nav-item-active')
    await wrapper.setProps({ activeKey: null })
    expect(wrapper.find('.am-dropdown-nav-item').classes()).not.toContain('am-dropdown-nav-item-active')
  })

  it('selects an option, updates the value and closes', async () => {
    const wrapper = mountDropdown({ defaultActiveKey: 'sort' }, { title: undefined, defaultValue: 'default' })
    await nextTick()
    // without a title the selected label is shown in the bar
    expect(wrapper.find('.am-dropdown-nav-item').text()).toBe('Default')
    const item = wrapper.findComponent(DropdownItem)
    const opts = wrapper.findAll('.am-dropdown-option')
    expect(opts[0].classes()).toContain('am-dropdown-option-active')
    expect(opts[0].find('.am-dropdown-option-check').exists()).toBe(true)

    await opts[2].trigger('click')
    expect(item.emitted('change')).toBeUndefined()

    await opts[1].trigger('click')
    expect(item.emitted('update:value')![0]).toEqual(['new'])
    expect(item.emitted('change')![0]).toEqual(['new', options[1]])
    expect(wrapper.emitted('change')![0]).toEqual([null])
    expect(wrapper.find('.am-dropdown-nav-item').text()).toBe('Newest')
  })

  it('supports v-model:value and closeOnSelect=false', async () => {
    const value = ref('default')
    const Comp = defineComponent({
      setup() {
        return () => h(Dropdown, { getContainer: false, defaultActiveKey: 'sort' }, {
          default: () => h(DropdownItem, {
            'key': 'sort',
            options,
            'closeOnSelect': false,
            'value': value.value,
            'onUpdate:value': (v: any) => (value.value = v),
          }),
        })
      },
    })
    const wrapper = mount(Comp, { attachTo: document.body })
    await nextTick()
    await wrapper.findAll('.am-dropdown-option')[1].trigger('click')
    expect(value.value).toBe('new')
    expect(wrapper.findAll('.am-dropdown-option')[1].classes()).toContain('am-dropdown-option-active')
    expect(wrapper.find('.am-dropdown').classes()).toContain('am-dropdown-open')
  })

  it('renders the footer with locale texts and emits reset / confirm', async () => {
    const wrapper = mountDropdown({ defaultActiveKey: 'filter' })
    await nextTick()
    const item = wrapper.findAllComponents(DropdownItem)[1]
    const buttons = wrapper.findAll('.am-dropdown-footer-button')
    expect(buttons.map(b => b.text())).toEqual([zhCN.Dropdown.reset, zhCN.Dropdown.confirm])
    await buttons[0].trigger('click')
    expect(item.emitted('reset')).toHaveLength(1)
    expect(wrapper.emitted('change')).toBeUndefined()
    await buttons[1].trigger('click')
    expect(item.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('change')![0]).toEqual([null])
  })

  it('respects closeOnMaskClick and closeOnClickAway', async () => {
    const wrapper = mountDropdown({ defaultActiveKey: 'sort', closeOnMaskClick: false, closeOnClickAway: false })
    await nextTick()
    await wrapper.find('.am-dropdown-mask').trigger('click')
    document.body.dispatchEvent(touchStart())
    expect(wrapper.emitted('change')).toBeUndefined()

    await wrapper.setProps({ closeOnClickAway: true })
    // touches inside the bar or the panel are not "away"
    wrapper.find('.am-dropdown-panel').element.dispatchEvent(touchStart())
    wrapper.find('.am-dropdown-nav').element.dispatchEvent(touchStart())
    expect(wrapper.emitted('change')).toBeUndefined()
    document.body.dispatchEvent(touchStart())
    expect(wrapper.emitted('change')![0]).toEqual([null])
  })

  it('exposes close()', async () => {
    const wrapper = mountDropdown({ defaultActiveKey: 'sort' })
    await nextTick()
    ;(wrapper.vm as any).close()
    await nextTick()
    expect(wrapper.emitted('change')![0]).toEqual([null])
  })

  it('positions the layer below the bar and teleports it to body by default', async () => {
    const wrapper = mountDropdown({ getContainer: undefined })
    await nextTick()
    const nav = wrapper.find('.am-dropdown-nav').element as HTMLElement
    nav.getBoundingClientRect = () => ({ left: 10, top: 50, width: 300, height: 44, right: 310, bottom: 94, x: 10, y: 50, toJSON() {} })
    await wrapper.find('.am-dropdown-nav-item').trigger('click')
    const layer = document.body.querySelector<HTMLElement>(':scope > .am-dropdown-layer')!
    expect(layer).not.toBeNull()
    expect(layer.style.top).toBe('94px')
    expect(layer.style.left).toBe('10px')
    expect(layer.style.width).toBe('300px')
    expect(document.body.classList.contains('am-overflow-hidden')).toBe(true)
  })

  it('highlight, forceRender, destroyOnHidden and item slots', async () => {
    const wrapper = mount(Dropdown, {
      props: { getContainer: false },
      slots: {
        default: () => [
          h(DropdownItem, { key: 'a', title: 'prop', highlight: true, forceRender: true, options }, {
            title: () => 'slot title',
            arrowIcon: () => h('i', { class: 'item-arrow' }),
          }),
          h(DropdownItem, { key: 'b', title: 'B', destroyOnHidden: true, options }),
        ],
        arrowIcon: () => h('i', { class: 'bar-arrow' }),
      },
      attachTo: document.body,
    })
    await nextTick()
    const navItems = wrapper.findAll('.am-dropdown-nav-item')
    expect(navItems[0].text()).toBe('slot title')
    expect(navItems[0].classes()).toContain('am-dropdown-nav-item-highlight')
    expect(navItems[0].find('.item-arrow').exists()).toBe(true)
    expect(navItems[1].find('.bar-arrow').exists()).toBe(true)
    // forceRender
    expect(wrapper.findAll('.am-dropdown-layer')).toHaveLength(1)

    await navItems[1].trigger('click')
    expect(wrapper.findAll('.am-dropdown-layer')).toHaveLength(2)
    await navItems[1].trigger('click')
    await wait()
    expect(wrapper.findAll('.am-dropdown-layer')).toHaveLength(1)
    const itemB = wrapper.findAllComponents(DropdownItem)[1]
    expect(itemB.emitted('afterOpenChange')!.slice(-1)[0]).toEqual([false])
  })

  it('passes attrs, rootClass, classes and styles', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        getContainer: false,
        defaultActiveKey: 'a',
        rootClass: 'root-cls',
        classes: { nav: 'n', item: 'i', title: 't' },
        styles: { nav: { height: '50px' } },
      },
      attrs: { 'class': 'custom', 'data-id': 'x' },
      slots: {
        default: () => h(DropdownItem, {
          'key': 'a',
          'title': 'A',
          options,
          'rootClass': 'item-root',
          'classes': { panel: 'p', option: 'o', mask: 'm' },
          'data-layer': 'y',
        }),
      },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-dropdown-nav').classes()).toContain('n')
    expect(wrapper.find('.am-dropdown-nav').attributes('style')).toContain('height: 50px')
    expect(wrapper.find('.am-dropdown-nav-item').classes()).toContain('i')
    expect(wrapper.find('.am-dropdown-nav-title').classes()).toContain('t')
    const layer = wrapper.find('.am-dropdown-layer')
    expect(layer.classes()).toContain('item-root')
    expect(layer.attributes('data-layer')).toBe('y')
    expect(wrapper.find('.am-dropdown-panel').classes()).toContain('p')
    expect(wrapper.find('.am-dropdown-option').classes()).toContain('o')
    expect(wrapper.find('.am-dropdown-mask').classes()).toContain('m')
  })

  it('uses the locale and theme of ConfigProvider', async () => {
    mount(ConfigProvider, {
      props: { locale: enUS, theme: { algorithm: 'dark' } },
      slots: {
        default: () => h(Dropdown, { defaultActiveKey: 'a' }, {
          default: () => h(DropdownItem, { key: 'a', title: 'A', showFooter: true }, { default: () => 'x' }),
        }),
      },
      attachTo: document.body,
    })
    await nextTick()
    const layer = document.body.querySelector(':scope > .am-dropdown-layer')!
    expect(layer.classList.contains('am-theme-dark')).toBe(true)
    expect(Array.from(layer.querySelectorAll('.am-dropdown-footer-button')).map(b => b.textContent!.trim())).toEqual([
      enUS.Dropdown.reset,
      enUS.Dropdown.confirm,
    ])
  })
})
