<docs lang="zh-CN">
默认以底部弹层展示，通过 `v-model:open` 控制显示。选择日期后点击「确定」提交 `v-model:value`。默认可选范围为今天起的六个月。
</docs>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { ref } from 'vue'

const open = ref(false)
const value = ref<Dayjs | null>(null)
</script>

<template>
  <am-list>
    <am-list-item title="选择单个日期" :extra="value ? value.format('YYYY-MM-DD') : '请选择'" clickable @click="open = true" />
  </am-list>
  <am-calendar v-model:open="open" v-model:value="value" />
</template>
