---
title: 定制主题
order: 3
group:
  title: 指南
  order: 1
---

主题完全基于 CSS 变量实现，没有任何运行时样式生成。变量名与 Antdv Next 的 Design Token 一一对应：`colorPrimary` 对应 `--am-color-primary`，`fontSizeLG` 对应 `--am-font-size-lg`。

点击页面右上角的调色板可以实时切换主色、圆角与算法，右侧模拟器会同步更新。

## 使用 ConfigProvider {#config-provider}

写法与 PC 端一致：

```vue
<script setup lang="ts">
import { theme } from '@antdv-next/mobile'
</script>

<template>
  <am-config-provider
    :theme="{
      algorithm: theme.darkAlgorithm,
      token: { colorPrimary: '#00b96b', borderRadius: 12 },
      components: { Button: { height: 44 } },
    }"
  >
    <App />
  </am-config-provider>
</template>
```

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| algorithm | 主题算法，可传数组组合 | `theme.defaultAlgorithm \| theme.darkAlgorithm \| theme.compactAlgorithm` 或 `'default' \| 'dark' \| 'compact'` |
| token | 全局变量，键名同 Antdv Next | `AliasToken` |
| components | 组件变量，`{ Button: { height: 44 } }` 会写成 `--am-button-height: 44px` | `Record<string, ComponentToken>` |
| inherit | 是否继承上层 ConfigProvider 的主题 | `boolean`，默认 `true` |

`ConfigProvider` 可以嵌套，内层只需声明差异。挂载到 `body` 的弹层（Popup、Modal、Picker 等）会自动携带所属 `ConfigProvider` 的主题。

## 全局切换 {#global}

如果希望页面背景、`body` 以及所有内容一起切换，使用 `applyTheme` 把主题写到 `<html>` 上：

```ts
import { applyTheme, theme } from '@antdv-next/mobile'

// 切换到暗色 + 绿色主色，返回值用于撤销
const revert = applyTheme({
  algorithm: theme.darkAlgorithm,
  token: { colorPrimary: '#00b96b' },
})
```

也可以不写任何 JS，直接用属性切换算法：

```html
<html data-am-theme="dark compact"></html>
```

## 直接覆盖 CSS 变量 {#css-variables}

```css
:root {
  --am-color-primary: #7c3aed;
  --am-border-radius: 12px;
  --am-control-height: 44px;
}

/* 只影响某个区域里的按钮 */
.checkout .am-button {
  --am-button-height: 52px;
  --am-button-border-radius: 26px;
}
```

变量分为两层：

- **种子变量**：`--am-color-primary`、`--am-color-text-base`、`--am-font-size` 等，是直接的取值。
- **派生变量**：`--am-color-primary-bg`、`--am-color-text-secondary`、`--am-color-border` 等，由种子变量通过 `color-mix()` 计算得到。

因此只改一个 `--am-color-primary`，按压态、浅色背景、描边色都会跟着变化。

> 派生变量在 `:root` 与每个 `ConfigProvider` 上计算。如果你在一个普通元素上覆盖种子变量并希望派生色一起变化，请给它加上 `am-theme` 类名，或直接使用 `ConfigProvider`。

## 常用变量 {#tokens}

| 变量 | Token | 默认值 |
| --- | --- | --- |
| `--am-color-primary` | colorPrimary | `#1677ff` |
| `--am-color-success` | colorSuccess | `#52c41a` |
| `--am-color-warning` | colorWarning | `#faad14` |
| `--am-color-error` | colorError | `#ff4d4f` |
| `--am-color-text-base` | colorTextBase | `#000` |
| `--am-color-bg-base` | colorBgBase | `#fff` |
| `--am-color-text` | colorText | 文本色 88% |
| `--am-color-text-secondary` | colorTextSecondary | 文本色 65% |
| `--am-color-bg-container` | colorBgContainer | 容器背景 |
| `--am-color-bg-layout` | colorBgLayout | 页面背景 |
| `--am-color-border` | colorBorder | 描边色 |
| `--am-font-size` | fontSize | `14px` |
| `--am-control-height` | controlHeight | `40px` |
| `--am-border-radius` | borderRadius | `8px` |
| `--am-padding` | padding | `16px` |

完整列表见源码 `style/tokens.css`。每个组件自己的变量列在对应文档的「主题变量」一节。

## 在 JS 中读取 {#use-token}

```ts
import { theme } from '@antdv-next/mobile'

const { token, isDark, cssVar } = theme.useToken()

cssVar('colorPrimary') // 'var(--am-color-primary)'
```
