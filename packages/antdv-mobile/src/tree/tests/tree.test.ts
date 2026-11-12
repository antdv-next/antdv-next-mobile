import type { VueWrapper } from '@vue/test-utils'
import type { TreeDataNode } from '../interface'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { computed, h, nextTick, shallowRef } from 'vue'
import Tree from '..'
import ConfigProvider from '../../config-provider'
import { formItemInputContextKey } from '../../form/context'

function makeData(): TreeDataNode[] {
  return [
    {
      key: 'a',
      title: 'Node A',
      children: [
        { key: 'a1', title: 'Node A1', children: [{ key: 'a11', title: 'Node A11' }, { key: 'a12', title: 'Node A12' }] },
        { key: 'a2', title: 'Node A2' },
      ],
    },
    { key: 'b', title: 'Node B', children: [{ key: 'b1', title: 'Node B1' }] },
    { key: 'c', title: 'Node C' },
  ]
}

const css = (wrapper: { element: Element }) => (wrapper.element as HTMLElement).style
const rows = (wrapper: VueWrapper<any>) => wrapper.findAll('.am-tree-treenode')
const keys = (wrapper: VueWrapper<any>) => rows(wrapper).map(row => row.attributes('data-key'))
const row = (wrapper: VueWrapper<any>, key: string) => wrapper.find(`.am-tree-treenode[data-key="${key}"]`)
const tapSwitcher = (wrapper: VueWrapper<any>, key: string) => row(wrapper, key).find('.am-tree-switcher').trigger('click')
const tapContent = (wrapper: VueWrapper<any>, key: string) => row(wrapper, key).find('.am-tree-node-content-wrapper').trigger('click')
const tapCheckbox = (wrapper: VueWrapper<any>, key: string) => row(wrapper, key).find('.am-checkbox-input').trigger('change')
const lastEmit = (wrapper: VueWrapper<any>, name: string) => wrapper.emitted(name)!.slice(-1)[0] as any[]

