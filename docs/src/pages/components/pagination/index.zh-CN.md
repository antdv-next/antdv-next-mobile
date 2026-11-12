---
title: Pagination
subtitle: 分页
description: 分页器用于分隔长列表，每次只加载一个页面。
group:
  title: 导航
  order: 3
---

## 何时使用 {#when-to-use}

- 当加载或渲染所有数据将花费很多时间时。
- 需要让用户明确知道当前位置并跳转到指定页，而不是无限滚动加载。

API 与 antdv-next 的 `Pagination` 对齐（`current`、`total`、`pageSize`、`simple`、`showTotal`、`itemRender` 等），界面针对窄屏做了精简。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/more.vue">更多页码</demo>
<demo src="./demo/simple.vue">简洁模式</demo>
<demo src="./demo/total.vue">显示总数</demo>
<demo src="./demo/size.vue">尺寸与禁用</demo>
<demo src="./demo/item-render.vue">自定义渲染</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| current(v-model) | 当前页码 | `number` | - |
| defaultCurrent | 默认的当前页码 | `number` | `1` |
| total | 数据总数 | `number` | `0` |
| pageSize | 每页条数 | `number` | `10` |
| simple | 简洁模式：上一页 / 下一页按钮，中间显示 `当前页 / 总页数` | `boolean` | `false` |
| disabled | 禁用分页 | `boolean` | `false` |
| size | 尺寸 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| showLessItems | 显示较少的页码（当前页两侧不显示相邻页） | `boolean` | `false` |
| hideOnSinglePage | 只有一页时是否隐藏分页器 | `boolean` | `false` |
| showTotal | 用于显示数据总量和当前数据范围 | `(total: number, range: [number, number]) => VueNode` | - |
| itemRender | 自定义页码、上一页、下一页的内容 | `(page: number, type: 'page' \| 'prev' \| 'next' \| 'jump-prev' \| 'jump-next', element: VueNode) => VueNode` | - |
| prevIcon | 自定义上一页图标 | `VueNode` | - |
| nextIcon | 自定义下一页图标 | `VueNode` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'item', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'item', CSSProperties>` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 页码改变时触发 | `(page: number, pageSize: number) => void` |
| update:current | 页码改变时触发，用于 `v-model:current` | `(page: number) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| itemRender | 自定义页码内容，优先于 `itemRender` 属性 | `{ page: number, type: 'page' \| 'prev' \| 'next' \| 'jump-prev' \| 'jump-next', element: VueNode }` |
| showTotal | 自定义总数展示，优先于 `showTotal` 属性 | `{ total: number, range: [number, number] }` |
| prevIcon | 自定义上一页图标 | - |
| nextIcon | 自定义下一页图标 | - |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Pagination` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-pagination-item-size` | 页码项尺寸 | `34px` |
| `--am-pagination-item-gap` | 页码项间距 | `4px` |
| `--am-pagination-font-size` | 字号 | `var(--am-font-size)` |
| `--am-pagination-color` | 文字颜色 | `var(--am-color-text)` |
| `--am-pagination-item-background` | 页码项背景色 | `transparent` |
| `--am-pagination-item-active-color` | 当前页文字颜色 | `var(--am-color-text-light-solid)` |
| `--am-pagination-item-active-background` | 当前页背景色 | `var(--am-color-primary)` |
| `--am-pagination-item-border-radius` | 页码项圆角 | `var(--am-border-radius)` |
| `--am-pagination-simple-button-background` | 简洁模式按钮背景色 | `var(--am-color-fill-tertiary)` |
| `--am-pagination-simple-button-padding-inline` | 简洁模式按钮水平内边距 | `var(--am-padding)` |

## 与 PC 端的差异 {#diff}

- 页码最多同时显示 7 项（含省略号），省略号点击后向前 / 向后跳 5 页（`showLessItems` 时为 3 页）。
- `simple` 模式为「上一页 / 当前页 / 总页数 / 下一页」的按钮布局，文案来自 `locale.Pagination`，不提供输入框跳页。
- 不支持 `showSizeChanger`、`pageSizeOptions`、`showQuickJumper`、`showTitle`、`responsive`、`align`、`components`，以及 `showSizeChange`、`update:pageSize` 事件。
- 不支持 `jumpPrevIcon` / `jumpNextIcon`、`defaultPageSize`；当前页使用实底样式，没有 hover 态。
