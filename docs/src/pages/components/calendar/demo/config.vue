<docs lang="zh-CN">
`minDate` / `maxDate` 设置可选范围（月份按需渲染，范围再大也不会卡顿），`disabledDate` 禁用特定日期，`maxRange` 限制区间天数，`weekStartsOn` 设置周起始日，`:show-confirm="false"` 选择完成后立即提交。
</docs>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { ref } from 'vue'

function fmt(value: Dayjs | Dayjs[] | null) {
  if (!value || (Array.isArray(value) && !value.length))
    return '请选择'
  return Array.isArray(value) ? value.map(date => date.format('M/D')).join(' - ') : value.format('YYYY-MM-DD')
}

const openA = ref(false)
const a = ref<Dayjs | null>(null)
const minDate = dayjs().subtract(5, 'year').startOf('year')
const maxDate = dayjs().add(5, 'year').endOf('year')

const openB = ref(false)
const b = ref<Dayjs | null>(null)
const disabledDate = (date: Dayjs) => date.day() === 0 || date.day() === 6

const openC = ref(false)
const c = ref<Dayjs[] | null>(null)

const openD = ref(false)
const d = ref<Dayjs | null>(null)
</script>

<template>
  <am-list>
    <am-list-item title="前后五年（120 个月）" :extra="fmt(a)" clickable @click="openA = true" />
    <am-list-item title="禁用周末" :extra="fmt(b)" clickable @click="openB = true" />
    <am-list-item title="最多选择 7 天" :extra="fmt(c)" clickable @click="openC = true" />
    <am-list-item title="周一开始 + 快捷选择" :extra="fmt(d)" clickable @click="openD = true" />
  </am-list>
  <am-calendar v-model:open="openA" v-model:value="a" :min-date="minDate" :max-date="maxDate" />
  <am-calendar v-model:open="openB" v-model:value="b" :disabled-date="disabledDate" />
  <am-calendar v-model:open="openC" v-model:value="c" selection-mode="range" :max-range="7" />
  <am-calendar v-model:open="openD" v-model:value="d" :week-starts-on="1" :show-confirm="false" />
</template>
