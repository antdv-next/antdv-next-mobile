---
title: FloatButton
subtitle: 悬浮按钮
description: 悬浮于页面上方的按钮。
group:
  title: 通用
  order: 1
---

## 何时使用 {#when-to-use}

- 用于网站上的全局功能：客服、反馈、购物车入口等。
- 无论浏览到何处都可以看见的按钮。
- 页面较长时，使用 `BackTop` 提供回到顶部的快捷入口。

API 与 antdv-next 的 `FloatButton` 对齐，并新增了移动端常见的拖拽与磁吸贴边能力。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/type.vue">类型、形状与文字</demo>
<demo src="./demo/badge.vue">徽标数</demo>
<demo src="./demo/group.vue">浮动按钮组</demo>
<demo src="./demo/menu.vue">菜单模式</demo>
<demo src="./demo/draggable.vue">拖拽与磁吸</demo>
<demo src="./demo/back-top.vue">回到顶部</demo>

> 悬浮按钮默认使用 `position: fixed` 固定在屏幕右下角。为了把按钮限制在演示区域内，上面的示例都通过 `:style="{ position: 'absolute' }"` 把它放在了一个相对定位的容器中。

## API

### FloatButton 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| icon | 自定义图标，同名插槽优先 | `VueNode` | `<FileTextOutlined />` |
| content | 图标下方的文字，默认插槽优先 | `VueNode` | - |
| ~~description~~ | 请使用 `content` 代替 | `VueNode` | - |
| type | 按钮类型 | `'default' \| 'primary'` | `'default'` |
| shape | 按钮形状 | `'circle' \| 'square'` | `'circle'` |
| href | 点击跳转的地址，指定后按钮渲染为 `<a>` | `string` | - |
| target | 相当于 `<a>` 的 `target` 属性，`href` 存在时生效 | `string` | - |
| htmlType | 原生 `button` 的 `type` | `'button' \| 'submit' \| 'reset'` | `'button'` |
| badge | 带徽标的悬浮按钮 | `{ count?: number \| string, dot?: boolean, overflowCount?: number, showZero?: boolean, color?: string }` | - |
| ariaLabel | 无障碍标签 | `string` | - |
| draggable | 是否可拖拽 | `boolean` | `false` |
| axis | 可拖拽的方向 | `'x' \| 'y' \| 'xy'` | `'xy'` |
| magnetic | 松手后自动吸附到该方向上最近的边缘 | `'x' \| 'y'` | - |
| offset | 按钮左上角的位置（px）。相对于视口，绝对定位时相对于定位父元素。支持 `v-model:offset` | `{ x: number, y: number }` | - |
| gap | 拖拽时与边缘的最小间距（px） | `number` | `16` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'icon' \| 'content' \| 'badge', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'icon' \| 'content' \| 'badge', CSSProperties>` | - |

### FloatButton 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| click | 点击按钮时触发，拖拽结束不会触发 | `(event: MouseEvent) => void` |
| update:offset | 拖拽结束后位置变化 | `(offset: { x: number, y: number }) => void` |
| offsetChange | 拖拽结束（含磁吸）后触发 | `(offset: { x: number, y: number }) => void` |

### FloatButton 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 图标下方的文字，优先于 `content` 属性 |
| icon | 自定义图标，优先于 `icon` 属性 |

### FloatButton.Group 属性 {#group-props}

通过 `<am-float-button-group>` 使用。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| shape | 组内所有按钮的形状 | `'circle' \| 'square'` | `'circle'` |
| trigger | 触发方式，设置后为菜单模式 | `'click'` | - |
| open | 菜单是否展开，需配合 `trigger` 使用，支持 `v-model:open` | `boolean` | - |
| defaultOpen | 菜单默认是否展开 | `boolean` | `false` |
| placement | 菜单弹出的位置 | `'top' \| 'left' \| 'right' \| 'bottom'` | `'top'` |
| icon | 触发按钮的图标，同名插槽优先 | `VueNode` | `<FileTextOutlined />` |
| closeIcon | 展开后触发按钮的图标，同名插槽优先 | `VueNode` | `<CloseOutlined />` |
| content | 触发按钮的文字 | `VueNode` | - |
| type | 触发按钮的类型 | `'default' \| 'primary'` | `'default'` |
| badge | 触发按钮的徽标 | `FloatButtonBadgeProps` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'list' \| 'trigger', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'list' \| 'trigger', CSSProperties>` | - |

