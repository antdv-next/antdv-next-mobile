---
title: Popup
subtitle: 弹出层
description: 从屏幕边缘或中间弹出的浮层容器，是所有弹出类组件的基础。
group:
  title: 反馈
  order: 6
---

## 何时使用 {#when-to-use}

- 需要一个可以从上、下、左、右滑出或在中间弹出的浮层，承载任意自定义内容。
- 需要自己实现一个弹出类组件：`Drawer`、`Modal`、`ActionSheet`、`Picker` 等都基于 Popup 实现，自动处理遮罩、滚动锁定、层级堆叠、`ConfigProvider` 主题透传与安全区。

如果需要带标题、关闭按钮和页脚的面板，请直接使用 [Drawer](/components/drawer)。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/placement.vue">弹出位置</demo>
<demo src="./demo/round.vue">圆角与关闭图标</demo>
<demo src="./demo/mask.vue">遮罩</demo>
<demo src="./demo/container.vue">指定挂载节点</demo>
<demo src="./demo/style-class.vue">语义化类名与组件变量</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 是否显示，支持 `v-model:open` | `boolean` | `false` |
| placement | 弹出位置 | `'top' \| 'bottom' \| 'left' \| 'right' \| 'center'` | `'bottom'` |
| mask | 是否显示遮罩 | `boolean` | `true` |
| maskClosable | 点击遮罩是否关闭 | `boolean` | `true` |
| closable | 是否显示右上角关闭图标 | `boolean` | `false` |
| closeIcon | 自定义关闭图标，同名插槽优先 | `VueNode` | `<CloseOutlined />` |
| round | 朝向页面一侧是否使用圆角 | `boolean` | `false` |
| safeArea | 底部弹出时是否预留底部安全区 | `boolean` | `true` |
| lockScroll | 打开时是否锁定页面滚动 | `boolean` | `true` |
| keyboard | 是否支持按 ESC 关闭 | `boolean` | `true` |
| destroyOnHidden | 关闭后销毁内容 | `boolean` | `false` |
| forceRender | 首次打开前预渲染内容 | `boolean` | `false` |
| getContainer | 挂载节点，`false` 为挂载在当前位置 | `string \| HTMLElement \| (() => HTMLElement) \| false` | `document.body` |
| zIndex | 层级，默认自动递增，保证后打开的在最上层 | `number` | - |
| width | 面板宽度 | `number \| string` | - |
| height | 面板高度 | `number \| string` | - |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'mask' \| 'body', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'mask' \| 'body', CSSProperties>` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| update:open | 显示状态变化 | `(open: boolean) => void` |
| close | 用户触发关闭（点击遮罩、关闭图标、ESC）时触发 | `(event?: Event) => void` |
| maskClick | 点击遮罩时触发 | `(event: MouseEvent) => void` |
| afterOpenChange | 打开 / 关闭动画结束后触发 | `(open: boolean) => void` |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 弹出层内容 |
| closeIcon | 自定义关闭图标，优先于 `closeIcon` 属性 |

### 方法 {#methods}

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| nativeElement | 面板 DOM 节点 | `HTMLElement` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Popup` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-popup-z-index` | 基础层级（未指定 `zIndex` 且未自动分配时） | `var(--am-z-index-popup-base)` |
| `--am-popup-bg` | 面板背景色 | `var(--am-color-bg-elevated)` |
| `--am-popup-border-radius` | 圆角大小 | `var(--am-border-radius-xl)` |
| `--am-popup-close-size` | 关闭图标大小 | `18px` |

## 与 PC 端的差异 {#diff}

- PC 端没有独立的 `Popup` 组件，它是移动端所有弹出类组件（`Drawer`、`Modal`、`ActionSheet` 等）的基础容器。
- 属性命名与 PC 端的 `Drawer` / `Modal` 保持一致：`open`、`placement`、`mask`、`maskClosable`、`closable`、`destroyOnHidden`、`forceRender`、`getContainer`、`zIndex`、`afterOpenChange`。
