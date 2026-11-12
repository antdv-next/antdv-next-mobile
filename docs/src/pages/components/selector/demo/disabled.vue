<docs lang="zh-CN">
`disabled` 禁用整个组件，也可以在选项上设置 `disabled` 禁用单个选项。
</docs>

<script setup lang="ts">
const options = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3', disabled: true },
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
