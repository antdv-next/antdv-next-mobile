import type { CSSProperties, VNode, VNodeChild } from 'vue'
import { camelize, Comment, Fragment, isVNode, normalizeStyle, Text } from 'vue'

/**
 * Flattens slot content into a list of renderable children:
 * fragments (`v-for`, `<template>`) are unwrapped, comments (`v-if` placeholders) and blank text dropped.
 */
export function flattenChildren(children?: VNodeChild | VNodeChild[]): (VNode | string | number)[] {
  const result: (VNode | string | number)[] = []
  const list = Array.isArray(children) ? children : [children]
  list.forEach((child) => {
    if (child === null || child === undefined || typeof child === 'boolean')
      return
    if (Array.isArray(child)) {
      result.push(...flattenChildren(child))
    }
    else if (isVNode(child)) {
      if (child.type === Fragment) {
        result.push(...flattenChildren(child.children as VNodeChild[]))
      }
      else if (child.type === Comment) {
        // skip
      }
      else if (child.type === Text) {
        if (typeof child.children === 'string' && child.children.trim() !== '')
          result.push(child)
      }
      else {
        result.push(child)
      }
    }
    else if (typeof child === 'string') {
      if (child.trim() !== '')
        result.push(child)
    }
    else if (typeof child === 'number') {
      result.push(child)
    }
  })
  return result
}

/**
 * Merges a computed inline style with `$attrs.style` so that the user's value always wins,
 * whatever notation was used (`max-width` in a string vs `maxWidth` in an object).
 */
export function mergeAttrsStyle(base: CSSProperties | undefined, attrsStyle: unknown): CSSProperties {
  const user = normalizeStyle([attrsStyle]) as Record<string, any> | undefined
  const merged: Record<string, any> = { ...base }
  if (user) {
    Object.keys(user).forEach((key) => {
      merged[key.startsWith('--') ? key : camelize(key)] = user[key]
    })
  }
  return merged
}
