<docs lang="zh-CN">
`minDate` / `maxDate` 限制滚轮的范围，切换年、月时会自动把日期夹回范围内。`disabledDate` 命中的日期置灰且无法停靠。
</docs>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { ref } from 'vue'

const minDate = dayjs()
const maxDate = dayjs().add(3, 'month')
const value = ref<Dayjs | null>(null)

// 周末不可预约
const disabledDate = (date: Dayjs) => date.day() === 0 || date.day() === 6
</script>

<template>
  <am-flex vertical gap="small">
    <am-date-picker
      v-model:value="value"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled-date="disabledDate"
      title="预约日期（工作日）"
      placeholder="未来三个月内的工作日"
    />
    <div class="demo-result">
      可选范围：{{ minDate.format('YYYY-MM-DD') }} ~ {{ maxDate.format('YYYY-MM-DD') }}
    </div>
  </am-flex>
</template>

<style scoped>
.demo-result {
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}
</style>
