---
title: Carousel
subtitle: 走马灯
description: 一组轮播的区域，支持手势滑动、无缝循环与自动播放。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 当有一组平级的内容需要在有限空间内轮流展示，如首页 Banner、商品图集、引导页。
- 当内容空间不足时，可以用走马灯的形式进行收纳，循环播放。

API 与 antdv-next 的 `Carousel` 对齐（`autoplay`、`dots`、`dotPlacement`、`infinite`、`effect`、`beforeChange`、`afterChange`、`goTo` / `next` / `prev`），并针对移动端重新实现了手势：跟手滑动、速度判定、方向锁定（横向轮播不会阻止页面纵向滚动）、无缝循环。默认插槽的每个直接子节点即为一页，`v-for` 与 `<template>` 片段会被自动展开。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/autoplay.vue">自动播放</demo>
<demo src="./demo/vertical.vue">纵向滚动</demo>
<demo src="./demo/fade.vue">渐显效果</demo>
<demo src="./demo/peek.vue">露出相邻卡片</demo>
<demo src="./demo/indicator.vue">自定义指示器</demo>
<demo src="./demo/methods.vue">手动控制</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| autoplay | 是否自动切换，传入 `{ dotDuration: true }` 时当前指示点会展示进度 | `boolean \| { dotDuration?: boolean }` | `false` |
| autoplaySpeed | 自动切换的间隔（毫秒） | `number` | `3000` |
| dots | 是否显示指示点，传入对象可指定指示点容器的类名 | `boolean \| { class?: string }` | `true` |
| dotPlacement | 指示点位置 | `'top' \| 'bottom' \| 'start' \| 'end'` | `'bottom'` |
| dotPosition | 指示点位置，请使用 `dotPlacement` 替换 | `'top' \| 'bottom' \| 'start' \| 'end' \| 'left' \| 'right'` | - |
| infinite | 是否无缝循环 | `boolean` | `true` |
| speed | 切换动画时长（毫秒） | `number` | `300` |
| initialSlide | 初始展示的页码 | `number` | `0` |
| vertical | 是否纵向滚动，未设置时与 PC 一致：`dotPlacement` 为 `start` / `end` 时纵向 | `boolean` | - |
| draggable | 是否可以通过手势滑动切换 | `boolean` | `true` |
| allowTouchMove | 临时开启 / 关闭手势（如内部元素正在处理手势时） | `boolean` | `true` |
| effect | 动画效果 | `'scrollx' \| 'fade'` | `'scrollx'` |
| slideSize | 每页占轮播宽度（纵向时为高度）的百分比，小于 100 时可露出相邻页 | `number` | `100` |
| trackOffset | 轨道的起始偏移，占轮播宽度的百分比 | `number` | `0` |
| stuckAtBoundary | 非循环模式下，首尾页是否贴边（忽略 `trackOffset`） | `boolean` | `true` |
| indicator | 自定义指示器，会替换指示点，同名插槽优先 | `VueNode \| ((info: { current: number, total: number }) => VueNode)` | - |
| stopPropagation | 是否阻止已处理的触摸事件冒泡（嵌套轮播时使用） | `boolean` | `false` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'track' \| 'slide' \| 'dots' \| 'dot', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'track' \| 'slide' \| 'dots' \| 'dot', CSSProperties>` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| beforeChange | 切换前触发 | `(current: number, next: number) => void` |
| afterChange | 切换动画结束后触发 | `(current: number) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 轮播内容，每个直接子节点为一页 | - |
| indicator | 自定义指示器，优先于 `indicator` 属性 | `{ current: number, total: number }` |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| goTo | 切换到指定页，`dontAnimate` 为 `true` 时不使用动画 | `(slide: number, dontAnimate?: boolean) => void` |
| next | 切换到下一页 | `() => void` |
| prev | 切换到上一页 | `() => void` |
| resize | 重新测量尺寸（容器尺寸变化时会自动调用） | `() => void` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Carousel` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-carousel-dot-width` | 指示点宽度 | `16px` |
| `--am-carousel-dot-height` | 指示点高度 | `3px` |
| `--am-carousel-dot-active-width` | 当前指示点宽度 | `24px` |
| `--am-carousel-dot-gap` | 指示点间距 | `4px` |
| `--am-carousel-dot-offset` | 指示点距离边缘的距离 | `12px` |
| `--am-carousel-dot-color` | 指示点颜色 | `var(--am-color-white)` |
| `--am-carousel-dot-opacity` | 非当前指示点的不透明度 | `0.3` |
| `--am-carousel-dot-border-radius` | 指示点圆角 | `3px` |

## 与 PC 端的差异 {#diff}

- 不依赖 `slick`，手势与动画为移动端重新实现；不支持 `arrows`、`prevArrow` / `nextArrow`、`waitForAnimate`、`fade`（请使用 `effect="fade"`）、`innerSlider`、`autoPlay()` 方法以及 `init` / `swipe` / `lazyLoad` 等 slick 事件。
- `draggable` 默认为 `true`（PC 为 `false`），`speed` 默认 `300`（PC 为 `500`）。
- 新增 `autoplaySpeed`、`slideSize`、`trackOffset`、`stuckAtBoundary`、`allowTouchMove`、`stopPropagation` 属性，`indicator` 属性 / 插槽与 `resize` 方法。
- 自动播放在手指按住以及页面不可见时暂停；非循环模式播放到最后一页后回到第一页。
- 纵向轮播需要为组件设置高度。
