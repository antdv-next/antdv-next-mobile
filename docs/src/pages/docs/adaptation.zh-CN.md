---
title: 设计稿适配
order: 3.5
group:
  title: 指南
  order: 1
---

组件库按 375 宽的设计稿绘制，所有长度都以「单位」表示：`1 单位 = var(--am-unit)`，默认是 `1px`。样式表里的 `40px` 在构建时会被编译成 `calc(40 * var(--am-unit))`，所以只需要改这一个变量，整个组件库就会跟随你的适配方案缩放，不需要任何构建配置。

## 选择一种方案 {#presets}

| 你的项目 | `--am-unit` | 说明 |
| --- | --- | --- |
| 固定像素（默认） | `1px` | 不缩放，无需任何设置 |
| 按视口等比缩放 | `calc(100vw / 375)` | 375 稿和 750 稿都用这个值 |
| 等比缩放并限制最大宽度 | `calc(min(100vw, 540px) / 375)` | 平板、桌面浏览器上不再继续放大 |
| rem 方案（根字号 = 视口宽度 / 10） | `calc(1rem / 37.5)` | 跟随 `amfe-flexible` 一类方案的根字号 |
| `<meta name="viewport" content="width=750">` | `2px` | 页面本身就是 750 宽 |

设计稿是 375 还是 750 只影响你自己的业务代码怎么写，组件库只需要知道「1 单位有多长」。以 750 稿为例：设计稿上按钮高 80，业务代码经过 `px → vw` 转换后是 `80 / 750 * 100vw`；组件库的按钮是 40 单位，即 `40 * 100vw / 375`，两者相等。

## 设置方式 {#usage}

写在 `:root` 上，对整个页面生效：

```css
:root {
  --am-unit: calc(100vw / 375);
}
```

或者用 `applyTheme`，可以在运行时切换：

```ts
import { theme } from '@antdv-next/mobile'

theme.applyTheme({ token: { unit: 'calc(100vw / 375)' } })
```

只想让页面的一部分缩放时，使用 `ConfigProvider`，其中的弹出层也会跟随：

```vue
<am-config-provider :theme="{ token: { unit: 'calc(100vw / 375)' } }">
  <App />
</am-config-provider>
```

`unit` 传数字时按 `px` 处理，`unit: 2` 等同于 `--am-unit: 2px`。

> 请通过 `:root`、`applyTheme` 或 `ConfigProvider` 设置。直接在某个普通元素上写 `--am-unit` 只会影响样式，JS 中的尺寸计算（滚轮、虚拟列表）量不到它。

## 按自己的设计稿写数字 {#design-width}

`--am-unit` 决定组件库本身有多大。如果你的设计稿不是 375 宽，还可以用 `designWidth` 告诉组件库：**你传进来的数字是按哪个宽度的设计稿写的**。

```ts
theme.applyTheme({
  token: {
    unit: 'calc(100vw / 375)',
    designWidth: 750,
    // 以下数字都按 750 稿理解
    borderRadius: 16, // 等于默认的 8
  },
})
```

```vue
<!-- 750 稿上量出来的 88，等于组件库的 44 -->
<am-picker-view :item-height="88" />
<am-avatar :size="96" />
<am-space :size="24" />
```

受 `designWidth` 影响的只有你传入的数字：组件的数字型尺寸属性，以及 `theme.token`、`theme.components` 里的数字。组件库自己的默认值不变，所以不传属性时外观与 375 稿一致。

它对应的 CSS 变量是 `--am-design-unit`（默认等于 `--am-unit`），`designWidth: 750` 会输出 `--am-design-unit: calc(var(--am-unit) * 375 / 750)`。

## 哪些值会缩放 {#rules}

- 样式表中的长度是单位，跟随 `--am-unit`。
- `theme.token` 与 `theme.components` 里的数字、组件的数字型尺寸属性（`itemHeight`、`size`、`gap`、`offsetTop` 等）是你设计稿上的长度，跟随 `--am-design-unit`；没有设置 `designWidth` 时两者相同。
- 不超过 `1px` 的值（描边、发丝线）和不小于 `999px` 的值（胶囊圆角）保持原样。
- 字符串原样输出，需要固定像素时写 `'20px'`。
- 手势判定距离、滚动位置、`FloatingPanel` 的 `anchors` 以及事件回调里的数值是真实像素。
- 等比缩放后，小于 375 的屏幕上输入框字号会低于 `16px`，iOS Safari 聚焦时会放大页面；可以用 `calc(max(100vw, 375px) / 375)` 避免缩小。

## 在 JS 中换算 {#use-unit}

`useUnit()` 返回当前作用域内 1 单位对应的真实像素，随视口变化响应式更新：

```ts
import { useUnit } from '@antdv-next/mobile'

const { unit, designUnit, toPx, toUnits, designToPx } = useUnit()

toPx(44) // 44 单位 -> 像素，375 屏为 44，750 屏等比缩放时为 88
toUnits(88) // 像素 -> 单位
designToPx(88) // 你设计稿上的 88 -> 像素
```

## 业务代码的转换 {#your-code}

业务代码按自己的设计稿写 `px`，再用构建工具转换即可。组件库的样式里已经没有需要转换的 `px`，不用再为它单独配置设计稿宽度。

PostCSS（`postcss-px-to-viewport`）：

```js
// postcss.config.js
export default {
  plugins: {
    'postcss-px-to-viewport': { viewportWidth: 750, minPixelValue: 1 },
  },
}
```

Lightning CSS（Vite `css.transformer: 'lightningcss'`）：

```ts
// vite.config.ts
export default defineConfig({
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      visitor: {
        Length(length) {
          // 750 稿：1px = 100vw / 750
          if (length.unit === 'px' && Math.abs(length.value) > 1)
            return { unit: 'vw', value: length.value / 7.5 }
        },
      },
    },
  },
})
```
