import type { TreeDataNode } from '../interface'
import { describe, expect, it } from 'vitest'
import {
  arrAdd,
  arrDel,
  calcSelectedKeys,
  conductCheck,
  conductExpandParent,
  convertDataToEntities,
  fillFieldNames,
  flattenTreeData,
  isCheckDisabled,
  parseCheckedKeys,
} from '../util'

/**
 * a
 * ├─ a1
 * │  ├─ a11
 * │  └─ a12
 * └─ a2
 * b
 * └─ b1
 *    └─ b11
 *       └─ b111
 */
function makeTree(patch: Record<string, Partial<TreeDataNode>> = {}): TreeDataNode[] {
  const n = (key: string, children?: TreeDataNode[]): TreeDataNode => ({ key, title: key, children, ...patch[key] })
  return [
    n('a', [n('a1', [n('a11'), n('a12')]), n('a2')]),
    n('b', [n('b1', [n('b11', [n('b111')])])]),
  ]
}

const sorted = (list: (string | number)[]) => [...list].sort()

function conduct(keys: string[], patch: Record<string, Partial<TreeDataNode>> = {}) {
  const result = conductCheck(keys, true, convertDataToEntities(makeTree(patch)))
  return { checked: sorted(result.checkedKeys), half: sorted(result.halfCheckedKeys) }
}

/** what the tree does when `key` is unchecked while `keys` are checked */
function uncheck(keys: string[], key: string, patch: Record<string, Partial<TreeDataNode>> = {}) {
  const entities = convertDataToEntities(makeTree(patch))
  const filled = conductCheck(keys, true, entities)
  const rest = filled.checkedKeys.filter(item => item !== key)
  const result = conductCheck(rest, { checked: false, halfCheckedKeys: filled.halfCheckedKeys }, entities)
  return { checked: sorted(result.checkedKeys), half: sorted(result.halfCheckedKeys) }
}

describe('tree util: data', () => {
  it('fillFieldNames falls back to the default names', () => {
    expect(fillFieldNames()).toEqual({ title: 'title', key: 'key', children: 'children' })
    expect(fillFieldNames({ title: 'name', children: 'items' })).toEqual({ title: 'name', key: 'key', children: 'items' })
  })

  it('convertDataToEntities links parents, children, levels and positions', () => {
    const { keyEntities, levelEntities } = convertDataToEntities(makeTree())
    expect(keyEntities.size).toBe(9)
    const a12 = keyEntities.get('a12')!
    expect(a12.pos).toBe('0-0-0-1')
    expect(a12.level).toBe(2)
    expect(a12.index).toBe(1)
    expect(a12.parent!.key).toBe('a1')
    expect(keyEntities.get('a')!.children.map(child => child.key)).toEqual(['a1', 'a2'])
    expect(levelEntities.map(list => list.map(entity => entity.key))).toEqual([
      ['a', 'b'],
      ['a1', 'a2', 'b1'],
      ['a11', 'a12', 'b11'],
      ['b111'],
    ])
  })

  it('uses the position as key when a node has none and honours fieldNames', () => {
    const data = [{ name: 'root', id: 'r', items: [{ name: 'child' }] }]
    const { keyEntities } = convertDataToEntities(data, { key: 'id', children: 'items' })
    expect([...keyEntities.keys()]).toEqual(['r', '0-0-0'])
    expect(flattenTreeData(data, true, { key: 'id', children: 'items' }).map(node => node.key)).toEqual(['r', '0-0-0'])
  })

  it('flattenTreeData only walks into expanded nodes', () => {
    const data = makeTree()
    expect(flattenTreeData(data, []).map(node => node.key)).toEqual(['a', 'b'])
    expect(flattenTreeData(data, ['a']).map(node => node.key)).toEqual(['a', 'a1', 'a2', 'b'])
    // an expanded child of a collapsed parent stays hidden
    expect(flattenTreeData(data, new Set(['a1', 'b'])).map(node => node.key)).toEqual(['a', 'b', 'b1'])
    expect(flattenTreeData(data, true)).toHaveLength(9)
    expect(flattenTreeData(undefined, true)).toEqual([])
  })

  it('flattenTreeData records level, position and first / last flags per level', () => {
    const nodes = flattenTreeData(makeTree(), true)
    const get = (key: string) => nodes.find(node => node.key === key)!
    expect(get('a').level).toBe(0)
    expect(get('a').isStart).toEqual([true])
    expect(get('a').isEnd).toEqual([false])
    expect(get('a12').level).toBe(2)
    expect(get('a12').pos).toBe('0-0-0-1')
    expect(get('a12').isStart).toEqual([true, true, false])
    expect(get('a12').isEnd).toEqual([false, false, true])
    expect(get('b111').isEnd).toEqual([true, true, true, true])
  })

  it('stays cheap with a large tree', () => {
    const data: TreeDataNode[] = Array.from({ length: 100 }, (_, i) => ({
      key: `p${i}`,
      children: Array.from({ length: 100 }, (_, j) => ({ key: `p${i}-c${j}` })),
    }))
    const entities = convertDataToEntities(data)
    expect(entities.keyEntities.size).toBe(10100)
    expect(flattenTreeData(data, true)).toHaveLength(10100)
    const { checkedKeys, halfCheckedKeys } = conductCheck(['p3', 'p7-c1'], true, entities)
    expect(checkedKeys).toHaveLength(102)
    expect(halfCheckedKeys).toEqual(['p7'])
  })
})

