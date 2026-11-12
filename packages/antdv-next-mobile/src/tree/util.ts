import type { Key } from '../_util/type'
import type { TreeCheckedKeys, TreeDataNode, TreeFieldNames } from './interface'

export interface TreeResolvedFieldNames {
  title: string
  key: string
  children: string
}

export interface TreeEntity {
  key: Key
  /** the node of `treeData` */
  node: TreeDataNode
  parent?: TreeEntity
  children: TreeEntity[]
  /** depth, `0` for root nodes */
  level: number
  /** index among its siblings */
  index: number
  /** `0-1-2` */
  pos: string
}

export interface TreeEntities {
  keyEntities: Map<Key, TreeEntity>
  /** entities grouped by level, in document order */
  levelEntities: TreeEntity[][]
}

export interface TreeFlattenNode {
  key: Key
  data: TreeDataNode
  level: number
  pos: string
  /** per level (ancestors, then the node itself): is it the first child */
  isStart: boolean[]
  /** per level (ancestors, then the node itself): is it the last child */
  isEnd: boolean[]
}

export interface TreeConductResult {
  checkedKeys: Key[]
  halfCheckedKeys: Key[]
}

export interface TreeConductUncheck {
  checked: false
  halfCheckedKeys: Key[]
}

export type TreeGetCheckDisabled = (node: TreeDataNode) => boolean

export function fillFieldNames(fieldNames?: TreeFieldNames): TreeResolvedFieldNames {
  return {
    title: fieldNames?.title || 'title',
    key: fieldNames?.key || 'key',
    children: fieldNames?.children || 'children',
  }
}

export function getNodeKey(node: TreeDataNode, pos: string, fieldNames: TreeResolvedFieldNames): Key {
  const key = node[fieldNames.key]
  return key !== undefined && key !== null ? key : pos
}

export function getNodeChildren(node: TreeDataNode, fieldNames: TreeResolvedFieldNames): TreeDataNode[] {
  const children = node[fieldNames.children]
  return Array.isArray(children) ? children : []
}

export function arrAdd(list: Key[], key: Key): Key[] {
  return list.includes(key) ? list.slice() : [...list, key]
}

export function arrDel(list: Key[], key: Key): Key[] {
  return list.filter(item => item !== key)
}

/** Indexes every node by key (with parent / children / level links). */
export function convertDataToEntities(treeData: TreeDataNode[] | undefined, fieldNames?: TreeFieldNames): TreeEntities {
  const names = fillFieldNames(fieldNames)
  const keyEntities = new Map<Key, TreeEntity>()
  const levelEntities: TreeEntity[][] = []

  function dig(list: TreeDataNode[], parent: TreeEntity | undefined, level: number) {
    const bucket = levelEntities[level] ?? (levelEntities[level] = [])
    list.forEach((node, index) => {
      if (!node || typeof node !== 'object')
        return
      const pos = parent ? `${parent.pos}-${index}` : `0-${index}`
      const entity: TreeEntity = { key: getNodeKey(node, pos, names), node, parent, children: [], level, index, pos }
      keyEntities.set(entity.key, entity)
      bucket.push(entity)
      parent?.children.push(entity)
      const children = getNodeChildren(node, names)
      if (children.length)
        dig(children, entity, level + 1)
    })
  }

  dig(treeData ?? [], undefined, 0)
  return { keyEntities, levelEntities }
}

/**
 * The visible rows: every root node plus the children of expanded nodes, in display order.
 * `expandedKeys: true` expands everything.
 */
