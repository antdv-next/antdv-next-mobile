---
title: Grid
subtitle: 栅格
description: 24 栅格系统。
group:
  title: 布局
  order: 2
---

## 何时使用 {#when-to-use}

- 需要按固定比例划分一行内的区域时，例如宫格入口、表单的并排字段、图片墙。
- 通过 `Row` 建立一行，内容放在 `Col` 内；一行的 `span` 总和超过 24 时自动换行。

布局基于 Flex 实现，API 与 antdv-next 的 `Row` / `Col` 对齐。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础栅格</demo>
<demo src="./demo/gutter.vue">区块间隔</demo>
<demo src="./demo/offset.vue">偏移与排序</demo>
<demo src="./demo/justify.vue">排版</demo>
<demo src="./demo/flex.vue">Flex 填充</demo>
<demo src="./demo/entry.vue">宫格入口</demo>

## API

### Row 属性 {#row-props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| gutter | 栅格间隔，数字单位为 px，也可以是 CSS 长度；数组形式为 `[水平间距, 垂直间距]` | `number \| string \| [number \| string, number \| string]` | `0` |
| align | 垂直对齐方式 | `'top' \| 'middle' \| 'bottom' \| 'stretch'` | `'top'` |
| justify | 水平排列方式 | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` |
| wrap | 是否自动换行 | `boolean` | `true` |
| rootClass | 根节点类名 | `string` | - |

### Col 属性 {#col-props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| span | 栅格占位格数，为 `0` 时相当于 `display: none` | `number \| string` | - |
| offset | 栅格左侧的间隔格数 | `number \| string` | `0` |
| order | 栅格顺序 | `number \| string` | `0` |
| push | 栅格向右移动格数 | `number \| string` | `0` |
| pull | 栅格向左移动格数 | `number \| string` | `0` |
| flex | Flex 布局属性：数字表示比例，`'100px'` 表示固定宽度，`'auto'` 表示填充剩余空间 | `number \| string` | - |
| rootClass | 根节点类名 | `string` | - |

### 插槽 {#slots}

| 组件 | 插槽 | 说明 |
| --- | --- | --- |
| Row | default | 行内容，通常是若干 `Col` |
| Col | default | 列内容 |

## 主题变量 {#design-token}

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-row-gutter-x` | 水平间距，由 `gutter` 属性写入，`Col` 通过它计算左右内边距 | `0px` |

## 与 PC 端的差异 {#diff}

- 不支持响应式断点：`Col` 没有 `xs` / `sm` / `md` / `lg` / `xl` / `xxl` 属性，`gutter` / `align` / `justify` 不支持断点对象。移动端视口宽度单一，需要适配平板时请使用 CSS 媒体查询。
- 不提供 `Grid.useBreakpoint`。
- `gutter` 额外支持字符串形式的 CSS 长度（如 `'1rem'`）。
- 垂直间距通过 `row-gap` 实现，不需要负外边距。
