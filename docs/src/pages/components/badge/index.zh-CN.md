---
title: Badge
subtitle: 徽标数
description: 图标右上角的圆形徽标数字。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 出现在图标、头像或标签栏的右上角，提示有待处理的消息数量。
- 仅用一个小红点提示有更新。
- 独立使用，用状态点配合文字表示状态。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/overflow.vue">封顶数字</demo>
<demo src="./demo/dot.vue">小红点</demo>
<demo src="./demo/standalone.vue">独立使用</demo>
<demo src="./demo/dynamic.vue">动态变化</demo>
<demo src="./demo/color.vue">颜色与偏移</demo>
<demo src="./demo/status.vue">状态点</demo>
<demo src="./demo/ribbon.vue">缎带</demo>

## API

### Badge 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| count | 展示的数字（或文本 / 自定义节点），大于 `overflowCount` 时显示为 `${overflowCount}+`，为 0 时隐藏 | `VueNode` | - |
| dot | 不展示数字，只显示一个小红点 | `boolean` | `false` |
| overflowCount | 展示封顶的数字值 | `number` | `99` |
| showZero | 当数值为 0 时是否展示 | `boolean` | `false` |
| offset | 徽标的位置偏移 `[向右, 向下]`，数字单位为 px | `[number \| string, number \| string]` | - |
| color | 自定义徽标颜色，支持预设色名与任意 CSS 颜色 | `string` | - |
| status | 设置为状态点 | `'success' \| 'processing' \| 'default' \| 'error' \| 'warning'` | - |
| text | 状态点旁的文本，设置了 `status` 或 `color` 且没有包裹内容时生效，同名插槽优先 | `VueNode` | - |
| size | 徽标大小，设置了 `count` 时生效 | `'default' \| 'small'` | `'default'` |
| title | 徽标的原生 `title`，设为 `null` 或 `false` 可移除 | `string \| null \| false` | `count` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'indicator', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'indicator', CSSProperties>` | - |

预设色名：`pink` `red` `yellow` `orange` `cyan` `green` `blue` `purple` `geekblue` `magenta` `volcano` `gold` `lime`。

### Badge 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 被徽标包裹的内容 |
| count | 自定义徽标内容，优先于 `count` 属性 |
| text | 自定义状态点的文本，优先于 `text` 属性 |

### Badge.Ribbon 属性 {#ribbon-props}

模板中使用 `<am-badge-ribbon>`。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| text | 缎带中的内容，同名插槽优先 | `VueNode` | - |
| color | 缎带颜色，支持预设色名与任意 CSS 颜色 | `string` | 主题色 |
| placement | 缎带的位置 | `'start' \| 'end'` | `'end'` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'indicator' \| 'content', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'indicator' \| 'content', CSSProperties>` | - |

### Badge.Ribbon 插槽 {#ribbon-slots}

| 插槽 | 说明 |
| --- | --- |
| default | 被缎带包裹的内容 |
| text | 缎带中的内容，优先于 `text` 属性 |

## 主题变量 {#design-token}

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-badge-color` | 徽标背景色 | `var(--am-color-error)` |
| `--am-badge-text-color` | 徽标文字颜色 | `var(--am-color-text-light-solid)` |
| `--am-badge-size` | 数字徽标的高度 | `18px` |
| `--am-badge-size-sm` | 小号数字徽标的高度 | `14px` |
| `--am-badge-font-size` | 数字字号 | `12px` |
| `--am-badge-font-size-sm` | 小号数字字号 | `10px` |
| `--am-badge-dot-size` | 小红点的直径 | `8px` |
| `--am-badge-status-size` | 状态点的直径 | `6px` |
| `--am-badge-border-color` | 徽标的描边颜色 | `var(--am-color-bg-container)` |
| `--am-ribbon-color` | 缎带背景色 | `var(--am-color-primary)` |
| `--am-ribbon-text-color` | 缎带文字颜色 | `var(--am-color-text-light-solid)` |
| `--am-ribbon-offset` | 缎带伸出容器的距离 | `8px` |

## 与 PC 端的差异 {#diff}

- 数字变化时没有逐位滚动动画，仅在出现 / 消失时有缩放动画。
- 包裹了内容且只设置 `status` / `color`（没有 `count`）时，直接显示为对应颜色的小圆点。
- `count` 为字符串时也可以直接展示（如 `new`、`热`）。
- 不支持 `scrollNumberPrefixCls`；`classes` / `styles` 仅支持对象形式。
- 默认尺寸更紧凑：数字徽标高 18px、小红点 8px。
