<docs lang="zh-CN">
`format` 同时决定展示格式与滚轮的列，例如 `HH:mm` 只显示时、分两列。`hourStep` / `minuteStep` / `secondStep` 设置选项间隔。
</docs>

<docs lang="en-US">
`format` determines both the display format and the wheel columns, e.g. `HH:mm` shows only the hour and minute columns. `hourStep` / `minuteStep` / `secondStep` set the interval between options.
</docs>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ref } from 'vue'

const value = ref(dayjs().hour(8).minute(30))
const step = ref(null)
</script>

<template>
  <am-flex vertical gap="small">
    <am-time-picker v-model:value="value" format="HH:mm" title="Work starts" />
    <am-time-picker v-model:value="step" format="HH:mm" :minute-step="15" title="15-minute steps" placeholder="15-minute steps" />
  </am-flex>
</template>
