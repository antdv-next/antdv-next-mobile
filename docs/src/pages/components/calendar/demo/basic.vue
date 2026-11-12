<docs lang="zh-CN">
默认以底部弹层展示，通过 `v-model:open` 控制显示。选择日期后点击「确定」提交 `v-model:value`。默认可选范围为今天起的六个月。
</docs>

<docs lang="en-US">
Displayed in a bottom popup by default and controlled with `v-model:open`. After selecting a date, tap "Confirm" to commit `v-model:value`. The default selectable range is six months starting from today.
</docs>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { ref } from 'vue'

const open = ref(false)
const value = ref<Dayjs | null>(null)
</script>

<template>
  <am-list>
    <am-list-item title="Select a date" :extra="value ? value.format('YYYY-MM-DD') : 'Please select'" clickable @click="open = true" />
  </am-list>
  <am-calendar v-model:open="open" v-model:value="value" />
</template>
