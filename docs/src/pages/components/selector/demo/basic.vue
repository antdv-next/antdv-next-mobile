<docs lang="zh-CN">
默认是单选模式，`value` 始终是数组，再次点击已选项可以取消选中。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const options = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' },
]
const value = ref(['1'])
</script>

<template>
  <am-selector v-model:value="value" :options="options" />
</template>
