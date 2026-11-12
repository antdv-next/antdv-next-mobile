---
title: PickerView
description: A wheel selection view, the content area of Picker, which can be embedded in a page.
group:
  title: Data Entry
  order: 4
---

## When To Use {#when-to-use}

- When the wheels need to be laid out directly in a page or a custom popup, instead of being triggered by an input.
- When you need to compose your own picker on top of the wheels ([Picker](/components/picker), [DatePicker](/components/date-picker) and [TimePicker](/components/time-picker) are all built on it).

The wheels are driven by `transform` and support touch dragging, momentum scrolling and automatic snapping; on desktop they can be operated with the mouse wheel, by clicking an option or with the arrow keys.

## Examples {#examples}

<demo src="./demo/basic.vue">Basic usage</demo>
<demo src="./demo/multiple.vue">Multiple columns</demo>
<demo src="./demo/cascade.vue">Cascading</demo>
<demo src="./demo/disabled.vue">Disabled options and loading state</demo>
<demo src="./demo/custom.vue">Custom height and option content</demo>
<demo src="./demo/virtual.vue">Large data / virtual scrolling</demo>

## API

### Props {#props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| columns | Column data. A two-dimensional array means multiple columns; when a function `(value) => PickerOption[][]` is passed, it is recomputed after every selection, which enables cascading | `PickerOption[][] \| ((value: PickerValue[]) => PickerOption[][])` | - |
| fieldNames | Customize the option field names | `{ label?: string, value?: string, disabled?: string }` | `{ label: 'label', value: 'value', disabled: 'disabled' }` |
| value (v-model) | The current value, one item per column | `PickerValue[]` | - |
| defaultValue | The default value (uncontrolled) | `PickerValue[]` | - |
| loading | Loading state, shows a loading icon and hides the wheels | `boolean` | `false` |
| itemHeight | Option height (px) | `number` | `40` |
| visibleItemCount | The number of visible options, an odd number is recommended | `number` | `5` |
| virtual | Virtual scrolling: each column only renders the options near the visible area, so even tens of thousands of options mount only a few dozen nodes; `false` renders all options | `boolean` | `true` |
| optionRender | Custom option content, the `option` slot takes precedence | `VueNode \| ((info: PickerOptionRenderInfo) => VueNode)` | - |
| rootClass | Class name of the root node | `string` | - |
| classes | Semantic structure class names | `Record<'root' \| 'column' \| 'item' \| 'indicator', string>` | - |
| styles | Semantic structure styles | `Record<'root' \| 'column' \| 'item' \| 'indicator', CSSProperties>` | - |

When `value` is not set, or the value of a column does not exist / is disabled, that column settles on the nearest selectable option (the first one by default).

### PickerOption

| Property | Description | Type |
| --- | --- | --- |
| label | Option text | `string \| number` |
| value | Option value | `string \| number` |
| disabled | Whether it is disabled, disabled options are skipped | `boolean` |

### Events {#events}

| Event | Description | Type |
| --- | --- | --- |
| change | Triggered when a wheel settles on a new option | `(value: PickerValue[], info: { items: PickerOption[], columnIndex: number }) => void` |
| update:value | `v-model:value` update | `(value: PickerValue[]) => void` |

### Slots {#slots}

| Slot | Description | Params |
| --- | --- | --- |
| option | Custom option content, takes precedence over `optionRender` | `{ option, index, columnIndex, selected }` |
| loading | Custom loading content | - |

## Design Token {#design-token}

Customize through `theme.components.PickerView` of `ConfigProvider` or by overriding the CSS variables directly. For the option height and the visible count, use the `itemHeight` / `visibleItemCount` props.

| Token | Description | Default |
| --- | --- | --- |
| `--am-picker-view-font-size` | Option font size | `var(--am-font-size-lg)` |
| `--am-picker-view-color` | Option text color | `var(--am-color-text)` |
| `--am-picker-view-disabled-color` | Disabled option text color | `var(--am-color-text-disabled)` |
| `--am-picker-view-indicator-bg` | Background of the selection indicator | `var(--am-color-fill-tertiary)` |
| `--am-picker-view-indicator-radius` | Border radius of the selection indicator | `var(--am-border-radius)` |
| `--am-picker-view-indicator-inset` | Horizontal inset of the selection indicator | `var(--am-padding-xs)` |
| `--am-picker-view-mask-opacity` | Opacity of the options at the top and bottom edges (fade mask) | `0.15` |
