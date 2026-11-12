<docs lang="zh-CN">
`disabledTime` 与 PC 端用法一致，返回不可选的时、分、秒，对应选项置灰且会被自动跳过。希望直接隐藏选项时可以使用 `filter`。
</docs>

<script setup lang="ts">
import type { PickerOption, TimePickerColumnType } from 'antdv-next-mobile'
import { ref } from 'vue'

const range = (start: number, end: number) => Array.from({ length: end - start }, (_, index) => start + index)

function disabledTime() {
  return {
  // 仅 9:00 - 18:00 可选，12 点午休
    disabledHours: () => [...range(0, 9), 12, ...range(19, 24)],
    disabledMinutes: (hour: number) => (hour === 18 ? range(1, 60) : []),
  }
}

function filter(type: TimePickerColumnType, options: PickerOption[]) {
  return type === 'hour' ? options.filter(option => Number(option.value) >= 9 && Number(option.value) <= 18) : options
}

const a = ref(null)
const b = ref(null)
</script>

<template>
  <am-flex vertical gap="small">
    <am-time-picker v-model:value="a" format="HH:mm" :disabled-time="disabledTime" placeholder="禁用项置灰" />
    <am-time-picker v-model:value="b" format="HH:mm" :disabled-time="disabledTime" :filter="filter" placeholder="隐藏营业时间外的小时" />
  </am-flex>
</template>
