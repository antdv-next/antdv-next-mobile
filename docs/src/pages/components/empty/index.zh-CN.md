---
title: Empty
subtitle: 空状态
description: 空状态时的展示占位图。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 当目前没有数据时，用于显式的用户提示，例如空的订单列表、搜索无结果。
- 初始化场景时的引导创建流程，可在底部放置操作按钮。

内置插图完全使用设计变量绘制，暗色模式下自动适配。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/simple.vue">简洁插图</demo>
<demo src="./demo/description.vue">自定义描述</demo>
<demo src="./demo/action.vue">底部操作</demo>
<demo src="./demo/custom-image.vue">自定义图片</demo>
<demo src="./demo/locale.vue">国际化</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| image | 图片地址（字符串）或自定义节点，同名插槽优先；设为 `false` 不显示图片 | `VueNode` | `Empty.PRESENTED_IMAGE_DEFAULT` |
| description | 自定义描述内容，同名插槽优先；设为 `false` 或 `null` 不显示描述 | `VueNode` | 国际化文案 `Empty.description` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'image' \| 'description' \| 'footer', string>` | - |
| styles | 语义化结构样式，图片大小可通过 `styles.image` 设置 | `Record<'root' \| 'image' \| 'description' \| 'footer', CSSProperties>` | - |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 底部内容，通常是操作按钮 |
| image | 自定义图片，优先于 `image` 属性 |
| description | 自定义描述，优先于 `description` 属性 |

### 内置图片 {#images}

| 静态属性 | 说明 |
| --- | --- |
| `Empty.PRESENTED_IMAGE_DEFAULT` | 默认插图 |
| `Empty.PRESENTED_IMAGE_SIMPLE` | 简洁的线条插图，同时让组件使用更紧凑的间距，适合列表、选择器等局部区域 |

```vue
<script setup lang="ts">
import { Empty } from '@antdv-next/mobile'
</script>

<template>
  <am-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" />
</template>
```

## 主题变量 {#design-token}

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-empty-padding-block` | 上下内边距 | `var(--am-padding-xl)` |
| `--am-empty-image-height` | 图片高度 | `100px` |
| `--am-empty-image-height-normal` | 简洁插图的高度 | `40px` |
| `--am-empty-description-color` | 描述文字颜色 | `var(--am-color-text-description)` |
| `--am-empty-description-font-size` | 描述文字字号 | `var(--am-font-size)` |
| `--am-empty-image-fill` | 内置插图的浅色填充 | `var(--am-color-fill-secondary)` |
| `--am-empty-image-fill-strong` | 内置插图的深色填充 | `var(--am-color-fill)` |
| `--am-empty-image-surface` | 内置插图的表面色 | `var(--am-color-bg-container)` |
| `--am-empty-image-stroke` | 内置插图的描边色 | `var(--am-color-border)` |

## 与 PC 端的差异 {#diff}

- 内置插图为移动端重新绘制，颜色全部来自设计变量（PC 端通过 JS 计算主题色）。
- `Empty.PRESENTED_IMAGE_DEFAULT` / `Empty.PRESENTED_IMAGE_SIMPLE` 是渲染函数而不是 VNode，用法保持一致。
- 不支持已废弃的 `imageStyle`，请使用 `styles.image`。
- `image` 额外支持 `false`，用于只显示文字的空状态。
- 组件自带上下内边距并在容器内水平居中。
