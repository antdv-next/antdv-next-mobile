<docs lang="zh-CN">
`showTime` 在日期后增加时间列。传入对象可以通过 `format` 决定显示哪些列，并设置步长或 12 小时制。
</docs>

<docs lang="en-US">
`showTime` adds time columns after the date. Pass an object to decide which columns are shown through `format`, and to set the steps or the 12-hour clock.
</docs>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ref } from 'vue'

const full = ref(dayjs())
const short = ref(null)
</script>

<template>
  <am-flex vertical gap="small">
    <am-date-picker v-model:value="full" show-time title="To the second" />
    <am-date-picker
      v-model:value="short"
      :show-time="{ format: 'HH:mm', minuteStep: 15 }"
      format="MM-DD HH:mm"
      title="Booking time"
      placeholder="Please select a time"
    />
  </am-flex>
</template>
