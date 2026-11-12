---
title: App
description: Application wrapper providing base text styles and a default environment for consuming context.
group:
  title: Gestures & Others
  order: 7
---

## When To Use {#when-to-use}

- Provide `message`, `notification`, `modal` and `toast` instances that consume the provide / inject context: they render inside the `App` and follow the theme, locale and direction of the surrounding `ConfigProvider`, without placing the `ContextHolder` of `useMessage` and friends by hand.
- Provide base text styles (font family, font size, line height, text color) on `.am-app`. This library ships no global reset, so native elements can inherit proper text styles from it.

## Examples {#examples}

<demo src="./demo/basic.vue">Basic usage</demo>
<demo src="./demo/theme.vue">Follow the ConfigProvider theme</demo>

`my-page.vue`, shared by the two examples above:

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

## How to use {#how-to-use}

### Basic usage {#basic-usage}

App provides the instances through `provide / inject`, so `useApp` has to be called in a component below it. We recommend wrapping the application with App at the top level.

Note: `App.useApp()` must be called below an App; outside of one, the returned `message`, `notification`, `modal` and `toast` are empty objects.

### Sequence with ConfigProvider {#sequence-with-configprovider}

App has to be placed below `ConfigProvider` to use its theme and locale:

```html
<am-config-provider :theme="{ ... }" :locale="enUS">
  <am-app>...</am-app>
</am-config-provider>
```

### Embedded usage (avoid nesting unless necessary) {#embedded-usage}

```html
<am-app :notification="{ placement: 'bottom' }">
  ...
  <am-app :notification="{ maxCount: 1 }">...</am-app>
</am-app>
```

The inner App owns its own set of instances and inherits the `message` / `notification` / `toast` config of the outer App.

## API

### Props {#props}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| component | The element to render, `false` creates no DOM node | `string \| Component \| false` | `'div'` |
| message | Config of `message` inside the App, see [message.config](/components/message#global-methods) | `MessageConfigOptions` | - |
| notification | Config of `notification` inside the App, see [notification.config](/components/notification#global-config) | `NotificationConfig` | - |
| toast | Config of `toast` inside the App, see [ToastConfigOptions](/components/toast) | `ToastConfigOptions` | - |
| rootClass | Class name of the root element | `string` | - |

With `component: false` no root node is rendered, so `class`, `style`, `rootClass` and the base text styles do not apply.

### Slots {#slots}

| Name | Description |
| --- | --- |
| default | Content of the application |

### App.useApp() {#use-app}

```ts
const { message, notification, modal, toast } = App.useApp()
```

| Property | Description | Type |
| --- | --- | --- |
| message | Same as the instance returned by [message.useMessage()](/components/message#message-usemessage) | `MessageInstance` |
| notification | Same as the instance returned by [notification.useNotification()](/components/notification#use-notification) | `NotificationInstance` |
| modal | Same as the instance returned by `Modal.useModal()`: `info`, `success`, `error`, `warning`, `confirm`, `show`, `alert`, `confirmAsync` | `ModalHookApi` |
| toast | Same as the instance returned by `Toast.useToast()`: `show`, `success`, `fail`, `loading`, `clear` | `ToastInstance` |

### Methods {#methods}

The same set of instances is available through a ref:

| Name | Description | Type |
| --- | --- | --- |
| message | Same as `useApp().message` | `MessageInstance` |
| notification | Same as `useApp().notification` | `NotificationInstance` |
| modal | Same as `useApp().modal` | `ModalHookApi` |
| toast | Same as `useApp().toast` | `ToastInstance` |

## Design Token {#design-token}

App has no component tokens; the root `.am-app` consumes the global ones:

| Variable | Description |
| --- | --- |
| `--am-color-text` | Text color |
| `--am-font-size` | Font size |
| `--am-font-family` | Font family |
| `--am-line-height` | Line height |

## Differences from PC {#diff}

- `useApp()` additionally returns the mobile-only `toast`, with a matching `toast` config prop.
- The `modal` instance additionally offers the mobile `show`, `alert` and `confirmAsync` methods (same as `Modal.useModal()`).
- `.am-app` only sets the font family, font size, line height and text color; it does not include the PC reset styles for native elements such as links.
- No `prefixCls`; the options of `message` / `notification` are those of the corresponding mobile components.
