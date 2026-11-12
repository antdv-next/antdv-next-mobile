<docs lang="zh-CN">
最简单的用法，通过 `v-model:checked` 绑定开关状态。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(true)

function onChange(value: boolean) {
  console.log(`switch to ${value}`)
}
</script>

<template>
  <am-flex align="center" gap="middle">
    <am-switch v-model:checked="checked" @change="onChange" />
    <am-switch default-checked />
    <span>{{ checked ? '开' : '关' }}</span>
  </am-flex>
</template>
