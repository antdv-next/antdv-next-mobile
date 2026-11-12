---
title: Typography
description: Basic text formatting, with multi-line ellipsis, expand / collapse and one-tap copy.
group:
  title: General
  order: 1
---

## When To Use {#when-to-use}

- When you need to display titles, paragraphs or list content, such as articles / detail pages / agreement text.
- When you need to truncate long text and support "expand / collapse".
- When you need one-tap copying of text (order number, invitation code).

The API is aligned with `Typography` of antdv-next: `Typography.Text`, `Typography.Title` and `Typography.Paragraph` share props such as `type`, text decorations, `ellipsis` and `copyable`.

## Examples {#examples}

<demo src="./demo/basic.vue">Basic</demo>
<demo src="./demo/title.vue">Title component</demo>
<demo src="./demo/text.vue">Text and decorations</demo>
<demo src="./demo/ellipsis.vue">Ellipsis</demo>
<demo src="./demo/expandable.vue">Expand and collapse</demo>
<demo src="./demo/controlled.vue">Controlled expansion</demo>
<demo src="./demo/copyable.vue">Copyable</demo>

## API

### Typography Props {#props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| component | Tag of the root element | `string` | `'article'` |
| rootClass | Class name of the root element | `string` | - |

### Common Props {#base-props}

`Typography.Text`, `Typography.Title` and `Typography.Paragraph` all support:

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| type | Text type | `'secondary' \| 'success' \| 'warning' \| 'danger'` | - |
| disabled | Disabled text | `boolean` | `false` |
| mark | Marked style | `boolean` | `false` |
| code | Code style | `boolean` | `false` |
| keyboard | Keyboard style | `boolean` | `false` |
| underline | Underlined style | `boolean` | `false` |
| delete | Deleted line style | `boolean` | `false` |
| strong | Whether the text is bold | `boolean` | `false` |
| italic | Whether the text is italic | `boolean` | `false` |
| ellipsis | Display an ellipsis when the text overflows, the number of rows and expand / collapse can be configured | `boolean \| EllipsisConfig` | `false` |
| copyable | Whether the text is copyable, the copied text and the icon can be configured | `boolean \| CopyConfig` | `false` |
| rootClass | Class name of the root element | `string` | - |
| classes | Semantic class names | `Record<'root' \| 'action', string>` | - |
| styles | Semantic styles | `Record<'root' \| 'action', CSSProperties>` | - |

### Typography.Title Props {#title-props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| level | Level of importance, equivalent to `h1` ~ `h5` | `1 \| 2 \| 3 \| 4 \| 5` | `1` |

### EllipsisConfig

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| rows | Maximum number of rows to display | `number` | `1` |
| expandable | Whether the text is expandable: `true` cannot be collapsed after expanding, `'collapsible'` can be expanded and collapsed repeatedly | `boolean \| 'collapsible'` | `false` |
| symbol | Customize the expand / collapse text | `VNodeChild \| ((expanded: boolean) => VNodeChild)` | Locale text "Expand" / "Collapse" |
| defaultExpanded | Whether the text is expanded by default | `boolean` | `false` |
| expanded | Whether the text is expanded (controlled) | `boolean` | - |

### CopyConfig

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| text | The text copied to the clipboard, defaults to the rendered text | `string \| (() => string \| Promise<string>)` | - |
| icon | Custom icon: `[copy icon, copied icon]` or a single node | `VueNode \| VueNode[]` | - |

### Events {#events}

| Event | Description | Type |
| --- | --- | --- |
| expand | Triggered when expand or collapse is clicked | `(expanded: boolean, event: MouseEvent) => void` |
| update:expanded | Triggered when the expanded state changes | `(expanded: boolean) => void` |
| copy | Triggered after the text is copied successfully | `(event: MouseEvent) => void` |

### Slots {#slots}

| Slot | Description | Params |
| --- | --- | --- |
| default | Text content | - |
| ellipsisSymbol | Customize the expand / collapse content, takes precedence over `ellipsis.symbol` | `{ expanded: boolean }` |
| copyIcon | Customize the copy icon, takes precedence over `copyable.icon` | `{ copied: boolean }` |

## Design Token {#design-token}

Customize through `theme.components.Typography` of `ConfigProvider`, or by overriding the CSS variables directly.

| Token | Description | Default |
| --- | --- | --- |
| `--am-typography-color` | Text color | `var(--am-color-text)` |
| `--am-typography-font-size` | Text font size | `var(--am-font-size)` |
| `--am-typography-line-height` | Line height | `var(--am-line-height)` |
| `--am-typography-title-color` | Title color | `var(--am-color-text-heading)` |
| `--am-typography-title-font-weight` | Title font weight | `var(--am-font-weight-strong)` |
| `--am-typography-title-margin-top` | Top margin of the title (when it follows another typography element) | `1.2em` |
| `--am-typography-title-margin-bottom` | Bottom margin of the title | `0.5em` |
| `--am-typography-paragraph-margin-bottom` | Bottom margin of the paragraph | `1em` |
| `--am-typography-action-color` | Color of actions such as expand / copy | `var(--am-color-link)` |
| `--am-typography-action-gap` | Gap between the actions and the text | `4px` |
| `--am-typography-code-bg` | Background color of the code style | `var(--am-color-fill-secondary)` |
| `--am-typography-mark-bg` | Background color of the marked style | Mixed from `--am-color-warning` |

## Differences from PC {#diff}

- Ellipsis is implemented with CSS `line-clamp`: with multi-line ellipsis the "Expand" button floats at the end of the last line. It does not rely on truncating the text with JS, so any rich text content can be truncated.
- `ellipsis` does not support `tooltip` (there is no hover on mobile), `suffix` or `onEllipsis`.
- Editing (`editable`) is not supported; `Typography.Link` is not provided, use `<am-button type="link">` or a native `<a>` for links.
- `copyable` does not support `tooltips` or `format`; the feedback for a successful copy is given by the icon change, and a `Toast` can be shown in the `copy` event.
- `expand` and `copy` are provided as events, and the expanded state can be controlled through `ellipsis.expanded`.
