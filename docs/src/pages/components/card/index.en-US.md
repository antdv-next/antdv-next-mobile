---
title: Card
description: A general purpose card container.
group:
  title: Data Display
  order: 5
---

## When To Use {#when-to-use}

- Hold a group of related information: title, content and actions, such as order cards, product cards and feeds.
- When the whole card can be tapped to enter a detail page, turn on `clickable` to get press feedback.

## Examples {#examples}

<demo src="./demo/basic.vue">Basic usage</demo>
<demo src="./demo/borderless.vue">Borderless</demo>
<demo src="./demo/cover.vue">Cover and meta</demo>
<demo src="./demo/actions.vue">Actions and footer</demo>
<demo src="./demo/clickable.vue">Clickable card</demo>
<demo src="./demo/loading.vue">Loading</demo>
<demo src="./demo/inner.vue">Inner card</demo>
<demo src="./demo/style-class.vue">Semantic class names and component tokens</demo>

## API

### Card Props {#props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| title | Card title, the same-named slot takes precedence | `VueNode` | - |
| extra | Content on the right side of the header, the same-named slot takes precedence | `VueNode` | - |
| cover | Card cover, the same-named slot takes precedence | `VueNode` | - |
| actions | Action group at the bottom of the card, the same-named slot takes precedence | `VueNode[]` | - |
| footer | Free-form footer below the content (mobile only), the same-named slot takes precedence | `VueNode` | - |
| loading | Show a skeleton placeholder while loading | `boolean` | `false` |
| variant | Variant of the card | `'outlined' \| 'borderless'` | `'outlined'` |
| bordered | Whether the card has a border, `false` is equivalent to `variant="borderless"` | `boolean` | `true` |
| size | Size of the card | `'default' \| 'small'` | `'default'` |
| type | Card type, `inner` is used for cards nested in a card | `'inner'` | - |
| clickable | Whether the whole card has press feedback (mobile only) | `boolean` | `false` |
| rootClass | Class name of the root node | `string` | - |
| classes | Semantic structure class names | `Record<'root' \| 'header' \| 'title' \| 'extra' \| 'cover' \| 'body' \| 'footer' \| 'actions', string>` | - |
| styles | Semantic structure styles | `Record<'root' \| 'header' \| 'title' \| 'extra' \| 'cover' \| 'body' \| 'footer' \| 'actions', CSSProperties>` | - |

Native events such as `click` are passed through to the root node, so `@click` can be used directly.

### Card Slots {#slots}

| Slot | Description |
| --- | --- |
| default | Card content |
| title | Card title |
| extra | Content on the right side of the header |
| cover | Card cover |
| actions | Action group, each root node in the slot is one action |
| footer | Footer |

### Card.Meta Props {#meta-props}

Use `<am-card-meta>` in templates.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| avatar | Avatar / icon, the same-named slot takes precedence | `VueNode` | - |
| title | Title, the same-named slot takes precedence | `VueNode` | - |
| description | Description, the same-named slot takes precedence | `VueNode` | - |
| rootClass | Class name of the root node | `string` | - |
| classes | Semantic structure class names | `Record<'root' \| 'avatar' \| 'section' \| 'title' \| 'description', string>` | - |
| styles | Semantic structure styles | `Record<'root' \| 'avatar' \| 'section' \| 'title' \| 'description', CSSProperties>` | - |

### Card.Meta Slots {#meta-slots}

| Slot | Description |
| --- | --- |
| avatar | Avatar / icon |
| title | Title |
| description | Description |

## Design Token {#design-token}

| Token | Description | Default |
| --- | --- | --- |
| `--am-card-bg` | Background color of the card | `var(--am-color-bg-container)` |
| `--am-card-border-color` | Color of the border and dividers | `var(--am-color-border-secondary)` |
| `--am-card-border-radius` | Border radius | `var(--am-border-radius-lg)` |
| `--am-card-padding` | Padding of the body and horizontal padding of the header | `var(--am-padding)` (`var(--am-padding-sm)` for `small`) |
| `--am-card-header-height` | Minimum height of the header | `48px` |
| `--am-card-header-font-size` | Font size of the title | `var(--am-font-size-lg)` |
| `--am-card-header-bg` | Background color of the header | `transparent` |
| `--am-card-actions-bg` | Background color of the action bar | `var(--am-color-bg-container)` |
| `--am-card-actions-height` | Minimum height of the action bar | `44px` |

## Differences from PC {#diff}

- Adds `clickable` (press scale + opacity feedback) in place of `hoverable` on PC.
- Adds the `footer` prop / slot and the matching semantic structure.
- Tab related features are not supported: `tabList`, `activeTabKey`, `defaultActiveTabKey`, `tabBarExtraContent`, `tabProps` and the `tabChange` event. Compose `Tabs` inside the card content instead.
- `Card.Grid` is not provided, use `Grid` for grid layouts.
- The deprecated `headStyle` / `bodyStyle` are not supported, use `styles.header` / `styles.body` instead.
- The loading state is a built-in lightweight skeleton that does not depend on the `Skeleton` component.
