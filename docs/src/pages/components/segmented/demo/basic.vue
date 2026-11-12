<docs lang="zh-CN">
最简单的用法：`options` 传入字符串或数字数组，通过 `v-model:value` 获取选中项。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string | number>('周')
</script>

<template>
  <am-flex vertical gap="middle" align="flex-start">
    <am-segmented v-model:value="value" :options="['日', '周', '月', '季度', '年']" />
    <span style="color: var(--am-color-text-tertiary); font-size: 13px">当前选中：{{ value }}</span>
  </am-flex>
</template>
