---
title: Message
subtitle: 全局提示
description: 全局展示操作反馈信息。
group:
  title: 反馈
  order: 6
---

## 何时使用 {#when-to-use}

- 可提供成功、警告和错误等反馈信息。
- 顶部居中显示并自动消失，是一种不打断用户操作的轻量级提示方式。

API 与 antdv-next 的 `message` 对齐。移动端样式为顶部的紧凑胶囊，自动避开顶部安全区。如果需要在屏幕中央展示、或需要在加载时阻止页面操作，请使用 [Toast](/components/toast)。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/type.vue">其他提示类型</demo>
<demo src="./demo/duration.vue">修改延时</demo>
<demo src="./demo/loading.vue">加载中</demo>
<demo src="./demo/update.vue">更新消息内容</demo>
<demo src="./demo/thenable.vue">Promise 接口</demo>
<demo src="./demo/hooks.vue">使用 hooks 获得上下文</demo>

## API

组件提供了一些静态方法，使用方式和参数如下：

- `message.success(content, [duration], onClose)`
- `message.error(content, [duration], onClose)`
- `message.info(content, [duration], onClose)`
- `message.warning(content, [duration], onClose)`
- `message.loading(content, [duration], onClose)`

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 提示内容，也可以直接传入配置对象 | `VueNode \| MessageArgsProps` | - |
| duration | 自动关闭的延时，单位秒。设为 0 时不自动关闭 | `number` | `3` |
| onClose | 关闭时触发的回调函数 | `() => void` | - |

这些方法都返回一个关闭函数，调用它可以手动关闭提示；它同时是 thenable 的，可以在提示关闭后继续执行：

```ts
const hide = message.loading('加载中...', 0)
hide()

message.success('保存成功').then(() => router.back())
```

也可以对象的形式传递参数：

- `message.open(config)`
- `message.success(config)`
- `message.error(config)`
- `message.info(config)`
- `message.warning(config)`
- `message.loading(config)`

`config` 对象属性如下：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 提示内容 | `VueNode` | - |
| duration | 自动关闭的延时，单位秒。设为 0 时不自动关闭 | `number` | `3` |
| type | 提示类型 | `'info' \| 'success' \| 'error' \| 'warning' \| 'loading'` | - |
| icon | 自定义图标 | `VueNode` | - |
| key | 当前提示的唯一标志，相同 `key` 的提示会原地更新 | `string \| number` | - |
| class | 自定义 CSS class | `string` | - |
| style | 自定义内联样式 | `CSSProperties` | - |
| onClick | 点击提示时触发的回调函数 | `(event: MouseEvent) => void` | - |
| onClose | 关闭时触发的回调函数 | `() => void` | - |

### 全局方法 {#global-methods}

还提供了全局配置和全局销毁方法：

- `message.config(options)`
- `message.destroy()`

也可通过 `message.destroy(key)` 来关闭一条消息。

#### message.config

```ts
message.config({
  top: 60,
  duration: 2,
  maxCount: 3,
})
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| top | 消息距离顶部的位置（会自动叠加顶部安全区） | `number \| string` | `8` |
| duration | 默认自动关闭延时，单位秒 | `number` | `3` |
| maxCount | 最大显示数，超过限制时，最早的消息会被自动关闭 | `number` | - |
| getContainer | 配置渲染节点的输出位置 | `() => HTMLElement` | `() => document.body` |
| appContext | 应用上下文，使内容中可以使用全局注册的组件 | `AppContext` | - |

### message.useMessage()

静态方法渲染在独立的应用中，主题与语言跟随 `ConfigProvider.config()` 的全局配置，无法读取调用处的 `ConfigProvider` 上下文。需要上下文时请使用 `message.useMessage()`：

```vue
<script setup lang="ts">
import { message } from 'antdv-next-mobile'

const [messageApi, ContextHolder] = message.useMessage()
</script>

<template>
  <ContextHolder />
  <am-button @click="messageApi.success('Hello')">
    显示
  </am-button>
</template>
```

`useMessage(config)` 可以传入与 `message.config` 相同的配置（`top`、`duration`、`maxCount`、`getContainer`），`messageApi` 上有 `open`、`success`、`error`、`info`、`warning`、`loading`、`destroy` 方法。

## 主题变量 {#design-token}

可通过 `ConfigProvider` 的 `theme.components.Message` 或直接覆盖 `.am-message` 上的 CSS 变量定制。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--am-message-z-index` | 层级（未自动分配时） | `2010` |
| `--am-message-top` | 距离顶部的位置 | `8px` |
| `--am-message-gap` | 多条消息之间的间距 | `var(--am-margin-xs)` |
| `--am-message-bg` | 背景色 | `var(--am-color-bg-elevated)` |
| `--am-message-color` | 文字颜色 | `var(--am-color-text)` |
| `--am-message-font-size` | 字号 | `var(--am-font-size)` |
| `--am-message-padding` | 内边距 | `9px var(--am-padding)` |
| `--am-message-border-radius` | 圆角 | `999px` |
| `--am-message-shadow` | 阴影 | `var(--am-box-shadow)` |
| `--am-message-max-width` | 最大宽度 | `calc(100% - 32px)` |
| `--am-message-icon-size` | 图标大小 | `16px` |

## 与 PC 端的差异 {#diff}

- 样式为紧凑的胶囊，`top` 会自动叠加顶部安全区（刘海屏）。
- 类型名带有组件前缀：`MessageArgsProps`、`MessageConfigOptions`、`MessageInstance`、`MessageType`、`MessageNoticeType`。
- 不支持 `pauseOnHover`（移动端没有悬停）、`stack` 堆叠模式、`classes` / `styles` 语义化配置、`prefixCls`、`transitionName`、`rtl`（方向跟随 `ConfigProvider` 的 `direction`）。
- `message.destroy()` 立即移除消息，不会触发 `onClose`。
