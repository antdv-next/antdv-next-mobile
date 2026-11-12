---
title: DatePicker
subtitle: 日期选择器
description: 通过滚轮选择年、月、日、时间等日期信息。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

- 需要用户输入一个日期（生日、证件有效期、预约时间等）时。
- 需要选择一段日期范围时，使用 `DatePicker.RangePicker`。
- 希望直观地看到整月日历时，请使用 [Calendar](/components/calendar)。

API 与 Antdv Next 的 `DatePicker` 对齐：`value` 默认收发 [dayjs](https://day.js.org/) 对象，设置 `valueFormat` 后收发格式化字符串；`picker` 切换选择粒度，`showTime` 增加时间列。移动端使用底部滚轮代替日历面板，点击「确定」后才会提交。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/picker.vue">选择粒度</demo>
<demo src="./demo/show-time.vue">日期时间</demo>
<demo src="./demo/range.vue">可选范围与禁用日期</demo>
<demo src="./demo/value-format.vue">值格式化</demo>
<demo src="./demo/filter.vue">过滤选项与自定义文案</demo>
<demo src="./demo/custom-trigger.vue" full>自定义触发器</demo>
<demo src="./demo/view.vue">内嵌视图 DatePickerView</demo>
<demo src="./demo/range-basic.vue">日期范围 RangePicker</demo>
<demo src="./demo/range-picker.vue">范围的粒度与格式</demo>
<demo src="./demo/range-limit.vue">范围限制、留空与禁用</demo>
<demo src="./demo/range-form.vue" full>范围：表单与自定义触发器</demo>

## API

### DatePicker 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value (v-model) | 已提交的日期 | `Dayjs \| string \| null` | - |
| defaultValue | 默认日期（非受控） | `Dayjs \| string \| null` | - |
| valueFormat | 绑定值的格式。设置后 `value`、`defaultValue`、`minDate`、`maxDate` 可使用该格式的字符串，`change` 返回同格式字符串 | `string` | - |
| picker | 选择粒度 | `'date' \| 'month' \| 'year' \| 'quarter' \| 'week' \| 'time'` | `'date'` |
| showTime | 增加时间选择（仅 `picker="date"`），对象可配置时间列 | `boolean \| DatePickerShowTime` | `false` |
| format | 触发器的展示格式，参考 [dayjs format](https://day.js.org/docs/zh-CN/display/format)，也可传入函数 | `string \| ((value: Dayjs) => string)` | 见下方 |
| minDate | 最小可选日期 | `Dayjs \| string` | 十年前 |
| maxDate | 最大可选日期 | `Dayjs \| string` | 十年后 |
| disabledDate | 不可选择的日期，对应选项置灰并被跳过 | `(current: Dayjs, info: { type: string }) => boolean` | - |
| disabledTime | 不可选择的时间 | `(date: Dayjs) => { disabledHours?, disabledMinutes?, disabledSeconds? }` | - |
| defaultPickerValue | 没有值时滚轮默认停靠的日期 | `Dayjs \| string` | 当前时间 |
| use12Hours | 使用 12 小时制 | `boolean` | `false` |
| hourStep | 小时选项间隔 | `number` | `1` |
| minuteStep | 分钟选项间隔 | `number` | `1` |
| secondStep | 秒选项间隔 | `number` | `1` |
| filter | 过滤或重排某一列的选项 | `(type: DatePickerColumnType, options: PickerOption[]) => PickerOption[]` | - |
| renderLabel | 自定义选项文字，默认追加语言包中的单位（如 `2024年`） | `(type: DatePickerColumnType, value: number) => string \| number` | - |
| open (v-model) | 弹层是否展开 | `boolean` | - |
| defaultOpen | 默认是否展开 | `boolean` | `false` |
| placeholder | 占位文字 | `string` | `'请选择日期'` |
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
| virtual | 虚拟滚动：每列只渲染可视区域附近的选项，上万个选项也只挂载几十个节点；`false` 时渲染全部选项 | `boolean` | `true` |
| getContainer | 弹层挂载节点，`false` 表示原地渲染 | `string \| HTMLElement \| (() => HTMLElement) \| false` | `document.body` |
| zIndex | 弹层层级 | `number` | - |
| maskClosable | 点击遮罩是否关闭（视为取消） | `boolean` | `true` |
| destroyOnHidden | 关闭时销毁弹层内容 | `boolean` | `false` |
| id | 触发器的 id，表单内默认取字段 id | `string` | - |
| rootClass | 触发器与弹层根节点的类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'content' \| 'suffix' \| 'popup', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'content' \| 'suffix' \| 'popup', CSSProperties>` | - |

`format` 的默认值随 `picker` 变化：

| picker | 默认 format | 列 |
| --- | --- | --- |
| `date` | `YYYY-MM-DD` | 年、月、日 |
| `date` + `showTime` | `YYYY-MM-DD HH:mm:ss` | 年、月、日、时、分、秒 |
| `month` | `YYYY-MM` | 年、月 |
| `quarter` | `YYYY-[Q]Q` | 年、季度 |
| `week` | `GGGG-[W]WW`（ISO 周） | 年、周 |
| `year` | `YYYY` | 年 |
| `time` | `HH:mm:ss` | 时、分、秒，即 [TimePicker](/components/time-picker) |

### DatePickerShowTime

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| format | 时间格式，决定显示哪些时间列，如 `HH:mm` 只显示时、分 | `string` | `'HH:mm:ss'` |
| showHour / showMinute / showSecond | 单独控制某一列是否显示 | `boolean` | `true` |
| use12Hours | 使用 12 小时制 | `boolean` | `false` |
| hourStep / minuteStep / secondStep | 选项间隔，优先于外层同名属性 | `number` | `1` |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 已提交的值变化时触发（确认或清除） | `(date: Dayjs \| string \| null, dateString: string) => void` |
| confirm | 点击确认按钮时触发 | `(date: Dayjs \| string, dateString: string) => void` |
| cancel | 点击取消按钮或遮罩时触发 | `() => void` |
| select | 滚轮停靠到新选项时触发，此时值尚未提交 | `(date: Dayjs \| string, dateString: string) => void` |
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

### DatePickerView

内嵌的滚轮视图，也可通过 `DatePicker.View` 访问。支持上表中所有日期相关属性（`value`、`defaultValue`、`valueFormat`、`picker`、`showTime`、`format`、`minDate`、`maxDate`、`disabledDate`、`disabledTime`、`defaultPickerValue`、`use12Hours`、`hourStep`、`minuteStep`、`secondStep`、`filter`、`renderLabel`、`itemHeight`、`visibleItemCount`、`virtual`），以及 [PickerView](/components/picker-view#props) 的 `rootClass`、`classes`、`styles`。

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 滚轮停靠到新日期时触发 | `(date: Dayjs \| string, dateString: string) => void` |
| update:value | `v-model:value` 更新 | `(date: Dayjs \| string) => void` |

### RangePicker {#range}

`DatePicker.RangePicker`（`<am-range-picker>`，具名导出 `DateRangePicker`）在同一个底部弹层中通过「开始 / 结束」两个页签选择日期范围，每个页签是一组滚轮。点击触发器的开始或结束部分会打开对应的页签；结束滚轮的最小值跟随已选的开始日期，点击「确定」后两端一起提交。需要直观地在日历上选择范围时，也可以使用 [Calendar](/components/calendar) 的 `selection-mode="range"`。

支持 DatePicker 的全部日期属性（`valueFormat`、`picker`、`showTime`、`format`、`minDate`、`maxDate`、`disabledDate`、`disabledTime`、`defaultPickerValue`、`use12Hours`、`hourStep`、`minuteStep`、`secondStep`、`filter`、`renderLabel`、`itemHeight`、`visibleItemCount`、`virtual`）和弹层 / 触发器属性（`open`、`defaultOpen`、`title`、`okText`、`cancelText`、`allowClear`、`status`、`variant`、`size`、`trigger`、`suffixIcon`、`getContainer`、`zIndex`、`maskClosable`、`destroyOnHidden`、`id`、`rootClass`、`classes`、`styles`），以下属性有所不同：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value (v-model) | 已提交的范围，`null` 表示该端为空 | `[Dayjs \| string \| null, Dayjs \| string \| null] \| null` | - |
| defaultValue | 默认范围（非受控） | `[Dayjs \| string \| null, Dayjs \| string \| null] \| null` | - |
| placeholder | 开始与结束的占位文字 | `[string, string]` | `['开始日期', '结束日期']` |
| separator | 触发器中两端之间的分隔符，同名插槽优先 | `VueNode` | `<SwapRightOutlined />` |
| allowEmpty | 允许某一端留空：没有值且页签从未打开过的一端提交为 `null` | `boolean \| [boolean, boolean]` | `false` |
| disabled | 是否禁用；传入数组可只禁用一端，被禁用的一端保持原值且页签不可切换 | `boolean \| [boolean, boolean]` | `false` |

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 已提交的范围变化时触发（确认或清除，清除时为 `null`） | `(dates: [Dayjs \| string \| null, Dayjs \| string \| null] \| null, dateStrings: [string, string]) => void` |
| calendarChange | 滚轮停靠到新日期时触发，此时值尚未提交 | `(dates, dateStrings: [string, string], info: { range: 'start' \| 'end' }) => void` |
| confirm | 点击确认按钮时触发 | `(dates, dateStrings: [string, string]) => void` |
| cancel | 点击取消按钮或遮罩时触发 | `() => void` |
| openChange | 弹层展开 / 收起时触发 | `(open: boolean) => void` |
| clear | 点击清除图标时触发 | `() => void` |

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 自定义触发器，替换内置的输入框 | `{ open, value, label, labels, disabled, toggle }` |
| separator | 触发器中的分隔符 | - |
| title | 弹层标题 | - |
| suffixIcon | 触发器后缀图标 | - |
| header | 页签与滚轮之间的内容 | - |
| footer | 滚轮下方的内容 | - |

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| toggle | 切换弹层，可传入目标状态以及打开时停靠的页签 | `(open?: boolean, range?: 'start' \| 'end') => void` |

## 主题变量 {#design-token}

触发器与弹层变量见 [Picker](/components/picker#design-token)，滚轮变量见 [PickerView](/components/picker-view#design-token)。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-date-picker-view-font-size` | 滚轮选项字号 | `var(--am-font-size-lg)` |
| `--am-range-picker-separator-color` | RangePicker 分隔符颜色 | `var(--am-color-text-quaternary)` |
| `--am-range-picker-gap` | RangePicker 两端与分隔符的间距 | `var(--am-padding-xs)` |
| `--am-range-picker-tabs-padding` | RangePicker 页签栏内边距（声明在 `.am-range-picker-tabs` 上） | `var(--am-padding-xs) var(--am-padding)` |
| `--am-range-picker-tab-padding-block` | 页签上下内边距 | `6px` |
| `--am-range-picker-tab-title-font-size` | 页签标题字号 | `var(--am-font-size-sm)` |
| `--am-range-picker-tab-value-font-size` | 页签日期字号 | `var(--am-font-size)` |
| `--am-range-picker-tab-active-color` | 当前页签日期颜色 | `var(--am-color-primary)` |

## 与 PC 端的差异 {#diff}

- 使用底部滚轮代替下拉日历面板，值在点击「确定」后提交（相当于 PC 端 `needConfirm` 恒为 `true`），新增 `confirm`、`cancel`、`select` 事件。
- `RangePicker` 在一个底部弹层内用「开始 / 结束」页签 + 滚轮选择，代替 PC 端的双日历面板：结束日期被限制为不早于开始日期（没有 `order` 自动排序）；`allowEmpty` 的含义调整为「没有值且页签未打开过的一端保持为空」；`calendarChange` 在滚轮停靠时触发；不支持 `presets`、`id: { start, end }`、`focus` / `blur` 事件，新增 `confirm`、`cancel`、`clear` 事件与 `toggle(open, range)`。
- `RangePicker` 的 `disabledDate` 不提供 `info.from`；没有 `DatePicker.MonthPicker` 等快捷子组件，请使用 `picker` 属性。
- 没有 `multiple`、`presets`、`showNow`、`showWeek`、`mode`、`panelRender`、`cellRender`、`renderExtraFooter`、`components`、`placement`、`prefix`、`inputReadOnly` 等面板 / 输入框相关 API；触发器不可手动输入。
- `picker` 新增 `'time'`（即 TimePicker）；`picker="week"` 使用 ISO 周（周一为一周的开始），默认格式为 `GGGG-[W]WW`。
- `minDate` / `maxDate` 默认为前后十年（滚轮需要有限的范围）；`disabledDate` 仅作用于当前粒度的最后一列，命中的选项置灰并自动跳过。
- `allowClear` 默认为 `false`，仅支持布尔值。
- 弹层容器使用 `getContainer`（与 Popup 一致），不支持 `getPopupContainer`。
- 新增移动端属性：`title`、`okText`、`cancelText`、`trigger`、`filter`、`renderLabel`、`itemHeight`、`visibleItemCount`、`virtual`，以及内嵌视图 `DatePickerView`。
- `classes` / `styles` 的语义化结构为 `root`、`content`、`suffix`、`popup`。
