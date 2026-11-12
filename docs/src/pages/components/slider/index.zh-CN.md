---
title: Slider
subtitle: 滑动输入条
description: 滑动型输入器，展示当前值和可选范围。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

当用户需要在数值区间 / 自定义区间内进行选择时，可为连续或离散值。

API 与 Antdv Next 的 `Slider` 对齐，针对触摸做了优化：更大的滑块与热区、拖动时显示数值气泡、横向滑动条不会拦截页面的纵向滚动。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/range.vue">双滑块</demo>
<demo src="./demo/step.vue">步长与刻度点</demo>
<demo src="./demo/marks.vue">刻度标记</demo>
<demo src="./demo/tooltip.vue">数值气泡</demo>
<demo src="./demo/event.vue">事件</demo>
<demo src="./demo/reverse.vue">反向</demo>
<demo src="./demo/vertical.vue">垂直方向</demo>
<demo src="./demo/style-class.vue">自定义滑块与组件变量</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前取值，`range` 时为 `[number, number]`，支持 `v-model:value` | `number \| [number, number]` | - |
| defaultValue | 初始取值 | `number \| [number, number]` | `0 \| [0, 0]` |
| min | 最小值 | `number` | `0` |
| max | 最大值 | `number` | `100` |
| step | 步长，取值必须大于 0。当 `marks` 不为空时可以设置为 `null`，此时可选值仅有 `marks`、`min` 和 `max` | `number \| null` | `1` |
| range | 双滑块模式 | `boolean` | `false` |
| disabled | 禁用状态 | `boolean` | `false` |
| marks | 刻度标记，key 必须为 `number` 且在闭区间 [min, max] 内，每个标签可以单独设置样式 | `Record<number, VueNode \| { style?: CSSProperties, label?: VueNode }>` | - |
| dots | 是否显示每一步的刻度点 | `boolean` | `false` |
| included | 值为 `true` 时表示值为包含关系（显示已选轨道），`false` 表示并列 | `boolean` | `true` |
| reverse | 反向坐标轴 | `boolean` | `false` |
| vertical | 垂直方向 | `boolean` | `false` |
| orientation | 排列方向，优先于 `vertical` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| keyboard | 支持使用键盘操作滑块（方向键、Home、End） | `boolean` | `true` |
| tooltip | 数值气泡配置 | [TooltipConfig](#tooltipconfig) | - |
| id | 第一个滑块的 id，在 `Form.Item` 中自动设置 | `string` | - |
| ariaLabelForHandle | 滑块的 `aria-label` | `string \| string[]` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'rail' \| 'track' \| 'handle', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'rail' \| 'track' \| 'handle', CSSProperties>` | - |

### TooltipConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 值为 `true` 时气泡始终显示；`false` 时始终不显示；不设置时仅在拖动过程中显示 | `boolean` | - |
| formatter | 格式化气泡内容，为 `null` 时隐藏气泡 | `((value: number) => VueNode) \| null` | 原值 |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 值发生改变时触发（拖动过程中会连续触发） | `(value: number \| [number, number]) => void` |
| changeComplete | 手指离开（或松开鼠标、按键）时触发，把当前值作为参数传入 | `(value: number \| [number, number]) => void` |
| update:value | `v-model:value` 更新 | `(value: number \| [number, number]) => void` |
| focus | 滑块获取焦点时触发 | `(event: FocusEvent) => void` |
| blur | 滑块失去焦点时触发 | `(event: FocusEvent) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| mark | 自定义刻度内容 | `{ point: number, label?: any }` |
| handle | 自定义滑块内容 | `{ value: number, index: number, dragging: boolean }` |

### 方法 {#methods}

| 名称 | 说明 |
| --- | --- |
| focus() | 获取焦点 |
| blur() | 移除焦点 |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Slider` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-slider-rail-size` | 轨道粗细 | `4px` |
| `--am-slider-handle-size` | 滑块大小 | `24px` |
| `--am-slider-dot-size` | 刻度点大小 | `8px` |
| `--am-slider-rail-bg` | 轨道背景色 | `var(--am-color-fill-secondary)` |
| `--am-slider-track-bg` | 已选轨道颜色 | `var(--am-color-primary)` |
| `--am-slider-handle-bg` | 滑块背景色 | `var(--am-color-white)` |
| `--am-slider-handle-shadow` | 滑块阴影 | `0 1px 4px 0 rgb(0 0 0 / 24%), 0 0 1px 0 rgb(0 0 0 / 16%)` |
| `--am-slider-dot-border-color` | 刻度点边框颜色 | `var(--am-color-border)` |
| `--am-slider-vertical-height` | 垂直模式下的高度 | `200px` |

## 与 PC 端的差异 {#diff}

- `tooltip` 简化为数值气泡：仅支持 `open` 与 `formatter`，默认只在拖动过程中显示（PC 端为 hover 显示），不支持 `placement`、`getPopupContainer`、`autoAdjustOverflow`。
- `range` 仅支持 `boolean`，不支持 `draggableTrack`、`editable` 等 RangeConfig；两个滑块可以互相越过。
- `disabled` 仅支持 `boolean`，不支持按滑块分别禁用的 `boolean[]`。
- `classes` / `styles` 仅支持对象形式，语义化结构为 `root`、`rail`、`track`、`handle`（没有 `tracks`）。
- 新增 `handle` 插槽用于自定义滑块内容，新增 `focus` / `blur` 事件。
- 不支持 `autoFocus`、`tabIndex` 及除 `ariaLabelForHandle` 之外的 aria 透传属性。
- 点击轨道任意位置会让最近的滑块直接跳到该位置并可继续拖动；直接按住滑块时不会跳动。
