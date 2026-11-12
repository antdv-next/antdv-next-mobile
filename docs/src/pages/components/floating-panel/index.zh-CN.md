---
title: FloatingPanel
subtitle: 浮动面板
description: 浮动在页面底部、可上下拖动并吸附到锚点高度的面板。
group:
  title: 手势与其他
  order: 7
---

## 何时使用 {#when-to-use}

- 地图、导航等页面中，在不离开主内容的前提下展示可展开的详情，如地点列表、路线信息。
- 需要让用户在「露出一点 / 展开一半 / 完全展开」之间自由拖动的底部面板。

与 [Popup](/components/popup) 不同，浮动面板没有遮罩，常驻在页面上，不会阻塞对背后内容的操作。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/anchors.vue">自定义锚点与受控高度</demo>
<demo src="./demo/header-only.vue">仅头部可拖动</demo>
<demo src="./demo/methods.vue">通过方法设置高度</demo>

> 为了在文档页中演示，示例都设置了 `:fixed="false"`，让面板定位在带有 `position: relative; overflow: hidden` 的盒子里。实际使用时保持默认的 `fixed` 即可固定在视口底部。

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| height | 面板当前露出的高度（px），支持 `v-model:height` | `number` | `anchors[0]` |
| anchors | 可吸附的高度（px）列表 | `number[]` | `[100, 视口高度 * 0.6]` |
| contentDraggable | 拖动内容区域是否可以移动面板；面板完全展开后内容区域变为可滚动，滚动回顶部继续下拉则收起面板 | `boolean` | `true` |
| duration | 吸附动画时长（毫秒） | `number` | `300` |
| safeArea | 是否为底部安全区留出内边距 | `boolean` | `true` |
| lockScroll | 是否锁定页面滚动。默认仅在拖动过程中锁定 | `boolean` | `false` |
| fixed | 是否固定在视口底部。为 `false` 时相对最近的定位祖先元素绝对定位，默认锚点也按该元素的高度计算 | `boolean` | `true` |
| zIndex | 层级 | `number` | `999` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'header' \| 'content', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'header' \| 'content', CSSProperties>` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| heightChange | 高度变化时触发：拖动过程中 `animating` 为 `false`，松手吸附或通过方法设置时为 `true` | `(height: number, info: { animating: boolean }) => void` |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 面板内容 |
| header | 自定义头部，替换默认的拖动条 |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| setHeight | 设置面板高度，`immediate` 为 `true` 时不使用动画 | `(height: number, options?: { immediate?: boolean }) => void` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.FloatingPanel` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-floating-panel-z-index` | 层级，`zIndex` 属性优先 | `999` |
| `--am-floating-panel-bg` | 背景色 | `var(--am-color-bg-elevated)` |
| `--am-floating-panel-border-radius` | 顶部圆角 | `var(--am-border-radius-xl)` |
| `--am-floating-panel-header-height` | 头部高度 | `30px` |
| `--am-floating-panel-bar-width` | 拖动条宽度 | `32px` |
| `--am-floating-panel-bar-height` | 拖动条高度 | `4px` |
| `--am-floating-panel-bar-color` | 拖动条颜色 | `var(--am-color-fill)` |
| `--am-floating-panel-shadow` | 阴影 | `var(--am-box-shadow)` |

## 常见问题 {#faq}

### 面板的总高度是多少？

面板元素的高度等于最大的锚点，通过位移只露出 `height` 的部分；拖动超出首尾锚点时带有阻尼并在松手后回弹。因此内容区域的可滚动高度按最大锚点计算。

### 快速滑动时为什么没有吸附到最近的锚点？

松手时的速度超过阈值会被视为「甩动」，面板会移动到该方向上的下一个锚点，而不是距离最近的锚点。
