---
title: VirtualList
subtitle: 虚拟列表
description: 只渲染可视区域附近的列表项，上万条数据也能流畅滚动。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 需要在一个滚动区域内展示成百上千条结构相同的数据：消息、联系人、日志、搜索结果等。
- 列表项高度固定（`fixed`，开销最小）或由内容决定（默认，渲染后自动测量）。
- 需要滚动到指定项（`scrollTo`）或在滚动到底部时加载更多（`reachEnd`）。

`VirtualList` 使用原生滚动（惯性、回弹、滚动条都由浏览器处理），只把可视区域附近的项挂载到页面上。它也是组件库内部的基础层：[Select](/components/select)、[Cascader](/components/cascader)、[List](/components/list) 的大数据量渲染都通过它完成。

## 代码演示 {#examples}

<demo src="./demo/basic.vue" full>10,000 条固定高度数据</demo>
<demo src="./demo/dynamic.vue" full>动态高度</demo>
<demo src="./demo/scroll-to.vue" full>滚动到指定项</demo>
<demo src="./demo/load-more.vue" full>滚动加载更多</demo>
<demo src="./demo/popup.vue" full>在弹层中使用</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 完整的数据源 | `any[]` | `[]` |
| height | 滚动容器的高度。不设置时容器随内容撑开，此时请通过 CSS 设置 `height` / `max-height` | `number \| string` | - |
| itemHeight | 列表项高度（px）。`fixed` 时为精确高度，否则为测量前的预估高度 | `number` | `44` |
| itemKey | 列表项唯一 `key` 的字段名，或返回 `key` 的函数 | `string \| ((item: any, index: number) => string \| number)` | 下标 |
| virtual | 是否开启虚拟滚动。`false` 时渲染全部列表项，DOM 结构与 API 保持不变 | `boolean` | `true` |
| fixed | 所有列表项的高度都等于 `itemHeight`：跳过测量，开销最小 | `boolean` | `false` |
| overscan | 可视区域前后额外渲染的项数 | `number` | `4` |
| component | 包裹列表项的内层元素的标签 | `string` | `'div'` |
| rootClass | 根节点（滚动容器）类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'holder' \| 'list' \| 'item', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'holder' \| 'list' \| 'item', CSSProperties>` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| scroll | 滚动时触发 | `(event: Event) => void` |
| visibleChange | 渲染窗口变化时触发，范围为 `[start, end)` | `(start: number, end: number) => void` |
| reachEnd | 滚动到距底部 40px 以内时触发一次；离开底部或数据长度变化后可再次触发，适合加载更多 | `() => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 列表项内容 | `{ item: any, index: number }` |
| header | 位于滚动容器内、列表项之前的内容，随列表一起滚动 | - |
| footer | 位于滚动容器内、列表项之后的内容，例如「加载中」「没有更多了」 | - |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| scrollTo | 滚动到指定位置（px），或滚动到指定的项 | `(target: number \| VirtualListScrollToConfig) => void` |
| getScrollTop | 获取当前滚动位置 | `() => number` |
| nativeElement | 滚动容器元素 | `HTMLElement` |

### VirtualListScrollToConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| index | 目标项的下标 | `number` | - |
| key | 目标项的 `key`（由 `itemKey` 决定），与 `index` 二选一 | `string \| number` | - |
| align | 目标项在可视区域中的位置；`auto` 表示已完全可见时不滚动，否则滚动最短距离 | `'start' \| 'center' \| 'end' \| 'auto'` | `'start'` |
| offset | 与目标项之间额外保留的距离（px） | `number` | `0` |
| behavior | 滚动行为，`smooth` 为平滑滚动 | `ScrollBehavior` | - |

## 主题变量 {#design-token}

VirtualList 只负责滚动与渲染窗口，没有自己的主题变量。外观由列表项的内容决定；滚动容器的尺寸、背景等可通过 `class` / `style`、`rootClass`、`classes`、`styles` 设置。

| 结构 | 类名 | 说明 |
| --- | --- | --- |
| root | `.am-virtual-list` | 滚动容器 |
| holder | `.am-virtual-list-holder` | 撑开全部数据高度的占位层 |
| list | `.am-virtual-list-inner` | 包裹已渲染列表项的内层，通过 `transform` 定位 |
| item | `.am-virtual-list-item` | 单个列表项的包裹元素，带有 `data-index` |

## 与 PC 端的差异 {#diff}

- PC 端没有公开的 VirtualList 组件，虚拟滚动内置在 `Select`、`Tree`、`Table` 等组件中；移动端把它作为公开的基础组件，并沿用 PC 端的命名：`data`、`height`、`itemHeight`、`itemKey`、`virtual`、`scrollTo({ index \| key, align })`。
- 使用浏览器原生滚动而不是模拟滚动条，保留移动端的惯性与回弹；因此没有 `fullHeight`、`showScrollBar`、`scrollWidth`（横向虚拟滚动）等 API。
- 列表项高度默认在渲染后测量（`itemHeight` 仅作为预估值）；新增 `fixed` 跳过测量、`overscan` 控制缓冲项数、`header` / `footer` 插槽以及 `reachEnd`、`visibleChange` 事件。
- 列表项会被包裹在 `.am-virtual-list-item` 中，因此依赖兄弟选择器的样式（如相邻项之间的分隔线）需要以包裹元素或 `data-index` 为准。
