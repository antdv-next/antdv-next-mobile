<docs lang="zh-CN">
页数较多时自动折叠为省略号，点击省略号向前 / 向后跳 5 页。`showLessItems` 显示更少的页码。
</docs>

<docs lang="en-US">
When there are many pages they collapse into ellipses automatically; tap an ellipsis to jump 5 pages backward / forward. `showLessItems` shows fewer page items.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const current = ref(10)
</script>

<template>
  <am-flex vertical gap="large">
    <am-pagination v-model:current="current" :total="500" />
    <am-pagination v-model:current="current" :total="500" show-less-items />
  </am-flex>
</template>
