---
title: Popover
subtitle: 气泡卡片
description: 点击元素，弹出气泡式的卡片浮层或菜单。
group:
  title: 反馈
  order: 6
---

## 何时使用 {#when-to-use}

- 当目标元素有进一步的描述和相关操作时，可以收纳到卡片中，由用户点击后显示。
- 需要一个贴近触发元素的轻量操作菜单时，使用 `actions` 菜单模式（如导航栏右上角的「更多」菜单）。

API 与 antdv-next 的 `Popover` 对齐，并针对触屏做了适配：点击触发、触摸空白处关闭、自动翻转与偏移以保持在屏幕内。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/placement.vue">十二个方向</demo>
<demo src="./demo/mode.vue">深色模式与自定义颜色</demo>
<demo src="./demo/menu.vue">菜单模式</demo>
<demo src="./demo/control.vue">受控与手动触发</demo>
<demo src="./demo/arrow.vue">箭头与自动调整</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 是否显示，支持 `v-model:open` | `boolean` | - |
| defaultOpen | 默认是否显示 | `boolean` | `false` |
| title | 卡片标题，同名插槽优先 | `VueNode` | - |
| content | 卡片内容，同名插槽优先 | `VueNode` | - |
| placement | 气泡位置 | `'top' \| 'topLeft' \| 'topRight' \| 'bottom' \| 'bottomLeft' \| 'bottomRight' \| 'left' \| 'leftTop' \| 'leftBottom' \| 'right' \| 'rightTop' \| 'rightBottom'` | `'top'` |
| trigger | 触发方式。`manual` 时只能通过 `open` 或实例方法控制 | `'click' \| 'manual'` | `'click'` |
| arrow | 是否显示箭头 | `boolean` | `true` |
| mode | 颜色模式 | `'light' \| 'dark'` | `'light'` |
| color | 自定义背景颜色 | `string` | - |
| autoAdjustOverflow | 空间不足时自动翻转到对侧，并沿边缘偏移以保持在屏幕内 | `boolean` | `true` |
| closeOnClickAway | 触摸气泡以外的区域时是否关闭 | `boolean` | `true` |
| destroyOnHidden | 关闭后销毁内容 | `boolean` | `false` |
| getPopupContainer | 浮层渲染的父节点，默认渲染到 `body` | `(triggerNode: HTMLElement) => HTMLElement` | `() => document.body` |
| zIndex | 层级 | `number` | 自动递增 |
| actions | 菜单模式：渲染一组操作项，代替 `title` / `content` | [PopoverAction](#popoveraction)[] | - |
| closeOnAction | 点击操作项后是否关闭 | `boolean` | `true` |
| rootClass | 浮层根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'container' \| 'arrow' \| 'title' \| 'content', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'container' \| 'arrow' \| 'title' \| 'content', CSSProperties>` | - |

`class`、`style` 等透传属性作用于包裹触发元素的 `.am-popover-trigger` 节点。

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| update:open | 显示状态变化 | `(open: boolean) => void` |
| openChange | 显隐变化时回调 | `(open: boolean) => void` |
| action | 点击菜单操作项时触发，禁用项不会触发 | `(action: PopoverAction, index: number) => void` |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 触发气泡的元素 |
| title | 卡片标题，优先于 `title` 属性 |
| content | 卡片内容，优先于 `content` 属性 |

### 方法 {#methods}

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| show | 显示气泡 | `() => void` |
| hide | 隐藏气泡 | `() => void` |
| updatePosition | 重新计算位置（触发元素移动或内容尺寸变化后调用） | `() => void` |

### PopoverAction

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识 | `string \| number` | - |
| text | 文字 | `VueNode` | - |
| icon | 图标 | `VueNode` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| danger | 危险操作，文字为红色 | `boolean` | `false` |
| onClick | 点击回调 | `(action: PopoverAction, index: number) => void` | - |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Popover` 或直接覆盖 CSS 变量（作用于 `rootClass` 所在的浮层根节点）定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-popover-z-index` | 层级（未自动分配时） | `var(--am-z-index-popup-base)` |
| `--am-popover-bg` | 背景色 | `var(--am-color-bg-elevated)` |
| `--am-popover-color` | 文字颜色 | `var(--am-color-text)` |
| `--am-popover-title-color` | 标题颜色 | `var(--am-color-text-heading)` |
| `--am-popover-font-size` | 字号 | `var(--am-font-size)` |
| `--am-popover-padding` | 内边距 | `var(--am-padding-xs) var(--am-padding-sm)` |
| `--am-popover-border-radius` | 圆角 | `var(--am-border-radius)` |
| `--am-popover-shadow` | 阴影 | `var(--am-box-shadow)` |
| `--am-popover-max-width` | 最大宽度 | `min(280px, calc(100vw - 16px))` |
| `--am-popover-arrow-size` | 箭头大小 | `8px` |
| `--am-popover-menu-item-height` | 菜单项最小高度 | `44px` |
| `--am-popover-menu-min-width` | 菜单最小宽度 | `120px` |
| `--am-popover-split-color` | 菜单项分割线颜色 | `var(--am-color-split)` |

## 与 PC 端的差异 {#diff}

- `trigger` 仅支持 `'click'`（默认）与 `'manual'`，不支持 `hover`、`focus`、`contextMenu`；触摸浮层以外的区域自动关闭。
- 触发元素会被包裹在一个 `inline-block` 的 `.am-popover-trigger` 节点中（PC 端直接克隆子节点）。
- `arrow` 仅支持布尔值，不支持 `{ pointAtCenter }`。
- 新增 `mode`（深色模式）、`closeOnClickAway`、`actions` / `closeOnAction`（菜单模式）与 `action` 事件，以及 `show`、`hide`、`updatePosition` 实例方法。
- 不支持 `mouseEnterDelay`、`mouseLeaveDelay`、`align`、`fresh`、`overlayClassName` 等 Tooltip 继承属性；`classes` / `styles` 仅支持对象形式。
