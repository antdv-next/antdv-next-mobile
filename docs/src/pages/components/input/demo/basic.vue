<docs lang="zh-CN">
基础用法，通过 `v-model:value` 绑定输入值。`allowClear` 的清除按钮只在聚焦且有内容时显示，`clearTrigger="always"` 可让它一直显示。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const phone = ref('13800138000')
</script>

<template>
  <am-flex vertical gap="small">
    <am-input v-model:value="value" placeholder="请输入内容" />
    <am-input v-model:value="phone" type="tel" inputmode="tel" placeholder="请输入手机号" allow-clear />
    <am-input default-value="一直显示清除按钮" allow-clear clear-trigger="always" />
    <span style="font-size: 12px; color: var(--am-color-text-tertiary)">value: {{ value }}</span>
  </am-flex>
</template>
