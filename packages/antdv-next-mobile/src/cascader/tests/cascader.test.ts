import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { computed, h, nextTick, reactive } from 'vue'
import Cascader, { CascaderView } from '..'
import ConfigProvider from '../../config-provider'
import { formItemInputContextKey } from '../../form/context'
import enUS from '../../locale/en_US'

const options = [
  {
    label: '浙江',
    value: 'zj',
    children: [
      { label: '杭州', value: 'hz', children: [{ label: '西湖', value: 'xh' }, { label: '余杭', value: 'yh' }] },
      { label: '宁波', value: 'nb', disabled: true },
    ],
  },
  { label: '江苏', value: 'js', children: [{ label: '南京', value: 'nj' }] },
  { label: '海南', value: 'hn' },
]

const tabsOf = (root: ParentNode = document) => [...root.querySelectorAll('.am-cascader-view-tab')].map(el => el.textContent!.trim())
const optionsOf = (root: ParentNode = document) => [...root.querySelectorAll('.am-cascader-view-option')].map(el => el.textContent!.trim())
function clickOption(text: string, root: ParentNode = document) {
  const el = [...root.querySelectorAll<HTMLElement>('.am-cascader-view-option')].find(item => item.textContent!.trim() === text)!
  el.click()
  return nextTick()
}

