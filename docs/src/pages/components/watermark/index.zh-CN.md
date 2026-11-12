---
title: Watermark
subtitle: 水印
description: 给页面的某个区域加上水印。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 页面需要添加水印标识版权时使用。
- 适用于防止信息盗用，例如内部资料、个人敏感信息、截图溯源。

API 与 antdv-next 的 `Watermark` 对齐：基于 Canvas 绘制，支持文字 / 多行文字 / 图片水印，水印节点被删除或篡改后会自动恢复。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基本用法</demo>
<demo src="./demo/multi-line.vue">多行水印</demo>
<demo src="./demo/image.vue">图片水印</demo>
<demo src="./demo/custom.vue">自定义配置</demo>
<demo src="./demo/full-page.vue">全屏水印</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 水印文字内容，数组表示多行 | `string \| string[]` | - |
| image | 图片源，建议使用 2 倍或 3 倍图，优先级高于 `content`（加载失败时回退到文字） | `string` | - |
| width | 水印的宽度，默认为 `content` 自身的宽度 | `number` | `120`（图片） |
| height | 水印的高度，默认为 `content` 自身的高度 | `number` | `64`（图片） |
| rotate | 水印绘制时旋转的角度，单位 `°` | `number` | `-22` |
| zIndex | 水印层的 `z-index` | `number` | `9` |
| gap | 水印之间的间距 `[水平, 垂直]` | `[number, number]` | `[100, 100]` |
| offset | 水印距离容器左上角的偏移量，默认为 `gap / 2` | `[number, number]` | `[gap[0] / 2, gap[1] / 2]` |
| font | 文字样式 | `WatermarkFont` | - |
| fullPage | 是否覆盖整个视口（`position: fixed`） | `boolean` | `false` |
| rootClass | 根节点类名 | `string` | - |

### WatermarkFont

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| color | 字体颜色，默认跟随主题（`--am-watermark-color`） | `string` | `var(--am-color-fill)` |
| fontSize | 字体大小 | `number \| string` | `16` |
| fontWeight | 字体粗细 | `'normal' \| 'lighter' \| 'bold' \| 'bolder' \| number` | `'normal'` |
| fontFamily | 字体类型 | `string` | `'sans-serif'` |
| fontStyle | 字体样式 | `'none' \| 'normal' \| 'italic' \| 'oblique'` | `'normal'` |
| textAlign | 文本对齐方向 | `'left' \| 'right' \| 'center' \| 'start' \| 'end'` | `'center'` |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| remove | 水印节点被外部删除或篡改时触发（水印会立即恢复） | `() => void` |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 需要添加水印的内容 |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| render | 手动重绘水印，例如通过 `<html>` 上的类名切换暗色模式之后 | `() => void` |

## 主题变量 {#design-token}

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-watermark-color` | 默认的水印文字颜色（绘制时解析为实际色值） | `var(--am-color-fill)` |

## 与 PC 端的差异 {#diff}

- 新增 `fullPage`，一个属性即可覆盖整个移动端页面。
- 默认文字颜色来自 CSS 变量，经由 `ConfigProvider` 切换主题时自动重绘；使用其他方式切换主题时可调用 `render()`。
- 不支持 `inherit`（PC 端用于把水印透传给 Modal / Drawer）：移动端弹层请使用 `fullPage` 水印覆盖。
- `remove` 以事件形式提供（PC 端为 `onRemove` 属性）。
