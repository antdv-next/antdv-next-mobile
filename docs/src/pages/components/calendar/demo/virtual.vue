<docs lang="zh-CN">
月份列表默认开启虚拟滚动（`virtual`）：可选范围为 10 年（120 个月、3,600 多天）时，也只渲染可视区域附近的几个月份。`scrollToDate` 可以直接跳到任意日期。
</docs>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { ref } from 'vue'

const minDate = dayjs().subtract(5, 'year').startOf('year')
const maxDate = dayjs().add(4, 'year').endOf('year')

const open = ref(false)
const value = ref<Dayjs | null>(null)
const calendarRef = ref<{ scrollToDate: (date: Dayjs) => void }>()
</script>

<template>
  <am-list>
    <am-list-item title="选择日期（10 年范围）" :extra="value ? value.format('YYYY-MM-DD') : '请选择'" clickable @click="open = true" />
  </am-list>
  <am-calendar ref="calendarRef" v-model:open="open" v-model:value="value" :min-date="minDate" :max-date="maxDate">
    <template #footer="{ confirm, disabled }">
      <am-flex gap="small">
        <am-button @click="calendarRef?.scrollToDate(minDate)">
          最早
        </am-button>
        <am-button @click="calendarRef?.scrollToDate(dayjs())">
          今天
        </am-button>
        <am-button @click="calendarRef?.scrollToDate(maxDate)">
          最晚
        </am-button>
        <am-button type="primary" block :disabled="disabled" @click="confirm">
          确定
        </am-button>
      </am-flex>
    </template>
  </am-calendar>
</template>
