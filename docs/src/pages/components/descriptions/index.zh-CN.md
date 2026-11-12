---
title: Descriptions
subtitle: 描述列表
description: 展示多个只读字段的组合。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

常见于详情页的信息展示，例如订单详情、个人资料、账单明细。

API 与 antdv-next 的 `Descriptions` 对齐：通过 `items` 配置字段，支持 `title`、`extra`、`column`、`layout`、`bordered`、`size`、`colon`。移动端默认一行一列。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基本用法</demo>
<demo src="./demo/align.vue">内容靠右对齐</demo>
<demo src="./demo/column.vue">多列与跨列</demo>
<demo src="./demo/bordered.vue">带边框</demo>
<demo src="./demo/vertical.vue">垂直布局</demo>
<demo src="./demo/size.vue">尺寸</demo>
<demo src="./demo/render.vue">自定义渲染</demo>
<demo src="./demo/style-class.vue">语义化类名与组件变量</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 描述列表的标题，显示在最顶部，同名插槽优先 | `VueNode` | - |
| extra | 描述列表的操作区域，显示在右上方，同名插槽优先 | `VueNode` | - |
| items | 描述列表项内容 | `DescriptionsItemType[]` | - |
| column | 一行的列表项数量 | `number` | `1` |
| layout | 描述布局 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| bordered | 是否展示边框 | `boolean` | `false` |
| size | 列表的大小 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| colon | 是否显示 label 后面的冒号（`bordered` 时不显示） | `boolean` | `true` |
| contentAlign | 水平布局下内容的对齐方式，`end` 时内容靠右，类似列表单元格 | `'start' \| 'end'` | `'start'` |
| labelRender | 统一自定义标签的渲染，同名插槽优先 | `(params: { item, index, value }) => VNodeChild` | - |
| contentRender | 统一自定义内容的渲染，同名插槽优先 | `(params: { item, index, value }) => VNodeChild` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'header' \| 'title' \| 'extra' \| 'label' \| 'content', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'header' \| 'title' \| 'extra' \| 'label' \| 'content', CSSProperties>` | - |

### DescriptionsItemType

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识 | `string \| number` | 索引 |
| label | 内容的描述 | `VueNode` | - |
| content | 内容 | `VueNode` | - |
| span | 占据的列数，`'filled'` 表示占满当前行剩余的列 | `number \| 'filled'` | `1` |
| class | 列表项类名 | `string` | - |
| style | 列表项样式 | `CSSProperties` | - |
| classes | 该项的语义化类名 | `Record<'label' \| 'content', string>` | - |
| styles | 该项的语义化样式 | `Record<'label' \| 'content', CSSProperties>` | - |
| children | 已废弃，请使用 `content` | `VueNode` | - |

每一行都会被自动占满：一行放不下的项会换行，上一行最后一项自动延伸；最后一项总是占满剩余的列。

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| title | 标题 | - |
| extra | 操作区域 | - |
| labelRender | 统一自定义标签 | `{ item: DescriptionsItemType, index: number, value: any }` |
| contentRender | 统一自定义内容 | `{ item: DescriptionsItemType, index: number, value: any }` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Descriptions` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-descriptions-title-color` | 标题颜色 | `var(--am-color-text-heading)` |
| `--am-descriptions-title-font-size` | 标题字号 | `var(--am-font-size-lg)` |
| `--am-descriptions-title-margin-bottom` | 标题下边距 | `var(--am-margin-sm)` |
| `--am-descriptions-label-color` | 标签颜色 | `var(--am-color-text-tertiary)` |
| `--am-descriptions-content-color` | 内容颜色 | `var(--am-color-text)` |
| `--am-descriptions-font-size` | 文字大小 | `var(--am-font-size)` |
| `--am-descriptions-item-padding-bottom` | 列表项下边距 | `var(--am-padding-sm)` |
| `--am-descriptions-column-gap` | 列间距 | `var(--am-margin)` |
| `--am-descriptions-colon-margin-end` | 冒号与内容的间距 | `8px` |
| `--am-descriptions-label-width` | 带边框水平布局下标签的宽度 | `30%` |
| `--am-descriptions-label-bg` | 带边框时标签的背景色 | `var(--am-color-fill-alter)` |
| `--am-descriptions-border-color` | 边框颜色 | `var(--am-color-border-secondary)` |
| `--am-descriptions-border-radius` | 带边框时的圆角 | `var(--am-border-radius)` |
| `--am-descriptions-cell-padding` | 带边框时单元格内边距 | `var(--am-padding-sm) var(--am-padding)` |

## 与 PC 端的差异 {#diff}

- `column` 默认为 `1`（PC 端为 `3`），且只支持数字，不支持响应式断点对象；`span` 同理。
- 只支持 `items` 数据驱动，不提供 `Descriptions.Item` 子组件。
- 新增 `contentAlign`，用于移动端详情页常见的「标签靠左、内容靠右」布局。
- 使用 CSS Grid 而非 `<table>` 渲染；带边框的水平布局中标签宽度由 `--am-descriptions-label-width` 控制。
