<docs lang="zh-CN">
向左滑动露出 `rightActions` 中的按钮，点击按钮触发 `action` 事件并自动收起。
</docs>

<docs lang="en-US">
Swipe left to reveal the buttons in `rightActions`. Clicking a button triggers the `action` event and closes automatically.
</docs>

<script setup lang="ts">
import type { SwipeActionItem } from '@antdv-next/mobile'
import { ref } from 'vue'

const rightActions: SwipeActionItem[] = [
  { key: 'unread', text: 'Unread', color: 'default' },
  { key: 'mute', text: 'Mute', color: 'warning' },
  { key: 'delete', text: 'Delete', color: 'danger' },
]
const last = ref('Try swiping left')

function onAction(action: SwipeActionItem) {
  last.value = `Clicked: ${action.key}`
}
</script>

<template>
  <am-swipe-action :right-actions="rightActions" @action="onAction">
    <div class="cell">
      <span>Swipe left</span>
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
