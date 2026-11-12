import type { AliasToken, ResolvedTheme, ThemeAlgorithm, ThemeAlgorithmName, ThemeConfig } from './interface'
import { inBrowser } from '../_util'

export const CSS_VAR_PREFIX = 'am'

const unitlessReg = /^(?:lineHeight|opacity|zIndex|fontWeight|flex|order)/

/** `fontSizeSM` -> `font-size-sm`, `fontSizeHeading1` -> `font-size-heading-1`, `NavBar` -> `nav-bar` */
export function toKebab(name: string) {
  return name
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .replace(/([a-z])(\d)/gi, '$1-$2')
    .toLowerCase()
}

/** `colorPrimary` -> `--am-color-primary`; with component: (`borderRadius`, `Button`) -> `--am-button-border-radius` */
export function tokenToCssVarName(token: string, component?: string) {
  return `--${CSS_VAR_PREFIX}-${component ? `${toKebab(component)}-` : ''}${toKebab(token)}`
}

/** `var(--am-color-primary)` helper for inline styles. */
export function cssVar(token: string, component?: string) {
  return `var(${tokenToCssVarName(token, component)})`
}

export function tokenValue(key: string, value: string | number) {
  if (typeof value === 'number' && !unitlessReg.test(key))
    return `${value}px`
  return String(value)
}

function createAlgorithm(name: ThemeAlgorithmName): ThemeAlgorithm {
  const fn = (() => name) as ThemeAlgorithm
  fn.__amAlgorithm = name
  return fn
}

export const defaultAlgorithm = createAlgorithm('default')
export const darkAlgorithm = createAlgorithm('dark')
export const compactAlgorithm = createAlgorithm('compact')

export function normalizeAlgorithms(algorithm: ThemeConfig['algorithm']): ThemeAlgorithmName[] {
  if (!algorithm)
    return []
  const list = Array.isArray(algorithm) ? algorithm : [algorithm]
  const names = list
    .map(item => (typeof item === 'string' ? item : item?.__amAlgorithm))
    .filter(Boolean) as ThemeAlgorithmName[]
  return Array.from(new Set(names))
}

export function mergeTheme(parent: ThemeConfig | undefined, theme: ThemeConfig | undefined): ThemeConfig | undefined {
  if (!theme)
    return parent
  if (!parent || theme.inherit === false)
    return theme
  const components: Record<string, any> = { ...parent.components }
  Object.keys(theme.components ?? {}).forEach((name) => {
    components[name] = { ...components[name], ...theme.components![name] }
  })
  return {
    ...parent,
    ...theme,
    algorithm: theme.algorithm ?? parent.algorithm,
    token: { ...parent.token, ...theme.token },
    components,
  }
}

/** Turns a `ThemeConfig` into the class names + inline CSS variables of a theme scope element. */
export function resolveTheme(theme?: ThemeConfig): ResolvedTheme {
  const algorithms = normalizeAlgorithms(theme?.algorithm)
  const className = ['am-theme']
  const isDark = algorithms.includes('dark')
  if (isDark)
    className.push('am-theme-dark')
  else if (algorithms.includes('default'))
    className.push('am-theme-light')
  if (algorithms.includes('compact'))
    className.push('am-theme-compact')

  const style: Record<string, string> = {}
  const token: AliasToken = theme?.token ?? {}
  Object.keys(token).forEach((key) => {
    const value = token[key]
    if (value !== undefined && value !== null)
      style[tokenToCssVarName(key)] = tokenValue(key, value)
  })
  const components = theme?.components ?? {}
  Object.keys(components).forEach((name) => {
    const componentToken = components[name] ?? {}
    Object.keys(componentToken).forEach((key) => {
      const value = componentToken[key]
      if (value !== undefined && value !== null)
        style[tokenToCssVarName(key, name)] = tokenValue(key, value)
    })
  })
  return { className, style, algorithms, isDark, token }
}

const appliedKey = '__amAppliedTheme'

/**
 * Applies a theme to an element (default `<html>`), so the page background,
 * `body` and every popup follow it without wrapping the app in a ConfigProvider.
 * Returns a function that reverts it.
 */
export function applyTheme(theme?: ThemeConfig, target?: HTMLElement) {
  if (!inBrowser)
    return () => {}
  const el = target ?? document.documentElement
  const prev: ResolvedTheme | undefined = (el as any)[appliedKey]
  if (prev) {
    prev.className.forEach(c => c !== 'am-theme' && el.classList.remove(c))
    Object.keys(prev.style).forEach(k => el.style.removeProperty(k))
  }
  const resolved = resolveTheme(theme)
  resolved.className.forEach(c => el.classList.add(c))
  Object.keys(resolved.style).forEach(k => el.style.setProperty(k, resolved.style[k]))
  ;(el as any)[appliedKey] = resolved
  return () => {
    resolved.className.forEach(c => el.classList.remove(c))
    Object.keys(resolved.style).forEach(k => el.style.removeProperty(k))
    delete (el as any)[appliedKey]
  }
}
