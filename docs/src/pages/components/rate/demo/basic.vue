<docs lang="zh-CN">
最简单的用法，点击或按住左右滑动都可以评分，支持 `v-model:value`。
</docs>

<docs lang="en-US">
The simplest usage. Rate by tapping or by pressing and swiping left or right. Supports `v-model:value`.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(3)
</script>

<template>
  <am-rate v-model:value="value" />
</template>
