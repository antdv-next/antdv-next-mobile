<docs lang="zh-CN">
`formatter` 可以为每个日期设置上方 / 下方的提示信息（节假日、价格、入住 / 离店等）；`cellRender` 插槽则可以完全接管单元格内容。
</docs>

<script setup lang="ts">
import type { CalendarDay } from 'antdv-next-mobile'
import type { Dayjs } from 'dayjs'
import { ref } from 'vue'

const hotelOpen = ref(false)
const hotel = ref<Dayjs[] | null>(null)

function formatter(day: CalendarDay): CalendarDay {
  const weekend = day.date.day() === 0 || day.date.day() === 6
  if (day.type === 'start')
    return { ...day, bottomInfo: '入住' }
  if (day.type === 'end')
    return { ...day, bottomInfo: '离店' }
  if (day.type === 'disabled')
    return day
  return { ...day, bottomInfo: weekend ? '¥468' : '¥328', className: weekend ? 'demo-weekend' : undefined }
}

const signOpen = ref(false)
const signed = [1, 2, 3, 5, 8, 9]
</script>

<template>
  <am-list>
    <am-list-item
      title="酒店预订"
      :extra="hotel?.length ? hotel.map(date => date.format('M月D日')).join(' - ') : '入住 - 离店'"
      clickable
      @click="hotelOpen = true"
    />
    <am-list-item title="签到日历" extra="cellRender 插槽" clickable @click="signOpen = true" />
  </am-list>
  <am-calendar v-model:open="hotelOpen" v-model:value="hotel" selection-mode="range" :formatter="formatter" title="选择入住离店日期" />
  <am-calendar v-model:open="signOpen" title="签到日历" :show-confirm="false" :show-mark="false">
    <template #cellRender="{ day }">
      <span>{{ day.text }}</span>
      <span class="demo-sign" :class="{ 'demo-sign-done': signed.includes(day.date.date()) }" />
    </template>
  </am-calendar>
</template>

<style>
.demo-weekend .am-calendar-day-bottom {
  color: var(--am-color-error);
}

.demo-sign {
  width: 6px;
  height: 6px;
  margin-top: 4px;
  border-radius: 50%;
}

.demo-sign-done {
  background: var(--am-color-success);
}
</style>
