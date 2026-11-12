import type { BarrageItem } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, shallowReactive, shallowRef } from 'vue'
import Barrage from '..'
import ConfigProvider from '../../config-provider'

function items(...ids: number[]): BarrageItem[] {
  return ids.map(id => ({ id, text: `Text ${id}` }))
}

function trackVar(el: Element, name: string) {
  return (el as HTMLElement).style.getPropertyValue(name)
}

describe('Barrage', () => {
  it('renders the default slot, the wrapper and one bullet per item', () => {
    const wrapper = mount(Barrage, {
      props: { defaultValue: items(1, 2) },
      slots: { default: () => h('video', { class: 'media' }) },
    })
    expect(wrapper.classes()).toContain('am-barrage')
    expect(wrapper.classes()).not.toContain('am-barrage-paused')
    expect(wrapper.find('.media').exists()).toBe(true)
    expect(trackVar(wrapper.find('.am-barrage-wrapper').element, '--am-barrage-offset')).toBe('10px')
    const bullets = wrapper.findAll('.am-barrage-item')
    expect(bullets.map(b => b.text())).toEqual(['Text 1', 'Text 2'])
  })

  it('renders nothing but the wrapper without items', () => {
    const wrapper = mount(Barrage)
    expect(wrapper.find('.am-barrage-wrapper').exists()).toBe(true)
    expect(wrapper.find('.am-barrage-track').exists()).toBe(false)
  })

  it('distributes bullets round-robin over `rows` and staggers them by `delay`', () => {
    const wrapper = mount(Barrage, {
      props: { defaultValue: items(1, 2, 3, 4, 5), rows: 2, delay: 100, duration: 2000, top: 20 },
    })
    const tracks = wrapper.findAll('.am-barrage-track').map(t => t.element)
    expect(tracks.map(t => trackVar(t, '--am-barrage-row'))).toEqual(['0', '1', '0', '1', '0'])
    expect(tracks.map(t => trackVar(t, '--am-barrage-delay'))).toEqual(['100ms', '200ms', '300ms', '400ms', '500ms'])
    expect(trackVar(tracks[0], '--am-barrage-duration')).toBe('2000ms')
    expect(trackVar(wrapper.find('.am-barrage-wrapper').element, '--am-barrage-offset')).toBe('20px')
  })

  it('falls back to one row for an invalid `rows`', () => {
    const wrapper = mount(Barrage, { props: { defaultValue: items(1, 2), rows: 0 } })
    expect(wrapper.findAll('.am-barrage-track').map(t => trackVar(t.element, '--am-barrage-row'))).toEqual(['0', '0'])
  })

  it('controlled: removes a finished bullet and emits update:value / change / finish', async () => {
    const list = items(1, 2)
    const wrapper = mount(Barrage, {
      props: {
        'value': list,
        'onUpdate:value': (value: BarrageItem[]) => wrapper.setProps({ value }),
      },
    })
    await wrapper.findAll('.am-barrage-item')[0].trigger('animationend')
    expect(wrapper.emitted('finish')![0]).toEqual([list[0]])
    expect(wrapper.emitted('update:value')![0]).toEqual([[list[1]]])
    expect(wrapper.emitted('change')![0]).toEqual([[list[1]]])
    expect(wrapper.findAll('.am-barrage-item').map(b => b.text())).toEqual(['Text 2'])
  })

  it('controlled without an update: a finished bullet is not rendered or replayed', async () => {
    const wrapper = mount(Barrage, { props: { value: items(1, 2) } })
    await wrapper.findAll('.am-barrage-item')[0].trigger('animationend')
    expect(wrapper.findAll('.am-barrage-item').map(b => b.text())).toEqual(['Text 2'])
    // a new array that still contains id 1 must not replay it
    await wrapper.setProps({ value: items(1, 2, 3) })
    expect(wrapper.findAll('.am-barrage-item').map(b => b.text())).toEqual(['Text 2', 'Text 3'])
    expect(wrapper.emitted('finish')).toHaveLength(1)
  })

  it('uncontrolled: keeps its own list', async () => {
    const wrapper = mount(Barrage, { props: { defaultValue: items(1, 2) } })
    await wrapper.findAll('.am-barrage-item')[1].trigger('animationend')
    expect(wrapper.findAll('.am-barrage-item').map(b => b.text())).toEqual(['Text 1'])
    expect(wrapper.emitted('change')![0]).toEqual([items(1)])
    await wrapper.find('.am-barrage-item').trigger('animationend')
    expect(wrapper.find('.am-barrage-track').exists()).toBe(false)
    expect(wrapper.emitted('change')![1]).toEqual([[]])
  })

  it('ignores animationend bubbling from the bullet content', async () => {
    const wrapper = mount(Barrage, {
      props: { defaultValue: items(1) },
      slots: { item: () => h('i', { class: 'inner' }) },
    })
    await wrapper.find('.inner').trigger('animationend')
    expect(wrapper.emitted('finish')).toBeUndefined()
    expect(wrapper.find('.am-barrage-item').exists()).toBe(true)
  })

  it('appended items fly without touching the ones in flight', async () => {
    const wrapper = mount(Barrage, { props: { value: items(1, 2), rows: 3, delay: 100 } })
    const first = wrapper.findAll('.am-barrage-track').map(t => t.element)
    await wrapper.setProps({ value: [...items(1, 2), ...items(3, 4)] })
    const tracks = wrapper.findAll('.am-barrage-track').map(t => t.element)
    expect(tracks).toHaveLength(4)
    // same DOM nodes, same track data
    expect(tracks[0]).toBe(first[0])
    expect(tracks[1]).toBe(first[1])
    expect(tracks.map(t => trackVar(t, '--am-barrage-row'))).toEqual(['0', '1', '2', '0'])
    // an appended batch starts right away
    expect(tracks.map(t => trackVar(t, '--am-barrage-delay'))).toEqual(['100ms', '200ms', '0ms', '100ms'])
  })

  it('picks up in-place mutations of a reactive list', async () => {
    const list = shallowRef(shallowReactive(items(1)))
    const wrapper = mount({
      setup: () => () => h(Barrage, { 'value': list.value, 'onUpdate:value': (v: BarrageItem[]) => (list.value = v) }),
    })
    list.value.push({ id: 2, text: 'Text 2' })
    await nextTick()
    expect(wrapper.findAll('.am-barrage-item').map(b => b.text())).toEqual(['Text 1', 'Text 2'])
    await wrapper.findAll('.am-barrage-item')[0].trigger('animationend')
    expect(list.value.map(i => i.id)).toEqual([2])
  })

  it('removes a bullet in flight when its item leaves the list', async () => {
    const wrapper = mount(Barrage, { props: { value: items(1, 2) } })
    await wrapper.setProps({ value: items(2) })
    expect(wrapper.findAll('.am-barrage-item').map(b => b.text())).toEqual(['Text 2'])
    expect(wrapper.emitted('finish')).toBeUndefined()
    expect(wrapper.emitted('update:value')).toBeUndefined()
  })

  it('autoPlay / play() / pause() toggle the paused state', async () => {
    const wrapper = mount(Barrage, { props: { defaultValue: items(1), autoPlay: false } })
    expect(wrapper.classes()).toContain('am-barrage-paused')
    // bullets are rendered (parked outside by the animation fill mode) and wait for play()
    expect(wrapper.find('.am-barrage-item').exists()).toBe(true)
    wrapper.vm.play()
    await nextTick()
    expect(wrapper.classes()).not.toContain('am-barrage-paused')
    wrapper.vm.pause()
    await nextTick()
    expect(wrapper.classes()).toContain('am-barrage-paused')
  })

  it('pauses while the page is hidden', async () => {
    const wrapper = mount(Barrage, { props: { defaultValue: items(1) } })
    const spy = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
    document.dispatchEvent(new Event('visibilitychange'))
    await nextTick()
    expect(wrapper.classes()).toContain('am-barrage-paused')
    spy.mockReturnValue('visible')
    document.dispatchEvent(new Event('visibilitychange'))
    await nextTick()
    expect(wrapper.classes()).not.toContain('am-barrage-paused')
    spy.mockRestore()
  })

  it('passes attrs / rootClass / classes / styles and item class / style', () => {
    const wrapper = mount(Barrage, {
      props: {
        defaultValue: [{ id: 1, text: 'A', class: 'mine', style: { color: 'red' } }],
        rootClass: 'root-a',
        classes: { root: 'root-b', item: 'item-a' },
        styles: { root: { height: '100px' }, item: { opacity: '0.5' } },
      },
      attrs: { 'class': 'from-attrs', 'data-id': 'x', 'style': 'width: 200px' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-barrage', 'root-a', 'root-b', 'from-attrs']))
    expect(wrapper.attributes('data-id')).toBe('x')
    const root = wrapper.element as HTMLElement
    expect(root.style.height).toBe('100px')
    expect(root.style.width).toBe('200px')
    const item = wrapper.find('.am-barrage-item')
    expect(item.classes()).toEqual(expect.arrayContaining(['item-a', 'mine']))
    expect((item.element as HTMLElement).style.opacity).toBe('0.5')
    expect((item.element as HTMLElement).style.color).toBe('red')
  })

  it('renders VueNode text and lets the item slot win', () => {
    const list: BarrageItem[] = [{ id: 1, text: () => h('b', 'Bold') }]
    const node = mount(Barrage, { props: { defaultValue: list } })
    expect(node.find('.am-barrage-item b').text()).toBe('Bold')

    const slot = mount(Barrage, {
      props: { defaultValue: list },
      slots: { item: ({ item }: { item: BarrageItem }) => h('em', `#${item.id}`) },
    })
    expect(slot.find('.am-barrage-item em').text()).toBe('#1')
    expect(slot.find('.am-barrage-item b').exists()).toBe(false)
  })

  it('works inside an rtl ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: { default: () => h(Barrage, { defaultValue: items(1) }) },
    })
    expect(wrapper.find('[dir="rtl"] .am-barrage-item').exists()).toBe(true)
  })
})
