import type { Key } from '../_util/type'

export interface MasonryLayoutInput {
  key: Key
  /** Rendered (or estimated) height in px; `undefined` while it is unknown */
  height?: number
  /** Fixed column index */
  column?: number
}

export interface MasonryPosition {
  column: number
  top: number
}

export interface MasonryLayoutResult {
  positions: Map<Key, MasonryPosition>
  /** Height of the tallest column (without a trailing gutter) */
  height: number
  /** Whether every item got a position */
  complete: boolean
}

export function normalizeColumns(columns: unknown, fallback = 2): number {
  const count = Math.floor(Number(columns))
  return Number.isFinite(count) && count > 0 ? count : fallback
}

/**
 * Masonry placement (same rule as antdv-next `usePositions`): items are visited in data order and each one
 * goes to its fixed `column` or to the currently shortest column (the first one on a tie), so positions
 * are stable for a given order. Placement stops at the first item whose height is still unknown:
 * everything after it would have to move once that height is measured.
 */
export function computeMasonryLayout(items: MasonryLayoutInput[], columns: number, gutter = 0): MasonryLayoutResult {
  const count = normalizeColumns(columns, 1)
  const gap = Number.isFinite(gutter) && gutter > 0 ? gutter : 0
  const columnHeights = Array.from<number>({ length: count }).fill(0)
  const positions = new Map<Key, MasonryPosition>()
  let complete = true

  for (let i = 0; i < items.length; i += 1) {
    const { key, height, column } = items[i]
    if (typeof height !== 'number' || !Number.isFinite(height)) {
      complete = false
      break
    }
    let target = 0
    if (typeof column === 'number' && Number.isFinite(column)) {
      target = Math.min(Math.max(Math.floor(column), 0), count - 1)
    }
    else {
      for (let c = 1; c < count; c += 1) {
        if (columnHeights[c] < columnHeights[target])
          target = c
      }
    }
    positions.set(key, { column: target, top: columnHeights[target] })
    columnHeights[target] += Math.max(height, 0) + gap
  }

  return {
    positions,
    height: Math.max(0, Math.max(...columnHeights) - gap),
    complete,
  }
}
