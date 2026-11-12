<docs lang="zh-CN">
`selection-mode="multiple"` 可选择多个不连续的日期，再次点击取消选择；`max-range` 限制最多可选的个数。
</docs>

<docs lang="en-US">
`selection-mode="multiple"` selects multiple non-consecutive dates, and tapping a date again deselects it; `max-range` limits how many can be selected.
</docs>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { ref } from 'vue'

const open = ref(false)
const dates = ref<Dayjs[]>([])
</script>

<template>
  <am-list>
    <am-list-item title="Select dates (up to 5)" :extra="dates.length ? `${dates.length} selected` : 'Please select'" clickable @click="open = true" />
  </am-list>
  <am-calendar v-model:open="open" v-model:value="dates" selection-mode="multiple" :max-range="5" range-prompt="Select up to 5 dates" />
</template>
