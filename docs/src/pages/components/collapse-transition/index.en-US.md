---
title: CollapseTransition
description: Adds an animated expand / collapse of the height to any content.
group:
  title: Gestures & Others
  order: 7
---

## When To Use {#when-to-use}

- Content that should expand and collapse smoothly: "show more", filters, optional blocks of a form.
- When you need panels with a header, use [Collapse](/components/collapse). Its content area is built on this component.

## Examples {#examples}

<demo src="./demo/basic.vue">Basic</demo>
<demo src="./demo/more.vue">Show more</demo>

## API

### Props {#props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| open | Whether the content is expanded | `boolean` | `false` |
| forceRender | Render the content before it was expanded for the first time | `boolean` | `false` |
| destroyOnHidden | Remove the content after collapsing | `boolean` | `false` |
| appear | Whether to play the expand animation when first rendered expanded | `boolean` | `false` |
| tag | Tag of the root | `string` | `'div'` |
| rootClass | Class name of the root | `string` | - |
| classes | Semantic class names | `Record<'root', string>` | - |
| styles | Semantic styles | `Record<'root', CSSProperties>` | - |

The height is animated on the root, so put paddings on the content inside (a padded root cannot collapse to 0).

### Events {#events}

| Event | Description | Type |
| --- | --- | --- |
| afterOpenChange | Triggered when the expand / collapse animation finished | `(open: boolean) => void` |

### Slots {#slots}

| Slot | Description | Params |
| --- | --- | --- |
| default | The collapsible content | - |

## Design Token {#design-token}

Customize through `theme.components.CollapseTransition` of `ConfigProvider` or by overriding the CSS variables.

| Variable | Description | Default |
| --- | --- | --- |
| `--am-collapse-transition-duration` | Duration of the animation | `var(--am-motion-duration-slow)` |
| `--am-collapse-transition-timing-function` | Easing of the animation | `var(--am-motion-ease-in-out)` |

## Differences from PC {#diff}

- antdv-next does not export a collapse motion. This component is added for mobile.
- The props follow the conventions of the PC popup components: `open`, `forceRender`, `destroyOnHidden`, `afterOpenChange`.
