---
title: Rate
description: Used for rating operation on something.
group:
  title: Data Entry
  order: 4
---

## When To Use {#when-to-use}

- Show evaluation.
- A quick rating operation on something.

The API is aligned with `Rate` of Antdv Next. On mobile, besides tapping, you can also press and swipe left or right across the stars to rate.

## Examples {#examples}

<demo src="./demo/basic.vue">Basic usage</demo>
<demo src="./demo/half.vue">Half star</demo>
<demo src="./demo/text.vue">Helper text</demo>
<demo src="./demo/clear.vue">Clear</demo>
<demo src="./demo/character.vue">Other characters</demo>
<demo src="./demo/size.vue">Size and count</demo>
<demo src="./demo/disabled.vue">Read only</demo>
<demo src="./demo/style-class.vue">Component tokens</demo>

## API

### Props {#props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | The current value, controlled, supports `v-model:value` | `number` | - |
| defaultValue | The default value | `number` | `0` |
| count | Total number of stars | `number` | `5` |
| allowHalf | Whether to allow half selection | `boolean` | `false` |
| allowClear | Whether to allow clearing by clicking again (swiping beyond the first star clears as well) | `boolean` | `true` |
| disabled | Read only, unable to interact | `boolean` | `false` |
| character | Custom character, the same-named slot takes precedence | `VueNode \| ((ctx: { index: number, value: number }) => VueNode)` | `<StarFilled />` |
| size | Size of the stars | `'small' \| 'middle' \| 'large'` | `'middle'` |
| keyboard | Support using the left and right arrow keys | `boolean` | `true` |
| id | Id of the root node, set automatically inside `Form.Item` | `string` | - |
| rootClass | Class name of the root node | `string` | - |
| classes | Semantic structure class names | `Record<'root' \| 'star', string>` | - |
| styles | Semantic structure styles | `Record<'root' \| 'star', CSSProperties>` | - |

### Events {#events}

| Event | Description | Type |
| --- | --- | --- |
| change | Callback when a value is selected, also triggered when the value changes while swiping | `(value: number) => void` |
| update:value | `v-model:value` update | `(value: number) => void` |
| focus | Callback when the component gets focus | `() => void` |
| blur | Callback when the component loses focus | `() => void` |
| keydown | Callback when a key is pressed | `(event: KeyboardEvent) => void` |

### Slots {#slots}

| Slot | Description | Params |
| --- | --- | --- |
| character | Custom character, takes precedence over the `character` prop | `{ index: number, value: number }` |

### Methods {#methods}

| Name | Description |
| --- | --- |
| focus() | Get focus |
| blur() | Remove focus |

## Design Token {#design-token}

Customize through `theme.components.Rate` of `ConfigProvider`, or override the CSS variables directly.

| Token | Description | Default |
| --- | --- | --- |
| `--am-rate-size` | Star size | `24px` (small `18px` / large `32px`) |
| `--am-rate-gap` | Gap between stars | `var(--am-margin-xs)` |
| `--am-rate-color` | Selected color | `var(--am-color-warning)` |
| `--am-rate-color-inactive` | Unselected color | `var(--am-color-fill)` |

## Differences from PC {#diff}

- Added rating by touch swipe: press and swipe left or right to change the value continuously, vertical swipes do not block the page scroll.
- `tooltips` is not supported (there is no hover on mobile), render the helper text yourself by following the "Helper text" example.
- There are no `hoverChange` and `mouseleave` events.
- The function argument of `character` is `{ index, value }`, and a same-named `character` slot is added.
- `size` takes `'small' | 'middle' | 'large'`, consistent with the other components of this library.
- The default star size is larger (24px), and the touch area of each star is enlarged.
