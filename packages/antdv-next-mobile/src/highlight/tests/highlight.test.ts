import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Highlight, { getHighlightChunks } from '..'

const content = 'Take your time and be patient. Time flies.'

function marks(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('.am-highlight-tag').map(item => item.element.textContent)
}

describe('Highlight', () => {
  it('renders plain text without keywords', () => {
    const wrapper = mount(Highlight, { props: { content } })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toEqual(['am-highlight'])
    expect(wrapper.element.textContent).toBe(content)
    expect(wrapper.find('.am-highlight-tag').exists()).toBe(false)
    expect(mount(Highlight, { props: { content, keywords: '' } }).find('.am-highlight-tag').exists()).toBe(false)
    expect(mount(Highlight, { props: { content, keywords: ['', ''] } }).element.textContent).toBe(content)
    expect(mount(Highlight).element.textContent).toBe('')
  })

  it('wraps every match and keeps the text intact', () => {
    const wrapper = mount(Highlight, { props: { content, keywords: 'time' } })
    expect(marks(wrapper)).toEqual(['time', 'Time'])
    expect(wrapper.find('.am-highlight-tag').element.tagName).toBe('MARK')
    expect(wrapper.element.textContent).toBe(content)
    // plain parts are bare text nodes (no wrapper element)
    expect(wrapper.element.children).toHaveLength(2)
    const texts = Array.from<Node>(wrapper.element.childNodes as unknown as ArrayLike<Node>).filter(node => node.nodeType === 3 && node.textContent !== '')
    expect(texts.map(node => node.textContent)).toEqual(['Take your ', ' and be patient. ', ' flies.'])
  })

  it('caseSensitive', () => {
    const wrapper = mount(Highlight, { props: { content, keywords: 'time', caseSensitive: true } })
    expect(marks(wrapper)).toEqual(['time'])
  })

  it('supports several keywords and updates reactively', async () => {
    const wrapper = mount(Highlight, { props: { content, keywords: ['patient', 'take'] } })
    expect(marks(wrapper)).toEqual(['Take', 'patient'])
    await wrapper.setProps({ keywords: 'flies' })
    expect(marks(wrapper)).toEqual(['flies'])
    await wrapper.setProps({ content: 'flies, flies' })
    expect(marks(wrapper)).toEqual(['flies', 'flies'])
  })

  it('merges overlapping and adjacent matches', () => {
    const overlap = mount(Highlight, { props: { content: 'abcdef', keywords: ['abc', 'bcd'] } })
    expect(marks(overlap)).toEqual(['abcd'])
    const adjacent = mount(Highlight, { props: { content: 'abcdef', keywords: ['ab', 'cd'] } })
    expect(marks(adjacent)).toEqual(['abcd'])
    const nested = mount(Highlight, { props: { content: 'abcdef', keywords: ['abcde', 'c'] } })
    expect(marks(nested)).toEqual(['abcde'])
    expect(nested.element.textContent).toBe('abcdef')
  })

  it('autoEscape: literal keywords by default, RegExp sources when disabled', () => {
    const literal = mount(Highlight, { props: { content: 'price: $1.50 (a+b) 1x50', keywords: ['$1.50', '(a+b)'] } })
    expect(marks(literal)).toEqual(['$1.50', '(a+b)'])
    const regexp = mount(Highlight, { props: { content: 'a1 b22 c333', keywords: '\\d+', autoEscape: false } })
    expect(marks(regexp)).toEqual(['1', '22', '333'])
    // invalid or empty-matching patterns never throw or loop
    const invalid = mount(Highlight, { props: { content: 'abc', keywords: ['(', 'x*'], autoEscape: false } })
    expect(invalid.element.textContent).toBe('abc')
    expect(invalid.find('.am-highlight-tag').exists()).toBe(false)
  })

  it('never renders html from content', () => {
    const wrapper = mount(Highlight, { props: { content: '<b>bold</b>', keywords: 'bold' } })
    expect(wrapper.find('b').exists()).toBe(false)
    expect(wrapper.element.textContent).toBe('<b>bold</b>')
  })

  it('tag, highlightTag and highlightClass', () => {
    const wrapper = mount(Highlight, {
      props: { content, keywords: 'time', tag: 'p', highlightTag: 'em', highlightClass: 'hit' },
    })
    expect(wrapper.element.tagName).toBe('P')
    const tag = wrapper.find('.am-highlight-tag')
    expect(tag.element.tagName).toBe('EM')
    expect(tag.classes()).toContain('hit')
  })

  it('unhighlightTag / unhighlightClass wrap the remaining text', () => {
    const byClass = mount(Highlight, { props: { content: 'abc', keywords: 'b', unhighlightClass: 'plain' } })
    const texts = byClass.findAll('.am-highlight-text')
    expect(texts.map(item => item.element.tagName)).toEqual(['SPAN', 'SPAN'])
    expect(texts.map(item => item.text())).toEqual(['a', 'c'])
    expect(texts[0].classes()).toContain('plain')
    const byTag = mount(Highlight, { props: { content: 'abc', keywords: 'b', unhighlightTag: 'i' } })
    expect(byTag.findAll('i.am-highlight-text')).toHaveLength(2)
    expect(byTag.element.textContent).toBe('abc')
  })

  it('highlight slot receives text and index', () => {
    const wrapper = mount(Highlight, {
      props: { content, keywords: 'time' },
      slots: { highlight: ({ text, index }: { text: string, index: number }) => h('b', { class: 'custom' }, `${index}:${text}`) },
    })
    expect(wrapper.findAll('.am-highlight-tag .custom').map(item => item.text())).toEqual(['0:time', '1:Time'])
  })

  it('passes attrs, rootClass, classes and styles', () => {
    const wrapper = mount(Highlight, {
      props: {
        content,
        keywords: 'time',
        rootClass: 'root-cls',
        classes: { root: 'r', highlight: 'h' },
        styles: { root: { margin: '1px' }, highlight: { color: 'red' } },
      },
      attrs: { 'class': 'custom', 'style': 'padding: 2px', 'data-id': 'x' },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-highlight', 'custom', 'root-cls', 'r']))
    expect(wrapper.attributes('data-id')).toBe('x')
    const style = (wrapper.element as HTMLElement).style
    expect(style.margin).toBe('1px')
    expect(style.padding).toBe('2px')
    const tag = wrapper.find('.am-highlight-tag')
    expect(tag.classes()).toContain('h')
    expect((tag.element as HTMLElement).style.color).toBe('red')
  })

  it('getHighlightChunks returns positions', () => {
    expect(getHighlightChunks('abcab', 'b')).toEqual([
      { text: 'a', highlight: false, start: 0, end: 1, index: -1 },
      { text: 'b', highlight: true, start: 1, end: 2, index: 0 },
      { text: 'ca', highlight: false, start: 2, end: 4, index: -1 },
      { text: 'b', highlight: true, start: 4, end: 5, index: 1 },
    ])
    expect(getHighlightChunks('', 'b')).toEqual([])
    expect(getHighlightChunks('abc', undefined)).toEqual([{ text: 'abc', highlight: false, start: 0, end: 3, index: -1 }])
  })
})
