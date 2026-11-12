<docs lang="zh-CN">
`Checkbox.Group` 的 `max` 限制最多可选数量，达到上限后其余选项自动禁用。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(['阅读', '音乐'])
const options = ['阅读', '音乐', '运动', '旅行']
</script>

<template>
  <am-flex vertical gap="small">
    <div>最多选择 2 项（已选 {{ value.length }} 项）</div>
    <am-checkbox-group v-model:value="value" :options="options" :max="2" />
  </am-flex>
</template>
