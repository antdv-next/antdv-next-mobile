#!/usr/bin/env node
/**
 * Architecture guard: upper-level components must be composed from the base layer
 * (see "Base Layer" in AGENTS.md). Fails when a component re-implements something
 * the base layer owns. Run with `pnpm check:base`.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const src = fileURLToPath(new URL('../packages/antdv-mobile/src', import.meta.url))

/** `allow` lists the files that ARE the base implementation of that concern. */
const rules = [
  {
    name: 'teleport',
    message: 'use _base/Portal.vue instead of a hand-written <Teleport>',
    pattern: /<Teleport[\s>]/,
    allow: ['_base/Portal.vue'],
  },
  {
    name: 'popup-theme',
    message: 'use _base/Portal.vue (v-slot="{ theme }") instead of usePopupTheme()',
    pattern: /usePopupTheme\(/,
    allow: ['_base/Portal.vue', 'config-provider/context.ts'],
  },
  {
    name: 'spinner',
    message: 'use _base/Spinner.vue instead of LoadingOutlined',
    pattern: /LoadingOutlined/,
    allow: ['_base/Spinner.vue'],
  },
  {
    name: 'is-renderable',
    message: 'import isRenderable from _util instead of a local copy',
    pattern: /(?:function|const)\s+isRenderable\b/,
    allow: ['_util/index.ts'],
  },
  {
    name: 'scroll-helpers',
    message: 'use getScrollTop / setScrollTop / getScrollParent from _util',
    pattern: /function\s+(?:getScrollTop|setScrollTop|getScrollParent|isWindow)\b|const\s+isWindow\s*=/,
    allow: ['_util/index.ts'],
  },
  {
    name: 'vnode-helpers',
    message: 'import flattenChildren / mergeAttrsStyle from _util/vnode',
    pattern: /function\s+(?:flattenChildren|mergeAttrsStyle)\b|from '\.\.\/space\/util'/,
    allow: ['_util/vnode.ts'],
  },
  {
    name: 'create-app',
    message: 'use _util/mount.ts for static APIs instead of createApp()',
    pattern: /\bcreateApp\(/,
    allow: ['_util/mount.ts'],
  },
  {
    name: 'click-away',
    message: 'use useClickAway() instead of a document click / touchstart listener',
    pattern: /document\.addEventListener\(\s*['"](?:click|touchstart|mousedown)['"]/,
    allow: ['_util/hooks/useClickAway.ts', '_util/hooks/useLockScroll.ts', 'style/index.ts'],
  },
]

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      if (name !== 'tests' && name !== 'node_modules')
        walk(full, files)
    }
    else if (/\.(?:vue|ts)$/.test(name) && !name.endsWith('.d.ts')) {
      files.push(full)
    }
  }
  return files
}

const violations = []
for (const file of walk(src)) {
  const rel = relative(src, file).split(sep).join('/')
  const lines = readFileSync(file, 'utf-8').split('\n')
  for (const rule of rules) {
    if (rule.allow.includes(rel))
      continue
    lines.forEach((line, index) => {
      // an explicit, reviewed exception: `// base-layer-ignore <rule>: reason`
      if (/base-layer-ignore/.test(line) || /base-layer-ignore/.test(lines[index - 1] ?? ''))
        return
      if (rule.pattern.test(line))
        violations.push({ rel, line: index + 1, rule, text: line.trim() })
    })
  }
}

if (violations.length) {
  console.error(`\n✖ ${violations.length} base-layer violation(s):\n`)
  for (const v of violations)
    console.error(`  ${v.rel}:${v.line}  [${v.rule.name}] ${v.rule.message}\n      ${v.text}`)
  console.error('\nSee "Base Layer" in AGENTS.md. A reviewed exception needs a `// base-layer-ignore <rule>: reason` comment on the line above.\n')
  process.exit(1)
}
console.log('✔ base layer: every component is composed from the shared primitives')
