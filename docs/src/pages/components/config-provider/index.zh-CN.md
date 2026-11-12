---
title: ConfigProvider
subtitle: 全局化配置
description: 为组件提供统一的全局化配置：主题、语言、尺寸与禁用状态。
group:
  title: 通用
  order: 1
---

## 何时使用 {#when-to-use}

- 需要定制或切换主题（主色、暗色、紧凑）。
- 需要切换语言。
- 需要统一设置组件尺寸或禁用状态。

`ConfigProvider` 可以嵌套使用，内层配置会与外层合并。

## 代码演示 {#examples}

<demo src="./demo/theme.vue">定制主题</demo>
<demo src="./demo/algorithm.vue">主题算法</demo>
<demo src="./demo/nested.vue">嵌套主题</demo>
<demo src="./demo/component-token.vue">组件变量</demo>
<demo src="./demo/locale.vue">国际化</demo>
<demo src="./demo/size.vue">组件尺寸与禁用</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| theme | 主题配置，见[定制主题](/docs/customize-theme) | `ThemeConfig` | - |
| locale | 语言包 | `Locale` | `zh_CN` |
| componentSize | 设置组件默认尺寸 | `'small' \| 'middle' \| 'large'` | - |
| componentDisabled | 设置组件禁用状态 | `boolean` | - |
| direction | 布局方向 | `'ltr' \| 'rtl'` | `'ltr'` |
| getPopupContainer | 弹层默认挂载节点 | `() => HTMLElement` | `() => document.body` |

### ThemeConfig {#theme-config}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| algorithm | 主题算法，可传数组 | `ThemeAlgorithm \| 'default' \| 'dark' \| 'compact'` | - |
| token | 全局 Token，写为 `--am-*` 变量 | `AliasToken` | - |
| components | 组件 Token，写为 `--am-<组件>-*` 变量 | `Record<string, ComponentToken>` | - |
| inherit | 是否继承上层主题 | `boolean` | `true` |

### 静态方法 {#static-methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| ConfigProvider.config | 为 `message`、`Modal.confirm`、`Toast` 等静态方法设置全局主题与语言 | `(config: { theme?, locale?, direction? }) => void` |

### 组合式函数 {#composables}

| 函数 | 说明 |
| --- | --- |
| `useConfig()` | 读取当前上下文：`locale`、`direction`、`componentSize`、`componentDisabled`、`theme` |
| `useLocale(name)` | 读取某个组件的文案 |
| `theme.useToken()` | 读取当前主题：`token`、`isDark`、`cssVar()` |
| `applyTheme(theme, el?)` | 把主题应用到 `<html>` 或指定元素，返回撤销函数 |

## 与 PC 端的差异 {#diff}

- `ConfigProvider` 会渲染一个 `display: contents` 的容器来承载 CSS 变量，不影响布局。
- 主题只有 CSS 变量模式，`cssVar`、`hashed` 仅为兼容而保留。
- 类名前缀固定为 `am`，不支持 `prefixCls`。
- 不支持按组件设置 `button`、`input` 等通用属性，请使用 `theme.components` 定制样式。
