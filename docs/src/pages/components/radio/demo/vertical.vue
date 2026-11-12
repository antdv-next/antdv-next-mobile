<docs lang="zh-CN">
设置 `vertical`（或 `orientation="vertical"`）让选项垂直排列。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('standard')
</script>

<template>
  <am-radio-group v-model:value="value" vertical>
    <am-radio value="standard">
      标准配送（3-5 天）
    </am-radio>
    <am-radio value="express">
      极速配送（次日达）
    </am-radio>
    <am-radio value="self">
      到店自提
    </am-radio>
  </am-radio-group>
</template>
