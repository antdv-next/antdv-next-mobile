<docs lang="zh-CN">
页数较多时自动折叠为省略号，点击省略号向前 / 向后跳 5 页。`showLessItems` 显示更少的页码。
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
