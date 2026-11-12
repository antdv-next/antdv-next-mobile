---
title: PickerView
subtitle: 选择器视图
description: 滚轮选择视图，Picker 的内容区域，可内嵌在页面中使用。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

- 需要把滚轮直接铺在页面或自定义弹层里，而不是通过输入框触发时。
- 需要基于滚轮组合出自己的选择器（[Picker](/components/picker)、[DatePicker](/components/date-picker)、[TimePicker](/components/time-picker) 均基于它实现）。

滚轮使用 `transform` 驱动，支持触摸拖动、惯性滚动与自动吸附；桌面端可用鼠标滚轮、点击选项或方向键操作。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/multiple.vue">多列选择</demo>
<demo src="./demo/cascade.vue">级联选择</demo>
<demo src="./demo/disabled.vue">禁用选项与加载状态</demo>
<demo src="./demo/custom.vue">自定义高度与选项内容</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 列数据。二维数组表示多列；传入函数 `(value) => PickerOption[][]` 时每次选择后重新计算，可实现级联 | `PickerOption[][] \| ((value: PickerValue[]) => PickerOption[][])` | - |
| fieldNames | 自定义选项字段名 | `{ label?: string, value?: string, disabled?: string }` | `{ label: 'label', value: 'value', disabled: 'disabled' }` |
| value (v-model) | 当前值，每列一项 | `PickerValue[]` | - |
| defaultValue | 默认值（非受控） | `PickerValue[]` | - |
| loading | 加载状态，显示加载图标并隐藏滚轮 | `boolean` | `false` |
| itemHeight | 选项高度（px） | `number` | `40` |
| visibleItemCount | 可见选项个数，建议为奇数 | `number` | `5` |
| optionRender | 自定义选项内容，同名插槽 `option` 优先 | `VueNode \| ((info: PickerOptionRenderInfo) => VueNode)` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'column' \| 'item' \| 'indicator', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'column' \| 'item' \| 'indicator', CSSProperties>` | - |

未设置 `value` 或某列的值不存在 / 被禁用时，该列会停在最近的可选项上（默认第一项）。

### PickerOption

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| label | 选项文字 | `string \| number` |
| value | 选项值 | `string \| number` |
| disabled | 是否禁用，禁用项会被跳过 | `boolean` |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 滚轮停靠到新选项时触发 | `(value: PickerValue[], info: { items: PickerOption[], columnIndex: number }) => void` |
| update:value | `v-model:value` 更新 | `(value: PickerValue[]) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| option | 自定义选项内容，优先于 `optionRender` | `{ option, index, columnIndex, selected }` |
| loading | 自定义加载内容 | - |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.PickerView` 或直接覆盖 CSS 变量定制。选项高度与可见个数请使用 `itemHeight` / `visibleItemCount` 属性。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-picker-view-font-size` | 选项字号 | `var(--am-font-size-lg)` |
| `--am-picker-view-color` | 选项文字颜色 | `var(--am-color-text)` |
| `--am-picker-view-disabled-color` | 禁用选项文字颜色 | `var(--am-color-text-disabled)` |
| `--am-picker-view-indicator-bg` | 选中指示条背景 | `var(--am-color-fill-tertiary)` |
| `--am-picker-view-indicator-radius` | 选中指示条圆角 | `var(--am-border-radius)` |
| `--am-picker-view-indicator-inset` | 选中指示条左右缩进 | `var(--am-padding-xs)` |
| `--am-picker-view-mask-opacity` | 上下边缘选项的不透明度（渐隐遮罩） | `0.15` |
