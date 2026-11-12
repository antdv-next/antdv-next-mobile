<docs lang="zh-CN">
`disabled` 禁用整个组件，也可以在选项上设置 `disabled` 禁用单个选项。
</docs>

<docs lang="en-US">
`disabled` disables the whole component; you can also set `disabled` on an option to disable a single option.
</docs>

<script setup lang="ts">
const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3', disabled: true },
]
</script>

<template>
  <div class="demo-selector-list">
    <am-selector :options="options" :default-value="['1']" />
    <am-selector :options="options" :default-value="['1']" disabled />
  </div>
</template>

<style scoped>
.demo-selector-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
