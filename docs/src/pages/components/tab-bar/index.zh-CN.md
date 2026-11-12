---
title: TabBar
subtitle: 标签栏
description: 位于页面底部，用于在应用的一级页面之间切换。
group:
  title: 导航
  order: 3
---

## 何时使用 {#when-to-use}

- 应用有 2 ~ 5 个同等重要的一级页面，需要随时互相切换。
- 需要在入口上提示未读数量或新内容。

`TabBar` 是移动端专属组件。页面内的内容分组切换请使用 [Tabs](/components/tabs)。

## 代码演示 {#examples}

<demo src="./demo/basic.vue" full>基础用法</demo>
<demo src="./demo/badge.vue" full>徽标</demo>
<demo src="./demo/only.vue" full>仅图标 / 仅文字</demo>
<demo src="./demo/slot.vue" full>自定义渲染</demo>
<demo src="./demo/controlled.vue" full>受控切换页面</demo>
<demo src="./demo/fixed.vue" full>固定在底部</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 标签项 | [TabBarItem](#tabbaritem)[] | `[]` |
| activeKey(v-model) | 当前激活项的 `key` | `string \| number` | - |
| defaultActiveKey | 默认激活项的 `key` | `string \| number` | 第一项的 `key` |
| fixed | 是否固定在视口底部 | `boolean` | `false` |
| placeholder | 固定时是否在文档流中保留等高占位 | `boolean` | `false` |
| safeArea | 是否适配底部安全区 | `boolean` | `true` |
| bordered | 是否显示顶部细线 | `boolean` | `true` |
| zIndex | 固定时的层级 | `number` | `100` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'content' \| 'item' \| 'icon' \| 'title' \| 'badge', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'content' \| 'item' \| 'icon' \| 'title' \| 'badge', CSSProperties>` | - |

### TabBarItem

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 唯一标识 | `string \| number` | - |
| title | 标题 | `VueNode` | - |
| icon | 图标，可以是接收激活状态的函数 | `VueNode \| ((active: boolean) => VueNode)` | - |
| badge | 徽标内容，`true` 时显示红点 | `number \| string \| boolean` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| class | 标签项类名 | `string` | - |
| style | 标签项样式 | `CSSProperties` | - |

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| change | 切换标签时触发 | `(key: string \| number) => void` |
| update:activeKey | 切换标签时触发，用于 `v-model:activeKey` | `(key: string \| number) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| icon | 自定义图标，优先于 `item.icon` | `{ item: TabBarItem, index: number, active: boolean }` |
| title | 自定义标题，优先于 `item.title` | `{ item: TabBarItem, index: number, active: boolean }` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.TabBar` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-tab-bar-height` | 标签栏高度（不含安全区） | `50px` |
| `--am-tab-bar-background` | 背景色 | `var(--am-color-bg-container)` |
| `--am-tab-bar-color` | 未激活颜色 | `var(--am-color-text-secondary)` |
| `--am-tab-bar-active-color` | 激活颜色 | `var(--am-color-primary)` |
| `--am-tab-bar-icon-size` | 图标尺寸 | `24px` |
| `--am-tab-bar-font-size` | 标题字号 | `10px` |
| `--am-tab-bar-badge-color` | 徽标背景色 | `var(--am-color-error)` |
| `--am-tab-bar-z-index` | 固定时的层级 | `100` |
