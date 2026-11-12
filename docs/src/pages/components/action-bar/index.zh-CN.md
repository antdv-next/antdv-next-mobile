---
title: ActionBar
subtitle: 底部动作栏
description: 位于页面底部，左侧是图标动作，右侧是一个或多个主要按钮。
group:
  title: 导航
  order: 3
---

## 何时使用 {#when-to-use}

- 商品详情、文章详情等页面，需要把「客服 / 店铺 / 购物车」等次要入口和「加入购物车 / 立即购买」等主要操作固定在底部。
- 购物车、订单确认等页面，需要在底部展示合计信息并提交（使用 `prefix`）。

`ActionBar` 是移动端专属组件。一级页面之间的切换请使用 [TabBar](/components/tab-bar)。

动作栏默认 `fixed`，固定在视口底部。为了不遮挡其他示例，本页除「固定在底部」外的示例都设置了 `:fixed="false"`。

## 代码演示 {#examples}

<demo src="./demo/basic.vue" full>基础用法</demo>
<demo src="./demo/badge.vue" full>徽标与禁用</demo>
<demo src="./demo/button.vue" full>按钮类型</demo>
<demo src="./demo/prefix.vue" full>提交订单栏</demo>
<demo src="./demo/fixed.vue" full>固定在底部</demo>

## API

### ActionBar 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fixed | 是否固定在视口底部 | `boolean` | `true` |
| placeholder | 固定时是否在文档流中保留等高占位 | `boolean` | `false` |
| safeArea | 是否适配底部安全区 | `boolean` | `true` |
| bordered | 是否显示顶部细线 | `boolean` | `true` |
| zIndex | 固定时的层级 | `number` | `100` |
| prefix | 动作前的自由内容，占满剩余宽度 | `VueNode` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'content' \| 'prefix', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'content' \| 'prefix', CSSProperties>` | - |

### ActionBar 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | `ActionBarIcon` / `ActionBarButton` 或任意内容 |
| prefix | 动作前的自由内容，优先于 `prefix` 属性 |

### ActionBarIcon 属性 {#icon-props}

也可以通过 `ActionBar.Icon` 使用。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| icon | 图标 | `VueNode` | - |
| text | 文字 | `VueNode` | - |
| badge | 徽标内容，`true` 时显示红点 | `number \| string \| boolean` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'icon' \| 'text' \| 'badge', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'icon' \| 'text' \| 'badge', CSSProperties>` | - |

### ActionBarIcon 事件 {#icon-events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| click | 点击时触发，禁用时不触发 | `(event: MouseEvent) => void` |

### ActionBarIcon 插槽 {#icon-slots}

| 插槽 | 说明 |
| --- | --- |
| icon | 自定义图标，优先于 `icon` 属性 |
| text | 自定义文字，优先于默认插槽和 `text` 属性 |
| default | 文字，等同于 `text` 插槽 |

### ActionBarButton 属性 {#button-props}

也可以通过 `ActionBar.Button` 使用。基于 [Button](/components/button#props) 渲染，下列属性的含义与 Button 一致。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型，`color` + `variant` 的语法糖 | `'default' \| 'primary' \| 'dashed' \| 'link' \| 'text'` | `'primary'` |
| color | 按钮颜色 | `'default' \| 'primary' \| 'danger' \| 'success' \| 'warning'` | - |
| variant | 按钮变体 | `'outlined' \| 'dashed' \| 'solid' \| 'filled' \| 'text' \| 'link'` | - |
| danger | 危险按钮 | `boolean` | `false` |
| ghost | 幽灵按钮 | `boolean` | `false` |
| icon | 图标 | `VueNode` | - |
| iconPlacement | 图标位置 | `'start' \| 'end'` | `'start'` |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 加载状态 | `boolean \| { delay?: number, icon?: VueNode }` | `false` |
| href | 跳转地址，设置后渲染为 `a` | `string` | - |
| target | 相当于 `a` 的 `target`，`href` 存在时生效 | `string` | - |
| htmlType | 原生 `button` 的 `type` | `'submit' \| 'button' \| 'reset'` | `'button'` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'icon' \| 'content', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'icon' \| 'content', CSSProperties>` | - |

### ActionBarButton 事件 {#button-events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| click | 点击时触发，禁用或加载中不触发 | `(event: MouseEvent) => void` |

### ActionBarButton 插槽 {#button-slots}

| 插槽 | 说明 |
| --- | --- |
| default | 按钮内容 |
| icon | 自定义图标，优先于 `icon` 属性 |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.ActionBar` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-action-bar-height` | 动作栏高度（不含安全区） | `50px` |
| `--am-action-bar-background` | 背景色 | `var(--am-color-bg-container)` |
| `--am-action-bar-padding-inline` | 左右内边距 | `var(--am-padding-xs)` |
| `--am-action-bar-z-index` | 固定时的层级 | `100` |
| `--am-action-bar-icon-width` | 图标动作的最小宽度 | `48px` |
| `--am-action-bar-icon-size` | 图标尺寸 | `20px` |
| `--am-action-bar-icon-color` | 图标颜色 | `var(--am-color-text)` |
| `--am-action-bar-icon-font-size` | 图标动作的文字字号 | `10px` |
| `--am-action-bar-icon-text-color` | 图标动作的文字颜色 | `var(--am-color-text-secondary)` |
| `--am-action-bar-badge-color` | 徽标背景色 | `var(--am-color-error)` |
| `--am-action-bar-button-height` | 按钮高度 | `var(--am-control-height)` |
| `--am-action-bar-button-font-size` | 按钮字号 | `var(--am-font-size)` |
| `--am-action-bar-button-gap` | 图标动作与按钮之间的间距 | `var(--am-padding-xs)` |

## 与 PC 端的差异 {#diff}

- antdv-next 没有对应组件，`ActionBar` 是移动端专属组件。
- `ActionBarButton` 复用 [Button](/components/button)，`type` / `color` / `variant` / `danger` / `loading` 等属性与 PC 端 Button 保持一致；`size`、`shape`、`block` 由动作栏接管，不再开放。