### FloatButton.Group 事件 {#group-events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| update:open | 展开状态变化 | `(open: boolean) => void` |
| openChange | 展开或关闭时的回调 | `(open: boolean) => void` |
| click | 点击触发按钮时的回调（仅菜单模式） | `(event: MouseEvent) => void` |

### FloatButton.Group 插槽 {#group-slots}

| 插槽 | 说明 |
| --- | --- |
| default | 组内的悬浮按钮 |
| icon | 触发按钮的图标 |
| closeIcon | 展开后触发按钮的图标 |

### FloatButton.BackTop 属性 {#back-top-props}

通过 `<am-back-top>` 使用。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visibilityHeight | 滚动高度达到此参数值才出现 | `number` | `400` |
| target | 设置需要监听其滚动事件的元素 | `() => HTMLElement \| Window` | `() => window` |
| duration | 回到顶部所需时间（ms）；开启「减弱动态效果」时不生效 | `number` | `450` |
| icon | 自定义图标，同名插槽优先 | `VueNode` | `<VerticalAlignTopOutlined />` |
| content | 图标下方的文字，默认插槽优先 | `VueNode` | - |
| type | 按钮类型 | `'default' \| 'primary'` | `'default'` |
| shape | 按钮形状 | `'circle' \| 'square'` | `'circle'` |
| badge | 徽标 | `FloatButtonBadgeProps` | - |
| ariaLabel | 无障碍标签 | `string` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | 同 FloatButton | - |
| styles | 语义化结构样式 | 同 FloatButton | - |

### FloatButton.BackTop 事件 {#back-top-events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| click | 点击按钮的回调函数 | `(event: MouseEvent) => void` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.FloatButton` 或直接覆盖 CSS 变量定制。变量声明在独立的悬浮按钮或按钮组的根节点上，组内的按钮继承按钮组的变量。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-float-button-size` | 按钮尺寸 | `48px` |
| `--am-float-button-inset-inline-end` | 距离屏幕右侧（RTL 下为左侧）的距离，会自动叠加安全区 | `24px` |
| `--am-float-button-inset-block-end` | 距离屏幕底部的距离，会自动叠加底部安全区 | `48px` |
| `--am-float-button-z-index` | 层级 | `99` |
| `--am-float-button-bg` | 默认类型的背景色 | `var(--am-color-bg-elevated)` |
| `--am-float-button-color` | 默认类型的文字颜色 | `var(--am-color-text)` |
| `--am-float-button-primary-bg` | 主要类型的背景色 | `var(--am-color-primary)` |
| `--am-float-button-primary-color` | 主要类型的文字颜色 | `var(--am-color-text-light-solid)` |
| `--am-float-button-icon-size` | 图标大小 | `20px` |
| `--am-float-button-content-font-size` | 文字字号 | `10px` |
| `--am-float-button-border-radius` | 方形按钮的圆角 | `var(--am-border-radius)` |
| `--am-float-button-shadow` | 阴影 | `var(--am-box-shadow)` |
| `--am-float-button-group-gap` | 组内按钮的间距 | `var(--am-margin-sm)` |

## 与 PC 端的差异 {#diff}

- 新增拖拽能力：`draggable`、`axis`、`magnetic`、`offset`（`v-model:offset`）、`gap`，以及 `offsetChange` 事件。需要拖拽任意内容时使用 [Draggable](/components/draggable)。
- 位置通过 `--am-float-button-inset-inline-end` / `--am-float-button-inset-block-end` 变量控制，并自动避开安全区。
- 不支持 `tooltip`（移动端没有悬停）；`FloatButton.Group` 的 `trigger` 仅支持 `'click'`，不支持 `'hover'`。
- `badge` 是内置的精简实现，仅支持 `count`、`dot`、`overflowCount`、`showZero`、`color`。
- `BackTop` 不支持 `showProgress`；它对应的标签为 `<am-back-top>`，同时也可通过 `FloatButton.BackTop` 访问。
- `classes` / `styles` 仅支持对象形式。