export function flattenTreeData(
  treeData: TreeDataNode[] | undefined,
  expandedKeys: Key[] | Set<Key> | true,
  fieldNames?: TreeFieldNames,
): TreeFlattenNode[] {
  const names = fillFieldNames(fieldNames)
  const expanded = expandedKeys === true ? true : expandedKeys instanceof Set ? expandedKeys : new Set(expandedKeys)
  const result: TreeFlattenNode[] = []

  function dig(list: TreeDataNode[], parent: TreeFlattenNode | undefined, level: number) {
    const last = list.length - 1
    list.forEach((data, index) => {
      if (!data || typeof data !== 'object')
        return
      const pos = parent ? `${parent.pos}-${index}` : `0-${index}`
      const node: TreeFlattenNode = {
        key: getNodeKey(data, pos, names),
        data,
        level,
        pos,
        isStart: parent ? [...parent.isStart, index === 0] : [index === 0],
        isEnd: parent ? [...parent.isEnd, index === last] : [index === last],
      }
      result.push(node)
      if (expanded === true || expanded.has(node.key)) {
        const children = getNodeChildren(data, names)
        if (children.length)
          dig(children, node, level + 1)
      }
    })
  }

  dig(treeData ?? [], undefined, 0)
  return result
}

/** A node whose checkbox can not be toggled stops the conduction (same rule as PC). */
export function isCheckDisabled(node: TreeDataNode | undefined): boolean {
  if (!node)
    return false
  return !!(node.disabled || node.disableCheckbox) || node.checkable === false
}

function removeFromCheckedKeys(halfCheckedKeys: Set<Key>, checkedKeys: Set<Key>) {
  const filtered: Key[] = []
  halfCheckedKeys.forEach((key) => {
    if (!checkedKeys.has(key))
      filtered.push(key)
  })
  return filtered
}

/** bottom-up pass shared by fill and clean: derives the state of every parent from its enabled children */
function conductUp(
  levelEntities: TreeEntity[][],
  checkedKeys: Set<Key>,
  halfCheckedKeys: Set<Key>,
  getCheckDisabled: TreeGetCheckDisabled,
  fill: boolean,
) {
  const visited = new Set<Key>()
  for (let level = levelEntities.length - 1; level >= 0; level -= 1) {
    const list = levelEntities[level] ?? []
    for (let i = 0; i < list.length; i += 1) {
      const entity = list[i]
      const parent = entity.parent
      if (getCheckDisabled(entity.node) || !parent || visited.has(parent.key))
        continue
      // a disabled parent is never changed by its children
      if (getCheckDisabled(parent.node)) {
        visited.add(parent.key)
        continue
      }
      let allChecked = true
      let partialChecked = false
      parent.children.forEach((child) => {
        if (getCheckDisabled(child.node))
          return
        const checked = checkedKeys.has(child.key)
        if (allChecked && !checked)
          allChecked = false
        if (!partialChecked && (checked || halfCheckedKeys.has(child.key)))
          partialChecked = true
      })
      if (fill) {
        if (allChecked)
          checkedKeys.add(parent.key)
      }
      else if (!allChecked) {
        checkedKeys.delete(parent.key)
      }
      if (partialChecked)
        halfCheckedKeys.add(parent.key)
      visited.add(parent.key)
    }
  }
}

/** checked keys conduct down to their enabled children, then up to their parents */
function fillConductCheck(keys: Set<Key>, levelEntities: TreeEntity[][], getCheckDisabled: TreeGetCheckDisabled): TreeConductResult {
  const checkedKeys = new Set(keys)
  const halfCheckedKeys = new Set<Key>()

  for (let level = 0; level < levelEntities.length; level += 1) {
    (levelEntities[level] ?? []).forEach((entity) => {
      if (checkedKeys.has(entity.key) && !getCheckDisabled(entity.node)) {
        entity.children.forEach((child) => {
          if (!getCheckDisabled(child.node))
            checkedKeys.add(child.key)
        })
      }
    })
  }

  conductUp(levelEntities, checkedKeys, halfCheckedKeys, getCheckDisabled, true)

  return {
    checkedKeys: Array.from(checkedKeys),
    halfCheckedKeys: removeFromCheckedKeys(halfCheckedKeys, checkedKeys),
  }
}

