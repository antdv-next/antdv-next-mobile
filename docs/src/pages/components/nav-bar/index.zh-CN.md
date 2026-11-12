---
title: NavBar
subtitle: 导航栏
description: 位于页面顶部，提供标题、返回与页面级操作。
group:
  title: 导航
  order: 3
---

## 何时使用 {#when-to-use}

- 需要展示当前页面的标题，并提供返回上一级的入口。
- 需要在页面顶部放置搜索、更多等页面级操作。

`NavBar` 是移动端专属组件，对应 PC 端 `PageHeader` 的使用场景。

## 代码演示 {#examples}

<demo src="./demo/basic.vue" full>基础用法</demo>
<demo src="./demo/back.vue" full>返回区域</demo>
<demo src="./demo/sub-title.vue" full>副标题</demo>
<demo src="./demo/extra.vue" full>左右两侧内容</demo>
<demo src="./demo/fixed.vue" full>固定在顶部</demo>
<demo src="./demo/style-class.vue" full>自定义样式</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题，同默认插槽 | `VueNode` | - |
| subTitle | 副标题 | `VueNode` | - |
| back | 返回箭头旁的文字，设为 `null` 或 `false` 时隐藏整个返回区域 | `VueNode` | - |
| backIcon | 自定义返回箭头，设为 `null` 或 `false` 时只隐藏箭头 | `VueNode` | `<LeftOutlined />` |
| left | 左侧内容，渲染在返回区域之后 | `VueNode` | - |
| right | 右侧内容 | `VueNode` | - |
| fixed | 是否固定在视口顶部 | `boolean` | `false` |
| placeholder | 固定时是否在文档流中保留等高占位 | `boolean` | `false` |
| safeArea | 是否适配顶部安全区（状态栏、刘海） | `boolean` | `false` |
| bordered | 是否显示底部细线 | `boolean` | `true` |
| zIndex | 固定时的层级 | `number` | `100` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'content' \| 'left' \| 'back' \| 'title' \| 'subTitle' \| 'right', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'content' \| 'left' \| 'back' \| 'title' \| 'subTitle' \| 'right', CSSProperties>` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| back | 点击返回区域时触发 | `(event: MouseEvent) => void` |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 标题，优先于 `title` 插槽与属性 |
| title | 标题 |
| subTitle | 副标题 |
| back | 返回箭头旁的文字 |
| backIcon | 自定义返回箭头 |
| left | 左侧内容 |
| right | 右侧内容 |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.NavBar` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-nav-bar-height` | 导航栏高度（不含安全区） | `46px` |
| `--am-nav-bar-background` | 背景色 | `var(--am-color-bg-container)` |
| `--am-nav-bar-color` | 文字与图标颜色 | `var(--am-color-text)` |
| `--am-nav-bar-title-font-size` | 标题字号 | `var(--am-font-size-lg)` |
| `--am-nav-bar-title-font-weight` | 标题字重 | `var(--am-font-weight-strong)` |
| `--am-nav-bar-sub-title-font-size` | 副标题字号 | `var(--am-font-size-sm)` |
| `--am-nav-bar-sub-title-color` | 副标题颜色 | `var(--am-color-text-tertiary)` |
| `--am-nav-bar-icon-size` | 返回箭头尺寸 | `20px` |
| `--am-nav-bar-padding-inline` | 水平内边距 | `var(--am-padding-sm)` |
| `--am-nav-bar-z-index` | 固定时的层级 | `100` |
