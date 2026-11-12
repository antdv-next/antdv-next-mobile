<docs lang="zh-CN">
与 PC 端的选择类组件一致，支持 `variant`、`size`、`status`、`disabled` 与 `allowClear`。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [['红色', '橙色', '黄色', '绿色', '蓝色'].map(label => ({ label, value: label }))]
const value = ref(['绿色'])
</script>

<template>
  <am-flex vertical gap="small">
    <am-picker v-model:value="value" :columns="columns" variant="outlined" allow-clear />
    <am-picker v-model:value="value" :columns="columns" variant="filled" />
    <am-picker v-model:value="value" :columns="columns" variant="underlined" />
    <am-picker v-model:value="value" :columns="columns" variant="borderless" />
    <am-picker v-model:value="value" :columns="columns" size="small" />
    <am-picker v-model:value="value" :columns="columns" size="large" />
    <am-picker v-model:value="value" :columns="columns" status="error" />
    <am-picker v-model:value="value" :columns="columns" status="warning" variant="filled" />
    <am-picker v-model:value="value" :columns="columns" disabled />
  </am-flex>
</template>
