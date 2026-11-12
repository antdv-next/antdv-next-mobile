---
title: NoticeBar
description: Display a set of notices; the text scrolls automatically when it overflows.
group:
  title: Feedback
  order: 6
---

## When To Use {#when-to-use}

- For notifying about information within the current page; a rather eye-catching kind of in-page notice.
- Content longer than one line scrolls automatically as a marquee, or can be shown in full across multiple lines with `wrap`.

`NoticeBar` is a mobile-only component with no counterpart in antdv-next (PC); for static tips with a title and description, use [Alert](/components/alert).

## Examples {#examples}

<demo src="./demo/basic.vue" full>Basic usage</demo>
<demo src="./demo/color.vue" full>Semantic colors</demo>
<demo src="./demo/scroll.vue" full>Scrolling</demo>
<demo src="./demo/wrap.vue" full>Multiple lines</demo>
<demo src="./demo/closable.vue" full>Closable and extra action</demo>
<demo src="./demo/icon.vue" full>Custom icon</demo>
<demo src="./demo/shape.vue">Shape and border</demo>
<demo src="./demo/style-class.vue">Custom style</demo>

## API

### Props {#props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| content | Notice content; the default slot takes precedence | `VueNode` | - |
| color | Semantic color of the notice bar; `default` is neutral gray | `'default' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'warning'` |
| icon | Icon on the left; pass `null` / `false` to hide it | `VueNode` | `<SoundOutlined />` |
| extra | Extra area on the right (before the close button) | `VueNode` | - |
| closable | Whether to show the close button | `boolean` | `false` |
| closeIcon | Custom close icon | `VueNode` | `<CloseOutlined />` |
| wrap | Whether to display on multiple lines (no scrolling) | `boolean` | `false` |
| scrollable | Whether to scroll: by default it scrolls only when the content overflows, `true` forces scrolling, `false` disables scrolling (overflow shows an ellipsis) | `boolean` | - |
| delay | Delay before scrolling starts, in milliseconds | `number` | `2000` |
| speed | Scrolling speed, in px/s | `number` | `50` |
| shape | Shape: `rectangular` square-cornered full-width, `neutral` rounded corners, `rounded` pill | `'neutral' \| 'rounded' \| 'rectangular'` | `'rectangular'` |
| bordered | Border: `true` all sides, `'block'` top and bottom only, `false` no border | `boolean \| 'block'` | `'block'` |
| rootClass | Class name of the root element | `string` | - |
| classes | Semantic structure class names | `Record<'root' \| 'icon' \| 'content' \| 'extra' \| 'close', string>` | - |
| styles | Semantic structure styles | `Record<'root' \| 'icon' \| 'content' \| 'extra' \| 'close', CSSProperties>` | - |

### Events {#events}

| Event | Description | Type |
| --- | --- | --- |
| click | Triggered when the notice bar is tapped (not triggered by tapping the close button) | `(event: MouseEvent) => void` |
| close | Triggered when the close button is tapped, after which the notice bar is removed | `(event: MouseEvent) => void` |
| replay | Triggered at the end of each scrolling round | `() => void` |

### Slots {#slots}

| Slot | Description |
| --- | --- |
| default | Notice content |
| icon | Custom icon on the left |
| extra | Custom extra area on the right |
| closeIcon | Custom close icon |

### Methods {#methods}

| Method | Description | Type |
| --- | --- | --- |
| reset | Re-measure the width and restart scrolling from the beginning (call it after the container size has been changed from outside) | `() => void` |

## Design Token {#design-token}

Customize through `theme.components.NoticeBar` of `ConfigProvider`, or by overriding the CSS variables directly.

| Token | Description | Default |
| --- | --- | --- |
| `--am-notice-bar-height` | Minimum height | `var(--am-control-height)` |
| `--am-notice-bar-font-size` | Font size | `var(--am-font-size)` |
| `--am-notice-bar-icon-size` | Icon size | `16px` |
| `--am-notice-bar-padding-inline` | Horizontal padding | `var(--am-padding-sm)` |
| `--am-notice-bar-gap` | Gap between the icon, content and action area | `var(--am-margin-xs)` |
| `--am-notice-bar-border-radius` | Border radius of the `neutral` shape | `var(--am-border-radius)` |
| `--am-notice-bar-color` | Text and icon color (changes with `color`) | `var(--am-color-warning-active)` |
| `--am-notice-bar-bg` | Background color (changes with `color`) | `var(--am-color-warning-bg)` |
| `--am-notice-bar-border-color` | Border color (changes with `color`) | `var(--am-color-warning-border)` |

## Differences from PC {#diff}

- A mobile-only component with no PC counterpart; the semantic color names are consistent with the `type` of `Alert`.
- RTL is supported: with `direction="rtl"` the text scrolls to the right.
- When the system has "Reduce Motion" turned on, it does not scroll and the overflow shows an ellipsis.
