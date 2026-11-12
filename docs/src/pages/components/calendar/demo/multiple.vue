<docs lang="zh-CN">
`selection-mode="multiple"` 可选择多个不连续的日期，再次点击取消选择；`max-range` 限制最多可选的个数。
</docs>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { ref } from 'vue'

const open = ref(false)
const dates = ref<Dayjs[]>([])
</script>

<template>
  <am-list>
    <am-list-item title="选择多个日期（最多 5 个）" :extra="dates.length ? `已选 ${dates.length} 天` : '请选择'" clickable @click="open = true" />
  </am-list>
  <am-calendar v-model:open="open" v-model:value="dates" selection-mode="multiple" :max-range="5" range-prompt="最多选择 5 个日期" />
</template>
