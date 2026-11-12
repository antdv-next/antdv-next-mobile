<docs lang="zh-CN">
支持 `variant`、`size`、`status` 与 `disabled`，与其他表单组件保持一致。
</docs>

<docs lang="en-US">
Supports `variant`, `size`, `status` and `disabled`, consistent with other form components.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const options = ['Low', 'Medium', 'High', 'Urgent'].map(label => ({ label, value: label }))
const value = ref('Medium')
</script>

<template>
  <am-flex vertical gap="small">
    <am-select v-model:value="value" :options="options" variant="outlined" />
    <am-select v-model:value="value" :options="options" variant="filled" />
    <am-select v-model:value="value" :options="options" variant="underlined" />
    <am-select v-model:value="value" :options="options" variant="borderless" />
    <am-select v-model:value="value" :options="options" size="small" />
    <am-select v-model:value="value" :options="options" size="large" />
    <am-select v-model:value="value" :options="options" status="error" />
    <am-select v-model:value="value" :options="options" disabled />
  </am-flex>
</template>
