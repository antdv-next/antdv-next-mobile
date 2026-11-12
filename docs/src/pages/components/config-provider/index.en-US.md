---
title: ConfigProvider
description: Provide a uniform global configuration for components - theme, locale, size and disabled state.
group:
  title: General
  order: 1
---

## When To Use {#when-to-use}

- When you need to customize or switch the theme (primary color, dark, compact).
- When you need to switch the language.
- When you need to set the component size or disabled state globally.

`ConfigProvider` can be nested, and the inner configuration is merged with the outer one.

## Examples {#examples}

<demo src="./demo/theme.vue">Customize theme</demo>
<demo src="./demo/algorithm.vue">Theme algorithm</demo>
<demo src="./demo/nested.vue">Nested theme</demo>
<demo src="./demo/component-token.vue">Component token</demo>
<demo src="./demo/locale.vue">Locale</demo>
<demo src="./demo/size.vue">Component size and disabled</demo>

## API

### Props {#props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| theme | Theme configuration, see [Customize Theme](/docs/customize-theme) | `ThemeConfig` | - |
| locale | Language package | `Locale` | `zh_CN` |
| componentSize | Set the default size of components | `'small' \| 'middle' \| 'large'` | - |
| componentDisabled | Set the disabled state of components | `boolean` | - |
| direction | Layout direction | `'ltr' \| 'rtl'` | `'ltr'` |
| getPopupContainer | Default mount node of popups | `() => HTMLElement` | `() => document.body` |

### ThemeConfig {#theme-config}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| algorithm | Theme algorithm, an array is also accepted | `ThemeAlgorithm \| 'default' \| 'dark' \| 'compact'` | - |
| token | Global tokens, written as `--am-*` variables | `AliasToken` | - |
| components | Component tokens, written as `--am-<component>-*` variables | `Record<string, ComponentToken>` | - |
| inherit | Whether to inherit the parent theme | `boolean` | `true` |

### Static Methods {#static-methods}

| Method | Description | Type |
| --- | --- | --- |
| ConfigProvider.config | Set the global theme and locale for static methods such as `message`, `Modal.confirm` and `Toast` | `(config: { theme?, locale?, direction? }) => void` |

### Composables {#composables}

| Function | Description |
| --- | --- |
| `useConfig()` | Read the current context: `locale`, `direction`, `componentSize`, `componentDisabled`, `theme` |
| `useLocale(name)` | Read the texts of a component |
| `theme.useToken()` | Read the current theme: `token`, `isDark`, `cssVar()` |
| `applyTheme(theme, el?)` | Apply a theme to `<html>` or the given element, returns an undo function |

## Differences from PC {#diff}

- `ConfigProvider` renders a `display: contents` container to carry the CSS variables, which does not affect layout.
- The theme only has the CSS variable mode; `cssVar` and `hashed` are kept for compatibility only.
- The class name prefix is fixed to `am`, `prefixCls` is not supported.
- Setting common props per component such as `button` and `input` is not supported, use `theme.components` to customize styles.
