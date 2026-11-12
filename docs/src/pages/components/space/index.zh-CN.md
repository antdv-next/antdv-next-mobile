---
title: Space
subtitle: 间距
description: 设置组件之间的间距。
group:
  title: 布局
  order: 2
---

## 何时使用 {#when-to-use}

- 避免组件紧贴在一起，拉开统一的空间。
- 适合行内元素的水平间距；需要在子元素之间插入分隔符时。
- 与 `Flex` 的区别：`Space` 会为每个子元素添加包裹元素用于对齐，并支持分隔符；`Flex` 不添加包裹元素，适合块级布局。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/vertical.vue">垂直间距</demo>
<demo src="./demo/size.vue">间距大小</demo>
<demo src="./demo/align.vue">对齐</demo>
<demo src="./demo/wrap.vue">自动换行</demo>
<demo src="./demo/separator.vue">分隔符</demo>
<demo src="./demo/block.vue">块级模式</demo>
<demo src="./demo/compact.vue">紧凑组合</demo>
<demo src="./demo/compact-fields.vue">组合选择类字段</demo>
<demo src="./demo/compact-search.vue">搜索框与多行文本</demo>
<demo src="./demo/compact-buttons.vue">按钮组</demo>
<demo src="./demo/compact-vertical.vue">纵向组合</demo>
<demo src="./demo/compact-nested.vue">嵌套与表单</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 间距大小，预设值 `small`(8px) / `middle`(16px) / `large`(24px)，数字单位为 px；数组形式为 `[水平间距, 垂直间距]` | `Size \| [Size, Size]`（`Size = 'small' \| 'middle' \| 'large' \| number \| string`） | `'small'` |
| orientation | 间距方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| vertical | 是否垂直，等价于 `orientation="vertical"` | `boolean` | `false` |
| direction | `orientation` 的别名，为兼容 antdv-next 保留 | `'horizontal' \| 'vertical'` | - |
| align | 交叉轴对齐方式，水平方向默认 `center` | `'start' \| 'end' \| 'center' \| 'baseline' \| 'stretch'` | - |
| wrap | 是否自动换行，仅在水平方向有效 | `boolean` | `false` |
| separator | 子元素之间的分隔符，同名插槽优先 | `VueNode` | - |
| block | 是否撑满父元素宽度（移动端特有） | `boolean` | `false` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'item' \| 'separator', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'item' \| 'separator', CSSProperties>` | - |

### Space.Compact {#space-compact}

把多个带边框的组件拼成一个无缝的整体。可参与组合的组件：`Button`、`Input`、`Input.Password`、`Input.Search`、`TextArea`、`InputNumber`、`Select`、`Picker`、`DatePicker`、`TimePicker`、`Cascader`、`Calendar`（触发器模式）以及 `Space.Addon`。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 组内成员的尺寸，成员自身的 `size` 优先 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| orientation | 排列方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| vertical | 纵向排列，等价于 `orientation="vertical"` | `boolean` | `false` |
| direction | `orientation` 的别名，兼容 antdv-next | `'horizontal' \| 'vertical'` | - |
| block | 撑满父元素宽度，输入框与选择字段平分剩余空间 | `boolean` | `false` |
| rootClass | 根节点类名 | `string` | - |

- 横向组合中，`Input`、选择类字段和输入模式的 `InputNumber` 会平分剩余宽度；需要固定宽度时给它加上 `style="flex: 0 0 96px"`。
- `Input.Search` 在组内默认变为带边框、非胶囊形的分段；`TextArea` 会撑开所在的行，同行成员跟随其高度。
- 组内字段默认使用 `outlined` 变体，即使处在默认无边框的 `Form` 中；显式设置 `variant` 时以设置为准。
- 从组内字段弹出的浮层（选择器面板等）不属于该分组，其中的组件不受影响。

### Space.Addon {#space-addon}

组合中的前后缀块，用于放置文本或图标。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| variant | 形态 | `'outlined' \| 'filled' \| 'borderless'` | `'outlined'` |
| size | 尺寸，默认跟随所在的 `Space.Compact` | `'small' \| 'middle' \| 'large'` | - |
| disabled | 禁用样式 | `boolean` | `false` |
| rootClass | 根节点类名 | `string` | - |

### 自定义组件接入 {#custom-compact-item}

自己的带边框组件也可以参与组合：把 `classes` 加到绘制边框的根元素上，并合并 `size`。

```ts
import { useCompactItemContext } from '@antdv-next/mobile'

const compact = useCompactItemContext()
// compact.classes.value -> ['am-compact-item', 'am-compact-first-item']
// compact.size.value    -> 'small' | 'middle' | 'large' | undefined
// compact.inCompact.value
```

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 子元素，`v-for` / `<template>` 产生的片段会被展开，`v-if` 为假的节点会被忽略 |
| separator | 自定义分隔符，优先于 `separator` 属性 |

## 主题变量 {#design-token}

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-space-gap-small` | `size="small"` 的间距 | `var(--am-padding-xs)` |
| `--am-space-gap-middle` | `size="middle"` 的间距 | `var(--am-padding)` |
| `--am-space-gap-large` | `size="large"` 的间距 | `var(--am-padding-lg)` |

## 与 PC 端的差异 {#diff}

- 新增 `block` 属性，撑满父元素宽度，常用于垂直排列的整行按钮。
- `size` 额外支持字符串形式的 CSS 长度。
- `Space.Compact` 额外支持 `block` 下字段平分宽度；`Space.Addon` 新增 `variant`。
- `Space.Compact` 中的 `InputNumber` 步进器模式会给加减按钮加上边框以对齐接缝。
- `size` 不跟随 `ConfigProvider` 的 `componentSize`。