describe('Tree', () => {
  it('renders the root nodes with default classes', () => {
    const wrapper = mount(Tree, { props: { treeData: makeData() } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-virtual-list', 'am-tree', 'am-tree-block-node']))
    expect(wrapper.classes()).not.toContain('am-tree-show-line')
    expect(wrapper.attributes('role')).toBe('tree')
    expect(keys(wrapper)).toEqual(['a', 'b', 'c'])
    const a = row(wrapper, 'a')
    expect(a.attributes('role')).toBe('treeitem')
    expect(a.attributes('aria-expanded')).toBe('false')
    expect(a.classes()).toContain('am-tree-treenode-switcher-close')
    expect(a.find('.am-tree-title').text()).toBe('Node A')
    expect(a.find('.am-tree-switcher').classes()).toContain('am-tree-switcher-close')
    expect(a.find('.am-tree-switcher-icon').exists()).toBe(true)
    // leaf: no switcher icon, no aria-expanded
    const c = row(wrapper, 'c')
    expect(c.classes()).toEqual(expect.arrayContaining(['am-tree-treenode-leaf', 'am-tree-treenode-leaf-last']))
    expect(c.find('.am-tree-switcher').classes()).toContain('am-tree-switcher-noop')
    expect(c.find('.am-tree-switcher-icon').exists()).toBe(false)
    expect(c.attributes('aria-expanded')).toBeUndefined()
    expect(wrapper.find('.am-checkbox').exists()).toBe(false)
    expect(wrapper.find('.am-tree-icon').exists()).toBe(false)
  })

  it('exposes install and the component name', () => {
    expect(Tree.name).toBe('AmTree')
    expect(typeof Tree.install).toBe('function')
  })

  it('renders an empty tree and a missing title', () => {
    expect(rows(mount(Tree))).toHaveLength(0)
    const wrapper = mount(Tree, { props: { treeData: [{ key: 1 }] } })
    expect(wrapper.find('.am-tree-title').text()).toBe('---')
  })

  it('writes the level as a css variable and the pc aria attributes', () => {
    const wrapper = mount(Tree, { props: { treeData: makeData(), defaultExpandAll: true } })
    expect(keys(wrapper)).toEqual(['a', 'a1', 'a11', 'a12', 'a2', 'b', 'b1', 'c'])
    expect(css(row(wrapper, 'a')).getPropertyValue('--am-tree-level')).toBe('0')
    expect(css(row(wrapper, 'a12')).getPropertyValue('--am-tree-level')).toBe('2')
    expect(row(wrapper, 'a12').attributes('aria-level')).toBe('3')
    expect(row(wrapper, 'a').attributes('aria-expanded')).toBe('true')
    expect(row(wrapper, 'a').attributes('aria-selected')).toBe('false')
  })

  describe('expand', () => {
    it('uncontrolled: the switcher toggles and emits the pc payload', async () => {
      const wrapper = mount(Tree, { props: { treeData: makeData() } })
      await tapSwitcher(wrapper, 'a')
      expect(keys(wrapper)).toEqual(['a', 'a1', 'a2', 'b', 'c'])
      expect(wrapper.emitted('update:expandedKeys')![0]).toEqual([['a']])
      const [expandedKeys, info] = wrapper.emitted('expand')![0] as any[]
      expect(expandedKeys).toEqual(['a'])
      expect(info.expanded).toBe(true)
      expect(info.node).toMatchObject({ key: 'a', title: 'Node A', expanded: false, pos: '0-0' })
      expect(info.nativeEvent).toBeInstanceOf(Event)

      await tapSwitcher(wrapper, 'a')
      expect(keys(wrapper)).toEqual(['a', 'b', 'c'])
      expect(lastEmit(wrapper, 'expand')[0]).toEqual([])
      expect(lastEmit(wrapper, 'expand')[1].expanded).toBe(false)
    })

    it('a leaf switcher does nothing', async () => {
      const wrapper = mount(Tree, { props: { treeData: makeData() } })
      await tapSwitcher(wrapper, 'c')
      expect(wrapper.emitted('expand')).toBeUndefined()
    })

    it('defaultExpandedKeys expands the parents too (defaultExpandParent)', () => {
      const wrapper = mount(Tree, { props: { treeData: makeData(), defaultExpandedKeys: ['a1'] } })
      expect(keys(wrapper)).toEqual(['a', 'a1', 'a11', 'a12', 'a2', 'b', 'c'])
      const plain = mount(Tree, { props: { treeData: makeData(), defaultExpandedKeys: ['a1'], defaultExpandParent: false } })
      expect(keys(plain)).toEqual(['a', 'b', 'c'])
    })

    it('controlled: follows the prop only', async () => {
      const wrapper = mount(Tree, { props: { treeData: makeData(), expandedKeys: ['b'], defaultExpandParent: false } })
      expect(keys(wrapper)).toEqual(['a', 'b', 'b1', 'c'])
      await tapSwitcher(wrapper, 'a')
      expect(wrapper.emitted('update:expandedKeys')![0]).toEqual([['b', 'a']])
      expect(keys(wrapper)).toEqual(['a', 'b', 'b1', 'c'])
      await wrapper.setProps({ expandedKeys: ['b', 'a'] })
      expect(keys(wrapper)).toEqual(['a', 'a1', 'a2', 'b', 'b1', 'c'])
      await wrapper.setProps({ expandedKeys: [] })
      expect(keys(wrapper)).toEqual(['a', 'b', 'c'])
    })

    it('controlled: autoExpandParent expands the ancestors of the given keys', async () => {
      const wrapper = mount(Tree, { props: { treeData: makeData(), expandedKeys: [], autoExpandParent: true } })
      await wrapper.setProps({ expandedKeys: ['a1'] })
      expect(keys(wrapper)).toEqual(['a', 'a1', 'a11', 'a12', 'a2', 'b', 'c'])
      await wrapper.setProps({ autoExpandParent: false })
      expect(keys(wrapper)).toEqual(['a', 'b', 'c'])
    })

    it('expandAction="click": a tap on the content expands as well', async () => {
      const wrapper = mount(Tree, { props: { treeData: makeData(), expandAction: 'click' } })
      await tapContent(wrapper, 'a')
      expect(keys(wrapper)).toEqual(['a', 'a1', 'a2', 'b', 'c'])
      expect(wrapper.emitted('select')).toHaveLength(1)
    })

    it('a disabled node can still be expanded', async () => {
      const data = makeData()
      data[0].disabled = true
      const wrapper = mount(Tree, { props: { treeData: data } })
      await tapSwitcher(wrapper, 'a')
      expect(keys(wrapper)).toContain('a1')
    })
  })

  describe('select', () => {
    it('uncontrolled single: selects, replaces and deselects', async () => {
      const wrapper = mount(Tree, { props: { treeData: makeData() } })
      await tapContent(wrapper, 'a')
      expect(row(wrapper, 'a').classes()).toContain('am-tree-treenode-selected')
      expect(row(wrapper, 'a').find('.am-tree-node-content-wrapper').classes()).toContain('am-tree-node-selected')
      expect(row(wrapper, 'a').attributes('aria-selected')).toBe('true')
      expect(wrapper.emitted('update:selectedKeys')![0]).toEqual([['a']])
      const [selectedKeys, info] = wrapper.emitted('select')![0] as any[]
      expect(selectedKeys).toEqual(['a'])
      expect(info).toMatchObject({ event: 'select', selected: true })
      expect(info.node).toMatchObject({ key: 'a', selected: false })
      expect(info.selectedNodes.map((node: TreeDataNode) => node.key)).toEqual(['a'])
      expect(info.nativeEvent).toBeInstanceOf(Event)
      expect(wrapper.emitted('click')![0][1]).toMatchObject({ key: 'a' })

      await tapContent(wrapper, 'b')
      expect(lastEmit(wrapper, 'select')[0]).toEqual(['b'])
      expect(row(wrapper, 'a').classes()).not.toContain('am-tree-treenode-selected')

      await tapContent(wrapper, 'b')
      expect(lastEmit(wrapper, 'select')[0]).toEqual([])
      expect(lastEmit(wrapper, 'select')[1].selected).toBe(false)
    })

    it('multiple keeps the previous keys', async () => {
      const wrapper = mount(Tree, { props: { treeData: makeData(), multiple: true, defaultSelectedKeys: ['a'] } })
      expect(wrapper.attributes('aria-multiselectable')).toBe('true')
      await tapContent(wrapper, 'c')
      expect(lastEmit(wrapper, 'select')[0]).toEqual(['a', 'c'])
      expect(wrapper.findAll('.am-tree-node-selected')).toHaveLength(2)
    })

    it('single mode shows the first of several keys only', () => {
      const wrapper = mount(Tree, { props: { treeData: makeData(), defaultSelectedKeys: ['b', 'c'] } })
      expect(wrapper.findAll('.am-tree-node-selected')).toHaveLength(1)
      expect(row(wrapper, 'b').classes()).toContain('am-tree-treenode-selected')
    })

    it('controlled: follows the prop only', async () => {
      const wrapper = mount(Tree, { props: { treeData: makeData(), selectedKeys: ['a'] } })
      await tapContent(wrapper, 'b')
      expect(wrapper.emitted('update:selectedKeys')![0]).toEqual([['b']])
      expect(row(wrapper, 'a').classes()).toContain('am-tree-treenode-selected')
      await wrapper.setProps({ selectedKeys: ['b'] })
      expect(row(wrapper, 'b').classes()).toContain('am-tree-treenode-selected')
      expect(row(wrapper, 'a').classes()).not.toContain('am-tree-treenode-selected')
    })

    it('selectable=false: nothing is selected, per node selectable wins', async () => {
      const data = makeData()
      data[2].selectable = true
      const wrapper = mount(Tree, { props: { treeData: data, selectable: false } })
      expect(wrapper.classes()).toContain('am-tree-unselectable')
      await tapContent(wrapper, 'a')
      expect(wrapper.emitted('select')).toBeUndefined()
      expect(wrapper.emitted('click')).toHaveLength(1)
      await tapContent(wrapper, 'c')
      expect(lastEmit(wrapper, 'select')[0]).toEqual(['c'])
    })

    it('a disabled node is not selected', async () => {
      const data = makeData()
      data[2].disabled = true
      const wrapper = mount(Tree, { props: { treeData: data } })
      expect(row(wrapper, 'c').classes()).toContain('am-tree-treenode-disabled')
      expect(row(wrapper, 'c').attributes('aria-disabled')).toBe('true')
      await tapContent(wrapper, 'c')
      expect(wrapper.emitted('select')).toBeUndefined()
    })
  })

  describe('check', () => {
    it('renders the library checkbox with checked / indeterminate from the conduction', () => {
      const wrapper = mount(Tree, {
        props: { treeData: makeData(), checkable: true, defaultExpandAll: true, defaultCheckedKeys: ['a11'] },
      })
      expect(wrapper.classes()).toContain('am-tree-checkable')
      expect(wrapper.findAll('.am-checkbox.am-tree-checkbox')).toHaveLength(8)
      expect(row(wrapper, 'a11').find('.am-checkbox').classes()).toContain('am-checkbox-checked')
      expect(row(wrapper, 'a1').find('.am-checkbox').classes()).toContain('am-checkbox-indeterminate')
      expect(row(wrapper, 'a').find('.am-checkbox').classes()).toContain('am-checkbox-indeterminate')
      expect(row(wrapper, 'a').classes()).toContain('am-tree-treenode-checkbox-indeterminate')
      expect(row(wrapper, 'a').attributes('aria-checked')).toBe('mixed')
      expect(row(wrapper, 'a11').attributes('aria-checked')).toBe('true')
      expect(row(wrapper, 'b').find('.am-checkbox').classes()).not.toContain('am-checkbox-indeterminate')
    })

    it('uncontrolled: checking a parent checks the subtree and emits the pc payload', async () => {
      const wrapper = mount(Tree, { props: { treeData: makeData(), checkable: true, defaultExpandAll: true } })
      await tapCheckbox(wrapper, 'a1')
      const [checkedKeys, info] = wrapper.emitted('check')![0] as any[]
      expect([...checkedKeys].sort()).toEqual(['a1', 'a11', 'a12'])
      expect(info).toMatchObject({ event: 'check', checked: true })
      expect(info.node).toMatchObject({ key: 'a1', checked: false })
      expect(info.halfCheckedKeys).toEqual(['a'])
      expect(info.checkedNodes.map((node: TreeDataNode) => node.key).sort()).toEqual(['a1', 'a11', 'a12'])
      expect(info.checkedNodesPositions.find((item: any) => item.node.key === 'a12').pos).toBe('0-0-0-1')
      expect(info.nativeEvent).toBeInstanceOf(Event)
      expect([...(wrapper.emitted('update:checkedKeys')![0][0] as string[])].sort()).toEqual(['a1', 'a11', 'a12'])
      expect(wrapper.findAll('.am-checkbox-checked')).toHaveLength(3)
      expect(row(wrapper, 'a').find('.am-checkbox').classes()).toContain('am-checkbox-indeterminate')

      // the last child completes the parent
      await tapCheckbox(wrapper, 'a2')
      expect([...lastEmit(wrapper, 'check')[0]].sort()).toEqual(['a', 'a1', 'a11', 'a12', 'a2'])
      expect(lastEmit(wrapper, 'check')[1].halfCheckedKeys).toEqual([])

      // unchecking a leaf turns its ancestors half checked
      await tapCheckbox(wrapper, 'a11')
      expect([...lastEmit(wrapper, 'check')[0]].sort()).toEqual(['a12', 'a2'])
      expect(lastEmit(wrapper, 'check')[1]).toMatchObject({ checked: false })
      expect([...lastEmit(wrapper, 'check')[1].halfCheckedKeys].sort()).toEqual(['a', 'a1'])

      // unchecking a half checked parent... checks it first (pc behaviour), then unchecks the subtree
      await tapCheckbox(wrapper, 'a')
      expect([...lastEmit(wrapper, 'check')[0]].sort()).toEqual(['a', 'a1', 'a11', 'a12', 'a2'])
      await tapCheckbox(wrapper, 'a')
      expect(lastEmit(wrapper, 'check')[0]).toEqual([])
      expect(wrapper.findAll('.am-checkbox-checked')).toHaveLength(0)
    })

    it('controlled: follows the prop only', async () => {
      const wrapper = mount(Tree, {
        props: { treeData: makeData(), checkable: true, defaultExpandAll: true, checkedKeys: ['b1'] },
      })
      expect(row(wrapper, 'b').find('.am-checkbox').classes()).toContain('am-checkbox-checked')
      await tapCheckbox(wrapper, 'c')
      expect([...(wrapper.emitted('update:checkedKeys')![0][0] as string[])].sort()).toEqual(['b', 'b1', 'c'])
      expect(row(wrapper, 'c').find('.am-checkbox').classes()).not.toContain('am-checkbox-checked')
      await wrapper.setProps({ checkedKeys: ['c'] })
      expect(row(wrapper, 'c').find('.am-checkbox').classes()).toContain('am-checkbox-checked')
      expect(row(wrapper, 'b').find('.am-checkbox').classes()).not.toContain('am-checkbox-checked')
    })

    it('disabled / disableCheckbox nodes are skipped by the conduction and can not be toggled', async () => {
      const data = makeData()
      data[0].children![1].disableCheckbox = true // a2
      data[0].children![0].children![0].disabled = true // a11
      const wrapper = mount(Tree, { props: { treeData: data, checkable: true, defaultExpandAll: true } })
      expect(row(wrapper, 'a2').find('.am-checkbox').classes()).toContain('am-checkbox-disabled')
      expect(row(wrapper, 'a11').find('.am-checkbox').classes()).toContain('am-checkbox-disabled')
      await tapCheckbox(wrapper, 'a2')
      await tapCheckbox(wrapper, 'a11')
      expect(wrapper.emitted('check')).toBeUndefined()

      await tapCheckbox(wrapper, 'a')
      expect([...lastEmit(wrapper, 'check')[0]].sort()).toEqual(['a', 'a1', 'a12'])
      await tapCheckbox(wrapper, 'a12')
      // a1 has no other enabled child, a keeps no checked enabled child
      expect(lastEmit(wrapper, 'check')[0]).toEqual([])
    })

    it('checkable: false on a node hides its checkbox', () => {
      const data = makeData()
      data[2].checkable = false
      const wrapper = mount(Tree, { props: { treeData: data, checkable: true } })
      expect(row(wrapper, 'c').find('.am-checkbox').exists()).toBe(false)
      expect(row(wrapper, 'a').find('.am-checkbox').exists()).toBe(true)
    })

    it('checkStrictly: no conduction, emits { checked, halfChecked }', async () => {
      const wrapper = mount(Tree, {
        props: { treeData: makeData(), checkable: true, checkStrictly: true, defaultExpandAll: true, defaultCheckedKeys: ['a'] },
      })
      expect(wrapper.findAll('.am-checkbox-checked')).toHaveLength(1)
      expect(wrapper.findAll('.am-checkbox-indeterminate')).toHaveLength(0)
      await tapCheckbox(wrapper, 'a11')
      const [value, info] = wrapper.emitted('check')![0] as any[]
      expect(value).toEqual({ checked: ['a', 'a11'], halfChecked: [] })
      expect(info.checkedNodes.map((node: TreeDataNode) => node.key)).toEqual(['a', 'a11'])
      expect(info.halfCheckedKeys).toBeUndefined()
      expect(wrapper.emitted('update:checkedKeys')![0]).toEqual([['a', 'a11']])
      expect(wrapper.findAll('.am-checkbox-checked')).toHaveLength(2)
      await tapCheckbox(wrapper, 'a')
      expect(lastEmit(wrapper, 'check')[0]).toEqual({ checked: ['a11'], halfChecked: [] })
    })

    it('checkStrictly: controlled { checked, halfChecked }', async () => {
      const wrapper = mount(Tree, {
        props: {
          treeData: makeData(),
          checkable: true,
          checkStrictly: true,
          defaultExpandAll: true,
          checkedKeys: { checked: ['a11'], halfChecked: ['a'] },
        },
      })
      expect(row(wrapper, 'a11').find('.am-checkbox').classes()).toContain('am-checkbox-checked')
      expect(row(wrapper, 'a').find('.am-checkbox').classes()).toContain('am-checkbox-indeterminate')
      expect(row(wrapper, 'a1').find('.am-checkbox').classes()).not.toContain('am-checkbox-indeterminate')
      await tapCheckbox(wrapper, 'a')
      expect(lastEmit(wrapper, 'check')[0]).toEqual({ checked: ['a11', 'a'], halfChecked: [] })
    })

    it('a tap on the content checks when the node is not selectable', async () => {
      const wrapper = mount(Tree, { props: { treeData: makeData(), checkable: true, selectable: false } })
      await tapContent(wrapper, 'c')
      expect(lastEmit(wrapper, 'check')[0]).toEqual(['c'])
      expect(wrapper.emitted('select')).toBeUndefined()
    })

    it('ignores checked keys without checkable', () => {
      const wrapper = mount(Tree, { props: { treeData: makeData(), defaultCheckedKeys: ['a'] } })
      expect(wrapper.find('.am-tree-treenode-checkbox-checked').exists()).toBe(false)
    })
  })

  describe('disabled', () => {
    it('disables select and check, keeps expand', async () => {
      const wrapper = mount(Tree, { props: { treeData: makeData(), checkable: true, disabled: true } })
      expect(wrapper.classes()).toContain('am-tree-disabled')
      expect(wrapper.findAll('.am-tree-treenode-disabled')).toHaveLength(3)
      expect(wrapper.findAll('.am-checkbox-disabled')).toHaveLength(3)
      await tapContent(wrapper, 'a')
      await tapCheckbox(wrapper, 'a')
      expect(wrapper.emitted('select')).toBeUndefined()
      expect(wrapper.emitted('check')).toBeUndefined()
      await tapSwitcher(wrapper, 'a')
      expect(wrapper.emitted('expand')).toHaveLength(1)
    })

    it('follows ConfigProvider componentDisabled, the prop wins', () => {
      const wrapper = mount(ConfigProvider, {
        props: { componentDisabled: true },
        slots: {
          default: () => [
            h(Tree, { treeData: makeData(), class: 'one' }),
            h(Tree, { treeData: makeData(), class: 'two', disabled: false }),
          ],
        },
      })
      expect(wrapper.find('.one').classes()).toContain('am-tree-disabled')
      expect(wrapper.find('.two').classes()).not.toContain('am-tree-disabled')
    })
  })

  describe('fieldNames', () => {
    const data = [
      { id: 'x', name: 'X', items: [{ id: 'x1', name: 'X1' }, { id: 'x2', name: 'X2' }] },
      { id: 'y', name: 'Y' },
    ]
    const fieldNames = { title: 'name', key: 'id', children: 'items' }

    it('reads title / key / children from the custom fields', async () => {
      const wrapper = mount(Tree, { props: { treeData: data, fieldNames, checkable: true, defaultExpandedKeys: ['x'] } })
      expect(keys(wrapper)).toEqual(['x', 'x1', 'x2', 'y'])
      expect(row(wrapper, 'x1').find('.am-tree-title').text()).toBe('X1')
      await tapCheckbox(wrapper, 'x1')
      expect(lastEmit(wrapper, 'check')[0]).toEqual(['x1'])
      expect(lastEmit(wrapper, 'check')[1].halfCheckedKeys).toEqual(['x'])
      await tapContent(wrapper, 'y')
      expect(lastEmit(wrapper, 'select')[1].node).toMatchObject({ id: 'y', key: 'y', name: 'Y' })
    })
  })

  describe('loadData', () => {
    function setup(extra: Record<string, any> = {}) {
      const treeData = shallowRef<TreeDataNode[]>([{ key: 'p', title: 'Parent' }, { key: 'leaf', title: 'Leaf', isLeaf: true }])
      let resolve!: () => void
      let reject!: (error: Error) => void
      const loadData = vi.fn((node: any) => new Promise<void>((res, rej) => {
        resolve = () => {
          treeData.value = [{ key: 'p', title: 'Parent', children: [{ key: `${node.key}-0`, title: 'Child', isLeaf: true }] }, treeData.value[1]]
          res()
        }
        reject = rej
      }))
      const { slots, ...rest } = extra
      const wrapper = mount({
        setup: () => () => h(Tree, { treeData: treeData.value, loadData, ...rest }, slots),
      })
      return { wrapper, loadData, resolve: () => resolve(), reject: (error: Error) => reject(error) }
    }

    it('loads the children on expand and shows the spinner in the switcher', async () => {
      const onLoad = vi.fn()
      const { wrapper, loadData, resolve } = setup({ onLoad })
      // not a leaf while it may still load, `isLeaf: true` never loads
      expect(row(wrapper, 'p').classes()).not.toContain('am-tree-treenode-leaf')
      expect(row(wrapper, 'leaf').classes()).toContain('am-tree-treenode-leaf')

      await tapSwitcher(wrapper, 'p')
      expect(loadData).toHaveBeenCalledTimes(1)
      expect(loadData.mock.calls[0][0]).toMatchObject({ key: 'p', title: 'Parent' })
      expect(row(wrapper, 'p').classes()).toContain('am-tree-treenode-loading')
      expect(row(wrapper, 'p').find('.am-tree-switcher-loading-icon .am-spinner').exists()).toBe(true)

      // taps while loading are ignored
      await tapSwitcher(wrapper, 'p')
      expect(loadData).toHaveBeenCalledTimes(1)

      resolve()
      await flushPromises()
      expect(keys(wrapper)).toEqual(['p', 'p-0', 'leaf'])
      expect(row(wrapper, 'p').find('.am-spinner').exists()).toBe(false)
      expect(onLoad).toHaveBeenCalledTimes(1)
      expect(onLoad.mock.calls[0][0]).toEqual(['p'])
      expect(onLoad.mock.calls[0][1]).toMatchObject({ event: 'load', node: { key: 'p' } })

      // loaded: collapsing and expanding again does not load twice
      await tapSwitcher(wrapper, 'p')
      await tapSwitcher(wrapper, 'p')
      expect(loadData).toHaveBeenCalledTimes(1)
    })

    it('a failed load collapses the node so the next tap retries', async () => {
      const { wrapper, loadData, reject } = setup()
      await tapSwitcher(wrapper, 'p')
      expect(row(wrapper, 'p').attributes('aria-expanded')).toBe('true')
      reject(new Error('network'))
      await flushPromises()
      expect(row(wrapper, 'p').classes()).not.toContain('am-tree-treenode-loading')
      expect(row(wrapper, 'p').attributes('aria-expanded')).toBe('false')
      await tapSwitcher(wrapper, 'p')
      expect(loadData).toHaveBeenCalledTimes(2)
    })

    it('loads nodes that are expanded by default', async () => {
      const { wrapper, loadData, resolve } = setup({ defaultExpandedKeys: ['p'] })
      await nextTick()
      expect(loadData).toHaveBeenCalledTimes(1)
      resolve()
      await flushPromises()
      expect(keys(wrapper)).toEqual(['p', 'p-0', 'leaf'])
      expect(loadData).toHaveBeenCalledTimes(1)
    })

    it('controlled loadedKeys: a loaded node without children is a leaf and is not loaded again', async () => {
      const { wrapper, loadData } = setup({ loadedKeys: ['p'] })
      expect(row(wrapper, 'p').classes()).toContain('am-tree-treenode-leaf')
      await tapSwitcher(wrapper, 'p')
      expect(loadData).not.toHaveBeenCalled()
    })

    it('switcherLoadingIcon: slot over prop over the spinner', async () => {
      const withProp = setup({ switcherLoadingIcon: 'wait' })
      await tapSwitcher(withProp.wrapper, 'p')
      expect(row(withProp.wrapper, 'p').find('.am-tree-switcher-loading-icon').text()).toBe('wait')
      expect(row(withProp.wrapper, 'p').find('.am-spinner').exists()).toBe(false)

      const withSlot = setup({ switcherLoadingIcon: 'wait', slots: { switcherLoadingIcon: () => 'slot-wait' } })
      await tapSwitcher(withSlot.wrapper, 'p')
      expect(row(withSlot.wrapper, 'p').find('.am-tree-switcher-loading-icon').text()).toBe('slot-wait')
    })
  })

  describe('render props and slots', () => {
    it('titleRender customises the title, a function title wins', () => {
      const data = makeData()
      data[2].title = (node: TreeDataNode) => `fn:${node.key}`
      const wrapper = mount(Tree, { props: { treeData: data, titleRender: node => h('b', `render:${node.key}`) } })
      expect(row(wrapper, 'a').find('.am-tree-title b').text()).toBe('render:a')
      expect(row(wrapper, 'c').find('.am-tree-title').text()).toBe('fn:c')
    })

    it('the title / titleRender slots win over the prop', () => {
      const titleRender = (node: TreeDataNode) => `prop:${node.key}`
      const withTitleRender = mount(Tree, {
        props: { treeData: makeData(), titleRender },
        slots: { titleRender: (node: TreeDataNode) => `slot:${node.title}` },
      })
      expect(row(withTitleRender, 'a').find('.am-tree-title').text()).toBe('slot:Node A')
      const withTitle = mount(Tree, {
        props: { treeData: makeData(), titleRender },
        slots: { title: (node: TreeDataNode) => `title:${node.key}`, titleRender: () => 'never' },
      })
      expect(row(withTitle, 'b').find('.am-tree-title').text()).toBe('title:b')
    })

    it('icon needs showIcon; node icon > slot > prop', () => {
      const data = makeData()
      data[1].icon = 'node-icon'
      const hidden = mount(Tree, { props: { treeData: data, icon: 'prop-icon' } })
      expect(hidden.find('.am-tree-icon').exists()).toBe(false)

      const withProp = mount(Tree, { props: { treeData: data, showIcon: true, icon: (attrs: any) => `prop:${attrs.eventKey}:${attrs.isLeaf}` } })
      expect(row(withProp, 'a').find('.am-tree-icon').text()).toBe('prop:a:false')
      expect(row(withProp, 'b').find('.am-tree-icon').text()).toBe('node-icon')
      expect(row(withProp, 'c').find('.am-tree-icon').text()).toBe('prop:c:true')

      const withSlot = mount(Tree, {
        props: { treeData: data, showIcon: true, icon: 'prop-icon' },
        slots: { icon: (attrs: any) => `slot:${attrs.expanded}` },
      })
      expect(row(withSlot, 'a').find('.am-tree-icon').text()).toBe('slot:false')
      expect(row(withSlot, 'b').find('.am-tree-icon').text()).toBe('node-icon')
    })

    it('switcherIcon: node > slot > prop, leaves get none', async () => {
      const data = makeData()
      data[1].switcherIcon = 'N'
      const withProp = mount(Tree, { props: { treeData: data, switcherIcon: (attrs: any) => (attrs.expanded ? '-' : '+') } })
      expect(row(withProp, 'a').find('.am-tree-switcher-icon').text()).toBe('+')
      expect(row(withProp, 'b').find('.am-tree-switcher-icon').text()).toBe('N')
      expect(row(withProp, 'c').find('.am-tree-switcher').text()).toBe('')
      await tapSwitcher(withProp, 'a')
      expect(row(withProp, 'a').find('.am-tree-switcher-icon').text()).toBe('-')

      const withSlot = mount(Tree, {
        props: { treeData: data, switcherIcon: 'prop' },
        slots: { switcherIcon: (attrs: any) => `slot:${attrs.eventKey}` },
      })
      expect(row(withSlot, 'a').find('.am-tree-switcher-icon').text()).toBe('slot:a')
    })

    it('follows a slot that is added or removed later', async () => {
      const on = shallowRef(false)
      const wrapper = mount({
        setup: () => () => h(
          Tree,
          { treeData: makeData(), switcherIcon: 'prop' },
          on.value ? { switcherIcon: () => 'slot', title: (node: TreeDataNode) => `T:${node.key}` } : {},
        ),
      })
      expect(row(wrapper, 'a').find('.am-tree-switcher-icon').text()).toBe('prop')
      expect(row(wrapper, 'a').find('.am-tree-title').text()).toBe('Node A')
      on.value = true
      await nextTick()
      await nextTick()
      expect(row(wrapper, 'a').find('.am-tree-switcher-icon').text()).toBe('slot')
      expect(row(wrapper, 'a').find('.am-tree-title').text()).toBe('T:a')
      on.value = false
      await nextTick()
      await nextTick()
      expect(row(wrapper, 'a').find('.am-tree-switcher-icon').text()).toBe('prop')
      expect(row(wrapper, 'a').find('.am-tree-title').text()).toBe('Node A')
    })

    it('filterTreeNode marks the matching rows', () => {
      const wrapper = mount(Tree, {
        props: { treeData: makeData(), filterTreeNode: node => String(node.title).includes('B') },
      })
      expect(wrapper.findAll('.am-tree-filter-node').map(node => node.attributes('data-key'))).toEqual(['b'])
    })

    it('node class / style land on the row', () => {
      const data = makeData()
      data[2].class = 'custom-row'
      data[2].style = { color: 'red' }
      const wrapper = mount(Tree, { props: { treeData: data } })
      expect(row(wrapper, 'c').classes()).toContain('custom-row')
      expect(css(row(wrapper, 'c')).color).toBe('red')
    })
  })

  describe('showLine', () => {
    it('draws indent units with end flags and line switchers', () => {
      const wrapper = mount(Tree, { props: { treeData: makeData(), showLine: true, defaultExpandAll: true } })
      expect(wrapper.classes()).toContain('am-tree-show-line')
      expect(row(wrapper, 'a').findAll('.am-tree-indent-unit')).toHaveLength(0)
      const units = row(wrapper, 'a12').findAll('.am-tree-indent-unit')
      expect(units).toHaveLength(2)
      // a has a sibling below (line continues), a1 as well
      expect(units[0].classes()).not.toContain('am-tree-indent-unit-end')
      expect(units[1].classes()).not.toContain('am-tree-indent-unit-end')
      // b is not the last root, b1 is under it
      expect(row(wrapper, 'b1').findAll('.am-tree-indent-unit')[0].classes()).not.toContain('am-tree-indent-unit-end')
      expect(row(wrapper, 'a').find('.am-tree-switcher-line-icon').exists()).toBe(true)
      expect(row(wrapper, 'a').find('.am-tree-switcher-icon').exists()).toBe(false)
      expect(row(wrapper, 'a12').find('.am-tree-switcher-leaf-line').exists()).toBe(true)
      expect(row(wrapper, 'a12').classes()).toContain('am-tree-treenode-leaf-last')
    })

    it('marks the units of a last ancestor as ended', () => {
      const data: TreeDataNode[] = [{ key: 'r', children: [{ key: 'r1', children: [{ key: 'r11' }] }] }]
      const wrapper = mount(Tree, { props: { treeData: data, showLine: true, defaultExpandAll: true } })
      const units = row(wrapper, 'r11').findAll('.am-tree-indent-unit')
      expect(units.map(unit => unit.classes().includes('am-tree-indent-unit-end'))).toEqual([true, true])
    })

    it('showLeafIcon: true renders a file icon, a node renders it', () => {
      const file = mount(Tree, { props: { treeData: makeData(), showLine: { showLeafIcon: true } } })
      expect(row(file, 'c').find('.am-tree-switcher-line-icon .anticon-file').exists()).toBe(true)
      expect(row(file, 'c').find('.am-tree-switcher-leaf-line').exists()).toBe(false)
      const custom = mount(Tree, { props: { treeData: makeData(), showLine: { showLeafIcon: 'L' } } })
      expect(row(custom, 'c').find('.am-tree-switcher-line-icon').text()).toBe('L')
    })

    it('without showLine no unit is rendered', () => {
      const wrapper = mount(Tree, { props: { treeData: makeData(), defaultExpandAll: true } })
      expect(wrapper.findAll('.am-tree-indent-unit')).toHaveLength(0)
      expect(wrapper.findAll('.am-tree-indent')).toHaveLength(8)
    })
  })

  describe('virtual', () => {
    const big: TreeDataNode[] = Array.from({ length: 200 }, (_, i) => ({
      key: `n${i}`,
      title: `Node ${i}`,
      children: Array.from({ length: 10 }, (_, j) => ({ key: `n${i}-${j}`, title: `Leaf ${i}-${j}` })),
    }))

    it('only mounts the rows around the viewport when height is set', () => {
      const wrapper = mount(Tree, { props: { treeData: big, defaultExpandAll: true, height: 220 } })
      expect(css(wrapper).height).toBe('220px')
      const count = rows(wrapper).length
      expect(count).toBeGreaterThan(4)
      expect(count).toBeLessThan(20)
      expect(css(wrapper.find('.am-virtual-list-holder')).height).toBe(`${2200 * 44}px`)
    })

    it('virtual: false renders everything with the same structure', () => {
      const virtual = mount(Tree, { props: { treeData: big, defaultExpandedKeys: ['n0'], height: 220 } })
      const plain = mount(Tree, { props: { treeData: big, defaultExpandedKeys: ['n0'], height: 220, virtual: false } })
      expect(rows(plain)).toHaveLength(210)
      expect(css(plain).height).toBe('220px')
      const structure = (wrapper: VueWrapper<any>) => {
        const first = row(wrapper, 'n0-0')
        return {
          root: wrapper.classes().sort(),
          parents: [first.element.parentElement!.className.replace(/\s*am-virtual-list-item-(?:first|last)/g, ''), first.element.parentElement!.parentElement!.className],
          row: first.html(),
        }
      }
      expect(structure(plain)).toEqual(structure(virtual))
    })

    it('without height the tree grows with its content and renders every row', () => {
      const wrapper = mount(Tree, { props: { treeData: big } })
      expect(rows(wrapper)).toHaveLength(200)
      expect(css(wrapper).height).toBe('')
    })

    it('listHeight / listItemHeight are aliases, the pc names win', () => {
      const alias = mount(Tree, { props: { treeData: big, listHeight: 300, listItemHeight: 50 } })
      expect(css(alias).height).toBe('300px')
      expect(css(alias).getPropertyValue('--am-tree-item-height')).toBe('50px')
      expect(css(alias.find('.am-virtual-list-holder')).height).toBe(`${200 * 50}px`)
      const pc = mount(Tree, { props: { treeData: big, height: 200, listHeight: 300, itemHeight: 60, listItemHeight: 50 } })
      expect(css(pc).height).toBe('200px')
      expect(css(pc).getPropertyValue('--am-tree-item-height')).toBe('60px')
    })

    it('scrollTo scrolls to a key, an offset or a number', async () => {
      const wrapper = mount(Tree, { props: { treeData: big, height: 220, itemHeight: 44 } })
      const el = wrapper.element as HTMLElement
      wrapper.vm.scrollTo({ key: 'n100' })
      expect(el.scrollTop).toBe(100 * 44)
      wrapper.vm.scrollTo({ key: 'n100', offset: 10 })
      expect(el.scrollTop).toBe(100 * 44 - 10)
      wrapper.vm.scrollTo(88)
      expect(el.scrollTop).toBe(88)
      await nextTick()
      expect(wrapper.vm.nativeElement).toBe(el)
      // a hidden key is ignored
      wrapper.vm.scrollTo({ key: 'n100-3' })
      expect(el.scrollTop).toBe(88)
      expect(wrapper.emitted('scroll')).toBeUndefined()
      await wrapper.trigger('scroll')
      expect(wrapper.emitted('scroll')).toHaveLength(1)
    })

    it('scrollTo autoExpand expands the target first (uncontrolled)', async () => {
      const wrapper = mount(Tree, { props: { treeData: big, height: 220, itemHeight: 44 } })
      wrapper.vm.scrollTo({ key: 'n1', autoExpand: true })
      await nextTick()
      expect(wrapper.emitted('update:expandedKeys')![0]).toEqual([['n1']])
      expect((wrapper.element as HTMLElement).scrollTop).toBe(44)
    })
  })

  describe('attrs and semantic parts', () => {
    it('passes attrs, rootClass, classes and styles through', () => {
      const data = makeData()
      const wrapper = mount(Tree, {
        props: {
          treeData: data,
          showIcon: true,
          icon: 'i',
          rootClass: 'my-root',
          classes: { root: 'c-root', item: 'c-item', itemIcon: 'c-icon', itemTitle: 'c-title', itemSwitcher: 'c-switcher' },
          styles: { root: { color: 'red' }, item: { margin: '1px' }, itemTitle: { fontWeight: '700' } },
        },
        attrs: { 'class': 'from-attrs', 'data-test': 'tree', 'style': 'width: 200px' },
      })
      expect(wrapper.classes()).toEqual(expect.arrayContaining(['am-tree', 'my-root', 'c-root', 'from-attrs']))
      expect(wrapper.attributes('data-test')).toBe('tree')
      expect(css(wrapper).width).toBe('200px')
      expect(css(wrapper).color).toBe('red')
      const a = row(wrapper, 'a')
      expect(a.classes()).toContain('c-item')
      expect(css(a).margin).toBe('1px')
      expect(a.find('.am-tree-icon').classes()).toContain('c-icon')
      expect(a.find('.am-tree-title').classes()).toContain('c-title')
      expect(css(a.find('.am-tree-title')).fontWeight).toBe('700')
      expect(a.find('.am-tree-switcher').classes()).toContain('c-switcher')
    })

    it('blockNode can be turned off', () => {
      const wrapper = mount(Tree, { props: { treeData: makeData(), blockNode: false } })
      expect(wrapper.classes()).not.toContain('am-tree-block-node')
    })
  })

  describe('form', () => {
    it('notifies the FormItem once per change and keeps its id off the row checkboxes', async () => {
      const onFieldChange = vi.fn()
      const wrapper = mount(Tree, {
        props: { treeData: makeData(), checkable: true },
        global: {
          provide: {
            [formItemInputContextKey as symbol]: {
              status: computed(() => ''),
              id: computed(() => 'field-id'),
              onFieldChange,
              onFieldBlur: () => {},
              isFormItemInput: true,
            },
          },
        },
      })
      expect(wrapper.find('#field-id').exists()).toBe(false)
      await tapCheckbox(wrapper, 'a')
      expect(onFieldChange).toHaveBeenCalledTimes(1)
      await tapContent(wrapper, 'b')
      expect(onFieldChange).toHaveBeenCalledTimes(2)
    })
  })
})
