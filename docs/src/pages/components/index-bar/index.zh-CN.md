---
title: IndexBar
subtitle: 索引栏
description: 用于列表的索引分类显示和快速定位。
group:
  title: 导航
  order: 3
---

## 何时使用 {#when-to-use}

- 通讯录、城市选择等按字母（或其他索引）分组的长列表。
- 需要通过点击或拖动右侧索引快速跳转到对应分组。

`IndexBar` 是移动端专属组件，由 `IndexBar` 与 `IndexBar.Anchor`（`<am-index-bar-anchor>`）组成：把锚点放在每个分组的内容之前即可。

## 代码演示 {#examples}

<demo src="./demo/basic.vue" full>基础用法</demo>
<demo src="./demo/custom-index.vue" full>自定义索引列表</demo>
<demo src="./demo/anchor-slot.vue" full>自定义锚点内容</demo>
<demo src="./demo/scroll-to.vue" full>滚动到指定锚点</demo>
<demo src="./demo/highlight.vue" full>高亮颜色与事件</demo>

## API

### IndexBar 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| indexList | 右侧索引列表 | `(string \| number)[]` | 内部所有锚点的 `index`（按文档顺序） |
| sticky | 锚点是否吸顶 | `boolean` | `true` |
| stickyOffsetTop | 吸顶时与滚动容器顶部的距离，例如固定导航栏的高度 | `number` | `0` |
| zIndex | 吸顶锚点与索引栏的层级 | `number` | `10` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'sidebar' \| 'index' \| 'hint', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'sidebar' \| 'index' \| 'hint', CSSProperties>` | - |

### IndexBar 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| select | 点击或拖动到某个索引时触发 | `(index: string \| number) => void` |
| change | 滚动过程中当前激活的锚点变化时触发 | `(index: string \| number) => void` |

### IndexBar 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 锚点与列表内容 |

### IndexBar 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| scrollTo | 滚动到指定索引对应的锚点 | `(index: string \| number) => void` |

### IndexBar.Anchor 属性 {#anchor-props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| index | 索引值 | `string \| number` | - |
| rootClass | 根节点类名 | `string` | - |

| 插槽 | 说明 |
| --- | --- |
| default | 锚点内容，默认显示 `index` |

### 使用须知 {#notes}

- 组件会自动寻找最近的滚动容器（`overflow-y` 为 `auto` / `scroll` 的祖先元素，否则为 `window`）并监听其滚动。
- 吸顶基于 CSS `position: sticky` 实现，锚点需要作为 `IndexBar` 的直接子节点（或其父元素足够高）才能持续吸顶。
- 右侧索引栏相对滚动容器垂直居中，不使用 `position: fixed`，因此可以放在弹出层或局部滚动区域中。

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.IndexBar` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-index-bar-highlight-color` | 激活索引与吸顶锚点的高亮颜色 | `var(--am-color-primary)` |
| `--am-index-bar-index-size` | 索引项尺寸 | `16px` |
| `--am-index-bar-index-font-size` | 索引项字号 | `10px` |
| `--am-index-bar-index-color` | 索引项文字颜色 | `var(--am-color-text-secondary)` |
| `--am-index-bar-anchor-height` | 锚点高度 | `32px` |
| `--am-index-bar-anchor-padding-inline` | 锚点水平内边距 | `var(--am-padding)` |
| `--am-index-bar-anchor-font-size` | 锚点字号 | `var(--am-font-size)` |
| `--am-index-bar-anchor-color` | 锚点文字颜色 | `var(--am-color-text-secondary)` |
| `--am-index-bar-anchor-background` | 锚点背景色 | `var(--am-color-bg-layout)` |
| `--am-index-bar-hint-size` | 拖动时中央提示的尺寸 | `48px` |
| `--am-index-bar-z-index` | 吸顶锚点的层级 | `10` |
