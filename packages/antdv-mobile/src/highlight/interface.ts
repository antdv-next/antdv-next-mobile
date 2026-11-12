import type { CSSProperties } from 'vue'

export interface HighlightChunk {
  /** Slice of `content` */
  text: string
  /** Whether the slice matched a keyword */
  highlight: boolean
  /** Position in `content` */
  start: number
  end: number
  /** Index among the highlighted chunks, `-1` for plain text */
  index: number
}

export interface HighlightSemanticClassNames {
  root?: string
  highlight?: string
}

export interface HighlightSemanticStyles {
  root?: CSSProperties
  highlight?: CSSProperties
}

export interface HighlightProps {
  /** Source text */
  content?: string
  /** Keyword(s) to highlight */
  keywords?: string | string[]
  /** Match case */
  caseSensitive?: boolean
  /** Treat keywords as literal text (escape RegExp special characters). `false` turns them into RegExp sources */
  autoEscape?: boolean
  /** Root tag */
  tag?: string
  /** Tag wrapping a match */
  highlightTag?: string
  /** Extra class of a match */
  highlightClass?: string
  /** Tag wrapping the text between matches. Plain text nodes when neither it nor `unhighlightClass` is set */
  unhighlightTag?: string
  /** Extra class of the text between matches (wrapped in `unhighlightTag`, `span` by default) */
  unhighlightClass?: string
  rootClass?: string
  classes?: HighlightSemanticClassNames
  styles?: HighlightSemanticStyles
}

export interface HighlightSlots {
  /** Custom render of a match */
  highlight?: (props: { text: string, index: number }) => any
}
