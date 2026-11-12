---
title: Notification
subtitle: 通知提醒框
description: 全局展示通知提醒信息。
group:
  title: 反馈
  order: 6
---

## 何时使用 {#when-to-use}

在屏幕顶部（或底部）以卡片横幅的形式显示通知提醒信息。经常用于以下情况：

- 较为复杂的通知内容，包含标题与描述。
- 带有交互的通知，给出用户下一步的行动点。
- 系统主动推送。

API 与 antdv-next 的 `notification` 对齐。移动端样式为通栏的卡片横幅，自动避开安全区，支持滑动关闭。只需要一句简短的反馈时，请使用 [Message](/components/message) 或 [Toast](/components/toast)。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/type.vue">带图标的通知</demo>
<demo src="./demo/duration.vue">自动关闭的延时</demo>
<demo src="./demo/actions.vue">自定义操作按钮</demo>
<demo src="./demo/update.vue">更新通知内容</demo>
<demo src="./demo/placement.vue">位置</demo>
<demo src="./demo/stack.vue">堆叠</demo>
<demo src="./demo/hooks.vue">使用 hooks 获得上下文</demo>

## API

### 静态方法 {#static-methods}

- `notification.success(config)`
- `notification.error(config)`
- `notification.info(config)`
- `notification.warning(config)`
- `notification.open(config)`
- `notification.destroy(key?: Key)`
- `notification.config(options)`
- `notification.useNotification(config)`

### NotificationArgsProps {#args-props}

`config` 参数如下：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 通知提醒标题 | `VueNode` | - |
| description | 通知提醒内容 | `VueNode` | - |
| actions | 自定义按钮组，显示在内容下方 | `VueNode` | - |
| key | 当前通知的唯一标志，相同 `key` 的通知会原地更新并重新计时 | `string \| number` | - |
| duration | 自动关闭的延时，单位秒。设为 `0` 或 `false` 时不自动关闭 | `number \| false` | `4.5` |
| showProgress | 显示自动关闭的进度条 | `boolean` | `false` |
| pauseOnHover | 手指按住通知（或鼠标悬停）时是否暂停计时 | `boolean` | `true` |
| icon | 自定义图标 | `VueNode` | - |
| type | 通知类型 | `'success' \| 'info' \| 'warning' \| 'error'` | - |
| placement | 弹出位置。`topLeft` / `topRight` 等同于 `top`，`bottomLeft` / `bottomRight` 等同于 `bottom` | `NotificationPlacement` | `'top'` |
| closable | 是否显示关闭按钮，也可以传入配置对象 | `boolean \| NotificationClosableType` | `true` |
| closeIcon | 自定义关闭图标，设置为 `null` 或 `false` 时隐藏关闭按钮 | `VueNode` | - |
| class | 自定义 CSS class | `string` | - |
| style | 自定义内联样式 | `CSSProperties` | - |
| classes | 语义化结构的 class | `NotificationSemanticClassNames` | - |
| styles | 语义化结构的内联样式 | `NotificationSemanticStyles` | - |
| props | 透传至通知节点的属性，如 `data-*`、`aria-*` | `Record<string, any>` | - |
| role | 供屏幕阅读器识别的通知内容语义 | `'alert' \| 'status'` | `'alert'` |
| onClick | 点击通知时触发的回调函数 | `(event: MouseEvent) => void` | - |
| onClose | 通知关闭（计时结束、点击关闭按钮或滑动关闭）时触发 | `() => void` | - |

语义化结构 `classes` / `styles` 支持的键：`root`、`icon`、`section`、`title`、`description`、`actions`、`close`、`progress`。

### NotificationClosableType {#closabletype}

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| closeIcon | 自定义关闭图标 | `VueNode` | - |
| disabled | 是否禁用关闭按钮 | `boolean` | `false` |
| onClose | 通知关闭时触发 | `() => void` | - |

### 全局配置 {#global-config}

`notification.config(options)`

```ts
notification.config({
  placement: 'bottom',
  bottom: 50,
  duration: 3,
  maxCount: 5,
})
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| top | 从顶部弹出时距离顶部的位置（会自动叠加顶部安全区） | `number \| string` | `8` |
| bottom | 从底部弹出时距离底部的位置（会自动叠加底部安全区） | `number \| string` | `8` |
| placement | 默认弹出位置 | `NotificationPlacement` | `'top'` |
| duration | 默认自动关闭延时，单位秒 | `number \| false` | `4.5` |
| maxCount | 最大显示数，超过限制时，最早的通知会被自动关闭 | `number` | - |
| stack | 堆叠模式，同一侧超过阈值时折叠成一叠，点击展开 | `boolean \| { threshold?: number }` | `{ threshold: 3 }` |
| showProgress | 显示自动关闭的进度条 | `boolean` | `false` |
| pauseOnHover | 手指按住通知时是否暂停计时 | `boolean` | `true` |
| closable | 是否显示关闭按钮 | `boolean \| NotificationClosableType` | `true` |
| closeIcon | 自定义关闭图标，设置为 `null` 或 `false` 时隐藏关闭按钮 | `VueNode` | - |
| classes | 语义化结构的 class | `NotificationSemanticClassNames` | - |
| styles | 语义化结构的内联样式 | `NotificationSemanticStyles` | - |
| getContainer | 配置渲染节点的输出位置 | `() => HTMLElement` | `() => document.body` |
| appContext | 应用上下文，使内容中可以使用全局注册的组件 | `AppContext` | - |

### notification.useNotification() {#use-notification}

静态方法渲染在独立的应用中，主题与语言跟随 `ConfigProvider.config()` 的全局配置，无法读取调用处的 `ConfigProvider` 上下文。需要上下文时请使用 `notification.useNotification()`：

```vue
<script setup lang="ts">
import { notification } from '@antdv-next/mobile'

