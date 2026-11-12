---
title: Signature
subtitle: 手写签名
description: 在画布上用手指书写签名，并导出为图片。
group:
  title: 数据录入
  order: 4
---

## 何时使用 {#when-to-use}

- 需要用户手写签名确认的场景，例如电子合同、签收、授权确认。
- 需要把手写内容导出为 png / jpg 图片上传到服务端。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/pen.vue">笔触颜色与宽度</demo>
<demo src="./demo/footer.vue">自定义操作按钮</demo>
<demo src="./demo/jpg.vue">导出 jpg 与背景色</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| penColor | 笔触颜色，默认取 `--am-signature-pen-color` 的计算值，跟随主题（暗色模式） | `string` | 主题文字色 |
| lineWidth | 笔触宽度，单位 px | `number` | `3` |
| backgroundColor | 导出图片的背景色，不影响画布的显示（显示背景请用 `--am-signature-bg`） | `string` | png 透明 / jpg `#fff` |
| type | 导出图片的格式 | `'png' \| 'jpg'` | `'png'` |
| quality | 导出 jpg 的质量，取值 0 ~ 1 | `number` | `0.92` |
| disabled | 是否禁用，禁用后无法书写，内置按钮不可点击 | `boolean` | `false` |
| placeholder | 画布为空时的提示，同名插槽优先 | `VueNode` | - |
| tips | 浏览器不支持 Canvas 时的提示，同名插槽优先 | `VueNode` | `当前浏览器不支持 Canvas，无法使用签名` |
| clearText | 清空按钮文字，同名插槽优先 | `VueNode` | `清空` |
| confirmText | 确认按钮文字，同名插槽优先 | `VueNode` | `确认` |
| footer | 自定义底部内容，设为 `false` / `null` 隐藏内置按钮，同名插槽优先 | `VueNode` | 清空 + 确认按钮 |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'content' \| 'canvas' \| 'placeholder' \| 'footer', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'content' \| 'canvas' \| 'placeholder' \| 'footer', CSSProperties>` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| start | 开始书写一笔时触发 | `(event: TouchEvent \| MouseEvent) => void` |
| signing | 书写过程中触发 | `(event: TouchEvent \| MouseEvent) => void` |
| end | 一笔书写结束时触发 | `(event: TouchEvent \| MouseEvent) => void` |
| confirm | 点击确认按钮或调用 `confirm()` 时触发，画布为空时 `image` 为 `''` | `(result: { image: string, canvas: HTMLCanvasElement }) => void` |
| clear | 点击清空按钮或调用 `clear()` 时触发 | `() => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| placeholder | 画布为空时的提示 | - |
| tips | 浏览器不支持 Canvas 时的提示 | - |
| clearText | 清空按钮内容 | - |
| confirmText | 确认按钮内容 | - |
| footer | 替换底部操作区 | `{ clear: () => void, confirm: () => void, empty: boolean, disabled: boolean }` |

### 方法 {#methods}

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| clear() | 清空画布并触发 `clear` 事件 | `() => void` |
| confirm() | 导出图片、触发 `confirm` 事件并返回结果 | `() => { image: string, canvas: HTMLCanvasElement }` |
| toDataURL() | 仅导出图片的 data URL（不触发事件），画布为空时返回 `''` | `() => string` |
| isEmpty() | 画布是否为空 | `() => boolean` |
| resize() | 按当前尺寸重新适配画布并重绘已有笔画，容器由隐藏变为显示或尺寸变化后可手动调用 | `() => void` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Signature` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-signature-height` | 画布高度 | `200px` |
| `--am-signature-bg` | 画布背景色（仅显示，不会导出） | `var(--am-color-bg-container)` |
| `--am-signature-border-width` | 边框宽度 | `var(--am-line-width)` |
| `--am-signature-border-style` | 边框样式 | `dashed` |
| `--am-signature-border-color` | 边框颜色 | `var(--am-color-border)` |
| `--am-signature-border-radius` | 圆角 | `var(--am-border-radius-lg)` |
| `--am-signature-pen-color` | 默认笔触颜色 | `var(--am-color-text)` |
| `--am-signature-placeholder-color` | 占位提示颜色 | `var(--am-color-text-placeholder)` |
| `--am-signature-placeholder-font-size` | 占位提示字号 | `var(--am-font-size-lg)` |
| `--am-signature-footer-gap` | 按钮间距 | `var(--am-margin-xs)` |
| `--am-signature-footer-margin` | 底部操作区与画布的间距 | `var(--am-margin-sm)` |

## 与 PC 端的差异 {#diff}

- Antdv Next（PC）没有对应组件，`Signature` 为移动端独有组件，能力对标 Vant 的 `Signature`。
- 属性命名遵循 Antdv Next 的习惯：`footer`（同 `Modal`，`false` 隐藏）、`rootClass`、`classes`、`styles`，渲染类属性均有同名插槽。
- 画布按 `devicePixelRatio` 放大以保证高清屏下的清晰度，尺寸变化时自动适配并保留已有笔画。
- 除触摸外同时支持鼠标书写，方便在桌面浏览器中调试。
