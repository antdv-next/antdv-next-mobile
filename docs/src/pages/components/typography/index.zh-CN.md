---
title: Typography
subtitle: 排版
description: 文本的基本格式，支持多行省略、展开收起与一键复制。
group:
  title: 通用
  order: 1
---

## 何时使用 {#when-to-use}

- 当需要展示标题、段落、列表内容时使用，如文章 / 详情页 / 协议说明。
- 当需要对长文本做省略并支持「展开 / 收起」时。
- 当需要一键复制文本（订单号、邀请码）时。

API 与 Antdv Next 的 `Typography` 对齐：`Typography.Text`、`Typography.Title`、`Typography.Paragraph` 共用 `type`、文本装饰、`ellipsis`、`copyable` 等属性。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基本</demo>
<demo src="./demo/title.vue">标题组件</demo>
<demo src="./demo/text.vue">文本与装饰</demo>
<demo src="./demo/ellipsis.vue">省略号</demo>
<demo src="./demo/expandable.vue">展开与收起</demo>
<demo src="./demo/controlled.vue">受控展开</demo>
<demo src="./demo/copyable.vue">可复制</demo>

## API

### Typography 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| component | 根节点的标签 | `string` | `'article'` |
| rootClass | 根节点类名 | `string` | - |

### 通用属性 {#base-props}

`Typography.Text`、`Typography.Title`、`Typography.Paragraph` 均支持：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 文本类型 | `'secondary' \| 'success' \| 'warning' \| 'danger'` | - |
| disabled | 禁用文本 | `boolean` | `false` |
| mark | 添加标记样式 | `boolean` | `false` |
| code | 添加代码样式 | `boolean` | `false` |
| keyboard | 添加键盘样式 | `boolean` | `false` |
| underline | 添加下划线样式 | `boolean` | `false` |
| delete | 添加删除线样式 | `boolean` | `false` |
| strong | 是否加粗 | `boolean` | `false` |
| italic | 是否斜体 | `boolean` | `false` |
| ellipsis | 自动溢出省略，可配置行数与展开收起 | `boolean \| EllipsisConfig` | `false` |
| copyable | 是否可复制，可配置复制的文本与图标 | `boolean \| CopyConfig` | `false` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'action', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'action', CSSProperties>` | - |

### Typography.Title 属性 {#title-props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| level | 重要程度，相当于 `h1` ~ `h5` | `1 \| 2 \| 3 \| 4 \| 5` | `1` |

### EllipsisConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| rows | 最多显示的行数 | `number` | `1` |
| expandable | 是否可展开：`true` 展开后不可收起，`'collapsible'` 可反复展开收起 | `boolean \| 'collapsible'` | `false` |
| symbol | 自定义展开 / 收起的文案 | `VNodeChild \| ((expanded: boolean) => VNodeChild)` | 国际化文案「展开」/「收起」 |
| defaultExpanded | 默认是否展开 | `boolean` | `false` |
| expanded | 是否展开（受控） | `boolean` | - |

### CopyConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| text | 拷贝到剪切板里的文本，默认为渲染出的文字 | `string \| (() => string \| Promise<string>)` | - |
| icon | 自定义图标：`[复制图标, 复制成功图标]` 或单个节点 | `VueNode \| VueNode[]` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| expand | 点击展开或收起时触发 | `(expanded: boolean, event: MouseEvent) => void` |
| update:expanded | 展开状态变化时触发 | `(expanded: boolean) => void` |
| copy | 复制成功后触发 | `(event: MouseEvent) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 文本内容 | - |
| ellipsisSymbol | 自定义展开 / 收起的内容，优先于 `ellipsis.symbol` | `{ expanded: boolean }` |
| copyIcon | 自定义复制图标，优先于 `copyable.icon` | `{ copied: boolean }` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Typography` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-typography-color` | 文本颜色 | `var(--am-color-text)` |
| `--am-typography-font-size` | 文本字号 | `var(--am-font-size)` |
| `--am-typography-line-height` | 行高 | `var(--am-line-height)` |
| `--am-typography-title-color` | 标题颜色 | `var(--am-color-text-heading)` |
| `--am-typography-title-font-weight` | 标题字重 | `var(--am-font-weight-strong)` |
| `--am-typography-title-margin-top` | 标题上边距（跟随在其他排版元素之后时） | `1.2em` |
| `--am-typography-title-margin-bottom` | 标题下边距 | `0.5em` |
| `--am-typography-paragraph-margin-bottom` | 段落下边距 | `1em` |
| `--am-typography-action-color` | 展开 / 复制等操作的颜色 | `var(--am-color-link)` |
| `--am-typography-action-gap` | 操作与文本的间距 | `4px` |
| `--am-typography-code-bg` | 代码样式背景色 | `var(--am-color-fill-secondary)` |
| `--am-typography-mark-bg` | 标记样式背景色 | 由 `--am-color-warning` 混合得到 |

## 与 PC 端的差异 {#diff}

- 省略基于 CSS `line-clamp` 实现：多行省略时「展开」按钮浮动在最后一行末尾，不依赖 JS 截断文本，任意富文本内容都可省略。
- `ellipsis` 不支持 `tooltip`（移动端没有 hover）、`suffix` 与 `onEllipsis`。
- 不支持可编辑（`editable`）；不提供 `Typography.Link`，链接请使用 `<am-button type="link">` 或原生 `<a>`。
- `copyable` 不支持 `tooltips`、`format`；复制成功的反馈通过图标变化体现，可在 `copy` 事件中配合 `Toast` 提示。
- `expand`、`copy` 以事件形式提供，展开状态支持通过 `ellipsis.expanded` 受控。
