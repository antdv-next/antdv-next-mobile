import type { CSSProperties } from 'vue'

export interface FloatingPanelSemanticClassNames {
  root?: string
  header?: string
  content?: string
}

export interface FloatingPanelSemanticStyles {
  root?: CSSProperties
  header?: CSSProperties
  content?: CSSProperties
}

export interface FloatingPanelProps {
  /** Visible height of the panel in px. Supports `v-model:height`. */
  height?: number
  /** Heights (px) the panel snaps to. Default `[100, 60% of the viewport (or of the positioned parent)]`. */
  anchors?: number[]
  /** Dragging the content moves the panel (the content scrolls once the panel is fully expanded) */
  contentDraggable?: boolean
  /** Duration of the snap animation in ms */
  duration?: number
  /** Reserve the bottom safe area */
  safeArea?: boolean
  /** Lock page scroll, by default it is only locked while dragging */
  lockScroll?: boolean
  /** `true`: fixed to the viewport. `false`: absolutely positioned inside the nearest positioned ancestor. */
  fixed?: boolean
  zIndex?: number
  rootClass?: string
  classes?: FloatingPanelSemanticClassNames
  styles?: FloatingPanelSemanticStyles
}

export interface FloatingPanelEmits {
  'update:height': [height: number]
  /** Fires while dragging (`animating: false`) and when snapping to an anchor (`animating: true`) */
  'heightChange': [height: number, info: { animating: boolean }]
}

export interface FloatingPanelSlots {
  default?: () => any
  /** replaces the drag handle */
  header?: () => any
}

export interface FloatingPanelRef {
  setHeight: (height: number, options?: { immediate?: boolean }) => void
}
