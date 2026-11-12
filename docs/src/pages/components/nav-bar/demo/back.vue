<docs lang="zh-CN">
`back` 设置箭头旁的文字，设为 `null` 隐藏整个返回区域；`backIcon` 自定义箭头，设为 `false` 只保留文字。
</docs>

<docs lang="en-US">
`back` sets the text next to the arrow, and hides the whole back area when set to `null`; `backIcon` customizes the arrow, and keeps only the text when set to `false`.
</docs>

<script setup lang="ts">
import { CloseOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const closeIcon = () => h(CloseOutlined)
</script>

<template>
  <div class="stack">
    <am-nav-bar title="Back text" back="Back" />
    <am-nav-bar title="Custom arrow" :back-icon="closeIcon" />
    <am-nav-bar title="Text only" back="Cancel" :back-icon="false" />
    <am-nav-bar title="No back" :back="null" />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
