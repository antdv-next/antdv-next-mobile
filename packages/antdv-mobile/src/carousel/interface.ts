import type { CSSProperties } from 'vue'
import type { RenderNodeFn } from '../_util/type'

export type CarouselEffect = 'scrollx' | 'fade'
export type CarouselDotPlacement = 'top' | 'bottom' | 'start' | 'end'

export interface CarouselIndicatorInfo {
  /** index of the current slide */
  current: number
  /** number of slides */
  total: number
}

export interface CarouselSemanticClassNames {
  root?: string
  track?: string
  slide?: string
  dots?: string
  dot?: string
}

export interface CarouselSemanticStyles {
  root?: CSSProperties
  track?: CSSProperties
  slide?: CSSProperties
  dots?: CSSProperties
  dot?: CSSProperties
}

export interface CarouselProps {
  /** Auto switch. `{ dotDuration: true }` also shows the progress on the active dot. */
  autoplay?: boolean | { dotDuration?: boolean }
  /** Interval of autoplay in ms */
  autoplaySpeed?: number
  /** Show the indicator dots. `{ class }` adds a class to the dots container. */
  dots?: boolean | { class?: string }
  dotPlacement?: CarouselDotPlacement
  /** @deprecated use `dotPlacement` */
  dotPosition?: CarouselDotPlacement | 'left' | 'right'
  /** Seamless loop */
  infinite?: boolean
  /** Duration of the switch animation in ms */
  speed?: number
  initialSlide?: number
  /** Slide vertically. Defaults to `true` when `dotPlacement` is `start` / `end` (same as PC). */
  vertical?: boolean
  /** Follow the finger and switch by swiping */
  draggable?: boolean
  /** Temporarily enable / disable the touch gesture (e.g. while an inner element handles it) */
  allowTouchMove?: boolean
  effect?: CarouselEffect
  /** Size of one slide in percent of the carousel (use < 100 for peeking cards) */
  slideSize?: number
  /** Offset of the track in percent of the carousel */
  trackOffset?: number
  /** Without `infinite`: keep the first / last slide attached to the edge instead of applying `trackOffset` */
  stuckAtBoundary?: boolean
  /** Custom indicator, replaces the dots. The same-named slot wins. */
  indicator?: RenderNodeFn<CarouselIndicatorInfo>
  /** Stop the propagation of touch events handled by the carousel (nested carousels) */
  stopPropagation?: boolean
  rootClass?: string
  classes?: CarouselSemanticClassNames
  styles?: CarouselSemanticStyles
}

export interface CarouselEmits {
  beforeChange: [current: number, next: number]
  afterChange: [current: number]
}

export interface CarouselSlots {
  /** every direct child is a slide */
  default?: () => any
  indicator?: (info: CarouselIndicatorInfo) => any
}

export interface CarouselRef {
  goTo: (slide: number, dontAnimate?: boolean) => void
  next: () => void
  prev: () => void
  /** re-measure the carousel (it is done automatically on resize) */
  resize: () => void
}
