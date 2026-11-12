<docs lang="zh-CN">
通过 ref 调用 `show(side)` 与 `close()` 手动控制。`closeOnAction` 设为 `false` 后点击按钮不会自动收起，`closeOnTouchOutside` 设为 `false` 后触摸外部不会收起，`disabled` 禁用滑动。
</docs>

<script setup lang="ts">
import type { SwipeActionItem } from 'antdv-next-mobile'
import { ref } from 'vue'

const swipeRef = ref()
const rightActions: SwipeActionItem[] = [
  { key: 'edit', text: '编辑', color: 'primary' },
  { key: 'delete', text: '删除', color: 'danger' },
]
const leftActions: SwipeActionItem[] = [{ key: 'pin', text: '置顶', color: 'warning' }]
const state = ref('已收起')
</script>

<template>
  <am-swipe-action
    ref="swipeRef"
    :left-actions="leftActions"
    :right-actions="rightActions"
    :close-on-action="false"
    :close-on-touch-outside="false"
    @actions-reveal="state = `已展开：${$event}`"
    @close="state = '已收起'"
  >
    <div class="cell">
      <span>手动控制</span>
      <span class="cell-extra">{{ state }}</span>
    </div>
  </am-swipe-action>
  <am-flex gap="small" style="padding: 12px 16px">
    <am-button size="small" @click="swipeRef?.show('left')">
      展开左侧
    </am-button>
    <am-button size="small" @click="swipeRef?.show('right')">
      展开右侧
    </am-button>
    <am-button size="small" @click="swipeRef?.close()">
      收起
    </am-button>
  </am-flex>
  <am-swipe-action :right-actions="rightActions" disabled>
    <div class="cell">
      <span>禁用滑动</span>
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
