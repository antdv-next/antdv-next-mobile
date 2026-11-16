import type { Plugin } from 'vite'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { isFixedLength, toUnit } from '../src/_util/unit'

/**
 * One pass over a stylesheet. Everything that must stay untouched is matched first and returned
 * as is: comments, strings, `url()` and at-rule preludes (`@media (min-width: 768px)` cannot
 * hold a `var()`). What is left are the `px` lengths of declarations.
 */
const TOKEN_RE = /\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|url\([^)]*\)|@[\w-][^{;]*|(?<![\w.#%-])(-?(?:\d+(?:\.\d*)?|\.\d+))px(?![\w-])/g
const DIRECTIVE_RE = /^\/\*\s*am-unit:\s*(on|off)\s*\*\/$/

/**
 * Rewrites the `px` lengths of the library css into units: `40px` -> `calc(40 * var(--am-unit))`.
 * Hairlines (`<= 1px`) and "infinite" radii (`>= 999px`) are kept, see `isFixedLength()`.
 *
 * Wrap rules that must stay in real pixels between an `am-unit: off` comment and an `am-unit: on` comment.
 */
export function pxToUnit(css: string): string {
  let enabled = true
  return css.replace(TOKEN_RE, (match, value?: string) => {
    if (value === undefined) {
      const directive = DIRECTIVE_RE.exec(match)
      if (directive)
        enabled = directive[1] === 'on'
      return match
    }
    // kept values are returned as written (`.5px` stays `.5px`)
    return enabled && !isFixedLength(Number(value)) ? toUnit(value) : match
  })
}

const IMPORT_RE = /@import\s+(['"])(\.{1,2}\/[^'"]+\.css)\1\s*;/g

/**
 * Vite inlines `@import` inside its own css pipeline, i.e. after this plugin: the imported file
 * would never be rewritten. Relative imports are therefore inlined here first.
 */
function inlineImports(code: string, file: string, watch: (dep: string) => void): string {
  return code.replace(IMPORT_RE, (_, __, spec: string) => {
    const dep = resolve(dirname(file), spec)
    watch(dep)
    return inlineImports(readFileSync(dep, 'utf-8'), dep, watch)
  })
}

export interface UnitPluginOptions {
  /** Which css files are rewritten. Default: the stylesheets of `packages/antdv-mobile/src`. */
  include?: (id: string) => boolean
}

const defaultInclude = (id: string) => /[\\/]antdv-mobile[\\/]src[\\/].*\.css$/.test(id)

/**
 * Vite plugin shared by the library build and the docs site. It runs before Vite's own css
 * pipeline, so it does not depend on the css transformer (PostCSS or Lightning CSS).
 */
export function unitPlugin(options: UnitPluginOptions = {}): Plugin {
  const include = options.include ?? defaultInclude
  return {
    name: 'antdv-mobile:unit',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0]
      if (!include(file))
        return
      // `this` is the plugin context of Vite; absent when the hook is called directly (tests)
      const watch = (dep: string) => (this as { addWatchFile?: (id: string) => void } | undefined)?.addWatchFile?.(dep)
      const result = pxToUnit(inlineImports(code, file, watch))
      return result === code ? undefined : { code: result, map: null }
    },
  }
}
