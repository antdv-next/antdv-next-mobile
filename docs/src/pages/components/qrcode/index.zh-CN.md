---
title: QRCode
subtitle: 二维码
description: 能够将文本转换生成二维码的组件，支持自定义配色和 Logo 配置。
group:
  title: 数据展示
  order: 5
---

## 何时使用 {#when-to-use}

- 当需要将文本、链接转换成为二维码时使用，例如分享页面、收款码、扫码登录。
- 二维码由内置的编码器生成（版本 1-40、纠错等级 L / M / Q / H），不依赖任何第三方库。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基本使用</demo>
<demo src="./demo/icon.vue">带 Icon 的例子</demo>
<demo src="./demo/status.vue">不同的状态</demo>
<demo src="./demo/status-render.vue">自定义状态渲染器</demo>
<demo src="./demo/color.vue">自定义颜色与渲染类型</demo>
<demo src="./demo/size.vue">自定义尺寸</demo>
<demo src="./demo/error-level.vue">纠错比例</demo>
<demo src="./demo/download.vue">下载二维码</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 扫描后的文本，数组会被编码为多个分段；为空时不渲染 | `string \| string[]` | - |
| type | 渲染类型 | `'canvas' \| 'svg'` | `'canvas'` |
| icon | 二维码中图片的地址（目前只支持图片地址） | `string` | - |
| iconSize | 二维码中图片的大小（px） | `number \| { width: number, height: number }` | `40` |
| size | 二维码大小（含内边距与边框）：数字（px）或任意 CSS 长度，如 `'100%'`、`'60vw'` | `number \| string` | `160` |
| color | 二维码颜色 | `string` | 跟随主题 `--am-qrcode-color` |
| bgColor | 二维码背景颜色 | `string` | 跟随主题 `--am-qrcode-bg` |
| marginSize | 留白（安静区）大小（单位为模块数），`0` 表示无留白 | `number` | `0` |
| bordered | 是否有边框（关闭后同时去掉内边距与圆角） | `boolean` | `true` |
| errorLevel | 二维码纠错等级 | `'L' \| 'M' \| 'Q' \| 'H'` | `'M'` |
| boostLevel | 在不增大二维码版本的前提下自动提升纠错等级，结果的纠错等级可能高于指定值 | `boolean` | `true` |
| status | 二维码状态 | `'active' \| 'expired' \| 'loading' \| 'scanned'` | `'active'` |
| statusRender | 自定义状态渲染器，同名插槽优先 | `(info: QRCodeStatusRenderInfo) => VueNode` | - |
| title | 二维码的无障碍标题 | `string` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'cover', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'cover', CSSProperties>` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| refresh | 点击过期状态下的刷新按钮时触发；只有监听了该事件才会显示刷新按钮 | `() => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| statusRender | 自定义状态渲染器，优先于 `statusRender` 属性 | `QRCodeStatusRenderInfo` |

```ts
interface QRCodeStatusRenderInfo {
  status: 'expired' | 'loading' | 'scanned'
  locale: { expired: string, refresh: string, scanned: string }
  /** 仅在监听了 `refresh` 事件时存在 */
  onRefresh?: () => void
}
```

### 方法 {#methods}

通过 `ref` 获取组件实例后调用。

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| nativeElement | 根节点 | `HTMLDivElement` |
| toDataURL | 获取二维码图片的 Data URL，用于保存或分享。`canvas` 等同于 `canvas.toDataURL(type, quality)`（默认 PNG）；`svg` 返回 `image/svg+xml` 图片 | `(type?: string, quality?: number) => string \| undefined` |

### 编码器 {#encoder}

内置的编码器也可以单独使用，例如在 `<canvas>` 之外自行绘制。

```ts
import { encodeQRCode } from '@antdv-next/mobile'

const { version, size, errorLevel, mask, modules } = encodeQRCode('https://www.antdv-next.com', {
  errorLevel: 'M', // 最低纠错等级
  boostLevel: true,
})
// modules[y][x] === true 表示深色模块
```

## 主题变量 {#design-token}

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-qrcode-color` | 二维码颜色 | `var(--am-color-text)` |
| `--am-qrcode-bg` | 背景颜色 | `var(--am-color-bg-container)` |
| `--am-qrcode-padding` | 内边距 | `var(--am-padding-sm)` |
| `--am-qrcode-border-radius` | 圆角 | `var(--am-border-radius-lg)` |
| `--am-qrcode-border-color` | 边框颜色 | `var(--am-color-border-secondary)` |
| `--am-qrcode-cover-bg` | 状态遮罩的背景 | `color-mix(in srgb, var(--am-color-bg-container) 96%, transparent)` |
| `--am-qrcode-cover-color` | 状态遮罩的文字颜色 | `var(--am-color-text)` |
| `--am-qrcode-font-size` | 状态文字字号 | `var(--am-font-size)` |

## 与 PC 端的差异 {#diff}

- 不依赖 `@v-c/qrcode`：二维码由组件内置的编码器生成，并通过 `encodeQRCode` 导出。
- `size` 除数字外还支持 CSS 长度（如 `100%`），二维码始终保持正方形并按实际宽度与设备像素比重绘。
- `color`、`bgColor` 的默认值来自主题变量（`--am-qrcode-color` / `--am-qrcode-bg`），暗色模式下会变为「浅色码 + 深色底」。部分扫码器不识别反色二维码，需要最佳兼容性（或需要导出图片）时请显式指定 `color="#000"`、`bg-color="#fff"`。
- 新增实例方法 `toDataURL()`，无需再查询内部的 `canvas` / `svg` 节点即可保存或分享图片；导出的图片包含解析后的前景色与背景色。
- `iconSize` 以二维码内容区的实际像素为基准；`canvas` 模式下图片加载成功后才会挖空中心模块，图片加载失败不会留下空洞。
- 状态遮罩的加载指示器使用内置的 Spinner，刷新按钮为触控友好的链接按钮。
- `classes` / `styles` 只支持对象形式，不支持函数形式；不接入 ConfigProvider 的组件级 `class` / `style` 配置。
- 去掉了基于 Popover 的悬浮示例等 PC 专属用法。

## FAQ

### 关于二维码纠错等级 {#faq-error-correction-level}

纠错等级也叫纠错率，指二维码被遮挡后仍能正常扫描的最大面积比例：`L` 约 `7%`、`M` 约 `15%`、`Q` 约 `25%`、`H` 约 `30%`。带 `icon` 时不建议使用 `L`。内容较短时，开启 `boostLevel` 会在不增大二维码的前提下自动使用更高的等级。

### 二维码无法扫描？ {#faq-cannot-scan}

内容过长会导致模块过于密集，可以调大 `size`，或者使用短链接缩短内容；暗色模式下请参考上文显式指定黑白配色。超出版本 40 容量的内容无法编码，组件不会渲染并在控制台输出错误。