describe('CascaderView', () => {
  it('renders a placeholder tab and the first level', () => {
    const wrapper = mount(CascaderView, { props: { options } })
    expect(wrapper.classes()).toContain('am-cascader-view')
    expect(tabsOf(wrapper.element)).toEqual(['请选择'])
    expect(wrapper.find('.am-cascader-view-tab').classes()).toEqual(expect.arrayContaining(['am-cascader-view-tab-active', 'am-cascader-view-tab-placeholder']))
    expect(optionsOf(wrapper.element)).toEqual(['浙江', '江苏', '海南'])
  })

  it('advances level by level and emits change only on a leaf', async () => {
    const wrapper = mount(CascaderView, { props: { options } })
    await clickOption('浙江', wrapper.element)
    expect(tabsOf(wrapper.element)).toEqual(['浙江', '请选择'])
    expect(optionsOf(wrapper.element)).toEqual(['杭州', '宁波'])
    expect(wrapper.emitted('tabChange')![0]).toEqual([1])
    expect(wrapper.emitted('change')).toBeUndefined()
    await clickOption('杭州', wrapper.element)
    await clickOption('余杭', wrapper.element)
    expect(wrapper.emitted('update:value')![0]).toEqual([['zj', 'hz', 'yh']])
    const [value, selected] = wrapper.emitted('change')![0] as any
    expect(value).toEqual(['zj', 'hz', 'yh'])
    expect(selected.map((option: any) => option.label)).toEqual(['浙江', '杭州', '余杭'])
    expect(wrapper.emitted('finish')![0][0]).toEqual(['zj', 'hz', 'yh'])
    expect(wrapper.find('.am-cascader-view-option-selected').text()).toBe('余杭')
    expect(wrapper.emitted('select')).toHaveLength(3)
  })

  it('shows the path of a controlled value and lets tabs go back', async () => {
    const wrapper = mount(CascaderView, { props: { options, value: ['zj', 'hz', 'xh'] } })
    expect(tabsOf(wrapper.element)).toEqual(['浙江', '杭州', '西湖'])
    expect(wrapper.find('.am-cascader-view-option-selected').text()).toBe('西湖')
    await wrapper.findAll('.am-cascader-view-tab')[0].trigger('click')
    expect(optionsOf(wrapper.element)).toEqual(['浙江', '江苏', '海南'])
    expect(wrapper.find('.am-cascader-view-option-selected').text()).toBe('浙江')
    // picking another branch drops the deeper levels
    await clickOption('江苏', wrapper.element)
    expect(tabsOf(wrapper.element)).toEqual(['江苏', '请选择'])
    await wrapper.setProps({ value: ['hn'] })
    expect(tabsOf(wrapper.element)).toEqual(['海南'])
  })

  it('changeOnSelect emits on every level', async () => {
    const wrapper = mount(CascaderView, { props: { options, changeOnSelect: true } })
    await clickOption('浙江', wrapper.element)
    expect(wrapper.emitted('change')![0][0]).toEqual(['zj'])
    expect(wrapper.emitted('finish')).toBeUndefined()
    await clickOption('杭州', wrapper.element)
    expect(wrapper.emitted('change')![1][0]).toEqual(['zj', 'hz'])
  })

  it('ignores disabled options', async () => {
    const wrapper = mount(CascaderView, { props: { options, defaultValue: ['zj'] } })
    expect(wrapper.findAll('.am-cascader-view-option')[1].classes()).toContain('am-cascader-view-option-disabled')
    await clickOption('宁波', wrapper.element)
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('supports fieldNames', async () => {
    const wrapper = mount(CascaderView, {
      props: {
        options: [{ name: 'A', code: 1, items: [{ name: 'A-1', code: 11 }] }],
        fieldNames: { label: 'name', value: 'code', children: 'items' },
      },
    })
    await clickOption('A', wrapper.element)
    await clickOption('A-1', wrapper.element)
    expect(wrapper.emitted('change')![0][0]).toEqual([1, 11])
  })

  it('lazy loads children with a promise and shows the loading state', async () => {
    const data = reactive<any[]>([{ label: '广东', value: 'gd', isLeaf: false }])
    let resolve!: () => void
    const loadData = vi.fn((selected: any[]) => new Promise<void>((done) => {
      resolve = () => {
        selected[selected.length - 1].children = [{ label: '深圳', value: 'sz' }]
        done()
      }
    }))
    const wrapper = mount(CascaderView, { props: { options: data, loadData } })
    await clickOption('广东', wrapper.element)
    expect(loadData).toHaveBeenCalledTimes(1)
    expect(loadData.mock.calls[0][0].map((option: any) => option.value)).toEqual(['gd'])
    expect(wrapper.find('.am-cascader-view-option .am-spin-icon').exists()).toBe(true)
    expect(wrapper.emitted('change')).toBeUndefined()
    // taps are ignored while loading
    await clickOption('广东', wrapper.element)
    expect(loadData).toHaveBeenCalledTimes(1)
    resolve()
    await nextTick()
    await nextTick()
    expect(wrapper.find('.am-spin-icon').exists()).toBe(false)
    expect(tabsOf(wrapper.element)).toEqual(['广东', '请选择'])
    expect(optionsOf(wrapper.element)).toEqual(['深圳'])
    await clickOption('深圳', wrapper.element)
    expect(wrapper.emitted('change')![0][0]).toEqual(['gd', 'sz'])
  })

  it('lazy loads PC-style (no promise, children assigned later) and treats empty results as a leaf', async () => {
    const data = reactive<any[]>([{ label: '广东', value: 'gd', isLeaf: false }, { label: '澳门', value: 'mo', isLeaf: false }])
    const wrapper = mount(CascaderView, { props: { options: data, loadData: () => {} } })
    await clickOption('广东', wrapper.element)
    expect(wrapper.find('.am-spin-icon').exists()).toBe(true)
    data[0].children = [{ label: '深圳', value: 'sz' }]
    await nextTick()
    await nextTick()
    expect(optionsOf(wrapper.element)).toEqual(['深圳'])

    await wrapper.findAll('.am-cascader-view-tab')[0].trigger('click')
    await clickOption('澳门', wrapper.element)
    data[1].isLeaf = true
    await nextTick()
    await nextTick()
    expect(wrapper.emitted('change')![0][0]).toEqual(['mo'])
    expect(wrapper.emitted('finish')![0][0]).toEqual(['mo'])
  })

  it('option slot wins over optionRender; empty content', () => {
    const optionRender = ({ option }: any) => h('i', { class: 'by-prop' }, option.label)
    const byProp = mount(CascaderView, { props: { options, optionRender } })
    expect(byProp.findAll('.by-prop')).toHaveLength(3)
    const bySlot = mount(CascaderView, { props: { options, optionRender }, slots: { option: ({ option }: any) => h('b', { class: 'by-slot' }, option.label) } })
    expect(bySlot.find('.by-prop').exists()).toBe(false)
    expect(bySlot.findAll('.by-slot')).toHaveLength(3)
    const empty = mount(CascaderView, { props: { options: [] } })
    expect(empty.find('.am-cascader-view-empty').text()).toBe('暂无数据')
    const custom = mount(CascaderView, { props: { options: [], notFoundContent: 'nothing' } })
    expect(custom.find('.am-cascader-view-empty').text()).toBe('nothing')
  })

  it('passes attrs, rootClass and classes', () => {
    const wrapper = mount(CascaderView, {
      props: { options, rootClass: 'root-cls', classes: { tab: 'tab-cls', option: 'option-cls', list: 'list-cls' } },
      attrs: { class: 'custom', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['root-cls', 'custom']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('.am-cascader-view-tab').classes()).toContain('tab-cls')
    expect(wrapper.find('.am-cascader-view-option').classes()).toContain('option-cls')
    expect(wrapper.find('.am-cascader-view-list').classes()).toContain('list-cls')
  })
})

describe('Cascader', () => {
  it('renders the trigger and auto-confirms on a leaf', async () => {
    const wrapper = mount(Cascader, { props: { options, title: '选择地区' } })
    const trigger = wrapper.find('.am-picker-trigger')
    expect(trigger.classes()).toContain('am-cascader')
    expect(trigger.text()).toBe('请选择')
    await trigger.trigger('click')
    const popup = document.querySelector('.am-picker-popup')!
    expect(popup.closest('.am-popup-root')!.parentElement).toBe(document.body)
    expect(document.querySelector('.am-picker-popup-title')!.textContent).toBe('选择地区')
    // no confirm button: a leaf completes the selection
    expect(document.querySelector('.am-picker-popup-confirm')).toBeNull()
    await clickOption('浙江')
    await clickOption('杭州')
    expect(wrapper.emitted('change')).toBeUndefined()
    await clickOption('西湖')
    expect(wrapper.emitted('update:value')![0]).toEqual([['zj', 'hz', 'xh']])
    const [value, selected] = wrapper.emitted('change')![0] as any
    expect(value).toEqual(['zj', 'hz', 'xh'])
    expect(selected.map((option: any) => option.label)).toEqual(['浙江', '杭州', '西湖'])
    expect(wrapper.emitted('confirm')![0][0]).toEqual(['zj', 'hz', 'xh'])
    expect(wrapper.emitted('update:open')!.slice(-1)[0]).toEqual([false])
    expect(wrapper.emitted('tabChange')).toHaveLength(2)
    expect(wrapper.find('.am-picker-trigger').text()).toBe('浙江 / 杭州 / 西湖')
  })

  it('cancel keeps the value and resets the browsed path', async () => {
    const wrapper = mount(Cascader, { props: { options, defaultValue: ['js', 'nj'] } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    expect(tabsOf()).toEqual(['江苏', '南京'])
    document.querySelectorAll<HTMLElement>('.am-cascader-view-tab')[0].click()
    await nextTick()
    await clickOption('浙江')
    document.querySelector<HTMLElement>('.am-picker-popup-cancel')!.click()
    await nextTick()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.find('.am-picker-trigger').text()).toBe('江苏 / 南京')
    await wrapper.find('.am-picker-trigger').trigger('click')
    expect(tabsOf()).toEqual(['江苏', '南京'])
  })

  it('changeOnSelect needs an explicit confirm', async () => {
    const wrapper = mount(Cascader, { props: { options, changeOnSelect: true } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    const confirm = document.querySelector<HTMLButtonElement>('.am-picker-popup-confirm')!
    expect(confirm.disabled).toBe(true)
    await clickOption('浙江')
    expect(confirm.disabled).toBe(false)
    expect(wrapper.emitted('change')).toBeUndefined()
    confirm.click()
    await nextTick()
    expect(wrapper.emitted('change')![0][0]).toEqual(['zj'])
    expect(wrapper.emitted('confirm')![0][0]).toEqual(['zj'])
    expect(wrapper.find('.am-picker-trigger').text()).toBe('浙江')
  })

  it('works controlled and with displayRender (slot wins)', async () => {
    const displayRender = (labels: string[]) => labels.join('-')
    const wrapper = mount(Cascader, { props: { options, value: ['zj', 'hz', 'xh'], displayRender } })
    expect(wrapper.find('.am-picker-trigger').text()).toBe('浙江-杭州-西湖')
    await wrapper.find('.am-picker-trigger').trigger('click')
    await clickOption('余杭')
    expect(wrapper.emitted('update:value')![0]).toEqual([['zj', 'hz', 'yh']])
    expect(wrapper.find('.am-picker-trigger').text()).toBe('浙江-杭州-西湖')
    await wrapper.setProps({ value: ['zj', 'hz', 'yh'] })
    expect(wrapper.find('.am-picker-trigger').text()).toBe('浙江-杭州-余杭')

    const bySlot = mount(Cascader, {
      props: { options, value: ['hn'], displayRender },
      slots: { displayRender: ({ labels }: any) => h('b', { class: 'by-slot' }, labels[0]) },
    })
    expect(bySlot.find('.by-slot').text()).toBe('海南')
  })

  it('falls back to raw values for options that are not loaded', () => {
    const wrapper = mount(Cascader, { props: { options: [], value: ['a', 'b'] } })
    expect(wrapper.find('.am-picker-trigger').text()).toBe('a / b')
  })

  it('lazy loads inside the popup', async () => {
    const data = reactive<any[]>([{ label: '广东', value: 'gd', isLeaf: false }])
    const loadData = (selected: any[]) => Promise.resolve().then(() => {
      selected[0].children = [{ label: '深圳', value: 'sz' }]
    })
    const wrapper = mount(Cascader, { props: { options: data, loadData } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    await clickOption('广东')
    expect(document.querySelector('.am-cascader-view-option .am-spin-icon')).not.toBeNull()
    await nextTick()
    await nextTick()
    await nextTick()
    expect(optionsOf()).toEqual(['深圳'])
    await clickOption('深圳')
    expect(wrapper.emitted('change')![0][0]).toEqual(['gd', 'sz'])
    expect(wrapper.find('.am-picker-trigger').text()).toBe('广东 / 深圳')
  })

  it('clears, respects disabled, default slot and trigger=false', async () => {
    const wrapper = mount(Cascader, { props: { options, defaultValue: ['hn'], allowClear: true } })
    await wrapper.find('.am-picker-trigger-clear').trigger('click')
    expect(wrapper.emitted('change')![0]).toEqual([[], []])
    expect(wrapper.emitted('clear')).toHaveLength(1)

    const disabled = mount(Cascader, { props: { options, disabled: true } })
    await disabled.find('.am-picker-trigger').trigger('click')
    expect(disabled.emitted('update:open')).toBeUndefined()

    const custom = mount(Cascader, {
      props: { options, defaultValue: ['hn'] },
      slots: { default: ({ label, toggle }: any) => h('button', { class: 'custom', onClick: () => toggle() }, label) },
    })
    expect(custom.find('.custom').text()).toBe('海南')
    await custom.find('.custom').trigger('click')
    expect(custom.emitted('update:open')![0]).toEqual([true])

    const hidden = mount(Cascader, { props: { options, trigger: false, open: true } })
    await nextTick()
    expect(hidden.find('.am-picker-trigger').exists()).toBe(false)
    expect(document.querySelectorAll('.am-cascader-view').length).toBeGreaterThan(0)
  })

  it('exposes Cascader.View, follows locale and notifies the form item', async () => {
    expect(Cascader.View).toBe(CascaderView)
    const onFieldChange = vi.fn()
    const onFieldBlur = vi.fn()
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(Cascader, { options }) },
      global: {
        provide: {
          [formItemInputContextKey as symbol]: {
            status: computed(() => 'error'),
            id: computed(() => 'area'),
            onFieldChange,
            onFieldBlur,
            isFormItemInput: true,
          },
        },
      },
    })
    const trigger = wrapper.find('.am-picker-trigger')
    expect(trigger.text()).toBe('Please select')
    expect(trigger.classes()).toContain('am-picker-trigger-status-error')
    expect(trigger.attributes('id')).toBe('area')
    await trigger.trigger('click')
    expect(tabsOf()).toEqual(['Select'])
    await clickOption('海南')
    await nextTick()
    expect(onFieldChange).toHaveBeenCalledTimes(1)
    expect(onFieldBlur).toHaveBeenCalledTimes(1)
  })
})

describe('Cascader virtual', () => {
  const cities = Array.from({ length: 3000 }, (_, i) => ({ label: `City ${i}`, value: `c${i}`, children: [{ label: `Area ${i}-a`, value: `a${i}` }] }))
  const big = [{ label: 'Province', value: 'p', children: cities }, { label: 'Other', value: 'o' }]
  const listOf = (root: ParentNode = document) => root.querySelector<HTMLElement>('.am-cascader-view-list')!

  it('mounts only a window of a 3,000-option level', async () => {
    const wrapper = mount(CascaderView, { props: { options: big } })
    expect(listOf(wrapper.element).classList.contains('am-virtual-list')).toBe(true)
    expect(listOf(wrapper.element).getAttribute('role')).toBe('listbox')
    await clickOption('Province', wrapper.element)
    await nextTick()
    const rendered = optionsOf(wrapper.element)
    expect(rendered.length).toBeGreaterThan(5)
    expect(rendered.length).toBeLessThan(30)
    expect(rendered[0]).toBe('City 0')
    expect(wrapper.find('.am-virtual-list-holder').attributes('style')).toContain(`height: ${3000 * 48}px`)

    const list = listOf(wrapper.element)
    list.scrollTop = 48 * 2000
    await wrapper.find('.am-cascader-view-list').trigger('scroll')
    expect(optionsOf(wrapper.element)).toContain('City 2000')
    expect(optionsOf(wrapper.element)).not.toContain('City 0')
    await clickOption('City 2001', wrapper.element)
    await clickOption('Area 2001-a', wrapper.element)
    expect(wrapper.emitted('change')![0][0]).toEqual(['p', 'c2001', 'a2001'])
  })

  it('scrolls the selected option of a level into view when its tab is activated', async () => {
    const wrapper = mount(CascaderView, { props: { options: big, defaultValue: ['p', 'c2500', 'a2500'] } })
    await nextTick()
    await nextTick()
    expect(optionsOf(wrapper.element)).toEqual(['Area 2500-a'])
    await wrapper.findAll('.am-cascader-view-tab')[1].trigger('click')
    await nextTick()
    await nextTick()
    await nextTick()
    // jsdom has no layout (viewport 0): the centre of the row is at the top
    expect(listOf(wrapper.element).scrollTop).toBe(48 * 2500 + 24)
    expect(wrapper.find('.am-cascader-view-option-selected').text()).toBe('City 2500')
    expect(optionsOf(wrapper.element).length).toBeLessThan(30)
    // a level without a selection starts at the top
    await clickOption('City 2501', wrapper.element)
    await nextTick()
    expect(listOf(wrapper.element).scrollTop).toBe(0)
  })

  it('virtual: false renders every option; listHeight / listItemHeight size the list', async () => {
    const wrapper = mount(CascaderView, { props: { options: big, defaultValue: ['p'], virtual: false, listHeight: 240, listItemHeight: 40 } })
    await nextTick()
    expect(optionsOf(wrapper.element)).toHaveLength(3000)
    expect(wrapper.attributes('style')).toContain('--am-cascader-view-option-height: 40px')
    expect(wrapper.attributes('style')).toContain('height: auto')
    expect(listOf(wrapper.element).style.height).toBe('240px')
    expect(wrapper.find('.am-virtual-list-item').attributes('style')).toContain('height: 40px')
  })

  it('popup: passes the virtual props and re-centres the selection on open', async () => {
    const wrapper = mount(Cascader, { props: { options: big, defaultValue: ['p', 'c1200'], changeOnSelect: true, listItemHeight: 50 } })
    await wrapper.find('.am-picker-trigger').trigger('click')
    await nextTick()
    await nextTick()
    await nextTick()
    // last reachable level: the areas of City 1200
    expect(optionsOf()).toEqual(['Area 1200-a'])
    ;(document.querySelectorAll('.am-cascader-view-tab')[1] as HTMLElement).click()
    await nextTick()
    await nextTick()
    await nextTick()
    expect(listOf().scrollTop).toBe(50 * 1200 + 25)
    expect(document.querySelectorAll('.am-cascader-view-option').length).toBeLessThan(30)
  })
})
