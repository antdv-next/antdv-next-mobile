---
title: Draggable
subtitle: 拖拽
description: 让任意内容可以在视口或容器内自由拖动，支持方向限制与边缘吸附。
group:
  title: 手势与其他
  order: 7
---

## 何时使用 {#when-to-use}

- 客服入口、红包挂件、悬浮播放器等需要用户自行挪开的悬浮内容。
- 只需要一个可拖动的悬浮按钮时，直接使用 [FloatButton](/components/float-button) 的 `draggable`，两者共用同一套拖拽逻辑。

Draggable 是移动端特有的组件，属性命名与 `FloatButton` 的拖拽属性保持一致。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/axis.vue">方向限制与磁吸</demo>
<demo src="./demo/control.vue">受控位置、重置与禁用</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| axis | 可拖拽的方向 | `'x' \| 'y' \| 'xy'` | `'xy'` |
| magnetic | 松手后自动吸附到该方向上最近的边缘 | `'x' \| 'y'` | - |
| offset | 元素左上角的位置（px）。相对于视口，绝对定位时相对于定位父元素。支持 `v-model:offset` | `{ x: number, y: number }` | - |
| gap | 与边缘的最小间距（px），可分别指定四个方向 | `number \| { top?: number, right?: number, bottom?: number, left?: number }` | `0` |
| disabled | 是否禁用拖拽 | `boolean` | `false` |
| zIndex | 层级 | `number` | `90` |
| getContainer | 挂载节点，默认渲染在当前位置 | `string \| HTMLElement \| (() => HTMLElement) \| false` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root', string>` | - |
| styles | 语义化结构样式 | `Record<'root', CSSProperties>` | - |

未设置 `offset` 且未拖动过时，元素停留在 CSS 指定的位置（`top` / `left` / `right` / `bottom`）。

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| click | 点击时触发，拖拽结束时不会触发 | `(event: MouseEvent) => void` |
| update:offset | 拖拽结束后位置变化 | `(offset: { x: number, y: number }) => void` |
| offsetChange | 拖拽结束（含磁吸）后触发 | `(offset: { x: number, y: number }) => void` |
| dragStart | 手指按下、开始拖拽时触发 | `() => void` |
| dragEnd | 拖拽结束时触发 | `(offset: { x: number, y: number }) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 可拖拽的内容 | `{ dragging: boolean }` |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| reset | 回到初始位置 | `() => void` |
| resize | 容器尺寸变化后重新约束位置（窗口尺寸变化会自动处理） | `() => void` |
| nativeElement | 根元素 | `HTMLElement` |

### useDraggable

组件内部使用的组合式函数同时对外导出，可以为自己的元素添加相同的拖拽能力，见 [组合式函数](/docs/composables#gesture)。

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Draggable` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-draggable-z-index` | 层级 | `90` |
| `--am-draggable-transition-duration` | 松手后吸附动画的时长 | `var(--am-motion-duration-mid)` |

## 与 PC 端的差异 {#diff}

- 移动端特有组件，antdv-next 没有对应组件。
- 同时支持触摸与鼠标拖拽，便于在桌面浏览器中调试。
