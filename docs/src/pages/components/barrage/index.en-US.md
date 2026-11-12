---
title: Barrage
description: Comments flying across a video, live stream, image or any other content.
group:
  title: Data Display
  order: 5
---

## When To Use {#when-to-use}

- Show the comments of other users in real time while watching a video or a live stream.
- Interactive text that livens up a piece of content, such as a campaign or lottery page.

`Barrage` is a mobile-only component with no counterpart in antdv-next (PC). The default slot holds the content covered by the bullets (video, image ...); the bullet layer ignores taps, so the content below stays interactive.

## Examples {#examples}

<demo src="./demo/basic.vue">Basic usage</demo>
<demo src="./demo/control.vue">Play and pause</demo>
<demo src="./demo/custom.vue">Custom bullets</demo>

## API

### Props {#props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value (v-model) | Bullet list, one bullet is created per `id`; a bullet is removed from the list once it has left the container | [BarrageItem](#barrage-item)[] | - |
| defaultValue | Initial bullet list (uncontrolled) | [BarrageItem](#barrage-item)[] | `[]` |
| rows | Number of tracks; bullets are assigned to the tracks in turn | `number` | `4` |
| top | Distance from the top of the container to the first track, in px | `number` | `10` |
| duration | Time a bullet needs to cross the container, in milliseconds | `number` | `4000` |
| delay | Interval between bullets added together, in milliseconds; the first bullet of the initial list also waits one `delay` | `number` | `300` |
| autoPlay | Whether to play automatically; call `play()` when `false` | `boolean` | `true` |
| rootClass | Class name of the root element | `string` | - |
| classes | Semantic structure class names | `Record<'root' \| 'item', string>` | - |
| styles | Semantic structure styles | `Record<'root' \| 'item', CSSProperties>` | - |

#### BarrageItem {#barrage-item}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| id | Unique identifier | `string \| number` | - |
| text | Bullet content; the `item` slot takes precedence | `VueNode` | - |
| class | Class name of the bullet | `string` | - |
| style | Style of the bullet | `CSSProperties` | - |

#### How the list is updated

- Once a bullet has left the container the component removes it from the list and fires `finish`, `update:value` and `change` in that order; `update:value` / `change` only fire when the component itself changes the list. With `v-model:value` the list therefore only holds waiting and flying bullets and never grows without bound.
- When only `value` is passed and not written back, a finished bullet is not rendered again until its `id` disappears from the list.
- Appending items does not interrupt the bullets in flight; deleting an item removes its bullet immediately (without `finish`).
- To let the same content fly again, add it to the list with a new `id`.

### Events {#events}

| Event | Description | Type |
| --- | --- | --- |
| update:value | Triggered after the component removed a finished bullet | `(value: BarrageItem[]) => void` |
| change | Same as `update:value` | `(value: BarrageItem[]) => void` |
| finish | Triggered when a bullet has left the container | `(item: BarrageItem) => void` |

### Slots {#slots}

| Slot | Description | Params |
| --- | --- | --- |
| default | Content below the bullets, such as a video or an image | - |
| item | Custom bullet content | `{ item: BarrageItem }` |

### Methods {#methods}

| Method | Description | Type |
| --- | --- | --- |
| play | Start / resume playing | `() => void` |
| pause | Pause; bullets in flight stay where they are | `() => void` |

## Design Token {#design-token}

Customize through `theme.components.Barrage` of `ConfigProvider`, or by overriding the CSS variables directly.

| Token | Description | Default |
| --- | --- | --- |
| `--am-barrage-color` | Bullet text color | `var(--am-color-white)` |
| `--am-barrage-font-size` | Bullet font size | `var(--am-font-size-lg)` |
| `--am-barrage-font-weight` | Bullet font weight | `var(--am-font-weight-strong)` |
| `--am-barrage-shadow-color` | Color of the text shadow that keeps bullets readable over bright media | `var(--am-color-bg-mask)` |
| `--am-barrage-row-height` | Track height | `24px` |
| `--am-barrage-row-gap` | Gap between tracks | `var(--am-margin-xxs)` |

## Differences from PC {#diff}

- A mobile-only component with no PC counterpart; `value` / `defaultValue` / `rootClass` / `classes` / `styles` follow the antdv-next naming conventions.
- Bullets are driven by pure CSS animations; the root has `overflow: hidden` and the container height comes from the default slot content or your own style.
- RTL is supported: with `direction="rtl"` the bullets fly from left to right.
- Playback pauses automatically while the page is in the background and resumes when it returns.
- Bullets are motion by nature, so they keep playing when the system has "Reduce Motion" turned on; listen to `prefers-reduced-motion` and call `pause()` or skip rendering when needed.
