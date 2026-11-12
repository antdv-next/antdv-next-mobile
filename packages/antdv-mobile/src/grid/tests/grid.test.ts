import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { Col, Row } from '..'

function style(wrapper: { element: Element }) {
  return (wrapper.element as HTMLElement).style
}

describe('Grid', () => {
  it('renders Row and Col', () => {
    const wrapper = mount(Row, { slots: { default: () => [h(Col, { span: 12 }, () => 'a'), h(Col, { span: 12 }, () => 'b')] } })
    expect(wrapper.classes()).toEqual(['am-row'])
    const cols = wrapper.findAll('.am-col')
    expect(cols).toHaveLength(2)
    expect(cols[0].classes()).toContain('am-col-12')
    expect((cols[0].element as HTMLElement).style.flex).toBe('0 0 50%')
    expect((cols[0].element as HTMLElement).style.maxWidth).toBe('50%')
  })

  it('exposes install on both components', () => {
    expect(typeof Row.install).toBe('function')
    expect(typeof Col.install).toBe('function')
    expect(Row.name).toBe('AmRow')
    expect(Col.name).toBe('AmCol')
  })

  it('row: horizontal gutter is exposed as a css variable, vertical gutter as row-gap', () => {
    const single = mount(Row, { props: { gutter: 16 } })
    expect(style(single).getPropertyValue('--am-row-gutter-x')).toBe('16px')
    expect(style(single).rowGap).toBe('')
    const both = mount(Row, { props: { gutter: [8, '1rem'] } })
    expect(style(both).getPropertyValue('--am-row-gutter-x')).toBe('8px')
    expect(style(both).rowGap).toBe('1rem')
    const none = mount(Row)
    expect(style(none).getPropertyValue('--am-row-gutter-x')).toBe('')
  })

  it('row: justify / align / wrap', () => {
    const wrapper = mount(Row, { props: { justify: 'space-between', align: 'middle', wrap: false } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-row-space-between', 'am-row-middle', 'am-row-no-wrap']))
  })

  it('col: span accepts strings, 0 hides the column', () => {
    const third = mount(Col, { props: { span: '8' } })
    expect(style(third).maxWidth).toBe('33.333333%')
    const hidden = mount(Col, { props: { span: 0 } })
    expect(hidden.classes()).toContain('am-col-hidden')
    expect(style(hidden).flex).toBe('')
    const auto = mount(Col)
    expect(auto.classes()).toEqual(['am-col'])
  })

  it('col: offset / order / push / pull', () => {
    const wrapper = mount(Col, { props: { span: 6, offset: 6, order: 2, push: 12, pull: 3 } })
    const s = style(wrapper)
    expect(s.marginInlineStart).toBe('25%')
    expect(s.order).toBe('2')
    expect(s.insetInlineStart).toBe('50%')
    expect(s.insetInlineEnd).toBe('12.5%')
  })

  it('col: flex', () => {
    expect(style(mount(Col, { props: { flex: 1 } })).flex).toBe('1 1 auto')
    expect(style(mount(Col, { props: { flex: '100px' } })).flex).toBe('0 0 100px')
    expect(style(mount(Col, { props: { flex: 'auto' } })).flex).toContain('auto')
    expect(style(mount(Col, { props: { flex: '1 1 200px' } })).flex).toBe('1 1 200px')
    expect(mount(Col, { props: { flex: 1 } }).classes()).toContain('am-col-flex')
  })

  it('passes attrs and rootClass', () => {
    const row = mount(Row, { props: { rootClass: 'row-root' }, attrs: { 'class': 'custom', 'data-id': 'r' } })
    expect(row.classes()).toEqual(expect.arrayContaining(['custom', 'row-root']))
    expect(row.attributes('data-id')).toBe('r')
    const col = mount(Col, { props: { rootClass: 'col-root', span: 12 }, attrs: { class: 'custom', style: 'max-width: 10px' } })
    expect(col.classes()).toEqual(expect.arrayContaining(['custom', 'col-root']))
    expect(style(col).maxWidth).toBe('10px')
  })
})
