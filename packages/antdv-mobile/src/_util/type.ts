import type { Component, CSSProperties, VNodeChild } from 'vue'

/**
 * Render-type prop contract (same as antdv-next): a plain node (string / number / VNode)
 * or a render function. Every `VueNode` prop also has a same-named slot; the slot wins.
 */
export type VueNode = VNodeChild | (() => VNodeChild)
export type RenderNodeFn<T = any> = VNodeChild | ((ctx: T) => VNodeChild)

export type SizeType = 'small' | 'middle' | 'large' | undefined
export type DirectionType = 'ltr' | 'rtl' | undefined
export type ValidateStatus = 'success' | 'warning' | 'error' | 'validating' | ''
export type Key = string | number
export type Numeric = string | number
export type MaybeArray<T> = T | T[]
export type GetContainer = string | HTMLElement | (() => HTMLElement) | false

export type SemanticClasses<K extends string> = Partial<Record<K, string>>
export type SemanticStyles<K extends string> = Partial<Record<K, CSSProperties>>

export type { Component, CSSProperties, VNodeChild }
