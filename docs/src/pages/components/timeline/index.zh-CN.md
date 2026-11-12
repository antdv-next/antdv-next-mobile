---
title: Timeline
subtitle: 时间轴
description: 垂直展示的时间流信息。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 当有一系列信息需按时间排列时，可正序和倒序。
- 需要有一条时间轴进行视觉上的串联时，例如物流轨迹、审批流程、操作记录。

API 与 antdv-next 的 `Timeline` 对齐：通过 `items` 配置节点，`title` 显示在时间轴的另一侧，`content` 为节点内容。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基本用法</demo>
<demo src="./demo/color.vue">圆圈颜色与变体</demo>
<demo src="./demo/title.vue">标题</demo>
<demo src="./demo/icon.vue">自定义时间轴点</demo>
<demo src="./demo/pending.vue">最后一个及排序</demo>
<demo src="./demo/alternate.vue">交替展现</demo>
<demo src="./demo/end.vue">另一侧时间轴点</demo>
<demo src="./demo/logistics.vue">物流轨迹</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 时间轴节点配置 | `TimelineItemType[]` | - |
| mode | 时间轴和内容的相对位置 | `'start' \| 'alternate' \| 'end'` | `'start'` |
| reverse | 节点排序是否倒序 | `boolean` | `false` |
| pending | 指定最后一个幽灵节点是否存在或内容，同名插槽优先 | `VueNode` | `false` |
| pendingDot | 幽灵节点的时间轴点，同名插槽优先 | `VueNode` | `<LoadingOutlined />` |
| variant | 时间轴点的变体 | `'outlined' \| 'filled'` | `'outlined'` |
| titleSpan | 标题列的宽度（`mode` 不为 `alternate` 时生效）：数字表示 24 栅格的占比，字符串为任意 CSS 宽度 | `number \| string` | `6`（25%） |
| dotRender | 统一自定义时间轴点，同名插槽优先 | `(params: { item, index }) => VNodeChild` | - |
| labelRender | 统一自定义标题，同名插槽优先 | `(params: { item, index }) => VNodeChild` | - |
| contentRender | 统一自定义内容，同名插槽优先 | `(params: { item, index }) => VNodeChild` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'item' \| 'itemTitle' \| 'itemRail' \| 'itemIcon' \| 'itemContent', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'item' \| 'itemTitle' \| 'itemRail' \| 'itemIcon' \| 'itemContent', CSSProperties>` | - |

### TimelineItemType

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识 | `string \| number` | 索引 |
| title | 标题，显示在时间轴的另一侧（如时间） | `VueNode` | - |
| content | 节点内容 | `VueNode` | - |
| color | 圆圈颜色：`blue`、`red`、`green`、`gray` 或自定义的色值 | `string` | `'blue'` |
| icon | 自定义时间轴点 | `VueNode` | - |
| loading | 是否显示加载中的时间轴点 | `boolean` | `false` |
| placement | 自定义该节点内容的位置 | `'start' \| 'end'` | - |
| class | 节点类名 | `string` | - |
| style | 节点样式 | `CSSProperties` | - |
| label | 已废弃，请使用 `title` | `VueNode` | - |
| children | 已废弃，请使用 `content` | `VueNode` | - |
| dot | 已废弃，请使用 `icon` | `VueNode` | - |
| position | 已废弃，请使用 `placement` | `'left' \| 'right' \| 'start' \| 'end'` | - |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| dotRender | 统一自定义时间轴点 | `{ item: TimelineItemType, index: number }` |
| labelRender | 统一自定义标题 | `{ item: TimelineItemType, index: number }` |
| contentRender | 统一自定义内容 | `{ item: TimelineItemType, index: number }` |
| pending | 幽灵节点的内容 | - |
| pendingDot | 幽灵节点的时间轴点 | - |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Timeline` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-timeline-dot-size` | 圆点尺寸 | `10px` |
| `--am-timeline-dot-border-width` | 圆点边框宽度 | `2px` |
| `--am-timeline-dot-bg` | `outlined` 圆点的背景色 | `var(--am-color-bg-container)` |
| `--am-timeline-icon-size` | 自定义图标尺寸 | `16px` |
| `--am-timeline-rail-width` | 时间轴列的宽度 | `20px` |
| `--am-timeline-tail-width` | 连接线宽度 | `2px` |
| `--am-timeline-tail-color` | 连接线颜色 | `var(--am-color-border)` |
| `--am-timeline-item-gap` | 时间轴与内容的间距 | `var(--am-margin-sm)` |
| `--am-timeline-item-padding-bottom` | 节点之间的间距 | `var(--am-padding-md)` |
| `--am-timeline-title-color` | 标题颜色 | `var(--am-color-text-secondary)` |
| `--am-timeline-title-span` | 标题列宽度 | `25%` |
| `--am-timeline-font-size` | 文字大小 | `var(--am-font-size)` |
| `--am-timeline-item-color` | 节点主色（随 `color` 变化） | `var(--am-color-primary)` |

## 与 PC 端的差异 {#diff}

- 仅支持垂直方向，不支持 `orientation="horizontal"`。
- 只支持 `items` 数据驱动，不提供 `Timeline.Item` 子组件。
- `titleSpan` 默认为 25%（PC 端为 50%），为窄屏留出更多内容空间。
- 节点级的 `classes` / `styles` 不支持，请使用节点的 `class` / `style` 或组件级语义化结构。
- `mode` 的 `left` / `right` 作为 `start` / `end` 的别名保留。
