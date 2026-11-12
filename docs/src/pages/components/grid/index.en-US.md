---
title: Grid
description: 24 Grids System.
group:
  title: Layout
  order: 2
---

## When To Use {#when-to-use}

- When the areas within a row have to be divided by fixed proportions, e.g. grid entries, side-by-side form fields, an image wall.
- Create a row with `Row` and put the content inside `Col`; when the `span` sum of a row exceeds 24, it wraps automatically.

The layout is based on Flex, and the API is aligned with `Row` / `Col` in antdv-next.

## Examples {#examples}

<demo src="./demo/basic.vue">Basic grid</demo>
<demo src="./demo/gutter.vue">Grid gutter</demo>
<demo src="./demo/offset.vue">Offset and order</demo>
<demo src="./demo/justify.vue">Typesetting</demo>
<demo src="./demo/flex.vue">Flex stretch</demo>
<demo src="./demo/entry.vue">Grid entries</demo>

## API

### Row Props {#row-props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| gutter | Spacing between grids. Numbers are in px, CSS lengths are also accepted; the array form is `[horizontal, vertical]` | `number \| string \| [number \| string, number \| string]` | `0` |
| align | Vertical alignment | `'top' \| 'middle' \| 'bottom' \| 'stretch'` | `'top'` |
| justify | Horizontal arrangement | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` |
| wrap | Whether to wrap automatically | `boolean` | `true` |
| rootClass | Class name of the root element | `string` | - |

### Col Props {#col-props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| span | Number of cells to occupy; `0` corresponds to `display: none` | `number \| string` | - |
| offset | Number of cells to offset the Col from the left | `number \| string` | `0` |
| order | Order of the Col | `number \| string` | `0` |
| push | Number of cells the Col is moved to the right | `number \| string` | `0` |
| pull | Number of cells the Col is moved to the left | `number \| string` | `0` |
| flex | Flex layout property: a number is a ratio, `'100px'` is a fixed width, `'auto'` fills the remaining space | `number \| string` | - |
| rootClass | Class name of the root element | `string` | - |

### Slots {#slots}

| Component | Slot | Description |
| --- | --- | --- |
| Row | default | Row content, usually several `Col`s |
| Col | default | Column content |

## Design Token {#design-token}

| Token | Description | Default |
| --- | --- | --- |
| `--am-row-gutter-x` | Horizontal gutter, written by the `gutter` prop; `Col` computes its left and right padding from it | `0px` |

## Differences from PC {#diff}

- Responsive breakpoints are not supported: `Col` has no `xs` / `sm` / `md` / `lg` / `xl` / `xxl` props, and `gutter` / `align` / `justify` do not accept breakpoint objects. Mobile viewports have a single width range; use CSS media queries when you need to adapt to tablets.
- `Grid.useBreakpoint` is not provided.
- `gutter` additionally supports CSS lengths as strings (e.g. `'1rem'`).
- The vertical gutter is implemented with `row-gap`, so no negative margin is needed.