const [api, ContextHolder] = notification.useNotification()
</script>

<template>
  <ContextHolder />
  <am-button @click="api.info({ title: 'Hello' })">
    显示
  </am-button>
</template>
```

`useNotification(config)` 可以传入与 `notification.config` 相同的配置（`appContext` 除外），`api` 上有 `open`、`success`、`error`、`info`、`warning`、`destroy` 方法。

> 可通过 [App 包裹组件](/components/app) 省去手动放置 `ContextHolder`。

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Notification` 或直接覆盖 `.am-notification` 上的 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-notification-z-index` | 层级（未自动分配时） | `2010` |
| `--am-notification-top` | 距离顶部的位置 | `8px` |
| `--am-notification-bottom` | 距离底部的位置 | `8px` |
| `--am-notification-margin` | 卡片与屏幕左右边缘的距离 | `var(--am-margin-sm)` |
| `--am-notification-gap` | 多条通知之间的间距 | `var(--am-margin-xs)` |
| `--am-notification-max-width` | 卡片最大宽度（平板 / 横屏时居中） | `480px` |
| `--am-notification-bg` | 背景色 | `var(--am-color-bg-elevated)` |
| `--am-notification-color` | 文字颜色 | `var(--am-color-text)` |
| `--am-notification-title-color` | 标题颜色 | `var(--am-color-text-heading)` |
| `--am-notification-description-color` | 描述颜色 | `var(--am-color-text-secondary)` |
| `--am-notification-font-size` | 字号 | `var(--am-font-size)` |
| `--am-notification-title-font-size` | 标题字号 | `var(--am-font-size-lg)` |
| `--am-notification-padding` | 内边距 | `var(--am-padding-sm) var(--am-padding)` |
| `--am-notification-border-radius` | 圆角 | `var(--am-border-radius-lg)` |
| `--am-notification-shadow` | 阴影 | `var(--am-box-shadow)` |
| `--am-notification-icon-size` | 图标大小 | `22px` |
| `--am-notification-close-size` | 关闭按钮宽度 | `24px` |
| `--am-notification-close-color` | 关闭按钮颜色 | `var(--am-color-icon)` |
| `--am-notification-progress-height` | 进度条高度 | `2px` |
| `--am-notification-progress-color` | 进度条颜色 | `var(--am-color-primary)` |
| `--am-notification-stack-offset` | 堆叠时后面的卡片露出的距离 | `8px` |
| `--am-notification-stack-scale` | 堆叠时每层卡片缩小的比例 | `0.05` |

## 与 PC 端的差异 {#diff}

- 样式为通栏的卡片横幅（宽度为屏幕宽度减去两侧边距），默认 `placement` 为 `top`（PC 为 `topRight`）。`topLeft` / `topRight` 映射为 `top`，`bottomLeft` / `bottomRight` 映射为 `bottom`。
- `top` / `bottom` 默认值为 `8`（PC 为 `24`），支持带单位的字符串，并会自动叠加安全区。
- 支持手势：向所在边缘方向（顶部通知向上、底部通知向下）或向左右滑动即可关闭，并触发 `onClose`。
- `pauseOnHover` 在移动端表现为“手指按住时暂停计时”，鼠标悬停时同样生效。
- `stack` 折叠后通过点击展开（PC 为悬停展开），点击其他区域收起；折叠时点击通知不会触发 `onClick`。
- `onClick` 会收到 `MouseEvent` 参数。
- `notification.destroy()` 立即移除通知，不会触发 `onClose`（与移动端 `message` 一致）。
- 类型名带有组件前缀：`NotificationArgsProps`、`NotificationConfig`、`NotificationGlobalConfig`、`NotificationInstance`、`NotificationIconType`、`NotificationClosableType`。
- `classes` / `styles` 只支持对象形式，语义化结构为 `root`、`icon`、`section`、`title`、`description`、`actions`、`close`、`progress`（没有 `list`、`listContent`、`wrapper`）。
- 不支持 `prefixCls`、`rtl`（方向跟随 `ConfigProvider` 的 `direction`）、`getContainer` 返回 `ShadowRoot`、全局配置的 `props`。
