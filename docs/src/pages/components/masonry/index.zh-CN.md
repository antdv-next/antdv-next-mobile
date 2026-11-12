---
title: Masonry
subtitle: 瀑布流
description: 瀑布流布局组件，用于展示不同高度的内容。
group:
  title: 布局
  order: 2
---

## 何时使用 {#when-to-use}

- 展示不规则高度的图片或卡片时，例如商品流、内容流、相册。
- 需要按列数均匀分布内容，并让每一列尽量等高时。
- 内容会分页追加时，可配合 [InfiniteScroll](/components/infinite-scroll) 使用。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/image.vue">图片</demo>
<demo src="./demo/dynamic.vue">动态更新</demo>
<demo src="./demo/infinite-scroll.vue" full>滚动加载</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 瀑布流项，见 [MasonryItemType](#masonry-item-type) | `MasonryItemType[]` | - |
| columns | 列数 | `number` | `2` |
| gutter | 间距，数字单位为 px，也可以是 CSS 长度；数组形式为 `[水平间距, 垂直间距]`，垂直间距缺省或为 `0` 时与水平间距相同 | `number \| string \| [number \| string, number \| string]` | `--am-masonry-gutter`（`8px`） |
| itemRender | 自定义项渲染，同名插槽优先 | `(itemInfo: MasonryItemType & { index: number; column: number }) => VNodeChild` | - |
| fresh | 是否持续监听每一项的尺寸变化并重新排版（内容高度会在加载之外的时机变化时开启） | `boolean` | `false` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化类名：`root` / `item` | `MasonrySemanticClassNames` | - |
| styles | 语义化样式：`root` / `item` | `MasonrySemanticStyles` | - |

### MasonryItemType {#masonry-item-type}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识 | `string \| number` | - |
| data | 自定义存储数据，会传给 `itemRender` | `T` | - |
| height | 已知高度（px）：测量前即按该高度排版，避免首屏跳动；测量后以实际高度为准 | `number` | - |
| column | 固定所在列（从 `0` 开始），超出范围时取最近的列 | `number` | - |
| children | 自定义展示内容，优先级高于 `itemRender` | `VueNode` | - |
| class | 该项的类名 | `string` | - |
| style | 该项的样式 | `CSSProperties` | - |

### 事件 {#events}

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| layoutChange | 所有项完成排版且某一项所在的列发生变化时触发，返回带有 `column` 的各项 | `(sortInfo: MasonryLayoutInfo[])`，即 `(MasonryItemType & { column: number })[]` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| itemRender | 自定义项渲染，优先于 `itemRender` 属性 | `MasonryItemType & { index: number; column: number }` |

### 方法 {#methods}

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| nativeElement | 根节点 | `HTMLDivElement` |
| layout | 重新测量并排版（例如字体或主题切换后） | `() => void` |

### 排版说明 {#layout}

- 按数据顺序依次把每一项放入当前最矮的一列（高度相同时取靠前的一列），或它指定的 `column`；DOM 顺序始终与数据顺序一致。
- 高度通过测量得到：在 `items` / `columns` / `gutter` 变化、容器尺寸变化、内部图片等资源 `load` / `error` 时重新测量，同一帧内的多次请求合并为一次。其他时机的高度变化（展开收起、异步内容）请开启 `fresh`，或调用 `layout()`。
- 未测量的项先以透明状态渲染，放置后淡入；之后的位置变化通过 `transform` 过渡，在 `prefers-reduced-motion` 下关闭。
- 不包含虚拟滚动：所有项都会渲染，适合几百项以内的列表；数据量更大时请分页并控制总量。

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Masonry` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-masonry-gutter` | 默认间距（未设置 `gutter` 时使用） | `var(--am-margin-xs)` |
| `--am-masonry-gutter-x` | 水平间距，由 `gutter` 属性写入 | `var(--am-masonry-gutter)` |
| `--am-masonry-gutter-y` | 垂直间距，由 `gutter` 属性写入 | `var(--am-masonry-gutter-x)` |
| `--am-masonry-columns` | 列数，由 `columns` 属性写入 | `2` |
| `--am-masonry-motion-duration` | 淡入与位置过渡的时长 | `var(--am-motion-duration-slow)` |
| `--am-masonry-motion-ease` | 过渡曲线 | `var(--am-motion-ease-out)` |

## 与 PC 端的差异 {#diff}

- `columns` 只支持数字，不支持 `{ xs, sm, md ... }` 响应式断点对象，默认值为 `2`（PC 为 `3`）。移动端视口宽度单一，需要适配平板时请根据 `useWindowSize()` 等自行计算列数。
- `gutter` 不支持断点对象；额外支持字符串形式的 CSS 长度（如 `'0.5rem'`）；默认值取自主题变量 `--am-masonry-gutter`（`8px`），PC 为 `0`。
- `classes` / `styles` 只支持对象形式，不支持函数形式。
- `itemRender` 的参数与 PC 实际行为一致（包含 `index` 与 `column`），并在类型中声明了 `column`。
- `items[].height` 会参与排版：已知高度的项在测量前就被放置（PC 声明了该字段但不使用）。
- `layoutChange` 仅在某一项所在的列变化时触发（PC 在 `items` 的任意字段变化时也会触发）；回调中的每一项始终带有 `key`。
- 位置通过 CSS 变量 + `transform` 实现并带过渡动画（PC 使用 `top` / `inset-inline-start`）；新增项淡入，移除项直接消失，没有离场动画。
- 新增 `layout()` 方法用于手动重新排版；新增主题变量 `--am-masonry-*`（PC 没有组件级主题变量）。
- 不依赖 `@v-c/resize-observer`，使用原生 `ResizeObserver`；不支持的环境下仍会在数据变化与资源加载时排版。
