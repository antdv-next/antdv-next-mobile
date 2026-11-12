---
title: Segmented
description: Display multiple options and allow users to select a single one.
group:
  title: Navigation
  order: 3
---

## When To Use {#when-to-use}

- Switch between 2 ~ 5 mutually exclusive options or views, such as "Day / Week / Month".
- When there are few options with short labels and all of them should always be visible.

The API is aligned with `Segmented` of Antdv Next, and the selected thumb moves with a smooth sliding animation.

## Examples {#examples}

<demo src="./demo/basic.vue">Basic usage</demo>
<demo src="./demo/block.vue">Full width</demo>
<demo src="./demo/size.vue">Size and shape</demo>
<demo src="./demo/icon.vue">Icon</demo>
<demo src="./demo/disabled.vue">Disabled</demo>
<demo src="./demo/vertical.vue">Vertical direction</demo>
<demo src="./demo/custom.vue">Custom rendering and design tokens</demo>

## API

### Props {#props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| options | Options configuration | `(string \| number \| SegmentedLabeledOption)[]` | `[]` |
| value(v-model) | The currently selected value | `string \| number` | - |
| defaultValue | The default selected value | `string \| number` | The value of the first option |
| block | Fit the width of the parent element, options share the width equally | `boolean` | `false` |
| size | Size | `'small' \| 'middle' \| 'large'` | `'middle'` |
| shape | Shape | `'default' \| 'round'` | `'default'` |
| disabled | Whether disabled | `boolean` | `false` |
| vertical | Arrange vertically | `boolean` | `false` |
| orientation | Orientation, takes precedence over `vertical` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| rootClass | Class name of the root node | `string` | - |
| classes | Semantic structure class names | `Record<'root' \| 'item' \| 'icon' \| 'label', string>` | - |
| styles | Semantic structure styles | `Record<'root' \| 'item' \| 'icon' \| 'label', CSSProperties>` | - |

### SegmentedLabeledOption

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| label | Option text | `VueNode` | - |
| value | Option value | `string \| number` | - |
| icon | Option icon | `VueNode` | - |
| disabled | Whether the option is disabled | `boolean` | `false` |
| className | Option class name | `string` | - |

### Events {#events}

| Event | Description | Type |
| --- | --- | --- |
| change | Triggered when the selected option changes | `(value: string \| number) => void` |
| update:value | Triggered when the selected option changes, used by `v-model:value` | `(value: string \| number) => void` |

### Slots {#slots}

| Slot | Description | Params |
| --- | --- | --- |
| iconRender | Custom icon, takes precedence over `option.icon` | `SegmentedLabeledOption` |
| labelRender | Custom label, takes precedence over `option.label` | `SegmentedLabeledOption` |

## Design Token {#design-token}

Customize through `theme.components.Segmented` of `ConfigProvider`, or by overriding the CSS variables directly.

| Token | Description | Default |
| --- | --- | --- |
| `--am-segmented-height` | Overall height | `var(--am-control-height-sm)` |
| `--am-segmented-padding` | Track padding | `2px` |
| `--am-segmented-font-size` | Font size | `var(--am-font-size)` |
| `--am-segmented-item-padding-inline` | Horizontal padding of an option | `var(--am-padding-sm)` |
| `--am-segmented-background` | Track background color | `var(--am-color-fill-secondary)` |
| `--am-segmented-color` | Option text color | `var(--am-color-text-secondary)` |
| `--am-segmented-selected-color` | Text color of the selected option | `var(--am-color-text)` |
| `--am-segmented-selected-background` | Background color of the selected thumb | `var(--am-color-bg-elevated)` |
| `--am-segmented-border-radius` | Track border radius | `var(--am-border-radius)` |
| `--am-segmented-item-border-radius` | Border radius of the options and the thumb | Track border radius minus the padding |

## Differences from PC {#diff}

- Options do not support `tooltip` (there is no hover on mobile) and have no hover state; press feedback uses `:active`.
- `name` is not supported: options are implemented with `role="radio"` elements and no native `<input type="radio">` is rendered.
- The value type of `options` is fixed to `string | number`; no generic parameter is provided.
- When uncontrolled and `defaultValue` is not set, the first option is selected by default.
