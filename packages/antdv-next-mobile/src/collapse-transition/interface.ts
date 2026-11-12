import type { CSSProperties } from 'vue'

export interface CollapseTransitionSemanticClassNames {
  root?: string
}

export interface CollapseTransitionSemanticStyles {
  root?: CSSProperties
}

export interface CollapseTransitionProps {
  /** Whether the content is expanded */
  open?: boolean
  /** Render the content before it was expanded for the first time */
  forceRender?: boolean
  /** Remove the content from the DOM while collapsed */
  destroyOnHidden?: boolean
  /** Play the expand animation when first rendered expanded */
  appear?: boolean
  /** Root tag */
  tag?: string
  rootClass?: string
  classes?: CollapseTransitionSemanticClassNames
  styles?: CollapseTransitionSemanticStyles
}

export interface CollapseTransitionEmits {
  /** The expand / collapse animation finished */
  afterOpenChange: [open: boolean]
}

export interface CollapseTransitionSlots {
  default?: () => any
}
