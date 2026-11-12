<docs lang="zh-CN">
同时设置 `leftActions` 与 `rightActions`。`color` 支持预设值，也可以传入任意 CSS 颜色。
</docs>

<script setup lang="ts">
import type { SwipeActionItem } from 'antdv-next-mobile'

const leftActions: SwipeActionItem[] = [
  { key: 'pin', text: '置顶', color: 'primary' },
  { key: 'star', text: '收藏', color: 'success' },
]
const rightActions: SwipeActionItem[] = [
  { key: 'archive', text: '归档', color: '#722ed1' },
  { key: 'delete', text: '删除', color: 'danger' },
]
</script>

<template>
  <am-swipe-action :left-actions="leftActions" :right-actions="rightActions">
    <div class="cell">
      <span>左右都可以滑动</span>
      <span class="cell-extra">← →</span>
    </div>
  </am-swipe-action>
</template>

<style scoped>
.cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  min-height: 52px;
  padding: 12px 16px;
  color: var(--am-color-text);
  font-size: 16px;
  background: var(--am-color-bg-container);
}

.cell-extra {
  color: var(--am-color-text-description);
  font-size: 14px;
}
</style>
