import type { Component, CSSProperties } from 'vue'
import type { SizeType } from '../_util/type'

export type FlexGap = SizeType | number | string

export interface FlexProps {
  /** `flex-direction: column` */
  vertical?: boolean
  /** Shortcut of `vertical` (`orientation="vertical"`) */
  orientation?: 'horizontal' | 'vertical'
  /** `true` equals `wrap`, or any `flex-wrap` value */
  wrap?: boolean | CSSProperties['flexWrap']
  justify?: CSSProperties['justifyContent']
  align?: CSSProperties['alignItems']
  /** `flex` shorthand of the container itself */
  flex?: CSSProperties['flex']
  /** `small` (8px) / `middle` (16px) / `large` (24px), a number (px) or any CSS length */
  gap?: FlexGap
  /** Root element / component */
  component?: string | Component
  rootClass?: string
}

export interface FlexSlots {
  default?: () => any
}
