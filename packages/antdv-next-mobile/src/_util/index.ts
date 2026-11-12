import type { CSSProperties } from 'vue'
import type { GetContainer, Numeric } from './type'

export const inBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

export const isDef = <T>(val: T): val is NonNullable<T> => val !== undefined && val !== null
export const isFunction = (val: unknown): val is (...args: any[]) => any => typeof val === 'function'
export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'
export const isPromise = <T = any>(val: unknown): val is Promise<T> => isObject(val) && isFunction(val.then) && isFunction(val.catch)
export const isNumeric = (val: unknown): val is Numeric => typeof val === 'number' || (typeof val === 'string' && /^-?\d+(?:\.\d+)?$/.test(val))

export function noop() {}

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max)
}

/** `12` -> `12px`, `'1rem'` -> `'1rem'`, `undefined` -> `undefined` */
export function addUnit(value?: Numeric | null): string | undefined {
  if (!isDef(value) || value === '')
    return undefined
  return isNumeric(value) ? `${value}px` : String(value)
}

export function getSizeStyle(size?: Numeric | [Numeric, Numeric]): CSSProperties | undefined {
  if (!isDef(size))
    return undefined
  if (Array.isArray(size))
    return { width: addUnit(size[0]), height: addUnit(size[1]) }
  const v = addUnit(size)
  return { width: v, height: v }
}

export function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (value === undefined || value === null)
    return []
  return Array.isArray(value) ? value : [value]
}

export function padZero(num: Numeric, length = 2) {
  return String(num).padStart(length, '0')
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const ret = {} as Pick<T, K>
  keys.forEach((k) => {
    if (k in obj)
      ret[k] = obj[k]
  })
  return ret
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> {
  const ret = { ...obj }
  keys.forEach(k => delete ret[k])
  return ret
}

export function raf(fn: FrameRequestCallback): number {
  return inBrowser ? requestAnimationFrame(fn) : -1
}

export function cancelRaf(id: number) {
  if (inBrowser)
    cancelAnimationFrame(id)
}

export function doubleRaf(fn: FrameRequestCallback) {
  raf(() => raf(fn))
}

export function resolveContainer(getContainer?: GetContainer): HTMLElement | null {
  if (!inBrowser || getContainer === false)
    return null
  if (typeof getContainer === 'string')
    return document.querySelector<HTMLElement>(getContainer) ?? document.body
  if (typeof getContainer === 'function')
    return getContainer()
  return getContainer ?? document.body
}

type ScrollElement = HTMLElement | Window

const overflowScrollReg = /scroll|auto|overlay/i

export function getScrollParent(el?: Element | null, root: ScrollElement | undefined = inBrowser ? window : undefined): ScrollElement {
  let node = el as HTMLElement | null
  while (node && node !== root && node.nodeType === 1 && node.tagName !== 'HTML' && node.tagName !== 'BODY') {
    const { overflowY } = window.getComputedStyle(node)
    if (overflowScrollReg.test(overflowY))
      return node
    node = node.parentNode as HTMLElement | null
  }
  return root as ScrollElement
}

export function getScrollTop(el: ScrollElement): number {
  const top = 'scrollTop' in el ? el.scrollTop : el.scrollY
  return Math.max(top, 0)
}

export function setScrollTop(el: ScrollElement, value: number) {
  if ('scrollTop' in el)
    el.scrollTop = value
  else
    el.scrollTo(el.scrollX, value)
}

export function preventDefault(event: Event, isStopPropagation?: boolean) {
  if (typeof event.cancelable !== 'boolean' || event.cancelable)
    event.preventDefault()
  if (isStopPropagation)
    event.stopPropagation()
}

let uid = 0
export function genId(prefix = 'am') {
  uid += 1
  return `${prefix}-${uid}`
}

/** Merge class values for semantic `classes` (ignores falsy values). */
export function cls(...args: any[]): string {
  const out: string[] = []
  args.forEach((arg) => {
    if (!arg)
      return
    if (typeof arg === 'string') {
      out.push(arg)
    }
    else if (Array.isArray(arg)) {
      const inner = cls(...arg)
      if (inner)
        out.push(inner)
    }
    else if (typeof arg === 'object') {
      Object.keys(arg).forEach((k) => {
        if (arg[k])
          out.push(k)
      })
    }
  })
  return out.join(' ')
}
