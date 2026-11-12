---
title: Avatar
description: Used to represent users or things, supporting the display of images, icons, or characters.
group:
  title: Data Display
  order: 5
---

## When To Use {#when-to-use}

- To represent users or groups in profile pages, comments and conversation lists.
- Falls back to an icon or characters automatically when the image fails to load, so no broken image is shown.

## Examples {#examples}

<demo src="./demo/basic.vue">Basic usage</demo>
<demo src="./demo/type.vue">Three types</demo>
<demo src="./demo/size.vue">Size</demo>
<demo src="./demo/fallback.vue">Fallback on load error</demo>
<demo src="./demo/gap.vue">Autoset font size</demo>
<demo src="./demo/badge.vue">With badge</demo>
<demo src="./demo/group.vue">Avatar group</demo>
<demo src="./demo/list.vue" full>In a list</demo>

## API

### Avatar Props {#props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| src | The address of the image, or a custom image node. The same-named slot takes precedence | `VueNode` | - |
| srcSet | The `srcset` of the image, for different screen densities | `string` | - |
| alt | The alternative text shown when the image cannot be displayed | `string` | - |
| icon | Icon avatar. The same-named slot takes precedence | `VueNode` | - |
| shape | The shape of the avatar | `'circle' \| 'square'` | `'circle'` |
| size | The size of the avatar. Numbers are in px | `'small' \| 'middle' \| 'large' \| number` | `'middle'` |
| gap | The minimum distance (px) between the characters and the left / right edges; the characters shrink automatically when they exceed it | `number` | `4` |
| fit | The `object-fit` of the image (mobile only) | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` |
| draggable | Whether the image is draggable | `boolean \| 'true' \| 'false'` | - |
| crossOrigin | The CORS setting of the image | `'' \| 'anonymous' \| 'use-credentials'` | - |
| rootClass | Class name of the root element | `string` | - |
| classes | Semantic structure class names | `Record<'root', string>` | - |
| styles | Semantic structure styles | `Record<'root', CSSProperties>` | - |

Display priority: a usable image `src` > `icon` > the characters in the default slot.

### Avatar Events {#events}

| Event | Description | Type |
| --- | --- | --- |
| error | Triggered when the image fails to load; the avatar then falls back to `icon` or characters | `(event: Event) => void` |

Native events such as `click` are passed through to the root element, so `@click` can be used directly.

### Avatar Slots {#slots}

| Slot | Description |
| --- | --- |
| default | The content of a character avatar |
| icon | Custom icon, takes precedence over the `icon` prop |
| src | Custom image node, takes precedence over the `src` prop |

### AvatarGroup Props {#group-props}

Also available as `Avatar.Group`; use `<am-avatar-group>` in templates.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| max | The maximum number of avatars to show and the style of the folded avatar | `{ count?: number, style?: CSSProperties }` | - |
| size | The size of all avatars in the group. The `size` of a single avatar takes precedence | `'small' \| 'middle' \| 'large' \| number` | - |
| shape | The shape of all avatars in the group. The `shape` of a single avatar takes precedence | `'circle' \| 'square'` | - |
| rootClass | Class name of the root element | `string` | - |

### AvatarGroup Slots {#group-slots}

| Slot | Description | Params |
| --- | --- | --- |
| default | The list of avatars | - |
| overflow | Custom content of the folded avatar, `+N` by default | `{ count: number }` |

## Design Token {#design-token}

| Token | Description | Default |
| --- | --- | --- |
| `--am-avatar-size` | Avatar size | `40px` (`small` 28px / `large` 56px) |
| `--am-avatar-font-size` | Character font size | `18px` |
| `--am-avatar-icon-size` | Icon size | `20px` |
| `--am-avatar-border-radius` | Border radius of a square avatar | `var(--am-border-radius)` |
| `--am-avatar-bg` | Background color | `var(--am-color-text-placeholder)` |
| `--am-avatar-color` | Text / icon color | `var(--am-color-text-light-solid)` |
| `--am-avatar-group-overlap` | Overlap distance between adjacent avatars in a group | `-8px` |
| `--am-avatar-group-border-color` | Outline color of the avatars in a group | `var(--am-color-bg-container)` |

## Differences from PC {#diff}

- `error` is a plain event, so the fallback cannot be prevented by returning `false`; provide `icon` or the default slot to customize the fallback content.
- `size` does not support the responsive breakpoint object (`{ xs, sm, ... }`).
- `max` of `AvatarGroup` does not support `popover`, and folded avatars are not expanded in a popover; use the `overflow` slot to customize the folded avatar and handle its click yourself.
- Added the `fit` prop to control how the image fills the avatar.
- Larger default sizes: `middle` 40px, `small` 28px, `large` 56px.
