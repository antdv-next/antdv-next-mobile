---
title: Calendar
subtitle: 日历
description: 在纵向滚动的月历中选择日期、日期区间或多个日期。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

- 选择日期区间（酒店入住 / 离店、请假起止日期）或多个不连续的日期。
- 需要在日期上展示价格、节假日等附加信息，或希望用户直观地看到星期时。
- 只选择单个日期且范围跨度很大（如生日）时，使用 [DatePicker](/components/date-picker) 更高效。

默认以底部弹层展示，通过 `v-model:open` 控制；设置 `:poppable="false"` 则直接内嵌在页面中。月份列表按需渲染，可放心设置很大的日期范围。

## 代码演示 {#examples}

<demo src="./demo/basic.vue" full>选择单个日期</demo>
<demo src="./demo/range.vue" full>选择日期区间</demo>
<demo src="./demo/multiple.vue" full>选择多个日期</demo>
<demo src="./demo/formatter.vue" full>自定义日期内容</demo>
<demo src="./demo/config.vue" full>范围、禁用与快捷选择</demo>
<demo src="./demo/virtual.vue" full>大数据量 / 虚拟滚动</demo>
<demo src="./demo/inline.vue" full>内嵌展示</demo>
<demo src="./demo/field.vue" full>作为表单域</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value (v-model) | 已提交的值：单选为日期，区间为 `[开始, 结束]`，多选为日期数组 | `Dayjs \| string \| (Dayjs \| string)[] \| null` | - |
| defaultValue | 默认值（非受控） | 同 `value` | - |
| valueFormat | 绑定值的格式，设置后收发该格式的字符串 | `string` | - |
| selectionMode | 选择模式 | `'single' \| 'range' \| 'multiple'` | `'single'` |
| minDate | 最小可选日期 | `Dayjs \| string` | 今天 |
| maxDate | 最大可选日期 | `Dayjs \| string` | 六个月后 |
| disabledDate | 不可选择的日期 | `(date: Dayjs) => boolean` | - |
| virtual | 虚拟滚动：只渲染可视区域附近的月份，可选范围跨越多年时也保持流畅；`false` 时渲染全部月份 | `boolean` | `true` |
| maxRange | 区间模式下最多可选天数；多选模式下最多可选个数 | `number` | - |
| showRangePrompt | 超过 `maxRange` 时是否显示提示 | `boolean` | `true` |
| rangePrompt | 超过 `maxRange` 时的提示文案 | `string` | `'最多选择 N 天'` |
| allowSameDay | 区间模式下是否允许开始和结束为同一天 | `boolean` | `false` |
| weekStartsOn | 一周的第一天，`0` 为周日，`1` 为周一 | `0 \| 1` | `0` |
| title | 标题，同名插槽优先 | `VueNode` | `'日期选择'` |
| showTitle | 是否显示标题 | `boolean` | `true` |
| showMark | 是否显示月份背景水印 | `boolean` | `true` |
| showConfirm | 是否显示确认按钮。为 `false` 时选择完成后立即提交 | `boolean` | `true` |
| okText | 确认按钮文字 | `string` | `'确定'` |
| rowHeight | 日期行高（px） | `number` | `64` |
| formatter | 渲染前加工每个日期：修改文字、上下方信息、类名或类型 | `(day: CalendarDay) => CalendarDay` | - |
| cellRender | 自定义日期单元格内容，同名插槽优先 | `(info: { date: Dayjs, day: CalendarDay }) => VueNode` | - |
| poppable | 是否以底部弹层展示，`false` 为内嵌视图 | `boolean` | `true` |
| open (v-model) | 弹层是否展开 | `boolean` | - |
| defaultOpen | 默认是否展开 | `boolean` | `false` |
| trigger | 是否渲染类输入框的触发器，显示格式化后的值（仅弹层模式） | `boolean` | `false` |
| format | 触发器的展示格式 | `string \| ((value: Dayjs) => string)` | `'YYYY-MM-DD'` |
| placeholder | 触发器占位文字 | `string` | `'日期选择'` |
| disabled | 是否禁用 | `boolean` | `false` |
| allowClear | 触发器有值时显示清除图标 | `boolean` | `false` |
| status | 触发器校验状态 | `'error' \| 'warning'` | - |
| variant | 触发器形态变体，表单内默认为 `borderless` | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'` |
| size | 触发器尺寸 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| suffixIcon | 触发器后缀图标，同名插槽优先 | `VueNode` | 箭头图标 |
| closable | 弹层是否显示关闭图标 | `boolean` | `true` |
| maskClosable | 点击遮罩是否关闭（视为取消） | `boolean` | `true` |
| getContainer | 弹层挂载节点，`false` 表示原地渲染 | `string \| HTMLElement \| (() => HTMLElement) \| false` | `document.body` |
| zIndex | 弹层层级 | `number` | - |
| destroyOnHidden | 关闭时销毁弹层内容 | `boolean` | `false` |
| id | 触发器的 id，表单内默认取字段 id | `string` | - |
| rootClass | 根节点类名（弹层模式下作用于弹层根节点与触发器） | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'trigger' \| 'popup' \| 'header' \| 'body' \| 'month' \| 'day' \| 'footer', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'trigger' \| 'popup' \| 'header' \| 'body' \| 'month' \| 'day' \| 'footer', CSSProperties>` | - |

### CalendarDay

`formatter` 接收并返回的日期对象。

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| date | 日期 | `Dayjs` |
| type | 日期类型 | `'' \| 'selected' \| 'start' \| 'end' \| 'start-end' \| 'middle' \| 'disabled'` |
| text | 中间显示的文字，默认为几号 | `string \| number` |
| topInfo | 上方的提示信息，今天默认显示「今天」 | `string` |
| bottomInfo | 下方的提示信息，区间模式默认显示「开始」「结束」 | `string` |
| className | 额外的类名 | `string` |
| isToday | 是否为今天 | `boolean` |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 已提交的值变化时触发 | `(value, dateString: string \| string[]) => void` |
| confirm | 点击确认按钮（或 `showConfirm=false` 时选择完成）触发 | `(value) => void` |
| select | 点击任意可选日期时触发，此时值尚未提交，区间可能只有开始日期 | `(value) => void` |
| cancel | 弹层未确认即关闭时触发 | `() => void` |
| openChange | 弹层展开 / 收起时触发 | `(open: boolean) => void` |
| monthShow | 某个月份进入可视区域时触发 | `(info: { date: Dayjs, title: string }) => void` |
| overRange | 选择超过 `maxRange` 时触发 | `() => void` |
| clear | 点击触发器的清除图标时触发 | `() => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 自定义触发器（弹层模式） | `{ open, value, label, disabled, toggle }` |
| title | 自定义标题 | - |
| cellRender | 自定义日期单元格内容，优先于 `cellRender` 属性 | `{ date: Dayjs, day: CalendarDay }` |
| footer | 自定义底部区域，替换确认按钮 | `{ confirm: () => void, disabled: boolean }` |
| suffixIcon | 触发器后缀图标 | - |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| scrollToDate | 滚动到指定日期所在的月份 | `(date: Dayjs \| string) => void` |
| reset | 把未提交的选择重置为指定值（默认重置为已提交的值）并滚动到对应位置 | `(date?: CalendarValue \| null) => void` |
| toggle | 切换弹层，可传入目标状态 | `(open?: boolean) => void` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Calendar` 或直接覆盖 CSS 变量定制。日期行高请使用 `rowHeight` 属性（月份的滚动位置依赖它计算）。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-calendar-height` | 内嵌视图的高度 | `520px` |
| `--am-calendar-popup-height` | 弹层高度 | `80%` |
| `--am-calendar-bg` | 内嵌视图背景色 | `var(--am-color-bg-container)` |
| `--am-calendar-title-font-size` | 标题字号 | `var(--am-font-size-lg)` |
| `--am-calendar-title-height` | 标题高度 | `48px` |
| `--am-calendar-weekday-font-size` | 星期字号 | `var(--am-font-size-sm)` |
| `--am-calendar-weekday-color` | 星期文字颜色 | `var(--am-color-text-secondary)` |
| `--am-calendar-month-title-font-size` | 月份标题字号 | `var(--am-font-size)` |
| `--am-calendar-month-mark-color` | 月份水印颜色 | `var(--am-color-fill-secondary)` |
| `--am-calendar-month-mark-font-size` | 月份水印字号 | `160px` |
| `--am-calendar-day-font-size` | 日期字号 | `var(--am-font-size-lg)` |
| `--am-calendar-day-radius` | 选中日期圆角 | `var(--am-border-radius)` |
| `--am-calendar-info-font-size` | 上下方信息字号 | `10px` |
| `--am-calendar-info-color` | 上下方信息颜色 | `var(--am-color-text-tertiary)` |
| `--am-calendar-selected-color` | 选中日期文字颜色 | `var(--am-color-text-light-solid)` |
| `--am-calendar-selected-bg` | 选中日期背景色 | `var(--am-color-primary)` |
| `--am-calendar-range-color` | 区间中间日期文字颜色 | `var(--am-color-primary)` |
| `--am-calendar-range-bg` | 区间中间日期背景色 | `var(--am-color-primary-bg)` |
| `--am-calendar-disabled-color` | 禁用日期文字颜色 | `var(--am-color-text-disabled)` |

## 与 PC 端的差异 {#diff}

PC 端的 `Calendar` 是一个**数据展示**组件（按月 / 年展示日程的日历面板）；移动端的 `Calendar` 是一个**日期选择**组件，对应 PC 端 `DatePicker` 面板与 `RangePicker` 的使用场景，两者 API 不通用：

- 不支持 PC 端的 `mode`、`fullscreen`、`headerRender`、`fullCellRender`、`validRange`、`showWeek`，以及 `panelChange` 事件。
- `value` 支持单个日期、区间与多个日期（`selectionMode`），并与 DatePicker 一样支持 `valueFormat`、`minDate`、`maxDate`、`disabledDate`。
- `cellRender` 保留了 PC 端的命名，参数为 `{ date, day }`；附加信息更推荐使用 `formatter`。
- 新增弹层相关 API（`poppable`、`open`、`showConfirm`、`confirm` / `cancel` 事件）、触发器相关 API（`trigger`、`format`、`placeholder` 等，用法与其他选择类表单域一致）以及 `scrollToDate`、`reset` 方法；月份列表默认虚拟滚动（`virtual`）。
- 需要在移动端展示日程月历时，可使用内嵌模式并通过 `formatter` / `cellRender` 渲染日程信息。
