<docs lang="zh-CN">
通过 `allowHalf` 支持选中半星。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(2.5)
</script>

<template>
  <am-rate v-model:value="value" allow-half />
</template>
