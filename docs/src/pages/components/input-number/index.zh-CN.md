---
title: InputNumber
subtitle: 数字输入框
description: 通过点击按钮或键盘输入范围内的数值，移动端默认呈现为步进器。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

当需要获取标准数值时，例如商品数量、人数、金额。

API 与 Antdv Next 的 `InputNumber` 对齐，移动端默认使用 `mode="spinner"`（− / + 按钮位于两侧的步进器），支持长按连续增减，并唤起数字键盘。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/range.vue">范围与步长</demo>
<demo src="./demo/formatter.vue">精度与格式化</demo>
<demo src="./demo/size.vue">尺寸与形态</demo>
<demo src="./demo/mode.vue">输入框模式与自定义按钮</demo>
<demo src="./demo/disabled.vue">状态</demo>
<demo src="./demo/form.vue" full>在表单中使用</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值，支持 `v-model:value`，`null` 表示空 | `number \| string \| null` | - |
| defaultValue | 初始值 | `number \| string \| null` | - |
| min | 最小值 | `number \| string` | `-Infinity` |
| max | 最大值 | `number \| string` | `Infinity` |
| step | 每次改变步数，可以为小数 | `number \| string` | `1` |
| precision | 数值精度（小数位数） | `number` | - |
| mode | 展示模式：`spinner` 为两侧带按钮的步进器，`input` 为撑满宽度的输入框 | `'spinner' \| 'input'` | `'spinner'` |
| controls | 是否显示增减按钮，也可设置自定义图标 | `boolean \| { upIcon?: VueNode, downIcon?: VueNode }` | `true` |
| formatter | 指定输入框展示值的格式 | `(value: number \| string, info: { userTyping: boolean, input: string }) => string` | - |
| parser | 指定从 `formatter` 里转换回数字的方式 | `(displayValue: string) => number \| string` | - |
| stringMode | 字符值模式，`change` 返回字符串（保留精度与末尾 0） | `boolean` | `false` |
| changeOnBlur | 失焦时是否提交（修正范围、格式化）输入的内容 | `boolean` | `true` |
| keyboard | 是否启用键盘上下键步进 | `boolean` | `true` |
| longPress | 长按按钮是否连续步进 | `boolean` | `true` |
| disabled | 禁用 | `boolean` | `false` |
| readOnly | 只读（也可写作 `readonly`） | `boolean` | `false` |
| prefix | 前缀，同名插槽优先 | `VueNode` | - |
| suffix | 后缀，同名插槽优先 | `VueNode` | - |
| placeholder | 占位文本 | `string` | - |
| status | 校验状态 | `'error' \| 'warning'` | - |
| size | 尺寸 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| variant | 形态变体 | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'`（表单内为 `'borderless'`） |
| inputmode | 虚拟键盘类型，需要输入负数时可设为 `'text'` | `string` | `'decimal'` |
| autofocus | 自动聚焦 | `boolean` | `false` |
| name | 原生 `name` | `string` | - |
| id | 原生输入框的 `id`，在 `FormItem` 中默认使用字段 id | `string` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'input' \| 'prefix' \| 'suffix' \| 'action', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'input' \| 'prefix' \| 'suffix' \| 'action', CSSProperties>` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| update:value | 值变化时触发 | `(value: number \| string \| null) => void` |
| change | 变化回调 | `(value: number \| string \| null) => void` |
| input | 输入时触发，参数为原始文本 | `(text: string) => void` |
| step | 点击按钮或键盘上下键步进时触发 | `(value: number \| string, info: { offset: number \| string, type: 'up' \| 'down', emitter: 'handler' \| 'keyboard' }) => void` |
| pressEnter | 按下回车的回调 | `(event: KeyboardEvent) => void` |
| focus | 获得焦点 | `(event: FocusEvent) => void` |
| blur | 失去焦点 | `(event: FocusEvent) => void` |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| prefix | 前缀，优先于 `prefix` 属性 |
| suffix | 后缀，优先于 `suffix` 属性 |
| upIcon | 自定义「加」按钮图标，优先于 `controls.upIcon` |
| downIcon | 自定义「减」按钮图标，优先于 `controls.downIcon` |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| focus | 获取焦点 | `(options?: FocusOptions) => void` |
| blur | 取消焦点 | `() => void` |
| input | 原生 `input` 元素 | `HTMLInputElement` |
| nativeElement | 根元素 | `HTMLElement` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.InputNumber` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-input-number-height` | 高度（同时也是按钮宽度） | `var(--am-control-height-sm)` |
| `--am-input-number-font-size` | 文字大小 | `var(--am-font-size-lg)` |
| `--am-input-number-input-width` | 步进器中输入区的宽度 | `48px` |
| `--am-input-number-gap` | 按钮与输入区的间距 | `2px` |
| `--am-input-number-border-radius` | 圆角 | `var(--am-border-radius-sm)` |
| `--am-input-number-color` | 文字颜色 | `var(--am-color-text)` |
| `--am-input-number-background` | 输入区背景色 | `var(--am-color-bg-container)` |
| `--am-input-number-filled-background` | `filled` / `borderless` 形态输入区背景色 | `var(--am-color-fill-tertiary)` |
| `--am-input-number-border-color` | 边框颜色 | `var(--am-color-border)` |
| `--am-input-number-active-border-color` | 聚焦时的边框与光标颜色 | `var(--am-color-primary)` |
| `--am-input-number-action-color` | 按钮图标颜色 | `var(--am-color-primary)` |
| `--am-input-number-action-background` | 按钮背景色 | `var(--am-color-fill-tertiary)` |
| `--am-input-number-action-active-background` | 按钮按压背景色 | `var(--am-color-fill)` |

## 与 PC 端的差异 {#diff}

- 默认 `mode="spinner"`（PC 默认为 `input`）：− / + 按钮位于两侧，触控区域更大，支持长按连续步进（`longPress`）。
- `inputmode` 默认为 `'decimal'` 以唤起数字键盘。
- 不支持 `addonBefore` / `addonAfter`、`allowClear`、`changeOnWheel`、`type`，以及鼠标类事件；`step` 事件的 `emitter` 没有 `'wheel'`。
- `stringMode` 基于原生数值运算，不提供超出 `Number` 精度的高精度小数支持。
- `classes` / `styles` 仅支持对象形式。
