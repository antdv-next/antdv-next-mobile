---
title: ShimmerText
description: Text with a highlight sweeping across it, to say that something is being generated, loaded or processed.
group:
  title: Data Display
  order: 5
---

## When To Use {#when-to-use}

- During long operations such as AI generation, searching or syncing, to tell in one line what is going on.
- Lighter and more informative than [Spin](/components/spin). Use [Skeleton](/components/skeleton) when the structure of the content is unknown.

## Examples {#examples}

<demo src="./demo/basic.vue">Basic</demo>
<demo src="./demo/custom.vue">Colors and speed</demo>
<demo src="./demo/active.vue">Stop the animation</demo>

## API

### Props {#props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| content | Text content, the default slot wins | `VueNode` | - |
| active | Whether the shimmer plays, `false` renders plain text | `boolean` | `true` |
| duration | Time of one sweep, numbers are seconds | `number \| string` | `2` |
| color | Base color of the text | `string` | - |
| shimmerColor | Color of the highlight | `string` | - |
| tag | Tag of the root | `string` | `'span'` |
| rootClass | Class name of the root | `string` | - |
| classes | Semantic class names | `Record<'root', string>` | - |
| styles | Semantic styles | `Record<'root', CSSProperties>` | - |

### Slots {#slots}

| Slot | Description | Params |
| --- | --- | --- |
| default | Text content | - |

## Design Token {#design-token}

Customize through `theme.components.ShimmerText` of `ConfigProvider` or by overriding the CSS variables.

| Variable | Description | Default |
| --- | --- | --- |
| `--am-shimmer-text-color` | Base color of the text | `var(--am-color-text-tertiary)` |
| `--am-shimmer-text-shimmer-color` | Color of the highlight | `var(--am-color-text)` |
| `--am-shimmer-text-duration` | Time of one sweep | `2s` |
| `--am-shimmer-text-spread` | Width of the highlight | `20%` |

## Differences from PC {#diff}

- A mobile-only component, Antdv Next has no counterpart.
- With "reduce motion" enabled in the system, the animation does not play and plain text is shown.
