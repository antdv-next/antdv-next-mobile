---
title: Divider
subtitle: 分割线
description: 区隔内容的分割线。
group:
  title: 布局
  order: 2
---

## 何时使用 {#when-to-use}

- 对不同章节的文本段落进行分割。
- 对行内文字 / 链接进行分割，例如列表的操作列。

API 与 Antdv Next 的 `Divider` 对齐：`orientation` 控制方向，`titlePlacement` 控制标题位置，`variant` 控制线型。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/with-text.vue">带文字的分割线</demo>
<demo src="./demo/variant.vue">线型</demo>
<demo src="./demo/vertical.vue">垂直分割线</demo>
<demo src="./demo/size.vue">间距大小</demo>
<demo src="./demo/style-class.vue">语义化类名与组件变量</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| orientation | 分割线方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| vertical | 是否垂直，等价于 `orientation="vertical"` | `boolean` | `false` |
| type | `orientation` 的别名，为兼容 Antdv Next 保留 | `'horizontal' \| 'vertical'` | - |
| titlePlacement | 标题的位置（`left` / `right` 等价于 `start` / `end`） | `'start' \| 'center' \| 'end'` | `'center'` |
| variant | 线型 | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` |
| dashed | 是否虚线，等价于 `variant="dashed"` | `boolean` | `false` |
| plain | 标题是否显示为普通正文样式 | `boolean` | `true` |
| size | 水平分割线的上下间距 | `'small' \| 'middle' \| 'large'` | `'large'` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'rail' \| 'content', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'rail' \| 'content', CSSProperties>` | - |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 分割线中的标题，仅水平分割线生效 |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Divider` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-divider-color` | 线条颜色 | `var(--am-color-split)` |
| `--am-divider-line-width` | 线条粗细 | `var(--am-line-width)` |
| `--am-divider-margin` | 水平分割线的上下间距 | `var(--am-margin)` |
| `--am-divider-vertical-margin` | 垂直分割线的左右间距 | `var(--am-margin-xs)` |
| `--am-divider-text-color` | 标题颜色 | `var(--am-color-text)` |
| `--am-divider-text-font-size` | 标题字号 | `var(--am-font-size-lg)` |
| `--am-divider-text-padding` | 标题与线条的间距 | `var(--am-padding-sm)` |
| `--am-divider-placement-rail-width` | 标题靠边时短线的宽度 | `5%` |

## 与 PC 端的差异 {#diff}

- 默认上下间距为 `16px`（PC 为 `24px`），`middle` / `small` 分别为 `12px` / `8px`，更适合移动端的信息密度。
- 不支持已废弃的 `orientationMargin`，请使用 `--am-divider-placement-rail-width` 或 `styles.content`。
- `classes` / `styles` 仅支持对象形式，不支持函数形式。
