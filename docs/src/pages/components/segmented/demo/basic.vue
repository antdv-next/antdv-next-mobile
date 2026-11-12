<docs lang="zh-CN">
最简单的用法：`options` 传入字符串或数字数组，通过 `v-model:value` 获取选中项。
</docs>

<docs lang="en-US">
The simplest usage: pass an array of strings or numbers to `options` and get the selected option with `v-model:value`.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string | number>('Week')
</script>

<template>
  <am-flex vertical gap="middle" align="flex-start">
    <am-segmented v-model:value="value" :options="['Day', 'Week', 'Month', 'Quarter', 'Year']" />
    <span style="color: var(--am-color-text-tertiary); font-size: 13px">Selected: {{ value }}</span>
  </am-flex>
</template>
