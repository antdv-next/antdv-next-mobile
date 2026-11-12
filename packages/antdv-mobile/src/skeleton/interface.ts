import type { CSSProperties } from 'vue'
import type { Numeric, SizeType } from '../_util/type'

export interface SkeletonAvatarConfig {
  /** `'small' | 'middle' | 'large'` or a number of pixels */
  size?: SizeType | number
  shape?: 'circle' | 'square'
}

export interface SkeletonTitleConfig {
  width?: Numeric
}

export interface SkeletonParagraphConfig {
  rows?: number
  /** Width of the last row, or of every row when an array is given */
  width?: Numeric | Numeric[]
}

export interface SkeletonSemanticClassNames {
  root?: string
  header?: string
  section?: string
  avatar?: string
  title?: string
  paragraph?: string
}

export interface SkeletonSemanticStyles {
  root?: CSSProperties
  header?: CSSProperties
  section?: CSSProperties
  avatar?: CSSProperties
  title?: CSSProperties
  paragraph?: CSSProperties
}

export interface SkeletonProps {
  /** Show the shimmer animation */
  active?: boolean
  /** Render the placeholder when `true`, the default slot otherwise */
  loading?: boolean
  avatar?: boolean | SkeletonAvatarConfig
  title?: boolean | SkeletonTitleConfig
  paragraph?: boolean | SkeletonParagraphConfig
  /** Rounded title and paragraph rows */
  round?: boolean
  rootClass?: string
  classes?: SkeletonSemanticClassNames
  styles?: SkeletonSemanticStyles
}

export interface SkeletonSlots {
  default?: () => any
}

export interface SkeletonElementSemanticClassNames {
  root?: string
  content?: string
}

export interface SkeletonElementSemanticStyles {
  root?: CSSProperties
  content?: CSSProperties
}

export interface SkeletonButtonProps {
  active?: boolean
  /** Fit the width of the parent */
  block?: boolean
  size?: SizeType
  shape?: 'default' | 'circle' | 'round' | 'square'
  rootClass?: string
  classes?: SkeletonElementSemanticClassNames
  styles?: SkeletonElementSemanticStyles
}

export interface SkeletonAvatarProps {
  active?: boolean
  size?: SizeType | number
  shape?: 'circle' | 'square'
  rootClass?: string
  classes?: SkeletonElementSemanticClassNames
  styles?: SkeletonElementSemanticStyles
}

export interface SkeletonInputProps {
  active?: boolean
  block?: boolean
  size?: SizeType
  rootClass?: string
  classes?: SkeletonElementSemanticClassNames
  styles?: SkeletonElementSemanticStyles
}

export interface SkeletonImageProps {
  active?: boolean
  /** Side length (number -> px) or `[width, height]` */
  size?: Numeric | [Numeric, Numeric]
  rootClass?: string
  classes?: SkeletonElementSemanticClassNames
  styles?: SkeletonElementSemanticStyles
}
