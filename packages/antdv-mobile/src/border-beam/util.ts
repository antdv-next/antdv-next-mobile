import type { BorderBeamColor, BorderBeamGradient } from './interface'

/** top, right, bottom, left */
export type BorderWidth = readonly [number, number, number, number]

export const DEFAULT_BORDER_BEAM_DURATION = 6
/** the last 30% of the beam is reserved for the transparent tail */
export const MAX_BEAM_COLOR_STOP_PERCENT = 70

function normalizeBorderBeamColor(value?: BorderBeamColor): BorderBeamGradient {
  return typeof value === 'string' ? (value ? [{ color: value, percent: 0 }] : []) : (value ?? [])
}

function fillGradientEnd(items: BorderBeamGradient): BorderBeamGradient {
  const lastItem = items[items.length - 1]
  if (!lastItem || lastItem.percent === 100)
    return items
  return [...items, { ...lastItem, percent: 100 }]
}

/** maps the public `0 ~ 100` stops into the visible segment, so the tail stays reserved */
function getMappedBeamColorStopPercent(percent: number): number {
  return Number(((Math.min(Math.max(percent, 0), 100) / 100) * MAX_BEAM_COLOR_STOP_PERCENT).toFixed(2))
}

export function getBorderBeamGradient(value?: BorderBeamColor): string | undefined {
  const stops = fillGradientEnd(normalizeBorderBeamColor(value))
    .map(item => `${item.color} ${getMappedBeamColorStopPercent(item.percent)}%`)
  return stops.length ? `linear-gradient(to left, ${stops.join(', ')}, transparent)` : undefined
}

export function isSameBorderWidth(left: BorderWidth, right: BorderWidth): boolean {
  return left[0] === right[0] && left[1] === right[1] && left[2] === right[2] && left[3] === right[3]
}

/** `2` -> `-2px`, `'0.5rem'` -> `calc(-1 * 0.5rem)` */
export function getInset(width: number | string): string {
  return typeof width === 'string' ? `calc(-1 * ${width})` : `-${width}px`
}
