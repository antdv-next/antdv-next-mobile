import type { CSSProperties } from 'vue'
import type { SizeType, VueNode } from '../_util/type'

export type AvatarSize = SizeType | number
export type AvatarShape = 'circle' | 'square'

export interface AvatarSemanticClassNames {
  root?: string
}

export interface AvatarSemanticStyles {
  root?: CSSProperties
}

export interface AvatarProps {
  /** Image url, or a custom image node */
  src?: VueNode
  /** `srcset` of the image */
  srcSet?: string
  alt?: string
  /** Icon avatar, the same-named slot wins */
  icon?: VueNode
  shape?: AvatarShape
  /** `small` / `middle` / `large` or a number in px */
  size?: AvatarSize
  /** Space (px) between the text and both edges, the text is scaled down to fit */
  gap?: number
  draggable?: boolean | 'true' | 'false'
  crossOrigin?: '' | 'anonymous' | 'use-credentials'
  /** Mobile only: `object-fit` of the image */
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  rootClass?: string
  classes?: AvatarSemanticClassNames
  styles?: AvatarSemanticStyles
}

export interface AvatarEmits {
  /** The image failed to load, the avatar falls back to `icon` / text */
  error: [event: Event]
}

export interface AvatarSlots {
  default?: () => any
  icon?: () => any
  src?: () => any
}

export interface AvatarGroupMax {
  /** Max avatars to show, the rest is folded into `+N` */
  count?: number
  /** Style of the `+N` avatar */
  style?: CSSProperties
}

export interface AvatarGroupProps {
  max?: AvatarGroupMax
  /** Size of every avatar in the group */
  size?: AvatarSize
  /** Shape of every avatar in the group */
  shape?: AvatarShape
  rootClass?: string
}

export interface AvatarGroupSlots {
  default?: () => any
  /** Custom content of the folded avatar */
  overflow?: (ctx: { count: number }) => any
}
