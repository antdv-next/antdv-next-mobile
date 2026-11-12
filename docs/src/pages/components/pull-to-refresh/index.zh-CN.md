---
title: PullToRefresh
subtitle: 下拉刷新
description: 在列表顶部下拉以刷新内容。
group:
  title: 手势与其他
  order: 7
---

## 何时使用 {#when-to-use}

- 列表、信息流等需要用户主动获取最新内容的页面。
- 通常与 [InfiniteScroll](/components/infinite-scroll) 搭配，实现「下拉刷新 + 上拉加载」。

使用 `v-model:refreshing` 控制刷新状态：下拉超过阈值松手后组件将其置为 `true` 并触发 `refresh` 事件，数据返回后由业务置回 `false`。只有最近的滚动容器处于顶部时才会触发下拉，横向手势（轮播、滑动操作）不受影响。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/text.vue">自定义文案</demo>
<demo src="./demo/slots.vue">自定义下拉区域</demo>
<demo src="./demo/scroll.vue">在滚动容器中使用</demo>
<demo src="./demo/disabled.vue">禁用</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| refreshing | 是否处于刷新中，支持 `v-model:refreshing` | `boolean` | `false` |
| pullingText | 下拉过程的提示，同名插槽 `pulling` 优先 | `VueNode \| ((info: { distance: number }) => VueNode)` | `'下拉刷新'` |
| canReleaseText | 释放即可刷新的提示，插槽 `canRelease` 优先 | `VueNode \| ((info: { distance: number }) => VueNode)` | `'释放立即刷新'` |
| refreshingText | 刷新中的提示，插槽 `refreshing` 优先 | `VueNode \| ((info: { distance: number }) => VueNode)` | `'加载中...'` |
| completeText | 刷新完成的提示，插槽 `complete` 优先；设为 `false` 时不展示完成状态 | `VueNode \| ((info: { distance: number }) => VueNode)` | `'刷新成功'` |
| completeDelay | 完成提示的停留时长（毫秒），`0` 表示不展示 | `number` | `500` |
| headHeight | 顶部提示区域的高度 | `number \| string` | `50` |
| threshold | 触发刷新的下拉距离，默认与 `headHeight` 相同 | `number \| string` | - |
| duration | 回弹动画时长（毫秒） | `number` | `300` |
| disabled | 是否禁用下拉 | `boolean` | `false` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'head' \| 'content', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'head' \| 'content', CSSProperties>` | - |

默认文案来自语言包 `locale.PullToRefresh`。

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| refresh | 下拉超过阈值并松手时触发 | `() => void` |
| change | 状态或下拉距离变化时触发 | `(info: { status: 'normal' \| 'pulling' \| 'canRelease' \| 'refreshing' \| 'complete', distance: number }) => void` |

### 插槽 {#slots}

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| default | 内容 | - |
| pulling | 下拉过程中顶部的内容 | `{ distance: number }` |
| canRelease | 释放即可刷新时顶部的内容 | `{ distance: number }` |
| refreshing | 刷新中顶部的内容 | `{ distance: number }` |
| complete | 刷新完成时顶部的内容 | `{ distance: number }` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.PullToRefresh` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-pull-to-refresh-head-color` | 提示文字颜色 | `var(--am-color-text-description)` |
| `--am-pull-to-refresh-head-font-size` | 提示文字大小 | `var(--am-font-size)` |
| `--am-pull-to-refresh-icon-size` | 加载图标大小 | `16px` |

## 常见问题 {#faq}

### 内容较少时，下方空白区域无法下拉？

下拉手势绑定在组件自身上，请让组件撑满可视区域，例如给它或 `classes.content` 设置 `min-height: 100%` / `min-height: 100vh`。

### 为什么没有 `onRefresh` 返回 Promise 的用法？

本库约定不使用 `on*` 属性，状态统一通过 `v-model:refreshing` 管理：在 `refresh` 事件中请求数据，完成后将 `refreshing` 置为 `false` 即可。
