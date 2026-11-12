<docs lang="zh-CN">
`filter` 可以过滤或重排某一列的选项（被过滤掉的值会自动修正到最近的选项），`renderLabel` 自定义选项文字。
</docs>

<script setup lang="ts">
import type { DatePickerColumnType, PickerOption } from 'antdv-next-mobile'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { ref } from 'vue'

const value = ref(dayjs().hour(9).minute(0))

function filter(type: DatePickerColumnType, options: PickerOption[]) {
  // 营业时间 9:00 - 18:00，半小时一档
  if (type === 'hour')
    return options.filter(option => Number(option.value) >= 9 && Number(option.value) <= 18)
  if (type === 'minute')
    return options.filter(option => Number(option.value) % 30 === 0)
  return options
}

const weekNames = ['日', '一', '二', '三', '四', '五', '六']
function renderLabel(type: DatePickerColumnType, val: number) {
  if (type === 'month')
    return `${val}月`
  if (type === 'day')
    return `${val}日`
  if (type === 'hour' || type === 'minute')
    return String(val).padStart(2, '0')
  return val
}

const format = (date: Dayjs) => `${date.format('M月D日')} 周${weekNames[date.day()]} ${date.format('HH:mm')}`
</script>

<template>
  <am-date-picker
    v-model:value="value"
    :show-time="{ format: 'HH:mm' }"
    :filter="filter"
    :render-label="renderLabel"
    :format="format"
    title="到店时间"
  />
</template>
