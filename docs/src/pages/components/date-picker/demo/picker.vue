<docs lang="zh-CN">
通过 `picker` 切换选择粒度：年、季度、月、周。周选择使用 ISO 周，返回该周周一的日期。
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
    <am-date-picker v-model:value="month" picker="month" title="选择月份" />
    <am-date-picker v-model:value="quarter" picker="quarter" title="选择季度" />
    <am-date-picker v-model:value="year" picker="year" title="选择年份" />
    <am-date-picker v-model:value="week" picker="week" title="选择周" placeholder="请选择周" />
  </am-flex>
</template>
