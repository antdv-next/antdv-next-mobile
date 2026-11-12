<docs lang="zh-CN">
`format` 同时决定展示格式与滚轮的列，例如 `HH:mm` 只显示时、分两列。`hourStep` / `minuteStep` / `secondStep` 设置选项间隔。
</docs>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ref } from 'vue'

const value = ref(dayjs().hour(8).minute(30))
const step = ref(null)
</script>

<template>
  <am-flex vertical gap="small">
    <am-time-picker v-model:value="value" format="HH:mm" title="上班时间" />
    <am-time-picker v-model:value="step" format="HH:mm" :minute-step="15" title="每 15 分钟一档" placeholder="每 15 分钟一档" />
  </am-flex>
</template>
