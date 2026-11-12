<docs lang="zh-CN">
基础分页，`total` 为数据总数，默认每页 10 条。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const current = ref(1)
</script>

<template>
  <am-pagination v-model:current="current" :total="50" />
</template>
