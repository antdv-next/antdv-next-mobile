---
title: InfiniteScroll
subtitle: 无限滚动
description: 列表滚动到底部（或顶部）时自动加载更多数据。
group:
  title: 手势与其他
  order: 7
---

## 何时使用 {#when-to-use}

- 信息流、订单列表等数据量大、需要分页加载的长列表。
- 聊天记录等向上滚动加载历史数据的场景（`direction="up"`）。

组件监听最近的滚动容器（`window` 或 `overflow: auto / scroll` 的祖先元素）：当列表末端距离容器可视区域不足 `threshold` 时，将 `loading` 置为 `true` 并触发 `load` 事件；数据返回后由业务将 `loading` 置回 `false`，全部加载完成后设置 `hasMore` 为 `false`（或 `finished` 为 `true`）。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/error.vue">加载失败与重试</demo>
<demo src="./demo/slots.vue">自定义提示</demo>
<demo src="./demo/up.vue">向上加载</demo>
<demo src="./demo/pull-to-refresh.vue">配合下拉刷新</demo>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| loading | 是否处于加载中，加载期间不会再触发 `load`，支持 `v-model:loading` | `boolean` | `false` |
| hasMore | 是否还有更多数据 | `boolean` | `true` |
| finished | 是否已全部加载完成，与 `hasMore` 相反，二者任一满足即停止加载 | `boolean` | `false` |
| error | 是否加载失败，失败后点击提示会重新触发 `load`，支持 `v-model:error` | `boolean` | `false` |
| threshold | 列表末端距离滚动容器可视区域多少像素时触发 `load` | `number \| string` | `250` |
| direction | 加载方向，`up` 为滚动到顶部时加载 | `'down' \| 'up'` | `'down'` |
| disabled | 是否禁用加载 | `boolean` | `false` |
| immediateCheck | 是否在挂载后立即检查一次位置 | `boolean` | `true` |
| loadingText | 加载中的提示，插槽 `loading` 优先 | `VueNode` | `'加载中...'` |
| finishedText | 加载完成的提示，插槽 `finished` 优先 | `VueNode` | `'没有更多了'` |
| errorText | 加载失败的提示，插槽 `error` 优先 | `VueNode` | `'加载失败 重新加载'` |
| rootClass | 根节点类名 | `string` | - |
| classes | 语义化结构类名 | `Record<'root' \| 'indicator', string>` | - |
| styles | 语义化结构样式 | `Record<'root' \| 'indicator', CSSProperties>` | - |

默认文案来自语言包 `locale.InfiniteScroll`。

### 事件 {#events}

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| load | 滚动到阈值内时触发，此时 `loading` 已被置为 `true` | `() => void` |

### 插槽 {#slots}

| 插槽 | 说明 |
| --- | --- |
| default | 列表内容 |
| loading | 自定义加载中的提示 |
| finished | 自定义加载完成的提示 |
| error | 自定义加载失败的提示 |

### 方法 {#methods}

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| check | 检查当前滚动位置，满足条件时触发 `load` | `() => void` |

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.InfiniteScroll` 或直接覆盖 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-infinite-scroll-color` | 提示文字颜色 | `var(--am-color-text-description)` |
| `--am-infinite-scroll-font-size` | 提示文字大小 | `var(--am-font-size)` |
| `--am-infinite-scroll-indicator-height` | 提示区域最小高度 | `48px` |
| `--am-infinite-scroll-retry-color` | 「重新加载」文字颜色 | `var(--am-color-primary)` |

## 常见问题 {#faq}

### 为什么 `load` 只触发了一次？

`load` 触发时组件会将 `loading` 置为 `true`，期间不再检查。请使用 `v-model:loading` 并在数据返回后将其置为 `false`；此时若内容仍未填满容器，组件会继续触发 `load` 直到填满或没有更多数据。

### 为什么一进入页面就连续触发 `load`？

请确认滚动容器正确：组件向上查找第一个 `overflow-y` 为 `auto` / `scroll` 的祖先元素，找不到时使用 `window`。如果祖先元素没有限制高度，内容永远「在可视区域内」，就会不断加载。

### 在 Tabs 等隐藏的面板中会加载吗？

不会。根节点为 `display: none` 时不触发；面板重新显示后可调用 `check()` 检查一次。
