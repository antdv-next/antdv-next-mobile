import { describe, expect, it } from 'vitest'
import theme, { applyTheme, cssVar, tokenToCssVarName } from '..'
import { mergeTheme, resolveTheme, toKebab, tokenValue } from '../util'

describe('theme util', () => {
  it('converts token names to css variables', () => {
    expect(toKebab('fontSizeSM')).toBe('font-size-sm')
    expect(toKebab('fontSizeHeading1')).toBe('font-size-heading-1')
    expect(toKebab('paddingXXS')).toBe('padding-xxs')
    expect(toKebab('NavBar')).toBe('nav-bar')
    expect(tokenToCssVarName('colorPrimary')).toBe('--am-color-primary')
    expect(tokenToCssVarName('borderRadius', 'Button')).toBe('--am-button-border-radius')
    expect(cssVar('colorBgContainer')).toBe('var(--am-color-bg-container)')
  })

  it('adds px to numeric tokens except unitless ones', () => {
    expect(tokenValue('borderRadius', 8)).toBe('8px')
    expect(tokenValue('lineHeight', 1.5)).toBe('1.5')
    expect(tokenValue('zIndexPopupBase', 2000)).toBe('2000')
    expect(tokenValue('opacityDisabled', 0.4)).toBe('0.4')
    expect(tokenValue('colorPrimary', '#000')).toBe('#000')
  })

  it('resolves algorithms into class names', () => {
    expect(resolveTheme().className).toEqual(['am-theme'])
    expect(resolveTheme({ algorithm: theme.darkAlgorithm }).className).toEqual(['am-theme', 'am-theme-dark'])
    expect(resolveTheme({ algorithm: 'default' }).className).toEqual(['am-theme', 'am-theme-light'])
    const combined = resolveTheme({ algorithm: [theme.darkAlgorithm, theme.compactAlgorithm] })
    expect(combined.className).toEqual(['am-theme', 'am-theme-dark', 'am-theme-compact'])
    expect(combined.isDark).toBe(true)
  })

  it('resolves global tokens into inline variables and component tokens into a scoped stylesheet', () => {
    const config = {
      token: { colorPrimary: '#00b96b', borderRadius: 12, lineHeight: 1.4 },
      components: { Button: { height: 44 }, NavBar: { height: 50 } },
    }
    const resolved = resolveTheme(config, 'am-scope-x')
    expect(resolved.style).toEqual({
      '--am-color-primary': '#00b96b',
      '--am-border-radius': '12px',
      '--am-line-height': '1.4',
    })
    expect(resolved.className).toContain('am-scope-x')
    expect(resolved.css).toContain(':where(.am-scope-x) .am-button,.am-button:where(.am-scope-x)')
    expect(resolved.css).toContain('{--am-button-height:44px;}')
    expect(resolved.css).toContain(':where(.am-scope-x) .am-nav-bar-root')
    expect(resolved.css).toContain('{--am-nav-bar-height:50px;}')
    // without a scope there is nowhere to put component tokens
    expect(resolveTheme(config).css).toBe('')
  })

  it('merges with the parent theme unless inherit is false', () => {
    const parent = { algorithm: 'dark' as const, token: { colorPrimary: 'red', borderRadius: 2 }, components: { Button: { height: 40 } } }
    const merged = mergeTheme(parent, { token: { borderRadius: 10 }, components: { Button: { fontSize: 18 } } })!
    expect(merged.algorithm).toBe('dark')
    expect(merged.token).toEqual({ colorPrimary: 'red', borderRadius: 10 })
    expect(merged.components!.Button).toEqual({ height: 40, fontSize: 18 })
    expect(mergeTheme(parent, { inherit: false, token: { borderRadius: 10 } })!.token).toEqual({ borderRadius: 10 })
    expect(mergeTheme(parent, undefined)).toBe(parent)
  })

  it('applyTheme writes to <html> and can be reverted / replaced', () => {
    const root = document.documentElement
    const revert = applyTheme({ algorithm: 'dark', token: { colorPrimary: '#f00' } })
    expect(root.classList.contains('am-theme-dark')).toBe(true)
    expect(root.style.getPropertyValue('--am-color-primary')).toBe('#f00')

    applyTheme({ algorithm: 'compact', components: { Button: { height: 50 } } })
    expect(document.getElementById('am-theme-global')!.textContent).toContain('--am-button-height:50px')
    expect(root.classList.contains('am-theme-dark')).toBe(false)
    expect(root.classList.contains('am-theme-compact')).toBe(true)
    expect(root.style.getPropertyValue('--am-color-primary')).toBe('')

    revert()
    applyTheme()()
    expect(root.classList.contains('am-theme-compact')).toBe(false)
    expect(root.classList.contains('am-theme')).toBe(false)
    expect(document.getElementById('am-theme-global')).toBeNull()
  })
})