describe('tree util: keys', () => {
  it('arrAdd / arrDel never mutate', () => {
    const list = ['a']
    expect(arrAdd(list, 'b')).toEqual(['a', 'b'])
    expect(arrAdd(list, 'a')).toEqual(['a'])
    expect(arrAdd(list, 'a')).not.toBe(list)
    expect(arrDel(['a', 'b'], 'a')).toEqual(['b'])
    expect(list).toEqual(['a'])
  })

  it('parseCheckedKeys accepts a list or { checked, halfChecked }', () => {
    expect(parseCheckedKeys(['a'])).toEqual({ checkedKeys: ['a'], halfCheckedKeys: [] })
    expect(parseCheckedKeys({ checked: ['a'], halfChecked: ['b'] })).toEqual({ checkedKeys: ['a'], halfCheckedKeys: ['b'] })
    expect(parseCheckedKeys(undefined)).toEqual({ checkedKeys: [], halfCheckedKeys: [] })
    expect(parseCheckedKeys(null)).toEqual({ checkedKeys: [], halfCheckedKeys: [] })
  })

  it('calcSelectedKeys keeps one key in single mode', () => {
    expect(calcSelectedKeys(['a', 'b'], false)).toEqual(['a'])
    expect(calcSelectedKeys(['a', 'b'], true)).toEqual(['a', 'b'])
    expect(calcSelectedKeys(undefined, false)).toEqual([])
  })

  it('conductExpandParent adds every ancestor and drops unknown keys', () => {
    const { keyEntities } = convertDataToEntities(makeTree())
    expect(sorted(conductExpandParent(['b111', 'a2', 'nope'], keyEntities))).toEqual(['a', 'a2', 'b', 'b1', 'b11', 'b111'])
    expect(conductExpandParent(undefined, keyEntities)).toEqual([])
  })

  it('conductExpandParent stops above a disabled node', () => {
    const { keyEntities } = convertDataToEntities(makeTree({ b1: { disabled: true } }))
    expect(sorted(conductExpandParent(['b111'], keyEntities))).toEqual(['b1', 'b11', 'b111'])
  })

  it('isCheckDisabled', () => {
    expect(isCheckDisabled(undefined)).toBe(false)
    expect(isCheckDisabled({ key: 1 })).toBe(false)
    expect(isCheckDisabled({ key: 1, disabled: true })).toBe(true)
    expect(isCheckDisabled({ key: 1, disableCheckbox: true })).toBe(true)
    expect(isCheckDisabled({ key: 1, checkable: false })).toBe(true)
  })
})

