---
title: NoticeBar
subtitle: 通告栏
description: 展示一组通告信息，文字超出时自动滚动播放。
group:
  title: 反馈
  order: 6
---

## 何时使用 {#when-to-use}

- 适用于当前页面内信息的通知，是一种较醒目的页面内通知方式。
- 内容超出一行时自动以跑马灯的形式滚动，也可以通过 `wrap` 换行完整展示。

`NoticeBar` 是移动端专属组件，Antdv Next（PC）中没有对应组件；带标题、描述的静态提示请使用 [Alert](/components/alert)。

## 代码演示 {#examples}

<demo src="./demo/basic.vue" full>基础用法</demo>
<demo src="./demo/color.vue" full>语义色</demo>
<demo src="./demo/scroll.vue" full>滚动播放</demo>
<demo src="./demo/wrap.vue" full>多行展示</demo>
<demo src="./demo/closable.vue" full>可关闭与额外操作</demo>
<demo src="./demo/icon.vue" full>自定义图标</demo>
<demo src="./demo/shape.vue">形状与边框</demo>
<demo src="./demo/style-class.vue">自定义样式</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 通告内容，默认插槽优先 | `VueNode` | - |
| color | 通告栏的语义色，`default` 为中性灰 | `'default' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'warning'` |
| icon | 左侧图标，传入 `null` / `false` 隐藏 | `VueNode` | `<SoundOutlined />` |
| extra | 右侧额外区域（位于关闭按钮之前） | `VueNode` | - |
| closable | 是否显示关闭按钮 | `boolean` | `false` |
| closeIcon | 自定义关闭图标 | `VueNode` | `<CloseOutlined />` |
| wrap | 是否多行展示（不滚动） | `boolean` | `false` |
| scrollable | 是否滚动播放：默认内容超出时才滚动，`true` 强制滚动，`false` 禁止滚动（超出显示省略号） | `boolean` | - |
| delay | 开始滚动前的延迟，单位毫秒 | `number` | `2000` |
| speed | 滚动速度，单位 px/s | `number` | `50` |
| shape | 形状：`rectangular` 直角通栏、`neutral` 圆角、`rounded` 胶囊 | `'neutral' \| 'rounded' \| 'rectangular'` | `'rectangular'` |
| bordered | 边框：`true` 四周，`'block'` 仅上下，`false` 无边框 | `boolean \| 'block'` | `'block'` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'icon' \| 'content' \| 'extra' \| 'close', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'icon' \| 'content' \| 'extra' \| 'close', CSSProperties>` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| click | 点击通告栏时触发（点击关闭按钮不会触发） | `(event: MouseEvent) => void` |
| close | 点击关闭按钮时触发，随后通告栏被移除 | `(event: MouseEvent) => void` |
| replay | 每一轮滚动结束时触发 | `() => void` |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 通告内容 |
| icon | 自定义左侧图标 |
| extra | 自定义右侧额外区域 |
| closeIcon | 自定义关闭图标 |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| reset | 重新测量宽度并从头开始滚动（容器尺寸被外部改变后调用） | `() => void` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.NoticeBar` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-notice-bar-height` | 最小高度 | `var(--am-control-height)` |
| `--am-notice-bar-font-size` | 文字大小 | `var(--am-font-size)` |
| `--am-notice-bar-icon-size` | 图标大小 | `16px` |
| `--am-notice-bar-padding-inline` | 水平内边距 | `var(--am-padding-sm)` |
| `--am-notice-bar-gap` | 图标、内容、操作区的间距 | `var(--am-margin-xs)` |
| `--am-notice-bar-border-radius` | `neutral` 形状的圆角 | `var(--am-border-radius)` |
| `--am-notice-bar-color` | 文字与图标颜色（随 `color` 变化） | `var(--am-color-warning-active)` |
| `--am-notice-bar-bg` | 背景色（随 `color` 变化） | `var(--am-color-warning-bg)` |
| `--am-notice-bar-border-color` | 边框色（随 `color` 变化） | `var(--am-color-warning-border)` |

## 与 PC 端的差异 {#diff}

- 移动端专属组件，PC 端没有对应实现；语义色命名与 `Alert` 的 `type` 保持一致。
- 支持 RTL：`direction="rtl"` 时文字向右滚动。
- 系统开启「减弱动态效果」时不滚动，超出部分显示省略号。
