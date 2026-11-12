<docs lang="zh-CN">
`showCheckMark` 设为 `false` 可以隐藏选中项右下角的对勾角标。
</docs>

<docs lang="en-US">
Set `showCheckMark` to `false` to hide the check mark at the bottom right corner of selected items.
</docs>

<script setup lang="ts">
const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
]
</script>

<template>
  <am-selector :options="options" :default-value="['1', '2']" :show-check-mark="false" multiple />
</template>
