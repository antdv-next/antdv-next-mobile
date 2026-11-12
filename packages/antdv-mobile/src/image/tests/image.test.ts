import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Image, { ImagePreviewGroup } from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'

const q = (selector: string) => document.body.querySelector<HTMLElement>(selector)
const qa = (selector: string) => Array.from(document.body.querySelectorAll<HTMLElement>(selector))

describe('Image', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders img with size, fit, radius and the default placeholder while loading', async () => {
    const wrapper = mount(Image, {
      props: { src: 'a.png', alt: 'alt text', width: 100, height: '5rem', fit: 'cover', position: 'top', radius: 8 },
    })
    expect(wrapper.classes()).toContain('am-image')
    expect(wrapper.attributes('style')).toContain('width: 100px')
    expect(wrapper.attributes('style')).toContain('height: 5rem')
    expect(wrapper.attributes('style')).toContain('border-radius: 8px')
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('a.png')
    expect(img.attributes('alt')).toBe('alt text')
    expect(img.attributes('style')).toContain('object-fit: cover')
    expect(img.attributes('style')).toContain('object-position: top')
    expect(wrapper.find('.am-image-placeholder .anticon').exists()).toBe(true)

    await img.trigger('load')
    expect(wrapper.emitted('load')).toHaveLength(1)
    expect(wrapper.find('.am-image-placeholder').exists()).toBe(false)
  })

  it('placeholder: false hides it, prop renders custom node, slot wins over prop', () => {
    expect(mount(Image, { props: { src: 'a.png', placeholder: false } }).find('.am-image-placeholder').exists()).toBe(false)
    const byProp = mount(Image, { props: { src: 'a.png', placeholder: () => h('i', { class: 'prop-holder' }) } })
    expect(byProp.find('.prop-holder').exists()).toBe(true)
    const bySlot = mount(Image, {
      props: { src: 'a.png', placeholder: () => h('i', { class: 'prop-holder' }) },
      slots: { placeholder: () => h('i', { class: 'slot-holder' }) },
    })
    expect(bySlot.find('.slot-holder').exists()).toBe(true)
    expect(bySlot.find('.prop-holder').exists()).toBe(false)
  })

  it('shows the localized error state and emits error', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(Image, { src: 'broken.png' }) },
    })
    await wrapper.find('img').trigger('error')
    const image = wrapper.findComponent(Image)
    expect(image.emitted('error')).toHaveLength(1)
    expect(image.classes()).toContain('am-image-error')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.am-image-placeholder-text').text()).toBe(enUS.Image.loadFailed)
  })

  it('falls back to the fallback image, then to the fallback slot', async () => {
    const wrapper = mount(Image, {
      props: { src: 'broken.png', fallback: 'fallback.png' },
      slots: { fallback: () => h('i', { class: 'custom-error' }) },
    })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').attributes('src')).toBe('fallback.png')
    expect(wrapper.emitted('error')).toHaveLength(1)
    await wrapper.find('img').trigger('load')
    expect(wrapper.emitted('load')).toBeUndefined()

    await wrapper.setProps({ src: 'broken-2.png' })
    expect(wrapper.find('img').attributes('src')).toBe('broken-2.png')
    await wrapper.find('img').trigger('error')
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('.custom-error').exists()).toBe(true)
    expect(wrapper.emitted('error')).toHaveLength(2)
  })

  it('lazy loads when the image enters the viewport', async () => {
    let callback: (entries: any[]) => void = () => {}
    const disconnect = vi.fn()
    vi.stubGlobal('IntersectionObserver', class {
      constructor(cb: any) {
        callback = cb
      }

      observe() {}
      disconnect = disconnect
    })
    const wrapper = mount(Image, { props: { src: 'a.png', lazy: true } })
    await nextTick()
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.am-image-placeholder').exists()).toBe(true)
    callback([{ isIntersecting: false }])
    await nextTick()
    expect(wrapper.find('img').exists()).toBe(false)
    callback([{ isIntersecting: true }])
    await nextTick()
    expect(wrapper.find('img').attributes('src')).toBe('a.png')
    expect(disconnect).toHaveBeenCalled()
  })

  it('passes attrs, round, rootClass, classes and styles', () => {
    const wrapper = mount(Image, {
      props: { src: 'a.png', round: true, rootClass: 'root-cls', classes: { image: 'img-cls', placeholder: 'ph-cls' }, styles: { image: { opacity: 0.5 } } },
      attrs: { 'class': 'custom', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'am-image-round']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(wrapper.find('img').classes()).toContain('img-cls')
    expect(wrapper.find('img').attributes('style')).toContain('opacity: 0.5')
    expect(wrapper.find('.am-image-placeholder').classes()).toContain('ph-cls')
  })

  it('does not preview by default, emits click', async () => {
    const wrapper = mount(Image, { props: { src: 'a.png' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(wrapper.classes()).not.toContain('am-image-previewable')
    expect(q('.am-image-preview')).toBeNull()
  })

  it('preview opens the viewer on tap and emits openChange', async () => {
    const wrapper = mount(Image, { props: { src: 'thumb.png', preview: { src: 'origin.png', closable: true, maxScale: 5 } } })
    expect(wrapper.classes()).toContain('am-image-previewable')
    await wrapper.trigger('click')
    expect(wrapper.emitted('openChange')![0]).toEqual([true])
    expect(q('.am-image-preview-img')!.getAttribute('src')).toBe('origin.png')
    expect(q('.am-image-preview-index')).toBeNull()
    q('.am-image-preview-close')!.click()
    await nextTick()
    expect(wrapper.emitted('openChange')![1]).toEqual([false])
  })

  it('preview.open controls the viewer', async () => {
    const wrapper = mount(Image, { props: { src: 'a.png', preview: { open: true } } })
    await nextTick()
    expect(q('.am-image-preview')).not.toBeNull()
    await wrapper.setProps({ preview: { open: false } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('openChange')![0]).toEqual([true])
  })
})

describe('ImagePreviewGroup', () => {
  it('is exposed as Image.PreviewGroup', () => {
    expect(Image.PreviewGroup).toBe(ImagePreviewGroup)
  })

  it('collects child images and opens the tapped one', async () => {
    const wrapper = mount(ImagePreviewGroup, {
      slots: {
        default: () => [
          h(Image, { src: 'a.png' }),
          h(Image, { src: 'b.png', preview: false }),
          h(Image, { src: 'c-thumb.png', preview: { src: 'c.png' } }),
        ],
      },
    })
    await nextTick()
    const images = wrapper.findAll('.am-image')
    expect(images[0].classes()).toContain('am-image-previewable')
    expect(images[1].classes()).not.toContain('am-image-previewable')

    await images[1].trigger('click')
    expect(q('.am-image-preview')).toBeNull()

    await images[2].trigger('click')
    expect(wrapper.emitted('change')![0]).toEqual([1, 0])
    expect(wrapper.emitted('openChange')![0]).toEqual([true, { current: 1 }])
    expect(qa('.am-image-preview-img').map(el => el.getAttribute('src'))).toEqual(['a.png', 'c.png'])
    expect(q('.am-image-preview-index')!.textContent!.trim()).toBe('2 / 2')
  })

  it('uses items when provided and supports controlled preview', async () => {
    const wrapper = mount(ImagePreviewGroup, {
      props: { items: ['1.png', { src: '2.png', alt: 'two' }, '3.png'], preview: { current: 2, showIndex: false } },
      slots: { default: () => h(Image, { src: '1.png' }) },
    })
    await nextTick()
    await wrapper.find('.am-image').trigger('click')
    expect(wrapper.emitted('change')![0]).toEqual([0, 2])
    expect(wrapper.emitted('openChange')![0]).toEqual([true, { current: 0 }])
    expect(qa('.am-image-preview-img')).toHaveLength(3)
    expect(q('.am-image-preview-index')).toBeNull()

    await wrapper.setProps({ preview: { open: false } })
    expect(q('.am-image-preview:not(.am-fade-leave-active)')).toBeNull()
  })

  it('preview={false} disables the preview of every child and provides the fallback', async () => {
    const wrapper = mount(ImagePreviewGroup, {
      props: { preview: false, fallback: 'group-fallback.png' },
      slots: { default: () => h(Image, { src: 'a.png' }) },
    })
    await nextTick()
    await wrapper.find('.am-image').trigger('click')
    expect(q('.am-image-preview')).toBeNull()
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').attributes('src')).toBe('group-fallback.png')
  })

  it('unregisters removed images', async () => {
    const wrapper = mount({
      components: { ImagePreviewGroup, Image },
      data: () => ({ list: ['a.png', 'b.png', 'c.png'] }),
      template: `<ImagePreviewGroup><Image v-for="src in list" :key="src" :src="src" /></ImagePreviewGroup>`,
    })
    await nextTick()
    await wrapper.setData({ list: ['a.png', 'c.png'] })
    await wrapper.findAll('.am-image')[1].trigger('click')
    expect(qa('.am-image-preview-img').map(el => el.getAttribute('src'))).toEqual(['a.png', 'c.png'])
  })
})
