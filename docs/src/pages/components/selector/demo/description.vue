<docs lang="zh-CN">
选项可以带一段 `description` 描述信息。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const options = [
  { label: '月卡', description: '¥ 25 / 月', value: 'month' },
  { label: '季卡', description: '¥ 68 / 季', value: 'quarter' },
  { label: '年卡', description: '¥ 228 / 年', value: 'year' },
]
const value = ref(['quarter'])
</script>

<template>
  <am-selector v-model:value="value" :options="options" :columns="3" />
</template>
