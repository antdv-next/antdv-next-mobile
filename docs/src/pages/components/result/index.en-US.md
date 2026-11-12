---
title: Result
description: Used to feed back the results of a series of operational tasks.
group:
  title: Data Display
  order: 5
---

## When To Use {#when-to-use}

- Use when important operations need to inform the user of the result and the feedback is relatively complex, such as a payment success page or a submission failure page.
- Full-page prompts when a page does not exist, access is denied or the server fails.

## Examples {#examples}

<demo src="./demo/success.vue">Success</demo>
<demo src="./demo/info.vue">Info</demo>
<demo src="./demo/warning.vue">Warning</demo>
<demo src="./demo/error.vue">Error with details</demo>
<demo src="./demo/exception.vue">403 / 404 / 500</demo>
<demo src="./demo/custom-icon.vue">Custom icon</demo>

## API

### Props {#props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| status | The status of the result, decides the icon and color | `'success' \| 'error' \| 'info' \| 'warning' \| '403' \| '404' \| '500'` (exception statuses also accept numbers) | `'info'` |
| icon | Custom icon. The same-named slot takes precedence; set to `false` or `null` to hide the icon | `VueNode` | - |
| title | Title text. The same-named slot takes precedence | `VueNode` | - |
| subTitle | Subtitle text. The same-named slot takes precedence | `VueNode` | - |
| extra | Operating area. The same-named slot takes precedence | `VueNode` | - |
| rootClass | Class name of the root element | `string` | - |
| classes | Semantic structure class names | `Record<'root' \| 'icon' \| 'title' \| 'subTitle' \| 'extra' \| 'body', string>` | - |
| styles | Semantic structure styles | `Record<'root' \| 'icon' \| 'title' \| 'subTitle' \| 'extra' \| 'body', CSSProperties>` | - |

### Slots {#slots}

| Slot | Description |
| --- | --- |
| default | Supplementary content, such as a detailed explanation of the failure, shown in a content area with a background |
| icon | Custom icon |
| title | Title |
| subTitle | Subtitle |
| extra | Operating area |

## Design Token {#design-token}

| Token | Description | Default |
| --- | --- | --- |
| `--am-result-padding` | Padding | `var(--am-padding-xl) var(--am-padding)` |
| `--am-result-icon-size` | Icon size | `64px` |
| `--am-result-icon-color` | Icon color, changes with `status` | `var(--am-color-info)` |
| `--am-result-image-height` | Height of the 403 / 404 / 500 illustrations | `140px` |
| `--am-result-title-font-size` | Title font size | `20px` |
| `--am-result-subtitle-font-size` | Subtitle font size | `var(--am-font-size)` |
| `--am-result-body-bg` | Background color of the supplementary content area | `var(--am-color-fill-alter)` |

## Differences from PC {#diff}

- The operating area `extra` is placed after the supplementary content (before it on PC), following the mobile convention of putting primary actions at the bottom of the page.
- 403 / 404 / 500 use lightweight illustrations redrawn for mobile; their colors come from design tokens and adapt to dark mode automatically.
- `icon` additionally supports `false` / `null` to hide the icon.
- More compact sizes: icon 64px, title 20px.
