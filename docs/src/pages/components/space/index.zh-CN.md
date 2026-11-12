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
- 不提供 `Space.Compact` 与 `Space.Addon`，移动端的紧凑组合请使用各录入组件自身的前后缀能力。
- `size` 不跟随 `ConfigProvider` 的 `componentSize`。
