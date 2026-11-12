<docs lang="zh-CN">
`selection-mode="range"` 选择日期区间：先点开始日期，再点结束日期。`allow-same-day` 允许起止为同一天。
</docs>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { computed, ref } from 'vue'

const open = ref(false)
const range = ref<Dayjs[] | null>(null)
const text = computed(() => (range.value?.length ? range.value.map(date => date.format('M月D日')).join(' - ') : '请选择'))

const sameDayOpen = ref(false)
const sameDay = ref<Dayjs[] | null>(null)
const sameDayText = computed(() => (sameDay.value?.length ? sameDay.value.map(date => date.format('M月D日')).join(' - ') : '请选择'))
</script>

<template>
  <am-list>
    <am-list-item title="选择日期区间" :extra="text" clickable @click="open = true" />
    <am-list-item title="允许同一天" :extra="sameDayText" clickable @click="sameDayOpen = true" />
  </am-list>
  <am-calendar v-model:open="open" v-model:value="range" selection-mode="range" title="选择入住和离店日期" />
  <am-calendar v-model:open="sameDayOpen" v-model:value="sameDay" selection-mode="range" allow-same-day />
</template>
