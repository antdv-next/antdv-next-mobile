<docs lang="zh-CN">
`showTime` 在日期后增加时间列。传入对象可以通过 `format` 决定显示哪些列，并设置步长或 12 小时制。
</docs>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ref } from 'vue'

const full = ref(dayjs())
const short = ref(null)
</script>

<template>
  <am-flex vertical gap="small">
    <am-date-picker v-model:value="full" show-time title="精确到秒" />
    <am-date-picker
      v-model:value="short"
      :show-time="{ format: 'HH:mm', minuteStep: 15 }"
      format="M月D日 HH:mm"
      title="预约时间"
      placeholder="请选择预约时间"
    />
  </am-flex>
</template>
