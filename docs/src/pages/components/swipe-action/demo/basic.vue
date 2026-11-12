<docs lang="zh-CN">
向左滑动露出 `rightActions` 中的按钮，点击按钮触发 `action` 事件并自动收起。
</docs>

<script setup lang="ts">
import type { SwipeActionItem } from 'antdv-next-mobile'
import { ref } from 'vue'

const rightActions: SwipeActionItem[] = [
  { key: 'unread', text: '标为未读', color: 'default' },
  { key: 'mute', text: '不再提醒', color: 'warning' },
  { key: 'delete', text: '删除', color: 'danger' },
]
const last = ref('向左滑动试试')

function onAction(action: SwipeActionItem) {
  last.value = `点击了：${action.key}`
}
</script>

<template>
  <am-swipe-action :right-actions="rightActions" @action="onAction">
    <div class="cell">
      <span>向左滑动</span>
      <span class="cell-extra">{{ last }}</span>
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
