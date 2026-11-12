---
title: Mask
subtitle: 背景蒙层
description: 覆盖在页面之上的半透明蒙层，用于强调特定内容并阻断其他操作。
group:
  title: 反馈
  order: 6
---

## 何时使用 {#when-to-use}

- 需要用一层蒙层盖住页面，引导用户关注蒙层之上的内容（如新手引导、自定义弹窗、加载态）。
- 常规的弹出场景请优先使用 [Popup](/components/popup)、[Modal](/components/modal) 等已经内置蒙层的组件。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/color.vue">蒙层颜色</demo>
<demo src="./demo/content.vue">自定义内容</demo>
<demo src="./demo/container.vue">局部蒙层</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 是否显示，支持 `v-model:open` | `boolean` | `false` |
| closable | 点击蒙层自身时是否关闭（触发 `update:open`） | `boolean` | `false` |
| color | 蒙层颜色，`'default'` 使用主题遮罩色，`'white'` 为白色半透明，也可传任意 CSS 颜色 | `'default' \| 'white' \| string` | `'default'` |
| lockScroll | 显示时是否锁定页面滚动 | `boolean` | `true` |
| destroyOnHidden | 隐藏后销毁内容 | `boolean` | `false` |
| getContainer | 挂载节点，默认渲染在当前位置 | `string \| HTMLElement \| (() => HTMLElement) \| false` | `false` |
| zIndex | 层级 | `number` | `1000` |
| rootClass | 根节点类名 | `string` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| update:open | 显示状态变化（`closable` 时点击蒙层触发） | `(open: boolean) => void` |
| click | 点击蒙层自身时触发，点击内容不会触发 | `(event: MouseEvent) => void` |
| afterOpenChange | 显示 / 隐藏动画结束后触发 | `(open: boolean) => void` |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 蒙层之上的内容 |

## 主题变量 {#design-token}

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-mask-z-index` | 层级 | `var(--am-z-index-popup-base)` |
| `--am-color-bg-mask` | 蒙层颜色（全局 token） | `rgb(0 0 0 / 45%)` |

## 与 PC 端的差异 {#diff}

- PC 端没有独立的 `Mask` 组件，蒙层内置于 `Modal`、`Drawer` 等组件中。移动端将其独立出来，方便实现自定义浮层。
