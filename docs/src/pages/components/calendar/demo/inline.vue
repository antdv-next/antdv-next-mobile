<docs lang="zh-CN">
设置 `:poppable="false"` 后日历直接内嵌在页面中，高度由 `--am-calendar-height` 控制。通过组件实例可以调用 `scrollToDate` 与 `reset`。
</docs>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { ref } from 'vue'

const calendarRef = ref()
const value = ref<Dayjs[] | null>(null)
</script>

<template>
  <am-calendar
    ref="calendarRef"
    v-model:value="value"
    :poppable="false"
    selection-mode="range"
    :show-title="false"
    :row-height="56"
    class="demo-inline-calendar"
  >
    <template #footer="{ confirm, disabled }">
      <am-flex gap="small">
        <am-button @click="calendarRef?.scrollToDate(dayjs().add(3, 'month'))">
          三个月后
        </am-button>
        <am-button @click="calendarRef?.reset()">
          重置
        </am-button>
        <am-button type="primary" :disabled="disabled" style="flex: 1" @click="confirm">
          {{ value?.length ? value.map(date => date.format('M/D')).join(' - ') : '确定' }}
        </am-button>
      </am-flex>
    </template>
  </am-calendar>
</template>

<style scoped>
.demo-inline-calendar {
  --am-calendar-height: 420px;
}
</style>
