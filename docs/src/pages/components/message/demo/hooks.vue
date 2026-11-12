<docs lang="zh-CN">
通过 `message.useMessage()` 创建的 `ContextHolder` 渲染在组件树中，提示会跟随其所在 `ConfigProvider` 的主题。还可以为这个实例单独配置 `top`、`maxCount` 等。
</docs>

<docs lang="en-US">
The `ContextHolder` created by `message.useMessage()` is rendered in the component tree, so messages follow the theme of the `ConfigProvider` it sits in. `top`, `maxCount`, etc. can also be configured for this instance alone.
</docs>

<script setup lang="ts">
import { message } from '@antdv-next/mobile'

const [messageApi, ContextHolder] = message.useMessage({ top: 56, maxCount: 2 })
let count = 0

function show() {
  count += 1
  messageApi.success(`Dark message ${count}, at most 2 shown at once`)
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
