---
title: App
subtitle: 包裹组件
description: 提供基础文字样式和消费上下文的默认环境。
group:
  title: 手势与其他
  order: 7
---

## 何时使用 {#when-to-use}

- 提供可消费 provide / inject 上下文的 `message`、`notification`、`modal`、`toast` 实例：它们渲染在 `App` 内部，跟随所在 `ConfigProvider` 的主题、语言与方向，省去 `useMessage` 等方法需要手动放置 `ContextHolder` 的步骤。
- 提供基于 `.am-app` 的基础文字样式（字体、字号、行高、文字颜色）。本组件库没有全局 reset，原生元素可以借此继承规范的文字样式。

## 代码演示 {#examples}

<demo src="./demo/basic.vue">基础用法</demo>
<demo src="./demo/theme.vue">跟随 ConfigProvider 主题</demo>

上面两个示例共用的 `my-page.vue`：

```vue
<script setup lang="ts">
import { App } from 'antdv-next-mobile'

const { message, notification, modal, toast } = App.useApp()

function showMessage() {
  message.success('Saved')
}

function showNotification() {
  notification.info({
    title: 'New version',
    description: 'Version 2.0 is ready to install.',
  })
}

function showModal() {
  modal.confirm({
    title: 'Delete this draft?',
    content: 'This action cannot be undone.',
  })
}

function showToast() {
  toast.show('Copied')
}
</script>

<template>
  <am-flex gap="small" wrap>
    <am-button type="primary" @click="showMessage">
      Message
    </am-button>
    <am-button type="primary" @click="showNotification">
      Notification
    </am-button>
    <am-button type="primary" @click="showModal">
      Modal
    </am-button>
    <am-button type="primary" @click="showToast">
      Toast
    </am-button>
  </am-flex>
</template>
```

## 如何使用 {#how-to-use}

### 基础用法 {#basic-usage}

App 组件通过 `provide / inject` 提供上下文方法调用，因而 `useApp` 需要在其子组件中才能使用，我们推荐在应用顶层包裹 App。

注意：`App.useApp()` 必须在 App 之下方可使用；在 App 之外调用时，返回的 `message`、`notification`、`modal`、`toast` 是空对象。

### 与 ConfigProvider 先后顺序 {#sequence-with-configprovider}

App 需要放在 `ConfigProvider` 之下才能使用其主题与语言：

```html
<am-config-provider :theme="{ ... }" :locale="enUS">
  <am-app>...</am-app>
</am-config-provider>
```

### 内嵌使用场景（如无必要，尽量不做嵌套） {#embedded-usage}

```html
<am-app :notification="{ placement: 'bottom' }">
  ...
  <am-app :notification="{ maxCount: 1 }">...</am-app>
</am-app>
```

内层 App 拥有自己的一组实例，并继承外层 App 的 `message` / `notification` / `toast` 配置。

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| component | 设置渲染元素，为 `false` 则不创建 DOM 节点 | `string \| Component \| false` | `'div'` |
| message | App 内 `message` 的配置，见 [message.config](/components/message#global-methods) | `MessageConfigOptions` | - |
| notification | App 内 `notification` 的配置，见 [notification.config](/components/notification#global-config) | `NotificationConfig` | - |
| toast | App 内 `toast` 的配置，见 [ToastConfigOptions](/components/toast) | `ToastConfigOptions` | - |
| rootClass | 根节点类名 | `string` | - |

`component` 为 `false` 时不渲染根节点，`class`、`style`、`rootClass` 以及基础文字样式都不会生效。

### 插槽 {#slots}

| 名称 | 说明 |
| --- | --- |
| default | 应用内容 |

### App.useApp() {#use-app}

```ts
const { message, notification, modal, toast } = App.useApp()
```

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| message | 同 [message.useMessage()](/components/message#message-usemessage) 返回的实例 | `MessageInstance` |
| notification | 同 [notification.useNotification()](/components/notification#use-notification) 返回的实例 | `NotificationInstance` |
| modal | 同 `Modal.useModal()` 返回的实例：`info`、`success`、`error`、`warning`、`confirm`、`show`、`alert`、`confirmAsync` | `ModalHookApi` |
| toast | 同 `Toast.useToast()` 返回的实例：`show`、`success`、`fail`、`loading`、`clear` | `ToastInstance` |

### 方法 {#methods}

通过 ref 可以获取同一组实例：

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| message | 同 `useApp().message` | `MessageInstance` |
| notification | 同 `useApp().notification` | `NotificationInstance` |
| modal | 同 `useApp().modal` | `ModalHookApi` |
| toast | 同 `useApp().toast` | `ToastInstance` |

## 主题变量 {#design-token}

App 没有组件级变量，根节点 `.am-app` 直接消费全局变量：

| 变量 | 说明 |
| --- | --- |
| `--am-color-text` | 文字颜色 |
| `--am-font-size` | 字号 |
| `--am-font-family` | 字体 |
| `--am-line-height` | 行高 |

## 与 PC 端的差异 {#diff}

- `useApp()` 额外返回移动端特有的 `toast`，并新增对应的 `toast` 配置属性。
- `modal` 实例额外提供移动端的 `show`、`alert`、`confirmAsync` 方法（与 `Modal.useModal()` 一致）。
- `.am-app` 只设置字体、字号、行高和文字颜色，不包含 PC 端针对链接等原生元素的重置样式。
- 没有 `prefixCls`；`message` / `notification` 的配置项以移动端对应组件为准。
