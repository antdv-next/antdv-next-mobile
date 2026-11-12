# Repository Guidelines

`antdv-next-mobile` is the mobile UI component library of the antdv-next family (Vue 3).

## Core Objectives

1. **PC parity first.** Whenever a prop, event, slot, exposed method or static API exists in
   [antdv-next](https://github.com/antdv-next/antdv-next) for the same concept, use the *same name, type and
   semantics* (`open` / `v-model:open`, `value` / `v-model:value`, `checked`, `items`, `options`, `fieldNames`,
   `placement`, `size: 'small' | 'middle' | 'large'`, `status`, `variant`, `rootClass`, `classes`, `styles`,
   `destroyOnHidden`, `getContainer`, `Modal.confirm`, `message.success` ...). The PC source lives in
   `../antdv-next/packages/antdv-next/src/<component>` and its docs in `../antdv-next/docs/src/pages/components/<component>`.
   Read them before designing a component.
2. **Mobile first.** Touch targets ≥ 40px, `:active` feedback instead of hover, gestures (swipe / drag / momentum),
   bottom popups instead of dropdown panels, safe-area support. Drop PC-only features (hover, resize, keyboard-heavy
   navigation) and add mobile-only ones where they make the component genuinely useful. Every difference from PC is
   listed in the component doc under `## 与 PC 端的差异`.
3. **`<script setup lang="ts">` SFCs only** for components. No TSX, no Options API. (Tiny render helpers such as
   `_util/RenderNode.ts` are the only exception.)
4. **Pure CSS variables.** No CSS-in-JS, no preprocessor. Theming is done with `--am-*` variables only.

## Layout

```
packages/antdv-next-mobile/src/
  components.ts          # public export list (do not reorder / rename without updating docs)
  index.ts               # install + re-exports
  style/                 # tokens.css (design tokens), base.css (motions, helpers)
  _util/                 # shared helpers: type.ts, index.ts, vnode.ts, RenderNode.ts, withInstall.ts, mount.ts, hooks/
  _base/                 # internal primitives: Portal, Spinner, BaseBadge
  hooks/                 # public composables (useRequest, useLoadMore, useCountDown, useSwipe ...), re-exports _util/hooks
  config-provider/       # ConfigProvider + useConfig / useSize / useDisabled / usePopupTheme
  locale/                # interface.ts, zh_CN.ts, en_US.ts, useLocale()
  theme/                 # ThemeConfig, algorithms, applyTheme, useToken
  form/context.ts        # FormItem <-> field contract (useFormItemInputContext, useMergedStatus)
  <component>/
    <Component>.vue      # one SFC per (sub) component
    interface.ts         # Props / Emits / Slots / exposed types — the typed contract
    index.ts             # withInstall + `export type * from './interface'`
    style/index.css
    tests/<component>.test.ts
docs/
  plugins/markdown.ts    # md -> SFC, demo blocks, `virtual:am-docs` registry
  src/site/              # desktop documentation site
  src/mobile/            # demo app rendered inside the phone simulator (mobile.html)
  src/pages/components/<component>/index.zh-CN.md
  src/pages/components/<component>/demo/*.vue
  src/pages/docs/*.zh-CN.md
```

`button/`, `popup/`, `mask/` and `config-provider/` are the reference implementations. Copy their structure.

## Base Layer (build on it, never around it)

Upper-level components are **composed from the base layer**. Re-implementing something the base layer
already owns is a review blocker.

| Need | Use | Never |
| --- | --- | --- |
| Leave the normal flow (teleport) and keep the ConfigProvider theme | `_base/Portal.vue` (`v-slot="{ theme }"`) | a hand-written `<Teleport>` + `usePopupTheme()` |
| Popup with mask / animation / scroll lock / z-index / ESC | `popup/Popup.vue` | a custom fixed layer |
| Backdrop only | `mask/Mask.vue` | a custom overlay div |
| Field that opens a bottom sheet (trigger + header + commit / cancel) | `picker/PickerTrigger.vue`, `picker/PickerPopup.vue`, `picker/usePickerField.ts` | per-component trigger / header markup |
| Buttons inside components (footer actions ...) | `button/Button.vue` | styled `<button>` look-alikes |
| Loading indicator | `_base/Spinner.vue` | `LoadingOutlined` + `am-spin-icon` by hand |
| Count / dot bubble | `_base/BaseBadge.vue` | local `*-badge` markup + css |
| Take part in a `Space.Compact` group (bordered controls) | `useCompactItemContext()` from `_base/compact.ts`: put `classes` on the bordered root, merge `size` | per-component seam css (seams live in `space/style/compact.css`) |
| Long lists (options, data lists, months) | `virtual-list/VirtualList.vue`, or `useVirtualRange()` when the component owns scrolling (wheel, calendar) | rendering every item |
| Gestures | `useTouch()` (+ `useEventListener`) | ad-hoc `touchstart` bookkeeping |
| Outside tap | `useClickAway()` | a document listener per component |
| Scroll helpers / page scroll lock / stacking | `getScrollParent`, `getScrollTop`, `setScrollTop`, `useLockScroll`, `nextZIndex` | local copies |
| Render props, slot children, attrs style | `RenderNode`, `isRenderable`, `flattenChildren`, `mergeAttrsStyle` (`_util`) | local copies |
| Static APIs | `_util/mount.ts` | `createApp` by hand |
| Controlled state, size, disabled, locale, status, variant | `useControlled`, `useSize`, `useDisabled`, `useLocale`, `useMergedStatus`, `useVariant` | re-deriving them |

If a second component needs the same helper, move it into `_util` / `_base` instead of copying it.

### Virtual scrolling

Any list whose length is data-driven must stay cheap with thousands of rows:

- `Select`, `Cascader`, `List` (data mode) and similar render through `VirtualList` and expose the PC-aligned
  props `virtual` (default `true`), `listHeight`, `listItemHeight`.
- `PickerView` columns and `Calendar` months own their scrolling and use `useVirtualRange()`.
- `virtual: false` must keep the same DOM structure and behaviour (it only renders everything).

## Component Contract

```vue
<script setup lang="ts">
import type { FooEmits, FooProps, FooSlots } from './interface'
import { computed } from 'vue'
import RenderNode from '../_util/RenderNode'
import { useDisabled, useSize } from '../config-provider/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmFoo', inheritAttrs: false })

const props = withDefaults(defineProps<FooProps>(), { disabled: undefined })
const emit = defineEmits<FooEmits>()
defineSlots<FooSlots>()
</script>
```

- **Names**: component `AmFoo` (tag `<am-foo>`), sub component `AmFooItem` + static `Foo.Item` + named export `FooItem`.
  Root class `am-foo`, modifiers `am-foo-<modifier>`, parts `am-foo-<part>`. Exported type names are prefixed with
  the component name (`FooProps`, `FooOption`) so `components.ts` never has collisions.
- **`interface.ts`** holds `FooProps`, `FooEmits` (`{ change: [value: string] }` tuple syntax), `FooSlots` and any public type.
  Keep prop interfaces *plain* (no mapped / conditional types, no index signatures) — the SFC compiler has to resolve them.
- **No `on*` props.** Events go through `defineEmits`. Two-way state always emits `update:<prop>` **and** the PC event
  (`change`, `openChange` ...).
- **Controlled / uncontrolled**: use `useControlled(props, 'value', { defaultValue, onChange })` from `_util/hooks`
  so components work with and without `v-model`. Support the PC `defaultValue` / `defaultOpen` / `defaultChecked` props.
  Boolean props that need a tri-state must default to `undefined` in `withDefaults` (Vue casts absent booleans to `false`).
- **Render props (`VueNode`)**: every render-type prop has a same-named slot; the slot wins:
  `<slot name="icon"><RenderNode :node="icon" /></slot>`. Type them as `VueNode` (or `RenderNodeFn<Ctx>` and pass `:params`).
  `VueNode` includes `boolean`, so Vue casts an absent prop to `false`: when `false` is meaningful (e.g. `icon: false`
  hides the icon) declare `undefined` as its default in `withDefaults`.
- **attrs**: `inheritAttrs: false` and `v-bind="$attrs"` on the root element so `class` / `style` / `data-*` land on the
  root and user values win. Support `rootClass`, and `classes` / `styles` for the meaningful semantic parts
  (always at least `root`).
- **Context**: size via `useSize(() => props.size)`, disabled via `useDisabled(() => props.disabled)`, texts via
  `useLocale('Foo')` (never hard-code Chinese / English in a component), validate status via
  `useMergedStatus(() => props.status)`. Data-entry components call `useFormItemInputContext().onFieldChange()` after
  the value changed and `.onFieldBlur()` on blur.
- **Popups** are built on `popup/Popup.vue` (or `usePopupTheme()` + `<Teleport>` for custom layers) so they keep the
  theme of their ConfigProvider, lock scroll and stack with `nextZIndex()`. Static APIs use `_util/mount.ts`.
- **Icons** come from `@antdv-next/icons`.
- **Shared code**: do not edit `_util/*`, `style/*`, `locale/*`, `config-provider/*`, `theme/*`, `components.ts`,
  `index.ts` as part of a component change unless that is the point of the change; add component-local helpers next
  to the component.
- SSR-safe: no `window` / `document` access at module top level or during `setup` (use `onMounted`, `inBrowser`).

## Styling

- Plain CSS in `style/index.css`, imported by the SFC after `import '../style'`.
- Use design tokens only: `var(--am-color-primary)`, `var(--am-color-text)`, `var(--am-color-bg-container)`,
  `var(--am-color-border)`, `var(--am-font-size)`, `var(--am-padding)`, `var(--am-border-radius)`,
  `var(--am-control-height)`, `var(--am-motion-duration-mid)` ... (full list: `src/style/tokens.css`).
  Never hard-code a brand / text / background color; dark mode must work with zero extra rules.
- Declare component tokens on the root class and consume them below:
  `.am-foo { --am-foo-height: var(--am-control-height); height: var(--am-foo-height); }`.
  They are overridable with CSS or `theme.components.Foo.height`. Document them under `## 主题变量`.
- Root elements set their own `box-sizing`, `font-size`, `font-family`, `line-height` and `color` (no global reset exists).
- `-webkit-tap-highlight-color: transparent`, `touch-action` where gestures are handled, `:active` for press feedback,
  `[dir='rtl']` overrides for directional rules, `prefers-reduced-motion` respected for long animations.
- Shared motions: `<Transition name="am-fade | am-zoom | am-slide-bottom | am-slide-top | am-slide-left | am-slide-right">`.
  Helpers: `.am-hairline-top`, `.am-hairline-bottom`, `.am-safe-area-bottom`, `.am-spin-icon`.

## Tests (Vitest + @vue/test-utils, jsdom)

`src/<component>/tests/<component>.test.ts`, run with `pnpm vitest run packages/antdv-next-mobile/src/<component>`.
Cover: default render + classes, every prop branch that changes structure, emits, controlled & uncontrolled state,
attrs / `rootClass` / `classes` passthrough, slot-over-prop priority, ConfigProvider size / disabled / locale,
gestures through `trigger('touchstart' | 'touchmove' | 'touchend', { touches: [{ clientX, clientY }] })`.
Wrappers are auto-unmounted and `document.body` is cleared after each test (`tests/setup.ts`).

## Docs

`docs/src/pages/components/<component>/index.zh-CN.md`:

```md
---
title: Button
subtitle: 按钮
description: 一句话描述。
group:
  title: 通用        # 通用 1 / 布局 2 / 导航 3 / 数据录入 4 / 数据展示 5 / 反馈 6 / 手势与其他 7
  order: 1
---

## 何时使用 {#when-to-use}
## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/list.vue" full>通栏展示</demo>

## API
### 属性 {#props}      (table: 属性 | 说明 | 类型 | 默认值)
### 事件 {#events}
### 插槽 {#slots}
### 方法 {#methods}
## 主题变量 {#design-token}
## 与 PC 端的差异 {#diff}
```

- A demo is a small SFC with a `<docs lang="zh-CN">` description block. Components are globally registered
  (`<am-button>`), so demos only import icons / helpers. Demos render inside a 375px phone: by default in a padded
  card; add the `full` attribute for edge-to-edge content (lists, nav bars, tabs).
- Escape `|` inside table cells as `\|`.
- `pnpm dev` serves the site at http://localhost:5180 (`/components/<name>`), the simulator page is
  `/mobile.html#/<name>`.

## Commands

```bash
pnpm install
pnpm dev                 # docs + simulator
pnpm test                # vitest
pnpm typecheck           # vue-tsc for the library and the docs
pnpm lint                # eslint --fix (@antfu/eslint-config)
pnpm check:base          # architecture guard: components must be built on the base layer
pnpm check               # lint + check:base + typecheck + test (what CI runs)
pnpm build               # library -> packages/antdv-next-mobile/dist
```

## CI & Release

Workflows live in `.github/workflows` and mirror antdv-next:

| Workflow | Trigger | What it does |
| --- | --- | --- |
| `test.yml` | push / PR | vitest (2 shards, merged report) + `check:base`, `typecheck`, library and site build |
| `lint.yml` | push / PR | `pnpm ci:lint` (changed files only on PRs) |
| `coverage.yml` | push | `pnpm test:coverage` -> Codecov (`CODECOV_TOKEN`) |
| `ci.yml` | PR | preview packages through `pkg-pr-new` |
| `semantic-pull-requests.yml` | PR | validates the PR title (`type(scope): subject`, lowercase subject) |
| `release.yml` | tag `antdv-next-mobile@*` / package.json change on `main` | `scripts/release.mjs`: publishes tagged, unpublished versions with npm trusted publishing |
| `deploy.yml` | after `Test` passed on `main` | docs site -> our servers by scp / ssh, served at https://m.antdv-next.com (`DEPLOY_*` and `DEPLOY_*_CN` secrets, same as antdv-next) |
| `claude.yml`, `claude-code-review.yml` | `@claude` mention by a member / manual | Claude Code (`CLAUDE_CODE_OAUTH_TOKEN`) |

Release: `pnpm bump` (bumpp: picks the version, commits `chore(release): antdv-next-mobile x.y.z`, tags
`antdv-next-mobile@x.y.z`, pushes). The Release workflow does the rest; `pnpm release:plan` shows what it would publish.
A prerelease such as `1.0.0-rc.1` is published under the `rc` dist-tag.

Pull requests: use the `create-pr` skill (`.agents/skills/create-pr`) and the templates in `.github/`.

## Commit

Checked by `scripts/verify-commit.js` (commit-msg hook); staged files are linted by lint-staged.
Conventional commits: `feat(button): ...`, `fix(popup): ...`, `docs: ...`, `test: ...`, `chore: ...`.
