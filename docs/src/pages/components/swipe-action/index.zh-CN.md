---
title: SwipeAction
subtitle: 滑动操作
description: 左右滑动列表项以露出隐藏的操作按钮。
group:
  title: 手势与其他
  order: 7
---

## 何时使用 {#when-to-use}

- 列表项上有删除、置顶、标为已读等次要操作，不希望占用界面空间时。
- 常与 [List](/components/list) 搭配，包裹每一个 `am-list-item`。

内容跟随手指滑动，超出按钮宽度后带有阻尼；松手时根据滑动距离与速度决定展开或收起。只响应横向手势，不影响页面的纵向滚动。

## 代码演示 {#examples}

<demo src="./demo/basic.vue" full>基础用法</demo>
<demo src="./demo/both.vue" full>两侧操作</demo>
<demo src="./demo/list.vue" full>在列表中使用</demo>
<demo src="./demo/manual.vue" full>手动控制与不自动收起</demo>
<demo src="./demo/custom.vue" full>自定义操作区域</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| leftActions | 左侧的操作按钮（向右滑动露出） | [SwipeActionItem](#swipeactionitem)`[]` | - |
| rightActions | 右侧的操作按钮（向左滑动露出） | [SwipeActionItem](#swipeactionitem)`[]` | - |
| closeOnAction | 点击操作按钮后是否自动收起 | `boolean` | `true` |
| closeOnTouchOutside | 触摸组件以外的区域时是否自动收起 | `boolean` | `true` |
| disabled | 是否禁用滑动 | `boolean` | `false` |
| stopPropagation | 是否阻止已处理的触摸事件冒泡（位于轮播、Tabs 等横向手势容器内时使用） | `boolean` | `false` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'content' \| 'actions' \| 'action', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'content' \| 'actions' \| 'action', CSSProperties>` | - |

### SwipeActionItem {#swipeactionitem}

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识 | `string \| number` | - |
| text | 按钮内容 | `VueNode` | - |
| color | 按钮颜色，预设值或任意 CSS 颜色 | `'primary' \| 'danger' \| 'warning' \| 'success' \| 'default' \| string` | `'default'` |
| onClick | 点击按钮时的回调 | `(event: MouseEvent) => void` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| action | 点击操作按钮时触发 | `(action: SwipeActionItem, event: MouseEvent) => void` |
| actionsReveal | 某一侧的操作按钮完全露出时触发 | `(side: 'left' \| 'right') => void` |
| close | 收起时触发 | `() => void` |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 内容 |
| left | 自定义左侧操作区域，替换 `leftActions` |
| right | 自定义右侧操作区域，替换 `rightActions` |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| show | 展开某一侧的操作按钮 | `(side?: 'left' \| 'right') => void` |
| close | 收起 | `() => void` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.SwipeAction` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-swipe-action-button-padding` | 按钮水平内边距 | `var(--am-padding)` |
| `--am-swipe-action-button-min-width` | 按钮最小宽度 | `64px` |
| `--am-swipe-action-button-font-size` | 按钮文字大小 | `var(--am-font-size-lg)` |
| `--am-swipe-action-button-color` | 按钮文字颜色 | `var(--am-color-text-light-solid)` |
| `--am-swipe-action-button-default-bg` | `default` 颜色按钮的背景色 | `var(--am-color-text-tertiary)` |
| `--am-swipe-action-duration` | 展开 / 收起动画时长 | `0.35s` |

## 常见问题 {#faq}

### 展开后点击内容区域没有触发内容的点击事件？

符合预期。操作按钮露出时，点击内容区域只会收起按钮，避免误触列表项的跳转；滑动结束后紧接着的那次点击同样会被忽略。

### 使用 `left` / `right` 插槽时如何在点击后收起？

`closeOnAction` 只对 `leftActions` / `rightActions` 生成的按钮生效。自定义内容请通过 ref 调用 `close()`。
