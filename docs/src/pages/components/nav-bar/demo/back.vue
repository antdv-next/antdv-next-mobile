<docs lang="zh-CN">
`back` 设置箭头旁的文字，设为 `null` 隐藏整个返回区域；`backIcon` 自定义箭头，设为 `false` 只保留文字。
</docs>

<script setup lang="ts">
import { CloseOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const closeIcon = () => h(CloseOutlined)
</script>

<template>
  <div class="stack">
    <am-nav-bar title="返回文字" back="返回" />
    <am-nav-bar title="自定义箭头" :back-icon="closeIcon" />
    <am-nav-bar title="仅文字" back="取消" :back-icon="false" />
    <am-nav-bar title="无返回" :back="null" />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