describe('tree util: conductCheck (check)', () => {
  it('a checked parent checks all its descendants', () => {
    expect(conduct(['a'])).toEqual({ checked: ['a', 'a1', 'a11', 'a12', 'a2'], half: [] })
  })

  it('a checked leaf half checks its ancestors', () => {
    expect(conduct(['a11'])).toEqual({ checked: ['a11'], half: ['a', 'a1'] })
  })

  it('all children checked -> the parent is checked, up through a deep chain', () => {
    expect(conduct(['a11', 'a12'])).toEqual({ checked: ['a1', 'a11', 'a12'], half: ['a'] })
    expect(conduct(['a11', 'a12', 'a2'])).toEqual({ checked: ['a', 'a1', 'a11', 'a12', 'a2'], half: [] })
    expect(conduct(['b111'])).toEqual({ checked: ['b', 'b1', 'b11', 'b111'], half: [] })
  })

  it('drops keys that are not in the tree and accepts an empty list', () => {
    expect(conduct(['nope', 'a2'])).toEqual({ checked: ['a2'], half: ['a'] })
    expect(conduct([])).toEqual({ checked: [], half: [] })
    expect(conductCheck(undefined, true, convertDataToEntities(makeTree()))).toEqual({ checkedKeys: [], halfCheckedKeys: [] })
  })

  it('a disabled child is skipped when the parent is checked', () => {
    expect(conduct(['a'], { a2: { disabled: true } })).toEqual({ checked: ['a', 'a1', 'a11', 'a12'], half: [] })
    expect(conduct(['a'], { a1: { disableCheckbox: true } })).toEqual({ checked: ['a', 'a2'], half: [] })
  })

  it('a disabled child is ignored when the parent counts its children', () => {
    // the parent is checked as soon as every enabled child is, whatever the disabled one is
    expect(conduct(['a1'], { a2: { disabled: true } })).toEqual({ checked: ['a', 'a1', 'a11', 'a12'], half: [] })
    expect(conduct(['a2'], { a1: { checkable: false } })).toEqual({ checked: ['a', 'a2'], half: [] })
  })

  it('a checked disabled node keeps its state and conducts nowhere', () => {
    expect(conduct(['a1'], { a1: { disabled: true } })).toEqual({ checked: ['a1'], half: [] })
    // its children can still be changed, they just do not reach it
    expect(conduct(['a11', 'a12'], { a1: { disabled: true } })).toEqual({ checked: ['a11', 'a12'], half: [] })
  })

  it('a disabled parent blocks the conduction to the levels above', () => {
    expect(conduct(['b111'], { b1: { disabled: true } })).toEqual({ checked: ['b11', 'b111'], half: [] })
  })

  it('supports a custom getCheckDisabled', () => {
    const entities = convertDataToEntities(makeTree())
    const result = conductCheck(['a'], true, entities, node => node.key === 'a1')
    expect(sorted(result.checkedKeys)).toEqual(['a', 'a2'])
  })
})

describe('tree util: conductCheck (uncheck)', () => {
  it('unchecking a parent unchecks all its descendants', () => {
    expect(uncheck(['a'], 'a')).toEqual({ checked: [], half: [] })
    expect(uncheck(['a', 'b'], 'a')).toEqual({ checked: ['b', 'b1', 'b11', 'b111'], half: [] })
  })

  it('unchecking a leaf turns its ancestors half checked', () => {
    expect(uncheck(['a'], 'a11')).toEqual({ checked: ['a12', 'a2'], half: ['a', 'a1'] })
  })

  it('unchecking the last checked leaf clears the whole chain', () => {
    expect(uncheck(['a11'], 'a11')).toEqual({ checked: [], half: [] })
    expect(uncheck(['b111'], 'b111')).toEqual({ checked: [], half: [] })
  })

  it('unchecking a middle node clears its subtree only', () => {
    expect(uncheck(['a'], 'a1')).toEqual({ checked: ['a2'], half: ['a'] })
  })

  it('a disabled child keeps its checked state when the parent is unchecked', () => {
    const patch = { a2: { disabled: true } }
    const entities = convertDataToEntities(makeTree(patch))
    // a2 was checked before (e.g. by default keys)
    const filled = conductCheck(['a', 'a2'], true, entities)
    expect(sorted(filled.checkedKeys)).toEqual(['a', 'a1', 'a11', 'a12', 'a2'])
    const rest = filled.checkedKeys.filter(key => key !== 'a')
    const result = conductCheck(rest, { checked: false, halfCheckedKeys: filled.halfCheckedKeys }, entities)
    expect(sorted(result.checkedKeys)).toEqual(['a2'])
    expect(result.halfCheckedKeys).toEqual([])
  })

  it('a disabled parent is not changed by unchecking its children', () => {
    const patch = { a1: { disabled: true } }
    expect(uncheck(['a1', 'a11', 'a12'], 'a11', patch)).toEqual({ checked: ['a1', 'a12'], half: [] })
  })

  it('a half checked node keeps its checked children; the clean pass never adds a key', () => {
    const entities = convertDataToEntities(makeTree())
    const result = conductCheck(['a11', 'b111'], { checked: false, halfCheckedKeys: ['a', 'a1', 'b', 'b1', 'b11'] }, entities)
    expect(sorted(result.checkedKeys)).toEqual(['a11', 'b111'])
    expect(sorted(result.halfCheckedKeys)).toEqual(['a', 'a1', 'b', 'b1', 'b11'])
  })
})
