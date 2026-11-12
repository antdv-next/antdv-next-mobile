---
title: SideBar
subtitle: 侧边导航
description: 垂直展示的导航栏，用于在不同的内容区域之间切换。
group:
  title: 导航
  order: 3
---

## 何时使用 {#when-to-use}

- 内容分类较多（如商品分类、设置分组），需要在左侧纵向排列入口、右侧展示对应内容。
- 分类数量超过一屏时，侧边导航可以独立滚动。

`SideBar` 是移动端专属组件，只负责导航，内容区域由使用者根据 `activeKey` 渲染。

## 代码演示 {#examples}

<demo src="./demo/basic.vue" full>基础用法</demo>
<demo src="./demo/badge.vue" full>徽标</demo>
<demo src="./demo/disabled.vue" full>禁用选项</demo>
<demo src="./demo/custom.vue" full>自定义样式</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 导航项 | [SideBarItem](#sidebaritem)[] | `[]` |
| activeKey(v-model) | 当前激活项的 `key` | `string \| number` | - |
| defaultActiveKey | 默认激活项的 `key` | `string \| number` | 第一项的 `key` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'item' \| 'title' \| 'badge', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'item' \| 'title' \| 'badge', CSSProperties>` | - |

### SideBarItem

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识 | `string \| number` | - |
| title | 标题 | `VueNode` | - |
| badge | 徽标内容，`true` 时显示红点 | `number \| string \| boolean` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| class | 导航项类名 | `string` | - |
| style | 导航项样式 | `CSSProperties` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 切换导航项时触发 | `(key: string \| number) => void` |
| update:activeKey | 切换导航项时触发，用于 `v-model:activeKey` | `(key: string \| number) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| title | 自定义标题，优先于 `item.title` | `{ item: SideBarItem, index: number, active: boolean }` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.SideBar` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-side-bar-width` | 宽度 | `104px` |
| `--am-side-bar-background` | 未激活项背景色 | `var(--am-color-bg-layout)` |
| `--am-side-bar-active-background` | 激活项背景色 | `var(--am-color-bg-container)` |
| `--am-side-bar-color` | 文字颜色 | `var(--am-color-text)` |
| `--am-side-bar-active-color` | 激活项文字与指示条颜色 | `var(--am-color-primary)` |
| `--am-side-bar-font-size` | 字号 | `var(--am-font-size)` |
| `--am-side-bar-item-padding` | 导航项内边距 | `14px var(--am-padding-sm)` |
| `--am-side-bar-item-border-radius` | 激活项相邻项的圆角 | `var(--am-border-radius)` |
| `--am-side-bar-indicator-width` | 指示条宽度 | `3px` |
| `--am-side-bar-indicator-height` | 指示条高度 | `16px` |
| `--am-side-bar-badge-color` | 徽标背景色 | `var(--am-color-error)` |
