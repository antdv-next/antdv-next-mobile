---
title: Picker
subtitle: 选择器
description: 在底部弹出的滚轮中选择一项或多项关联数据。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

- 从一组（或多组联动的）数据中选择，选项数量在 5 ~ 30 之间时。
- 选项较少且需要平铺展示时使用 [Selector](/components/selector)，选项很多或需要搜索时使用 [Select](/components/select)。

Picker 是一个**表单域**：默认渲染一个类输入框的触发器，点击后从底部弹出滚轮，点击「确定」提交、点击「取消」或遮罩放弃。只需要滚轮本身时请使用 [PickerView](/components/picker-view)。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/format.vue">多列与格式化</demo>
<demo src="./demo/cascade.vue">级联选择</demo>
<demo src="./demo/custom-trigger.vue" full>自定义触发器</demo>
<demo src="./demo/variant.vue">形态、尺寸与状态</demo>
<demo src="./demo/form.vue" full>在表单中使用</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 列数据，传入函数可实现级联，见 [PickerView](/components/picker-view#props) | `PickerOption[][] \| ((value: PickerValue[]) => PickerOption[][])` | - |
| fieldNames | 自定义选项字段名 | `{ label?: string, value?: string, disabled?: string }` | - |
| value (v-model) | 已提交的值，每列一项 | `PickerValue[]` | - |
| defaultValue | 默认值（非受控） | `PickerValue[]` | - |
| open (v-model) | 弹层是否展开 | `boolean` | - |
| defaultOpen | 默认是否展开 | `boolean` | `false` |
| placeholder | 占位文字 | `string` | `'请选择'` |
| format | 自定义触发器显示的文字 | `(items: PickerOption[]) => string` | 以 ` / ` 连接各列 label |
| title | 弹层标题，同名插槽优先 | `VueNode` | - |
| okText | 确认按钮文字 | `string` | `'确定'` |
| cancelText | 取消按钮文字 | `string` | `'取消'` |
| disabled | 是否禁用 | `boolean` | `false` |
| allowClear | 有值时显示清除图标 | `boolean` | `false` |
| status | 校验状态 | `'error' \| 'warning'` | - |
| variant | 形态变体，表单内默认为 `borderless` | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'` |
| size | 触发器尺寸 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| trigger | 是否渲染内置触发器，设为 `false` 时仅通过 `v-model:open` 控制弹层 | `boolean` | `true` |
| suffixIcon | 触发器后缀图标，同名插槽优先，`null` 表示隐藏 | `VueNode` | 箭头图标 |
| loading | 加载状态，加载中无法确认 | `boolean` | `false` |
| itemHeight | 选项高度（px） | `number` | `40` |
| visibleItemCount | 可见选项个数 | `number` | `5` |
| optionRender | 自定义选项内容，同名插槽 `option` 优先 | `VueNode \| ((info: PickerOptionRenderInfo) => VueNode)` | - |
| getContainer | 弹层挂载节点，`false` 表示原地渲染 | `string \| HTMLElement \| (() => HTMLElement) \| false` | `document.body` |
| zIndex | 弹层层级 | `number` | - |
| maskClosable | 点击遮罩是否关闭（视为取消） | `boolean` | `true` |
| destroyOnHidden | 关闭时销毁弹层内容 | `boolean` | `false` |
| id | 触发器的 id，表单内默认取字段 id | `string` | - |
| rootClass | 触发器与弹层根节点的类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'content' \| 'suffix' \| 'popup', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'content' \| 'suffix' \| 'popup', CSSProperties>` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 已提交的值变化时触发（确认或清除） | `(value: PickerValue[], info: { items: PickerOption[] }) => void` |
| confirm | 点击确认按钮时触发 | `(value: PickerValue[], info: { items: PickerOption[] }) => void` |
| cancel | 点击取消按钮或遮罩时触发 | `() => void` |
| select | 滚轮停靠到新选项时触发，此时值尚未提交 | `(value: PickerValue[], info: { items: PickerOption[], columnIndex: number }) => void` |
| openChange | 弹层展开 / 收起时触发 | `(open: boolean) => void` |
| clear | 点击清除图标时触发 | `() => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 自定义触发器，替换内置的输入框 | `{ open, value, label, items, disabled, toggle }` |
| title | 弹层标题 | - |
| suffixIcon | 触发器后缀图标 | - |
| option | 自定义选项内容 | `{ option, index, columnIndex, selected }` |
| header | 标题栏与滚轮之间的内容 | - |
| footer | 滚轮下方的内容 | - |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| toggle | 切换弹层，可传入目标状态 | `(open?: boolean) => void` |

## 主题变量 {#design-token}

触发器与弹层标题栏由所有选择类表单域（Picker、DatePicker、TimePicker、Cascader、Select、Calendar）共用。滚轮相关变量见 [PickerView](/components/picker-view#design-token)。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-picker-trigger-height` | 触发器高度 | `var(--am-control-height)` |
| `--am-picker-trigger-font-size` | 触发器字号 | `var(--am-font-size-lg)` |
| `--am-picker-trigger-padding-inline` | 触发器水平内边距 | `var(--am-padding-sm)` |
| `--am-picker-trigger-border-radius` | 触发器圆角 | `var(--am-border-radius)` |
| `--am-picker-trigger-color` | 文字颜色 | `var(--am-color-text)` |
| `--am-picker-trigger-placeholder-color` | 占位文字颜色 | `var(--am-color-text-placeholder)` |
| `--am-picker-trigger-icon-color` | 后缀图标颜色 | `var(--am-color-icon)` |
| `--am-picker-trigger-bg` | 背景色 | `var(--am-color-bg-container)` |
| `--am-picker-trigger-border-color` | 边框颜色 | `var(--am-color-border)` |
| `--am-picker-trigger-active-border-color` | 展开时的边框颜色 | `var(--am-color-primary)` |
| `--am-picker-popup-header-height` | 弹层标题栏高度 | `48px` |
| `--am-picker-popup-title-font-size` | 弹层标题字号 | `var(--am-font-size-lg)` |
| `--am-picker-popup-button-font-size` | 确认 / 取消按钮字号 | `var(--am-font-size-lg)` |
| `--am-picker-popup-confirm-color` | 确认按钮颜色 | `var(--am-color-primary)` |
| `--am-picker-popup-cancel-color` | 取消按钮颜色 | `var(--am-color-text-secondary)` |
