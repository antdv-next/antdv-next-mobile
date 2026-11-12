import type { CSSProperties } from 'vue'
import type { Numeric, RenderNodeFn } from '../_util/type'

export type PullToRefreshStatus = 'normal' | 'pulling' | 'canRelease' | 'refreshing' | 'complete'

export interface PullToRefreshRenderInfo {
  /** current pull distance in px */
  distance: number
}

export interface PullToRefreshSemanticClassNames {
  root?: string
  head?: string
  content?: string
}

export interface PullToRefreshSemanticStyles {
  root?: CSSProperties
  head?: CSSProperties
  content?: CSSProperties
}

export interface PullToRefreshProps {
  /** Whether it is refreshing. Supports `v-model:refreshing`; set it back to `false` when the data arrived. */
  refreshing?: boolean
  /** Text while pulling. The `pulling` slot wins. */
  pullingText?: RenderNodeFn<PullToRefreshRenderInfo>
  /** Text when releasing triggers the refresh. The `canRelease` slot wins. */
  canReleaseText?: RenderNodeFn<PullToRefreshRenderInfo>
  /** Text while refreshing. The `refreshing` slot wins. */
  refreshingText?: RenderNodeFn<PullToRefreshRenderInfo>
  /** Text after the refresh finished. The `complete` slot wins. */
  completeText?: RenderNodeFn<PullToRefreshRenderInfo>
  /** How long the complete text stays in ms, `0` skips it */
  completeDelay?: number
  /** Height of the head area */
  headHeight?: Numeric
  /** Pull distance that triggers the refresh, defaults to `headHeight` */
  threshold?: Numeric
  /** Duration of the rebound animation in ms */
  duration?: number
  disabled?: boolean
  rootClass?: string
  classes?: PullToRefreshSemanticClassNames
  styles?: PullToRefreshSemanticStyles
}

export interface PullToRefreshEmits {
  'update:refreshing': [refreshing: boolean]
  /** The user released past the threshold */
  'refresh': []
  'change': [info: { status: PullToRefreshStatus, distance: number }]
}

export interface PullToRefreshSlots {
  default?: () => any
  pulling?: (info: PullToRefreshRenderInfo) => any
  canRelease?: (info: PullToRefreshRenderInfo) => any
  refreshing?: (info: PullToRefreshRenderInfo) => any
  complete?: (info: PullToRefreshRenderInfo) => any
}
