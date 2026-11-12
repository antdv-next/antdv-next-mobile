---
title: ImagePreview
subtitle: 图片预览
description: 全屏的图片查看器，支持滑动切换、双指缩放、双击放大与下拉关闭。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 需要全屏查看一张或一组图片，并通过手势缩放查看细节时。
- 点击缩略图、相册封面、上传列表等位置后查看大图时。

支持组件式（`v-model:open`）与函数式（`ImagePreview.show()`）两种用法。[Image](/components/image) 的 `preview` 与 [Upload](/components/upload) 的图片预览均基于本组件。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/current.vue">指定初始位置与受控</demo>
<demo src="./demo/closable.vue">关闭方式</demo>
<demo src="./demo/slots.vue">自定义页码与底部内容</demo>
<demo src="./demo/static.vue">函数式调用</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 是否显示，支持 `v-model:open` | `boolean` | `false` |
| defaultOpen | 默认是否显示（非受控） | `boolean` | `false` |
| images | 图片列表 | `(string \| { src: string, alt?: string })[]` | `[]` |
| current | 当前图片的索引，支持 `v-model:current` | `number` | - |
| defaultCurrent | 默认展示的图片索引（非受控） | `number` | `0` |
| loop | 是否循环切换 | `boolean` | `true` |
| showIndex | 是否显示页码（如 `2 / 5`） | `boolean` | `true` |
| closable | 是否显示关闭图标 | `boolean` | `false` |
| closeIcon | 自定义关闭图标，同名插槽优先 | `VueNode` | - |
| closeOnClick | 单击图片是否关闭 | `boolean` | `true` |
| swipeToClose | 未缩放时是否可以下拉关闭 | `boolean` | `true` |
| maxZoom | 最大缩放倍数 | `number` | `3` |
| minZoom | 手势缩小时的最小倍数，松手后回弹到 1 | `number` | `1/3` |
| doubleTapZoom | 是否开启双击缩放，传入数字为双击放大的倍数（默认 2）。关闭后单击会立即关闭，没有等待双击的延迟 | `boolean \| number` | `true` |
| getContainer | 挂载的节点，`false` 时渲染在当前位置 | `string \| HTMLElement \| (() => HTMLElement) \| false` | `document.body` |
| zIndex | 层级 | `number` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'image' \| 'index' \| 'footer', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'image' \| 'index' \| 'footer', CSSProperties>` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 切换图片时触发 | `(current: number) => void` |
| close | 用户请求关闭（单击、关闭图标、下拉、ESC）时触发 | `() => void` |
| openChange | 显示状态变化时触发 | `(open: boolean) => void` |
| afterOpenChange | 打开 / 关闭动画结束后触发 | `(open: boolean) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| index | 自定义页码 | `{ current: number, total: number }` |
| footer | 固定在底部的内容 | `{ current: number, total: number }` |
| image | 自定义每一页的内容，替换默认的 `<img>` | `{ src: string, alt?: string, index: number }` |
| closeIcon | 自定义关闭图标 | - |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| close | 关闭预览 | `() => void` |
| goTo | 切换到指定图片 | `(index: number, dontAnimate?: boolean) => void` |

### 静态方法 {#static-methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| ImagePreview.show | 打开图片预览，返回的对象可用于关闭 | `(options: ImagePreviewShowOptions) => { close: () => void }` |
| ImagePreview.clear | 关闭所有通过 `show` 打开的预览 | `() => void` |

`ImagePreviewShowOptions` 支持上表中除 `open` / `defaultOpen` / `defaultCurrent` / `classes` / `styles` 以外的属性（`current` 为初始位置），以及：

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| index | 自定义页码 | `(info: { current: number, total: number }) => VueNode` |
| footer | 固定在底部的内容 | `(info: { current: number, total: number }) => VueNode` |
| onChange | 切换图片时的回调 | `(current: number) => void` |
| onClose | 用户请求关闭时的回调 | `() => void` |
| afterClose | 关闭动画结束后的回调 | `() => void` |

函数式调用渲染在独立的应用中，主题与语言跟随 `ConfigProvider.config()` 的全局配置。

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.ImagePreview` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-image-preview-z-index` | 层级 | `var(--am-z-index-popup-base)` |
| `--am-image-preview-bg` | 背景色 | `var(--am-color-black)` |
| `--am-image-preview-color` | 页码、关闭图标等前景色 | `var(--am-color-white)` |
| `--am-image-preview-index-font-size` | 页码字号 | `var(--am-font-size)` |
| `--am-image-preview-index-top` | 页码距顶部的距离（不含安全区） | `16px` |
| `--am-image-preview-close-size` | 关闭图标大小 | `22px` |
| `--am-image-preview-duration` | 缩放与回弹动画时长 | `0.3s` |

## 与 PC 端的差异 {#diff}

PC 端没有独立的 `ImagePreview` 组件，预览能力内置于 `Image` 的 `preview` 配置中。移动端将其独立出来，并提供函数式调用：

- 没有工具栏（旋转、翻转、缩放按钮），改为手势操作：左右滑动切换、双指缩放、双击放大、放大后拖动、下拉关闭。
- 属性命名沿用 PC 的 `open`、`current`、`getContainer`、`afterOpenChange` 等约定。
