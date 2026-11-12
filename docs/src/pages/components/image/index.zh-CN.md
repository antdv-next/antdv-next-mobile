---
title: Image
subtitle: 图片
description: 可设置填充模式、懒加载、占位与预览的图片。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 需要展示图片，并希望统一处理加载中占位、加载失败容错时。
- 需要控制图片的填充模式（`cover` / `contain` ...）、圆角或懒加载时。
- 点击图片需要全屏预览、手势缩放时（预览能力由 [ImagePreview](/components/image-preview) 提供）。

API 与 antdv-next 的 `Image` 对齐：`src`、`alt`、`width`、`height`、`fallback`、`placeholder`、`preview`、`Image.PreviewGroup`。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/fit.vue">填充模式</demo>
<demo src="./demo/shape.vue">圆角与圆形</demo>
<demo src="./demo/placeholder.vue">加载占位与容错</demo>
<demo src="./demo/lazy.vue">懒加载</demo>
<demo src="./demo/preview.vue">点击预览</demo>
<demo src="./demo/preview-group.vue">多张图片预览</demo>

## API

### Image

#### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| src | 图片地址 | `string` | - |
| alt | 图像描述 | `string` | - |
| width | 图像宽度，数字的单位为 `px` | `string \| number` | - |
| height | 图像高度，数字的单位为 `px` | `string \| number` | - |
| fit | 图片填充模式，同 `object-fit` | `'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down'` | `'fill'` |
| position | 图片位置，同 `object-position` | `string` | - |
| fallback | 加载失败时使用的容错地址 | `string` | - |
| placeholder | 加载占位。`true` 使用默认占位，`false` 不显示，也可传入节点，同名插槽优先 | `boolean \| VueNode` | `true` |
| preview | 点击后全屏预览，传入对象可配置预览。在 `ImagePreviewGroup` 内默认开启 | `boolean \| ImagePreviewConfig` | `false` |
| lazy | 是否懒加载，进入视口后才开始加载 | `boolean` | `false` |
| radius | 圆角，数字的单位为 `px` | `string \| number` | - |
| round | 是否显示为圆形 | `boolean` | `false` |
| crossorigin | 同原生 `crossorigin` | `'anonymous' \| 'use-credentials' \| ''` | - |
| referrerpolicy | 同原生 `referrerpolicy` | `string` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'image' \| 'placeholder', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'image' \| 'placeholder', CSSProperties>` | - |

#### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| load | 图片加载完成时触发 | `(event: Event) => void` |
| error | 图片加载失败时触发 | `(event: Event) => void` |
| click | 点击图片时触发 | `(event: MouseEvent) => void` |
| openChange | 预览打开 / 关闭时触发 | `(open: boolean) => void` |

#### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| placeholder | 自定义加载占位，优先于 `placeholder` 属性 |
| fallback | 自定义加载失败时的内容 |

### ImagePreviewConfig

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 是否显示预览（受控） | `boolean` | - |
| src | 预览时使用的地址，如缩略图对应的原图 | `string` | `src` |
| closable | 是否显示关闭图标 | `boolean` | `false` |
| closeIcon | 自定义关闭图标 | `VueNode` | - |
| closeOnClick | 单击是否关闭预览 | `boolean` | `true` |
| swipeToClose | 是否可以下拉关闭 | `boolean` | `true` |
| maxScale | 最大缩放倍数 | `number` | `3` |
| minScale | 最小缩放倍数 | `number` | `1/3` |
| doubleTapZoom | 双击缩放，传入数字为放大倍数 | `boolean \| number` | `true` |
| getContainer | 预览挂载的节点 | `string \| HTMLElement \| (() => HTMLElement) \| false` | `document.body` |
| zIndex | 预览层的 `z-index` | `number` | - |
| rootClass | 预览层根节点类名 | `string` | - |

### ImagePreviewGroup

也可以通过 `Image.PreviewGroup` 访问。

#### 属性 {#group-props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 预览的图片数组，未设置时收集分组内的 `Image` | `(string \| { src: string, alt?: string })[]` | - |
| preview | 预览参数，为 `false` 时禁用 | `boolean \| ImagePreviewGroupConfig` | `true` |
| fallback | 分组内图片的默认容错地址 | `string` | - |

`ImagePreviewGroupConfig` 在 `ImagePreviewConfig` 的基础上增加：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| current | 当前预览图的索引（受控） | `number` | - |
| loop | 是否循环切换 | `boolean` | `true` |
| showIndex | 是否显示页码 | `boolean` | `true` |

#### 事件 {#group-events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| openChange | 预览打开 / 关闭时触发 | `(open: boolean, info: { current: number }) => void` |
| change | 切换预览图时触发 | `(current: number, prevCurrent: number) => void` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Image` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-image-placeholder-bg` | 占位背景色 | `var(--am-color-fill-tertiary)` |
| `--am-image-placeholder-color` | 占位图标与文字颜色 | `var(--am-color-text-quaternary)` |
| `--am-image-placeholder-icon-size` | 占位图标大小 | `28px` |
| `--am-image-placeholder-font-size` | 占位文字大小 | `var(--am-font-size-sm)` |
| `--am-image-border-radius` | 圆角 | `0` |

## 与 PC 端的差异 {#diff}

- `preview` 默认为 `false`（PC 为 `true`）：移动端图片多位于可点击的卡片 / 列表中，需要预览时显式开启，或放入 `ImagePreviewGroup`。
- 预览层为移动端的 [ImagePreview](/components/image-preview)：手势缩放、双击放大、下拉关闭；不支持 PC 的工具栏相关配置（`actionsRender`、`imageRender`、`cover`、`mask`、`scaleStep`、`movable`、`wheel`、`focusTrap`、`onTransform`）。
- `preview.onOpenChange` / `onChange` 改为组件事件 `openChange` / `change`。
- `placeholder` 默认显示内置占位；加载失败时默认展示带图标的失败提示，`fallback` 插槽用于自定义失败内容。
- 新增 `fit`、`position`、`lazy`、`radius`、`round` 属性与 `load` 事件。
