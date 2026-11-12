import type { Key } from '../_util/type'
import type { ListyGroup, ListyRowKey } from './interface'

export interface ListyGroupEntry {
  key: Key
  /** items of the group, in data order */
  items: any[]
  /** index of the header row in the flat row list */
  rowIndex: number
}

export interface ListyGroupRow {
  type: 'group'
  taggedKey: string
  group: ListyGroupEntry
}

export interface ListyItemRow {
  type: 'item'
  taggedKey: string
  item: any
  /** index in `items` */
  index: number
}

export type ListyRow = ListyGroupRow | ListyItemRow

export interface ListyFlatRows {
  rows: ListyRow[]
  groups: ListyGroupEntry[]
  /** flat row index -> index in `groups` (empty without groups) */
  rowGroups: number[]
}

/**
 * Type-tagged row key (`item:x` / `group:x`), so item and group keys never collide.
 * Built and compared as a whole, never parsed back.
 */
export function toTaggedKey(key: Key, type: 'item' | 'group'): string {
  return `${type}:${key}`
}

export function getItemKey(rowKey: ListyRowKey | undefined, item: any, index: number): Key {
  if (typeof rowKey === 'function')
    return rowKey(item, index)
  if (rowKey !== undefined && item !== null && typeof item === 'object' && item[rowKey] !== undefined)
    return item[rowKey]
  return index
}

/**
 * Flattens the data into the rows handed to VirtualList. With `group`, items sharing a group
 * key are collected under one header row (groups are ordered by their first item), exactly
 * like the PC implementation.
 */
export function flattenRows(items: any[], rowKey: ListyRowKey | undefined, group?: ListyGroup): ListyFlatRows {
  const itemRow = (item: any, index: number): ListyItemRow => ({
    type: 'item',
    item,
    index,
    taggedKey: toTaggedKey(getItemKey(rowKey, item, index), 'item'),
  })

  if (!group)
    return { rows: items.map(itemRow), groups: [], rowGroups: [] }

  const segments = new Map<Key, ListyItemRow[]>()
  items.forEach((item, index) => {
    const groupKey = typeof group.key === 'function' ? group.key(item) : group.key
    const segment = segments.get(groupKey)
    if (segment)
      segment.push(itemRow(item, index))
    else
      segments.set(groupKey, [itemRow(item, index)])
  })

  const rows: ListyRow[] = []
  const groups: ListyGroupEntry[] = []
  const rowGroups: number[] = []
  segments.forEach((segment, key) => {
    const entry: ListyGroupEntry = { key, items: segment.map(row => row.item), rowIndex: rows.length }
    const groupIndex = groups.push(entry) - 1
    rows.push({ type: 'group', taggedKey: toTaggedKey(key, 'group'), group: entry })
    rowGroups.push(groupIndex)
    segment.forEach((row) => {
      rows.push(row)
      rowGroups.push(groupIndex)
    })
  })
  return { rows, groups, rowGroups }
}

export interface RenderedRows {
  /** the row wrappers currently in the DOM, in order */
  elements: HTMLCollection
  /** flat row index of `elements[0]` */
  first: number
  /** top edge of the scroll viewport (client coordinates) */
  top: number
  /** bottom edge of the scroll viewport */
  bottom: number
}

/**
 * The rows VirtualList currently renders inside `root` (its scroll container). Row positions are
 * read from the DOM, so they are exact whatever the measured heights are.
 */
export function getRenderedRows(root: HTMLElement): RenderedRows | undefined {
  const elements = root.querySelector('.am-virtual-list-inner')?.children
  if (!elements?.length)
    return undefined
  const first = Number((elements[0] as HTMLElement).dataset.index)
  if (Number.isNaN(first))
    return undefined
  const top = root.getBoundingClientRect().top + root.clientTop
  return { elements, first, top, bottom: top + root.clientHeight }
}

export function getRowElement(rendered: RenderedRows, rowIndex: number): HTMLElement | undefined {
  return rendered.elements[rowIndex - rendered.first] as HTMLElement | undefined
}
