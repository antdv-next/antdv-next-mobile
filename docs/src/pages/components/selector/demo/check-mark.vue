<docs lang="zh-CN">
`showCheckMark` 设为 `false` 可以隐藏选中项右下角的对勾角标。
</docs>

<script setup lang="ts">
const options = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' },
]
</script>

<template>
  <am-selector :options="options" :default-value="['1', '2']" :show-check-mark="false" multiple />
</template>
