---
title: DatePicker
description: Select a year, month, day, time and other date information with wheels.
group:
  title: Data Entry
  order: 4
---

## When To Use {#when-to-use}

- When the user needs to enter a date (birthday, ID expiry date, appointment time, etc.).
- When a date range has to be selected, or you want to see a whole month calendar at a glance, use [Calendar](/components/calendar).

The API is aligned with `DatePicker` in antdv-next: `value` takes and emits [dayjs](https://day.js.org/) objects by default, and formatted strings once `valueFormat` is set; `picker` switches the granularity and `showTime` adds time columns. On mobile, bottom wheels replace the calendar panel, and the value is only committed after tapping "OK".

## Examples {#examples}

<demo src="./demo/basic.vue">Basic usage</demo>
<demo src="./demo/picker.vue">Picker granularity</demo>
<demo src="./demo/show-time.vue">Date and time</demo>
<demo src="./demo/range.vue">Selectable range and disabled dates</demo>
<demo src="./demo/value-format.vue">Value format</demo>
<demo src="./demo/filter.vue">Filter options and custom labels</demo>
<demo src="./demo/custom-trigger.vue" full>Custom trigger</demo>
<demo src="./demo/view.vue">Inline view DatePickerView</demo>

## API

### DatePicker Props {#props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value (v-model) | The committed date | `Dayjs \| string \| null` | - |
| defaultValue | Default date (uncontrolled) | `Dayjs \| string \| null` | - |
| valueFormat | Format of the bound value. Once set, `value`, `defaultValue`, `minDate` and `maxDate` accept strings in this format and `change` returns a string in the same format | `string` | - |
| picker | Picker granularity | `'date' \| 'month' \| 'year' \| 'quarter' \| 'week' \| 'time'` | `'date'` |
| showTime | Add time selection (only with `picker="date"`); an object configures the time columns | `boolean \| DatePickerShowTime` | `false` |
| format | Display format of the trigger, see [dayjs format](https://day.js.org/docs/en/display/format); a function is also accepted | `string \| ((value: Dayjs) => string)` | See below |
| minDate | The minimum selectable date | `Dayjs \| string` | Ten years ago |
| maxDate | The maximum selectable date | `Dayjs \| string` | Ten years later |
| disabledDate | Dates that cannot be selected; the matching options are grayed out and skipped | `(current: Dayjs, info: { type: string }) => boolean` | - |
| disabledTime | Times that cannot be selected | `(date: Dayjs) => { disabledHours?, disabledMinutes?, disabledSeconds? }` | - |
| defaultPickerValue | The date the wheels rest on by default when there is no value | `Dayjs \| string` | Current time |
| use12Hours | Use the 12-hour clock | `boolean` | `false` |
| hourStep | Interval between hour options | `number` | `1` |
| minuteStep | Interval between minute options | `number` | `1` |
| secondStep | Interval between second options | `number` | `1` |
| filter | Filter or reorder the options of a column | `(type: DatePickerColumnType, options: PickerOption[]) => PickerOption[]` | - |
| renderLabel | Custom option text; by default the unit from the locale is appended (e.g. `2024年` in zh-CN) | `(type: DatePickerColumnType, value: number) => string \| number` | - |
| open (v-model) | Whether the popup is open | `boolean` | - |
| defaultOpen | Whether the popup is open by default | `boolean` | `false` |
| placeholder | Placeholder text | `string` | `'Select date'` |
| title | Title of the popup; the same-named slot takes precedence | `VueNode` | - |
| okText | Text of the confirm button | `string` | `'OK'` |
| cancelText | Text of the cancel button | `string` | `'Cancel'` |
| disabled | Whether it is disabled | `boolean` | `false` |
| allowClear | Show a clear icon when there is a value | `boolean` | `false` |
| status | Validation status | `'error' \| 'warning'` | - |
| variant | Variant; defaults to `borderless` inside a form | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'` | `'outlined'` |
| size | Size of the trigger | `'small' \| 'middle' \| 'large'` | `'middle'` |
| trigger | Whether to render the built-in trigger | `boolean` | `true` |
| suffixIcon | Suffix icon of the trigger; the same-named slot takes precedence, `null` hides it | `VueNode` | Arrow icon |
| itemHeight | Option height (px) | `number` | `40` |
| visibleItemCount | Number of visible options | `number` | `5` |
| virtual | Virtual scrolling: each column only renders the options near the visible area, so even tens of thousands of options mount just a few dozen nodes; `false` renders all options | `boolean` | `true` |
| getContainer | The node the popup is mounted to; `false` renders in place | `string \| HTMLElement \| (() => HTMLElement) \| false` | `document.body` |
| zIndex | The z-index of the popup | `number` | - |
| maskClosable | Whether tapping the mask closes the popup (treated as cancel) | `boolean` | `true` |
| destroyOnHidden | Destroy the popup content when closed | `boolean` | `false` |
| id | The id of the trigger; defaults to the field id inside a form | `string` | - |
| rootClass | Class name of the root elements of the trigger and the popup | `string` | - |
| classes | Semantic structure class names | `Record<'root' \| 'content' \| 'suffix' \| 'popup', string>` | - |
| styles | Semantic structure styles | `Record<'root' \| 'content' \| 'suffix' \| 'popup', CSSProperties>` | - |

The default value of `format` depends on `picker`:

| picker | Default format | Columns |
| --- | --- | --- |
| `date` | `YYYY-MM-DD` | Year, month, day |
| `date` + `showTime` | `YYYY-MM-DD HH:mm:ss` | Year, month, day, hour, minute, second |
| `month` | `YYYY-MM` | Year, month |
| `quarter` | `YYYY-[Q]Q` | Year, quarter |
| `week` | `GGGG-[W]WW` (ISO week) | Year, week |
| `year` | `YYYY` | Year |
| `time` | `HH:mm:ss` | Hour, minute, second, i.e. [TimePicker](/components/time-picker) |

### DatePickerShowTime

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| format | Time format, decides which time columns are shown, e.g. `HH:mm` only shows hour and minute | `string` | `'HH:mm:ss'` |
| showHour / showMinute / showSecond | Control whether a single column is shown | `boolean` | `true` |
| use12Hours | Use the 12-hour clock | `boolean` | `false` |
| hourStep / minuteStep / secondStep | Option intervals, take precedence over the same-named outer props | `number` | `1` |

### Events {#events}

| Event | Description | Type |
| --- | --- | --- |
| change | Triggered when the committed value changes (confirm or clear) | `(date: Dayjs \| string \| null, dateString: string) => void` |
| confirm | Triggered when the confirm button is tapped | `(date: Dayjs \| string, dateString: string) => void` |
| cancel | Triggered when the cancel button or the mask is tapped | `() => void` |
| select | Triggered when a wheel settles on a new option; the value is not committed yet | `(date: Dayjs \| string, dateString: string) => void` |
| openChange | Triggered when the popup opens / closes | `(open: boolean) => void` |
| clear | Triggered when the clear icon is tapped | `() => void` |

### Slots {#slots}

| Slot | Description | Params |
| --- | --- | --- |
| default | Custom trigger, replaces the built-in input | `{ open, value, label, disabled, toggle }` |
| title | Title of the popup | - |
| suffixIcon | Suffix icon of the trigger | - |
| header | Content between the title bar and the wheels | - |
| footer | Content below the wheels | - |

### Methods {#methods}

| Method | Description | Type |
| --- | --- | --- |
| toggle | Toggle the popup; a target state can be passed | `(open?: boolean) => void` |

### DatePickerView

The inline wheel view, also available as `DatePicker.View`. It supports all the date-related props in the table above (`value`, `defaultValue`, `valueFormat`, `picker`, `showTime`, `format`, `minDate`, `maxDate`, `disabledDate`, `disabledTime`, `defaultPickerValue`, `use12Hours`, `hourStep`, `minuteStep`, `secondStep`, `filter`, `renderLabel`, `itemHeight`, `visibleItemCount`, `virtual`), plus `rootClass`, `classes` and `styles` of [PickerView](/components/picker-view#props).

| Event | Description | Type |
| --- | --- | --- |
| change | Triggered when the wheels settle on a new date | `(date: Dayjs \| string, dateString: string) => void` |
| update:value | `v-model:value` update | `(date: Dayjs \| string) => void` |

### Date range {#range}

There is no `DatePicker.RangePicker` on mobile. To select a date range, use `selection-mode="range"` of [Calendar](/components/calendar) (which can act as a form field through the `trigger` prop); you can also place two DatePickers and constrain each other with `minDate` / `maxDate`.

## Design Token {#design-token}

See [Picker](/components/picker#design-token) for the trigger and popup tokens, and [PickerView](/components/picker-view#design-token) for the wheel tokens.

| Token | Description | Default |
| --- | --- | --- |
| `--am-date-picker-view-font-size` | Font size of the wheel options | `var(--am-font-size-lg)` |

## Differences from PC {#diff}

- Bottom wheels replace the dropdown calendar panel, and the value is committed after tapping "OK" (equivalent to `needConfirm` always being `true` on PC); adds the `confirm`, `cancel` and `select` events.
- No panel / input related APIs such as `RangePicker`, `multiple`, `presets`, `showNow`, `showWeek`, `mode`, `panelRender`, `cellRender`, `renderExtraFooter`, `components`, `placement`, `prefix`, `inputReadOnly`; the trigger cannot be typed into.
- `picker` adds `'time'` (i.e. TimePicker); `picker="week"` uses ISO weeks (the week starts on Monday) and its default format is `GGGG-[W]WW`.
- `minDate` / `maxDate` default to ten years before and after (wheels need a finite range); `disabledDate` only applies to the last column of the current granularity, and the matching options are grayed out and skipped automatically.
- `allowClear` defaults to `false` and only supports a boolean.
- The popup container uses `getContainer` (same as Popup); `getPopupContainer` is not supported.
- Adds mobile props: `title`, `okText`, `cancelText`, `trigger`, `filter`, `renderLabel`, `itemHeight`, `visibleItemCount`, `virtual`, as well as the inline view `DatePickerView`.
- The semantic structure of `classes` / `styles` is `root`, `content`, `suffix`, `popup`.
