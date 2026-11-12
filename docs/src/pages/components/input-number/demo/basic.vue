<docs lang="zh-CN">
移动端默认是带有 − / + 按钮的步进器，通过 `v-model:value` 绑定数值；长按按钮可以连续增减，也可以直接点击中间的数字输入。
</docs>

<docs lang="en-US">
On mobile it is a stepper with − / + buttons by default; bind the value with `v-model:value`. Long-press a button to step continuously, or tap the number in the middle to type directly.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<number | null>(1)
</script>

<template>
  <am-flex align="center" gap="middle">
    <am-input-number v-model:value="value" />
    <span>value: {{ value ?? 'null' }}</span>
  </am-flex>
</template>
