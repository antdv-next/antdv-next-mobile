---
title: TimePicker
subtitle: 时间选择器
description: 通过滚轮选择一个时间点。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

需要用户输入一个时间（闹钟、营业时间、预约时段）时使用。需要同时选择日期请使用 [DatePicker](/components/date-picker) 的 `showTime`。

API 与 antdv-next 的 `TimePicker` 对齐：`value` 默认收发 dayjs 对象，设置 `valueFormat` 后收发字符串；`format` 同时决定展示格式与滚轮的列。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/format.vue">格式与步长</demo>
<demo src="./demo/12hours.vue">12 小时制</demo>
<demo src="./demo/value-format.vue">值格式化</demo>
<demo src="./demo/disabled-time.vue">禁用时间</demo>
<demo src="./demo/custom-trigger.vue" full>自定义触发器</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value (v-model) | 已提交的时间 | `Dayjs \| string \| null` | - |
| defaultValue | 默认时间（非受控） | `Dayjs \| string \| null` | - |
| valueFormat | 绑定值的格式，设置后收发该格式的字符串，如 `HH:mm` | `string` | - |
| format | 展示格式，同时决定滚轮的列：`HH:mm:ss`、`HH:mm`、`h:mm a` 等 | `string` | `'HH:mm:ss'` |
| use12Hours | 使用 12 小时制，默认格式变为 `h:mm:ss a` | `boolean` | `false` |
| hourStep | 小时选项间隔 | `number` | `1` |
| minuteStep | 分钟选项间隔 | `number` | `1` |
| secondStep | 秒选项间隔 | `number` | `1` |
| showHour | 是否显示小时列 | `boolean` | `true` |
| showMinute | 是否显示分钟列 | `boolean` | `true` |
| showSecond | 是否显示秒列 | `boolean` | `true` |
| disabledTime | 不可选择的时间，对应选项置灰并被跳过 | `(date: Dayjs) => { disabledHours?: () => number[], disabledMinutes?: (hour) => number[], disabledSeconds?: (hour, minute) => number[] }` | - |
| defaultOpenValue | 没有值时滚轮默认停靠的时间 | `Dayjs \| string` | 当前时间 |
| filter | 过滤或重排某一列的选项 | `(type: 'hour' \| 'minute' \| 'second' \| 'meridiem', options: PickerOption[]) => PickerOption[]` | - |
| renderLabel | 自定义选项文字 | `(type, value: number) => string \| number` | - |
| open (v-model) | 弹层是否展开 | `boolean` | - |
| defaultOpen | 默认是否展开 | `boolean` | `false` |
| placeholder | 占位文字 | `string` | `'请选择时间'` |
| title | 弹层标题，同名插槽优先 | `VueNode` | - |
| okText | 确认按钮文字 | `string` | `'确定'` |
| cancelText | 取消按钮文字 | `string` | `'取消'` |
| disabled | 是否禁用 | `boolean` | `false` |
| allowClear | 有值时显示清除图标 | `boolean` | `false` |
| status | 校验状态 | `'error' \| 'warning'` | - |
| variant | 形态变体，表单内默认为 `borderless` | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'` |
| size | 触发器尺寸 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| trigger | 是否渲染内置触发器 | `boolean` | `true` |
| suffixIcon | 触发器后缀图标，同名插槽优先，`null` 表示隐藏 | `VueNode` | 箭头图标 |
| itemHeight | 选项高度（px） | `number` | `40` |
| visibleItemCount | 可见选项个数 | `number` | `5` |
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
| change | 已提交的值变化时触发（确认或清除） | `(time: Dayjs \| string \| null, timeString: string) => void` |
| confirm | 点击确认按钮时触发 | `(time: Dayjs \| string, timeString: string) => void` |
| cancel | 点击取消按钮或遮罩时触发 | `() => void` |
| select | 滚轮停靠到新选项时触发，此时值尚未提交 | `(time: Dayjs \| string, timeString: string) => void` |
| openChange | 弹层展开 / 收起时触发 | `(open: boolean) => void` |
| clear | 点击清除图标时触发 | `() => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 自定义触发器，替换内置的输入框 | `{ open, value, label, disabled, toggle }` |
| title | 弹层标题 | - |
| suffixIcon | 触发器后缀图标 | - |
| header | 标题栏与滚轮之间的内容 | - |
| footer | 滚轮下方的内容 | - |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| toggle | 切换弹层，可传入目标状态 | `(open?: boolean) => void` |

## 主题变量 {#design-token}

TimePicker 没有独立的组件变量：触发器与弹层变量见 [Picker](/components/picker#design-token)，滚轮变量见 [PickerView](/components/picker-view#design-token)。

## 与 PC 端的差异 {#diff}

- 使用底部滚轮代替下拉面板，值在点击「确定」后提交（相当于 `needConfirm` 恒为 `true`），新增 `confirm`、`cancel`、`select` 事件。
- 没有 `TimePicker.RangePicker`、`showNow`、`hideDisabledOptions`、`renderExtraFooter`、`cellRender`、`placement`、`prefix`、`inputReadOnly`、`changeOnScroll` 等 API；触发器不可手动输入。需要隐藏禁用项时请使用 `filter`。
- `allowClear` 默认为 `false`，仅支持布尔值。
- 弹层容器使用 `getContainer`（与 Popup 一致），不支持 `getPopupContainer`。
- 新增移动端属性：`title`、`okText`、`cancelText`、`trigger`、`filter`、`renderLabel`、`itemHeight`、`visibleItemCount`。
- `classes` / `styles` 的语义化结构为 `root`、`content`、`suffix`、`popup`。
