---
title: Flex
subtitle: 弹性布局
description: 用于对齐的弹性布局容器。
group:
  title: 布局
  order: 2
---

## 何时使用 {#when-to-use}

- 需要设置元素之间的间距、对齐方式和换行方式时。
- 与 `Space` 的区别：`Space` 会为每个子元素包裹一层用于行内对齐；`Flex` 不添加任何包裹元素，适合页面级的块级布局。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础布局</demo>
<demo src="./demo/align.vue">对齐方式</demo>
<demo src="./demo/gap.vue">间距</demo>
<demo src="./demo/wrap.vue">自动换行</demo>
<demo src="./demo/combination.vue">组合使用</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| vertical | 主轴是否为垂直方向，即 `flex-direction: column` | `boolean` | `false` |
| orientation | 主轴方向，`vertical` 优先 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| wrap | 是否换行，`true` 等价于 `wrap`，也可传入任意 [flex-wrap](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-wrap) 值 | `boolean \| CSSProperties['flexWrap']` | `false` |
| justify | 主轴对齐方式，同 [justify-content](https://developer.mozilla.org/zh-CN/docs/Web/CSS/justify-content) | `CSSProperties['justifyContent']` | `'normal'` |
| align | 交叉轴对齐方式，同 [align-items](https://developer.mozilla.org/zh-CN/docs/Web/CSS/align-items) | `CSSProperties['alignItems']` | `'normal'` |
| flex | 容器自身的 [flex](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex) 简写属性 | `CSSProperties['flex']` | - |
| gap | 子元素间距，预设值 `small`(8px) / `middle`(16px) / `large`(24px)，数字单位为 px，也可以是任意 CSS 长度 | `'small' \| 'middle' \| 'large' \| number \| string` | - |
| component | 自定义根元素 | `string \| Component` | `'div'` |
| rootClass | 根节点类名 | `string` | - |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 子元素 |

## 主题变量 {#design-token}

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-flex-gap-small` | `gap="small"` 的间距 | `var(--am-padding-xs)` |
| `--am-flex-gap-middle` | `gap="middle"` 的间距 | `var(--am-padding)` |
| `--am-flex-gap-large` | `gap="large"` 的间距 | `var(--am-padding-lg)` |

## 与 PC 端的差异 {#diff}

- `justify` / `align` / `flex` 与自定义 `gap` 通过行内样式输出（PC 为工具类名），用户传入的 `style` 优先级更高。
- 额外支持 `orientation="vertical"`，与 `Space`、`Divider` 的写法保持一致。
