---
title: Spin
description: Used for the loading status of a page or a block.
group:
  title: Feedback
  order: 6
---

## When To Use {#when-to-use}

When part of the page is waiting for asynchronous data or during a rendering process, an appropriate loading animation can effectively alleviate users' inquietude.

The API is aligned with `Spin` of antdv-next: `spinning`, `size`, `description`, `delay`, `indicator`, `fullscreen` and `percent`, and a translucent mask is added automatically when it wraps content.

## Examples {#examples}

<demo src="./demo/basic.vue">Basic usage</demo>
<demo src="./demo/size.vue">Size</demo>
<demo src="./demo/description.vue">Description</demo>
<demo src="./demo/nested.vue">Wrap content</demo>
<demo src="./demo/delay.vue">Delay</demo>
<demo src="./demo/fullscreen.vue">Fullscreen</demo>
<demo src="./demo/indicator.vue">Custom indicator</demo>
<demo src="./demo/percent.vue">Progress</demo>

## API

### Props {#props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| spinning | Whether it is in the loading state | `boolean` | `true` |
| size | Size of the component | `'small' \| 'middle' \| 'large'` | `'middle'` |
| description | Description below the indicator, the same-named slot takes precedence | `VueNode` | - |
| delay | Time to delay showing the loading effect (prevents flashing), in milliseconds | `number` | `0` |
| indicator | Custom loading indicator, the same-named slot takes precedence | `VueNode` | - |
| fullscreen | Show a fullscreen loading with a mask and lock page scrolling | `boolean` | `false` |
| percent | Show the progress (0 - 100), only works with the default indicator | `number` | - |
| tip | Deprecated, use `description` instead | `VueNode` | - |
| rootClass | Class name of the root node | `string` | - |
| classes | Semantic structure class names | `Record<'root' \| 'section' \| 'indicator' \| 'description' \| 'container', string>` | - |
| styles | Semantic structure styles | `Record<'root' \| 'section' \| 'indicator' \| 'description' \| 'container', CSSProperties>` | - |

### Slots {#slots}

| Slot | Description |
| --- | --- |
| default | The wrapped content, which becomes translucent and unclickable while loading |
| indicator | Custom loading indicator |
| description | Custom description |

## Design Token {#design-token}

Customize through `theme.components.Spin` of `ConfigProvider`, or override the CSS variables directly.

| Token | Description | Default |
| --- | --- | --- |
| `--am-spin-color` | Color of the indicator | `var(--am-color-primary)` |
| `--am-spin-size` | Size of the indicator | `28px` (small `20px`, large `40px`) |
| `--am-spin-stroke-width` | Stroke width of the ring (relative to a canvas of 48) | `4` |
| `--am-spin-description-color` | Color of the description | `var(--am-color-text-secondary)` |
| `--am-spin-description-font-size` | Font size of the description | `var(--am-font-size)` |
| `--am-spin-gap` | Gap between the indicator and the description | `var(--am-margin-xs)` |
| `--am-spin-z-index` | z-index of the fullscreen mode | `var(--am-z-index-popup-base)` |

## Differences from PC {#diff}

- The default indicator is a ring (the more common style on mobile) instead of the four rotating dots on PC.
- `description` is shown below the indicator in every mode; on PC it is only shown when wrapping content or in fullscreen.
- `percent` only supports numbers, not `'auto'`.
- The fullscreen mode locks page scrolling and intercepts touches.
- `Spin.setDefaultIndicator` and the deprecated `wrapperClassName` are not supported.
