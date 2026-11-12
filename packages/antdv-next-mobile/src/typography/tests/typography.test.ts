import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Typography, { TypographyParagraph, TypographyText, TypographyTitle } from '..'
import ConfigProvider from '../../config-provider'
import enUS from '../../locale/en_US'

/** jsdom has no layout: fake an overflowing (or fitting) ellipsis content box. */
function mockOverflow(overflow = true) {
  const isContent = (el: Element) => el.classList.contains('am-typography-ellipsis-content')
  vi.spyOn(Element.prototype, 'scrollHeight', 'get').mockImplementation(function (this: Element) {
    return isContent(this) ? (overflow ? 200 : 44) : 0
  })
  vi.spyOn(Element.prototype, 'clientHeight', 'get').mockImplementation(function (this: Element) {
    return isContent(this) ? 44 : 0
  })
  vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockImplementation(function (this: Element) {
    return isContent(this) ? (overflow ? 600 : 300) : 0
  })
  vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(function (this: Element) {
    return isContent(this) ? 300 : 0
  })
}

describe('Typography', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('renders the container and static sub components', () => {
    const wrapper = mount(Typography, {
      props: { rootClass: 'root-cls' },
      attrs: { 'class': 'custom', 'data-id': 'x' },
      slots: { default: 'content' },
    })
    expect(wrapper.element.tagName).toBe('ARTICLE')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-typography', 'root-cls', 'custom']))
    expect(wrapper.attributes('data-id')).toBe('x')
    expect(mount(Typography, { props: { component: 'section' } }).element.tagName).toBe('SECTION')
    expect(Typography.Text).toBe(TypographyText)
    expect(Typography.Title).toBe(TypographyTitle)
    expect(Typography.Paragraph).toBe(TypographyParagraph)
  })

  it('renders Text / Paragraph / Title with the right elements', () => {
    const text = mount(TypographyText, { slots: { default: 'text' } })
    expect(text.element.tagName).toBe('SPAN')
    expect(text.classes()).toEqual(expect.arrayContaining(['am-typography', 'am-typography-text']))
    expect(text.text()).toBe('text')

    const paragraph = mount(TypographyParagraph, { slots: { default: 'paragraph' } })
    expect(paragraph.element.tagName).toBe('DIV')
    expect(paragraph.classes()).toContain('am-typography-paragraph')

    const title = mount(TypographyTitle, { slots: { default: 'title' } })
    expect(title.element.tagName).toBe('H1')
    expect(title.classes()).toEqual(expect.arrayContaining(['am-typography-title', 'am-typography-title-1']))
    const h4 = mount(TypographyTitle, { props: { level: 4 } })
    expect(h4.element.tagName).toBe('H4')
    expect(h4.classes()).toContain('am-typography-title-4')
    expect(mount(TypographyTitle, { props: { level: 9 as any } }).element.tagName).toBe('H1')
  })

  it.each(['secondary', 'success', 'warning', 'danger'] as const)('supports type %s', (type) => {
    expect(mount(TypographyText, { props: { type } }).classes()).toContain(`am-typography-${type}`)
  })

  it('wraps content with decoration tags', () => {
    const wrapper = mount(TypographyText, {
      props: { strong: true, underline: true, delete: true, code: true, mark: true, keyboard: true, italic: true },
      slots: { default: 'text' },
    })
    expect(wrapper.find('strong > u > del > code > mark > kbd > i').text()).toBe('text')
    const plain = mount(TypographyText, { slots: { default: 'text' } })
    expect(plain.element.children).toHaveLength(0)
  })

  it('supports disabled', () => {
    const wrapper = mount(TypographyText, { props: { disabled: true, copyable: true } })
    expect(wrapper.classes()).toContain('am-typography-disabled')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.find('.am-typography-copy').attributes('disabled')).toBeDefined()
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(TypographyParagraph, {
      props: {
        copyable: true,
        rootClass: 'root-cls',
        classes: { root: 'r', action: 'a' },
        styles: { root: { margin: '2px' }, action: { color: 'red' } },
      },
      attrs: { 'class': 'custom', 'style': 'padding: 1px', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom', 'root-cls', 'r']))
    expect(wrapper.attributes('style')).toContain('padding: 1px')
    expect(wrapper.attributes('style')).toContain('margin: 2px')
    expect(wrapper.attributes('data-id')).toBe('x')
    const action = wrapper.find('.am-typography-action')
    expect(action.classes()).toContain('a')
    expect(action.attributes('style')).toContain('color: red')
  })

  describe('ellipsis', () => {
    it('single line by default', () => {
      const wrapper = mount(TypographyText, { props: { ellipsis: true }, slots: { default: 'long text' } })
      expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-typography-ellipsis', 'am-typography-ellipsis-single-line']))
      const content = wrapper.find('.am-typography-ellipsis-content')
      expect(content.text()).toBe('long text')
      expect(content.attributes('style')).toBeUndefined()
      expect(wrapper.find('.am-typography-expand').exists()).toBe(false)
    })

    it('clamps multiple rows', () => {
      const wrapper = mount(TypographyParagraph, { props: { ellipsis: { rows: 3 } }, slots: { default: 'long text' } })
      expect(wrapper.classes()).toContain('am-typography-ellipsis-multiple-line')
      expect((wrapper.find('.am-typography-ellipsis-content').element as HTMLElement).style.webkitLineClamp).toBe('3')
    })

    it('shows no expand button when the text fits', async () => {
      mockOverflow(false)
      const wrapper = mount(TypographyParagraph, { props: { ellipsis: { rows: 2, expandable: true } }, slots: { default: 'short' } })
      await nextTick()
      expect(wrapper.find('.am-typography-expand').exists()).toBe(false)
      expect(wrapper.classes()).not.toContain('am-typography-ellipsis-overflowed')
    })

    it('expands once with expandable: true', async () => {
      mockOverflow()
      const onExpand = vi.fn()
      const wrapper = mount(TypographyParagraph, {
        props: { ellipsis: { rows: 2, expandable: true } },
        attrs: { onExpand },
        slots: { default: 'long text' },
      })
      await nextTick()
      expect(wrapper.classes()).toContain('am-typography-ellipsis-overflowed')
      const expand = wrapper.find('.am-typography-ellipsis-content > .am-typography-expand')
      expect(expand.text()).toBe('展开')
      await expand.trigger('click')
      expect(onExpand).toHaveBeenCalledWith(true, expect.any(MouseEvent))
      expect(wrapper.classes()).not.toContain('am-typography-ellipsis')
      expect(wrapper.find('.am-typography-ellipsis-content').exists()).toBe(false)
      expect(wrapper.find('.am-typography-collapse').exists()).toBe(false)
      expect(wrapper.text()).toBe('long text')
    })

    it('expands and collapses with expandable: collapsible', async () => {
      mockOverflow()
      const onExpand = vi.fn()
      const onUpdate = vi.fn()
      const wrapper = mount(TypographyParagraph, {
        props: { ellipsis: { rows: 2, expandable: 'collapsible' } },
        attrs: { onExpand, 'onUpdate:expanded': onUpdate },
        slots: { default: 'long text' },
      })
      await nextTick()
      await wrapper.find('.am-typography-expand').trigger('click')
      expect(onUpdate).toHaveBeenLastCalledWith(true)
      const collapse = wrapper.find('.am-typography-collapse')
      expect(collapse.text()).toBe('收起')
      await collapse.trigger('click')
      await nextTick()
      expect(onExpand).toHaveBeenLastCalledWith(false, expect.any(MouseEvent))
      expect(onUpdate).toHaveBeenLastCalledWith(false)
      expect(wrapper.classes()).toContain('am-typography-ellipsis')
      expect(wrapper.find('.am-typography-expand').exists()).toBe(true)
    })

    it('puts the expand button after a single-line text', async () => {
      mockOverflow()
      const wrapper = mount(TypographyText, { props: { ellipsis: { expandable: true } }, slots: { default: 'long text' } })
      await nextTick()
      expect(wrapper.find('.am-typography-ellipsis-content > .am-typography-expand').exists()).toBe(false)
      expect(wrapper.find('.am-typography-ellipsis > .am-typography-expand').exists()).toBe(true)
    })

    it('supports defaultExpanded and controlled expanded', async () => {
      mockOverflow()
      const uncontrolled = mount(TypographyParagraph, {
        props: { ellipsis: { rows: 2, expandable: 'collapsible', defaultExpanded: true } },
      })
      expect(uncontrolled.classes()).not.toContain('am-typography-ellipsis')
      expect(uncontrolled.find('.am-typography-collapse').exists()).toBe(true)

      const onExpand = vi.fn()
      const controlled = mount(TypographyParagraph, {
        props: { ellipsis: { rows: 2, expandable: 'collapsible', expanded: false } },
        attrs: { onExpand },
      })
      await nextTick()
      await controlled.find('.am-typography-expand').trigger('click')
      expect(onExpand).toHaveBeenCalledWith(true, expect.any(MouseEvent))
      // stays collapsed until the prop changes
      expect(controlled.classes()).toContain('am-typography-ellipsis')
      await controlled.setProps({ ellipsis: { rows: 2, expandable: 'collapsible', expanded: true } })
      expect(controlled.classes()).not.toContain('am-typography-ellipsis')
    })

    it('custom symbol: prop, function and slot (slot wins)', async () => {
      mockOverflow()
      const byProp = mount(TypographyParagraph, {
        props: { ellipsis: { rows: 2, expandable: 'collapsible', symbol: (expanded: boolean) => (expanded ? 'less' : 'more') } },
      })
      await nextTick()
      expect(byProp.find('.am-typography-expand').text()).toBe('more')
      await byProp.find('.am-typography-expand').trigger('click')
      expect(byProp.find('.am-typography-collapse').text()).toBe('less')

      const bySlot = mount(TypographyParagraph, {
        props: { ellipsis: { rows: 2, expandable: true, symbol: 'prop' } },
        slots: { ellipsisSymbol: ({ expanded }: { expanded: boolean }) => `slot-${expanded}` },
      })
      await nextTick()
      expect(bySlot.find('.am-typography-expand').text()).toBe('slot-false')
    })

    it('uses locale texts', async () => {
      mockOverflow()
      const wrapper = mount(ConfigProvider, {
        props: { locale: enUS },
        slots: { default: () => h(TypographyParagraph, { ellipsis: { rows: 2, expandable: true }, copyable: true }, () => 'text') },
      })
      await nextTick()
      expect(wrapper.find('.am-typography-expand').text()).toBe('Expand')
      expect(wrapper.find('.am-typography-copy').attributes('aria-label')).toBe('Copy')
    })
  })

  describe('copyable', () => {
    function mockClipboard() {
      const writeText = vi.fn(() => Promise.resolve())
      vi.stubGlobal('navigator', { clipboard: { writeText } })
      return writeText
    }

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('copies the rendered text and shows the copied state', async () => {
      vi.useFakeTimers()
      const writeText = mockClipboard()
      const onCopy = vi.fn()
      const wrapper = mount(TypographyParagraph, {
        props: { copyable: true },
        attrs: { onCopy },
        slots: { default: 'copy me' },
      })
      const button = wrapper.find('.am-typography-copy')
      expect(button.attributes('aria-label')).toBe('复制')
      expect(button.find('.anticon-copy').exists()).toBe(true)
      await button.trigger('click')
      await vi.advanceTimersByTimeAsync(0)
      expect(writeText).toHaveBeenCalledWith('copy me')
      expect(onCopy).toHaveBeenCalledWith(expect.any(MouseEvent))
      expect(button.classes()).toContain('am-typography-copy-success')
      expect(button.attributes('aria-label')).toBe('复制成功')
      expect(button.find('.anticon-check').exists()).toBe(true)
      await vi.advanceTimersByTimeAsync(3000)
      expect(button.classes()).not.toContain('am-typography-copy-success')
    })

    it('copies config text (string or async function)', async () => {
      const writeText = mockClipboard()
      const byString = mount(TypographyText, { props: { copyable: { text: 'custom' } }, slots: { default: 'shown' } })
      await byString.find('.am-typography-copy').trigger('click')
      await Promise.resolve()
      expect(writeText).toHaveBeenLastCalledWith('custom')

      const byFn = mount(TypographyText, { props: { copyable: { text: () => Promise.resolve('async') } } })
      await byFn.find('.am-typography-copy').trigger('click')
      await new Promise(resolve => setTimeout(resolve))
      expect(writeText).toHaveBeenLastCalledWith('async')
    })

    it('falls back to execCommand without the clipboard API', async () => {
      vi.stubGlobal('navigator', {})
      const execCommand = vi.fn(() => true)
      ;(document as any).execCommand = execCommand
      const onCopy = vi.fn()
      const wrapper = mount(TypographyText, { props: { copyable: true }, attrs: { onCopy }, slots: { default: 'legacy' } })
      await wrapper.find('.am-typography-copy').trigger('click')
      await new Promise(resolve => setTimeout(resolve))
      expect(execCommand).toHaveBeenCalledWith('copy')
      expect(onCopy).toHaveBeenCalledTimes(1)
      expect(document.querySelector('textarea')).toBeNull()
      delete (document as any).execCommand
    })

    it('does not copy when disabled', async () => {
      const writeText = mockClipboard()
      const onCopy = vi.fn()
      const wrapper = mount(TypographyText, { props: { copyable: true, disabled: true }, attrs: { onCopy } })
      await wrapper.find('.am-typography-copy').trigger('click')
      await Promise.resolve()
      expect(writeText).not.toHaveBeenCalled()
      expect(onCopy).not.toHaveBeenCalled()
    })

    it('custom icons: config and slot (slot wins)', async () => {
      mockClipboard()
      const byConfig = mount(TypographyText, {
        props: { copyable: { icon: [() => h('i', { class: 'icon-copy' }), () => h('i', { class: 'icon-copied' })] } },
      })
      expect(byConfig.find('.icon-copy').exists()).toBe(true)
      await byConfig.find('.am-typography-copy').trigger('click')
      await new Promise(resolve => setTimeout(resolve))
      expect(byConfig.find('.icon-copied').exists()).toBe(true)

      const bySlot = mount(TypographyText, {
        props: { copyable: { icon: () => h('i', { class: 'icon-copy' }) } },
        slots: { copyIcon: ({ copied }: { copied: boolean }) => h('i', { class: `slot-${copied}` }) },
      })
      expect(bySlot.find('.slot-false').exists()).toBe(true)
      expect(bySlot.find('.icon-copy').exists()).toBe(false)
    })
  })
})
