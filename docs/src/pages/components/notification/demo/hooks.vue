<docs lang="zh-CN">
通过 `notification.useNotification()` 创建的 `ContextHolder` 渲染在组件树中，通知会跟随其所在 `ConfigProvider` 的主题与语言。还可以为这个实例单独配置 `placement`、`maxCount` 等。
</docs>

<docs lang="en-US">
The `ContextHolder` created by `notification.useNotification()` is rendered in the component tree, so notifications follow the theme and locale of the `ConfigProvider` it sits in. `placement`, `maxCount`, etc. can also be configured for this instance alone.
</docs>

<script setup lang="ts">
import { notification } from '@antdv-next/mobile'

const [api, ContextHolder] = notification.useNotification({ placement: 'bottom', maxCount: 2 })
let count = 0

function show() {
  count += 1
  api.success({
    title: `Dark notification ${count}`,
    description: 'At most 2 are shown at once.',
  })
}
</script>

<template>
  <am-config-provider :theme="{ algorithm: 'dark' }">
    <ContextHolder />
  </am-config-provider>
  <am-button block @click="show">
    Show with hooks
  </am-button>
</template>
