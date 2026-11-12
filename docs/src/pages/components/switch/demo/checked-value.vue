<docs lang="zh-CN">
通过 `checkedValue` 与 `unCheckedValue` 自定义开 / 关对应的值，方便直接对接后端字段。
</docs>

<docs lang="en-US">
Customize the values for on / off with `checkedValue` and `unCheckedValue`, which makes it easy to map directly to backend fields.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const status = ref<number>(1)
</script>

<template>
  <am-flex align="center" gap="middle">
    <am-switch v-model:checked="status" :checked-value="1" :un-checked-value="0" />
    <span>status = {{ status }}</span>
  </am-flex>
</template>
