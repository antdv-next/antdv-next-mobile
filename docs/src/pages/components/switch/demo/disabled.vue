<docs lang="zh-CN">
`disabled` 状态下开关不可操作。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const disabled = ref(true)
</script>

<template>
  <am-flex vertical gap="middle" align="flex-start">
    <am-flex gap="middle">
      <am-switch default-checked :disabled="disabled" />
      <am-switch :disabled="disabled" />
    </am-flex>
    <am-button type="primary" size="small" @click="disabled = !disabled">
      切换禁用状态
    </am-button>
  </am-flex>
</template>