/** unchecked keys (neither checked nor half checked) conduct down to their enabled children, then up */
function cleanConductCheck(
  keys: Set<Key>,
  halfKeys: Key[],
  levelEntities: TreeEntity[][],
  getCheckDisabled: TreeGetCheckDisabled,
): TreeConductResult {
  const checkedKeys = new Set(keys)
  const prevHalfCheckedKeys = new Set(halfKeys)

  for (let level = 0; level < levelEntities.length; level += 1) {
    (levelEntities[level] ?? []).forEach((entity) => {
      if (!checkedKeys.has(entity.key) && !prevHalfCheckedKeys.has(entity.key) && !getCheckDisabled(entity.node)) {
        entity.children.forEach((child) => {
          if (!getCheckDisabled(child.node))
            checkedKeys.delete(child.key)
        })
      }
    })
  }

  const halfCheckedKeys = new Set<Key>()
  conductUp(levelEntities, checkedKeys, halfCheckedKeys, getCheckDisabled, false)

  return {
    checkedKeys: Array.from(checkedKeys),
    halfCheckedKeys: removeFromCheckedKeys(halfCheckedKeys, checkedKeys),
  }
}

/**
 * Parent / child check conduction, a port of `conductCheck` of the PC tree (`@v-c/tree`).
 *
 * - `checked: true`: `keyList` are checked keys. Every checked node checks its enabled children;
 *   a parent whose enabled children are all checked becomes checked, otherwise half checked
 *   when one of them is checked / half checked.
 * - `checked: { checked: false, halfCheckedKeys }`: `keyList` are the keys left after a node was
 *   unchecked and `halfCheckedKeys` the previous half checked keys. Every node that is neither
 *   checked nor half checked unchecks its enabled children; parents are derived again.
 *
 * Disabled nodes (`disabled`, `disableCheckbox`, `checkable: false`) keep their own state: they
 * neither pass a change down nor take one from their children, and they are ignored when a parent
 * counts its children. Keys that are not in the tree are dropped.
 */
export function conductCheck(
  keyList: Key[] | undefined,
  checked: true | TreeConductUncheck,
  entities: TreeEntities,
  getCheckDisabled: TreeGetCheckDisabled = isCheckDisabled,
): TreeConductResult {
  const { keyEntities, levelEntities } = entities
  const keys = new Set((keyList ?? []).filter(key => keyEntities.has(key)))
  if (checked === true)
    return fillConductCheck(keys, levelEntities, getCheckDisabled)
  return cleanConductCheck(keys, checked.halfCheckedKeys, levelEntities, getCheckDisabled)
}

/** The given keys plus all their ancestors (stops above a disabled node). Unknown keys are dropped. */
export function conductExpandParent(keyList: Key[] | undefined, keyEntities: Map<Key, TreeEntity>): Key[] {
  const expandedKeys = new Set<Key>()
  ;(keyList ?? []).forEach((key) => {
    let entity = keyEntities.get(key)
    while (entity && !expandedKeys.has(entity.key)) {
      expandedKeys.add(entity.key)
      if (entity.node.disabled)
        break
      entity = entity.parent
    }
  })
  return Array.from(expandedKeys)
}

/** `checkedKeys` prop -> `{ checkedKeys, halfCheckedKeys }` */
export function parseCheckedKeys(keys: TreeCheckedKeys | null | undefined): TreeConductResult {
  if (Array.isArray(keys))
    return { checkedKeys: keys, halfCheckedKeys: [] }
  if (keys && typeof keys === 'object')
    return { checkedKeys: keys.checked ?? [], halfCheckedKeys: keys.halfChecked ?? [] }
  return { checkedKeys: [], halfCheckedKeys: [] }
}

/** single mode keeps the first key only */
export function calcSelectedKeys(keys: Key[] | undefined, multiple: boolean): Key[] {
  const list = keys ?? []
  if (multiple || list.length <= 1)
    return list
  return [list[0]]
}
