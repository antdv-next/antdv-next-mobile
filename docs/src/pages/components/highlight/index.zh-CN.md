---
title: Highlight
subtitle: 高亮文本
description: 高亮一段文本中匹配关键词的部分。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 搜索结果、联想词列表中，需要标出与搜索词匹配的文字时。
- 需要在一段文本中强调若干关键词时。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/multiple.vue">多个关键词</demo>
<demo src="./demo/search.vue">搜索结果</demo>
<demo src="./demo/custom.vue">自定义样式</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 原文本 | `string` | `''` |
| keywords | 需要高亮的关键词，空字符串会被忽略 | `string \| string[]` | - |
| caseSensitive | 是否区分大小写 | `boolean` | `false` |
| autoEscape | 是否按字面量匹配关键词（自动转义正则特殊字符）；设为 `false` 时关键词作为正则表达式源码 | `boolean` | `true` |
| tag | 根节点标签 | `string` | `'span'` |
| highlightTag | 匹配文字的标签 | `string` | `'mark'` |
| highlightClass | 匹配文字的额外类名 | `string` | - |
| unhighlightTag | 未匹配文字的标签；与 `unhighlightClass` 均未设置时，未匹配文字渲染为纯文本节点 | `string` | - |
| unhighlightClass | 未匹配文字的类名，设置后未匹配文字会被 `unhighlightTag`（默认 `span`）包裹 | `string` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'highlight', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'highlight', CSSProperties>` | - |

- 重叠或相邻的匹配会合并为同一个高亮节点。
- 文本始终以文本节点渲染，不使用 `v-html`，`content` 中的 HTML 不会被解析。
- `autoEscape` 为 `false` 时，非法的正则表达式会被忽略。

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| highlight | 自定义匹配文字的内容，渲染在 `highlightTag` 内 | `{ text: string, index: number }`，`index` 为第几处匹配（从 0 开始） |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| getHighlightChunks | 具名导出的工具函数，返回拆分后的片段，可用于自行渲染 | `(content: string, keywords?: string \| string[], options?: { caseSensitive?: boolean, autoEscape?: boolean }) => HighlightChunk[]` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Highlight` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-highlight-color` | 高亮文字颜色 | `var(--am-color-primary)` |
| `--am-highlight-background` | 高亮文字背景 | `transparent` |
| `--am-highlight-font-weight` | 高亮文字字重 | `inherit` |
| `--am-highlight-padding-inline` | 高亮文字的水平内边距 | `0` |
| `--am-highlight-border-radius` | 高亮文字的圆角 | `0` |

Highlight 是行内文本，根节点有意不设置 `font-size`、`font-family`、`line-height` 与 `color`，全部继承自所在上下文。

## 与 PC 端的差异 {#diff}

- 移动端新增组件，antdv-next（PC 端）没有对应组件。
