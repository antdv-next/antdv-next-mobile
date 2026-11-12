<docs lang="zh-CN">
基础分页，`total` 为数据总数，默认每页 10 条。
</docs>

<docs lang="en-US">
Basic pagination. `total` is the total number of data items, 10 per page by default.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const current = ref(1)
</script>

<template>
  <am-pagination v-model:current="current" :total="50" />
</template>
