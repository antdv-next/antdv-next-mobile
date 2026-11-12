<docs lang="zh-CN">
通过 `message.useMessage()` 创建的 `ContextHolder` 渲染在组件树中，提示会跟随其所在 `ConfigProvider` 的主题。还可以为这个实例单独配置 `top`、`maxCount` 等。
</docs>

<script setup lang="ts">
import { message } from 'antdv-next-mobile'

const [messageApi, ContextHolder] = message.useMessage({ top: 56, maxCount: 2 })
let count = 0

function show() {
  count += 1
  messageApi.success(`暗色主题的提示 ${count}，最多同时显示 2 条`)
}
</script>

<template>
  <am-config-provider :theme="{ algorithm: 'dark' }">
    <ContextHolder />
  </am-config-provider>
  <am-button block @click="show">
    使用 hooks 显示
  </am-button>
</template>
