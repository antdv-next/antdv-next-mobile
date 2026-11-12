<docs lang="zh-CN">
通过 `picker` 切换选择粒度：年、季度、月、周。周选择使用 ISO 周，返回该周周一的日期。
</docs>

<docs lang="en-US">
Switch the granularity with `picker`: year, quarter, month, week. The week picker uses ISO weeks and returns the Monday of that week.
</docs>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ref } from 'vue'

const month = ref(dayjs())
const quarter = ref(dayjs())
const year = ref(dayjs())
const week = ref(null)
</script>

<template>
  <am-flex vertical gap="small">
    <am-date-picker v-model:value="month" picker="month" title="Select month" />
    <am-date-picker v-model:value="quarter" picker="quarter" title="Select quarter" />
    <am-date-picker v-model:value="year" picker="year" title="Select year" />
    <am-date-picker v-model:value="week" picker="week" title="Select week" placeholder="Please select a week" />
  </am-flex>
</template>
