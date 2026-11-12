---
title: Skeleton
description: Provide a placeholder while you wait for content to load.
group:
  title: Feedback
  order: 6
---

## When To Use {#when-to-use}

- When the network is slow and loading takes a long time.
- In lists / cards that contain a lot of text and image content.
- Only when loading data for the first time.
- It can be fully replaced by Spin, but where applicable it provides a better visual effect and user experience than Spin.

The API is aligned with `Skeleton` of Antdv Next: the default slot is rendered when `loading` is `false`, and `avatar` / `title` / `paragraph` can be either a boolean or a config object.

## Examples {#examples}

<demo src="./demo/basic.vue">Basic usage</demo>
<demo src="./demo/complex.vue">Complex combination</demo>
<demo src="./demo/active.vue">Active animation</demo>
<demo src="./demo/children.vue">Contains sub component</demo>
<demo src="./demo/list.vue" full>List</demo>
<demo src="./demo/element.vue">Button / Avatar / Input / Image</demo>
<demo src="./demo/style-class.vue">Semantic class names and component tokens</demo>

## API

### Skeleton Props {#props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| active | Show the animation effect | `boolean` | `false` |
| loading | Shows the placeholder when `true` and the default slot when `false` | `boolean` | - |
| avatar | Show the avatar placeholder | `boolean \| SkeletonAvatarConfig` | `false` |
| title | Show the title placeholder | `boolean \| SkeletonTitleConfig` | `true` |
| paragraph | Show the paragraph placeholder | `boolean \| SkeletonParagraphConfig` | `true` |
| round | Show the paragraph and title with rounded corners when `true` | `boolean` | `false` |
| rootClass | Class name of the root element | `string` | - |
| classes | Semantic structure class names | `Record<'root' \| 'header' \| 'section' \| 'avatar' \| 'title' \| 'paragraph', string>` | - |
| styles | Semantic structure styles | `Record<'root' \| 'header' \| 'section' \| 'avatar' \| 'title' \| 'paragraph', CSSProperties>` | - |

#### SkeletonAvatarConfig

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| size | The size of the avatar placeholder | `'small' \| 'middle' \| 'large' \| number` | `'large'` |
| shape | The shape of the avatar placeholder | `'circle' \| 'square'` | `'circle'` (`'square'` when there is only a title) |

#### SkeletonTitleConfig

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| width | The width of the title placeholder | `number \| string` | - |

#### SkeletonParagraphConfig

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| rows | The number of rows of the paragraph placeholder | `number` | `3` (`2` with an avatar) |
| width | The width of the paragraph placeholder; an array sets the width of each row, otherwise it is the width of the last row | `number \| string \| Array<number \| string>` | - |

### Skeleton.Button Props {#button-props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| active | Show the animation effect | `boolean` | `false` |
| block | Fit the width to the parent | `boolean` | `false` |
| shape | Button shape | `'default' \| 'circle' \| 'round' \| 'square'` | `'default'` |
| size | Button size | `'small' \| 'middle' \| 'large'` | `'middle'` |

### Skeleton.Avatar Props {#avatar-props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| active | Show the animation effect | `boolean` | `false` |
| shape | Avatar shape | `'circle' \| 'square'` | `'circle'` |
| size | Avatar size | `'small' \| 'middle' \| 'large' \| number` | `'middle'` |

### Skeleton.Input Props {#input-props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| active | Show the animation effect | `boolean` | `false` |
| block | Fit the width to the parent | `boolean` | `false` |
| size | Input size | `'small' \| 'middle' \| 'large'` | `'middle'` |

### Skeleton.Image Props {#image-props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| active | Show the animation effect | `boolean` | `false` |
| size | Size of the image placeholder; an array is `[width, height]` | `number \| string \| [number \| string, number \| string]` | `96` |

The four element components also support `rootClass`, `classes` and `styles` (semantic structure: `root`, `content`).

### Slots {#slots}

| Slot | Description |
| --- | --- |
| default | The real content shown when `loading` is `false` |

## Design Token {#design-token}

Customize through `theme.components.Skeleton` of `ConfigProvider`, or override the CSS variables directly.

| Token | Description | Default |
| --- | --- | --- |
| `--am-skeleton-color` | Color of the placeholder blocks | `var(--am-color-fill-secondary)` |
| `--am-skeleton-color-highlight` | Highlight color of the animation | `var(--am-color-fill)` |
| `--am-skeleton-title-height` | Title height | `16px` |
| `--am-skeleton-paragraph-height` | Height of a paragraph row | `16px` |
| `--am-skeleton-paragraph-gap` | Gap between paragraph rows | `12px` |
| `--am-skeleton-border-radius` | Border radius of the placeholder blocks | `var(--am-border-radius-sm)` |
| `--am-skeleton-avatar-size` | Avatar size | `var(--am-control-height)` |
| `--am-skeleton-duration` | Animation duration | `1.4s` |

## Differences from PC {#diff}

- `Skeleton.Node` is not provided; for a custom shape, simply override the size of `Skeleton.Image` / `Skeleton.Button`.
- `Skeleton.Image` gains a `size` prop, making it easy to fit images of different aspect ratios on mobile.
- Sizes use the mobile `'small' \| 'middle' \| 'large'`; the `'default'` deprecated on PC is not supported.
