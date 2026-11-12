import type { PopoverPlacement } from '../popover/interface'
import type { TourPlacement } from './interface'
import { computePosition, parsePlacement } from '../popover/position'

export interface TourRect {
  left: number
  top: number
  width: number
  height: number
}

export interface TourPositionOptions {
  placement?: TourPlacement
  /** distance between the highlighted area and the panel */
  gap?: number
  /** minimal distance of the panel to the screen edges */
  padding?: number
  viewport: { width: number, height: number }
  /** safe-area insets the panel must not enter */
  safeTop?: number
  safeBottom?: number
}

export interface TourPosition {
  left: number
  top: number
  /** placement after flipping / falling back */
  placement: TourPlacement
  /** arrow center, measured from the panel start along the edge it sits on */
  arrowOffset: number
  /** `false` when the panel is centered or had to overlap the target */
  arrow: boolean
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

/**
 * Where to put the tour panel next to the highlighted area (both relative to the tour layer).
 * Built on the Popover placement helper (flip + shift), plus what a phone needs:
 * `left` / `right` fall back to `top` / `bottom` when the panel does not fit beside the target,
 * and the panel is always clamped into the screen (minus the safe areas).
 */
export function computeTourPosition(target: TourRect | null, panel: { width: number, height: number }, options: TourPositionOptions): TourPosition {
  const { viewport, gap = 12, padding = 16, safeTop = 0, safeBottom = 0 } = options
  const minTop = padding + safeTop
  const maxTop = viewport.height - safeBottom - panel.height - padding
  const maxLeft = viewport.width - panel.width - padding

  if (!target || options.placement === 'center') {
    return {
      left: Math.round(clamp((viewport.width - panel.width) / 2, padding, maxLeft)),
      top: Math.round(clamp((viewport.height - panel.height) / 2, minTop, maxTop)),
      placement: 'center',
      arrowOffset: 0,
      arrow: false,
    }
  }

  let placement = (options.placement ?? 'bottom') as PopoverPlacement
  const { side } = parsePlacement(placement)
  if (side === 'left' || side === 'right') {
    const spaceLeft = target.left - padding
    const spaceRight = viewport.width - (target.left + target.width) - padding
    if (Math.max(spaceLeft, spaceRight) < panel.width + gap) {
      const spaceTop = target.top - minTop
      const spaceBottom = viewport.height - safeBottom - (target.top + target.height) - padding
      placement = spaceBottom >= spaceTop ? 'bottom' : 'top'
    }
  }

  // the helper knows a single padding: move the safe areas out of its coordinate system
  const next = computePosition(
    { ...target, top: target.top - safeTop },
    panel,
    {
      placement,
      gap,
      padding,
      viewport: { width: viewport.width, height: viewport.height - safeTop - safeBottom },
      autoAdjust: true,
      arrowInset: 16,
    },
  )
  const rawTop = next.top + safeTop
  const top = clamp(rawTop, minTop, maxTop)
  const left = clamp(next.left, padding, maxLeft)
  const vertical = parsePlacement(next.placement).side === 'top' || parsePlacement(next.placement).side === 'bottom'
  // clamped along the main axis: the panel covers a part of the target, an arrow would point nowhere
  const overlap = vertical ? Math.abs(top - rawTop) > 0.5 : Math.abs(left - next.left) > 0.5

  return {
    left: Math.round(left),
    top: Math.round(top),
    placement: next.placement,
    arrowOffset: Math.round(next.arrowOffset),
    arrow: !overlap,
  }
}

export function isInViewport(el: HTMLElement) {
  const width = window.innerWidth || document.documentElement.clientWidth
  const height = window.innerHeight || document.documentElement.clientHeight
  const { top, right, bottom, left } = el.getBoundingClientRect()
  return top >= 0 && left >= 0 && right <= width && bottom <= height
}
