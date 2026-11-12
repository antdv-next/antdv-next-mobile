import type { GetContainer } from '../_util/type'

export interface MaskProps {
  /** Whether the mask is visible. Supports `v-model:open`. */
  open?: boolean
  zIndex?: number
  /** Lock page scroll while visible */
  lockScroll?: boolean
  /** `'default'` uses the mask token, `'white'` a light translucent layer, or any css color */
  color?: 'default' | 'white' | string
  /** Close (emit `update:open` false) when clicked */
  closable?: boolean
  /** Teleport target. `false` (default) renders in place. */
  getContainer?: GetContainer
  destroyOnHidden?: boolean
  rootClass?: string
}

export interface MaskEmits {
  'update:open': [open: boolean]
  'click': [event: MouseEvent]
  'afterOpenChange': [open: boolean]
}

export interface MaskSlots {
  default?: () => any
}
