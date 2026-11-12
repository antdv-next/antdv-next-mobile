import type { PopoverPlacement } from './interface'

export interface PopoverRect {
  left: number
  top: number
  width: number
  height: number
}

export interface ComputePositionOptions {
  placement: PopoverPlacement
  /** distance between the trigger and the popup */
  gap?: number
  /** minimal distance to the viewport edges */
  padding?: number
  viewport: { width: number, height: number }
  /** flip to the opposite side / shift along the edge when there is not enough room */
  autoAdjust?: boolean
  /** minimal distance of the arrow center to the popup corners */
  arrowInset?: number
}

export interface PopoverPosition {
  /** viewport coordinates of the popup */
  left: number
  top: number
  /** placement after flipping */
  placement: PopoverPlacement
  /** arrow center, measured from the popup start along the edge it sits on */
  arrowOffset: number
}

type Side = 'top' | 'bottom' | 'left' | 'right'
type Align = 'start' | 'center' | 'end'

const opposite: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }

export function parsePlacement(placement: PopoverPlacement): { side: Side, align: Align } {
  const match = /^(top|bottom|left|right)(Left|Right|Top|Bottom)?$/.exec(placement)
  const side = (match?.[1] ?? 'top') as Side
  const suffix = match?.[2]
  let align: Align = 'center'
  if (suffix === 'Left' || suffix === 'Top')
    align = 'start'
  else if (suffix === 'Right' || suffix === 'Bottom')
    align = 'end'
  return { side, align }
}

function composePlacement(side: Side, align: Align): PopoverPlacement {
  if (align === 'center')
    return side
  const vertical = side === 'top' || side === 'bottom'
  const suffix = vertical ? (align === 'start' ? 'Left' : 'Right') : (align === 'start' ? 'Top' : 'Bottom')
  return `${side}${suffix}` as PopoverPlacement
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

/**
 * Where to put a popup of size `popup` next to `trigger` (both in viewport coordinates).
 * Dependency free: flips to the opposite side when the preferred one is too small and
 * shifts along the edge so the popup stays inside the viewport.
 */
export function computePosition(trigger: PopoverRect, popup: { width: number, height: number }, options: ComputePositionOptions): PopoverPosition {
  const { gap = 8, padding = 8, viewport, autoAdjust = true, arrowInset = 12 } = options
  let { side } = parsePlacement(options.placement)
  const { align } = parsePlacement(options.placement)
  const vertical = side === 'top' || side === 'bottom'

  if (autoAdjust) {
    const space: Record<Side, number> = {
      top: trigger.top - padding,
      bottom: viewport.height - (trigger.top + trigger.height) - padding,
      left: trigger.left - padding,
      right: viewport.width - (trigger.left + trigger.width) - padding,
    }
    const need = (vertical ? popup.height : popup.width) + gap
    if (space[side] < need && space[opposite[side]] > space[side])
      side = opposite[side]
  }

  let left: number
  let top: number
  let arrowOffset: number

  if (vertical) {
    top = side === 'top' ? trigger.top - popup.height - gap : trigger.top + trigger.height + gap
    if (align === 'start')
      left = trigger.left
    else if (align === 'end')
      left = trigger.left + trigger.width - popup.width
    else
      left = trigger.left + trigger.width / 2 - popup.width / 2
    if (autoAdjust)
      left = clamp(left, padding, viewport.width - popup.width - padding)
    arrowOffset = clamp(trigger.left + trigger.width / 2 - left, arrowInset, popup.width - arrowInset)
  }
  else {
    left = side === 'left' ? trigger.left - popup.width - gap : trigger.left + trigger.width + gap
    if (align === 'start')
      top = trigger.top
    else if (align === 'end')
      top = trigger.top + trigger.height - popup.height
    else
      top = trigger.top + trigger.height / 2 - popup.height / 2
    if (autoAdjust)
      top = clamp(top, padding, viewport.height - popup.height - padding)
    arrowOffset = clamp(trigger.top + trigger.height / 2 - top, arrowInset, popup.height - arrowInset)
  }

  return { left, top, placement: composePlacement(side, align), arrowOffset }
}
