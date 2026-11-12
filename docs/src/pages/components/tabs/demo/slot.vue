<docs lang="zh-CN">
使用 `labelRender` 与 `contentRender` 插槽自定义标签与内容；`animated` 开启内容滑动切换，组件变量可以调整指示条。
</docs>

<script setup lang="ts">
import type { TabsItem } from 'antdv-next-mobile'

interface Channel extends TabsItem {
  count: number
}

const items: Channel[] = [
  { key: 'unread', label: '未读', count: 12 },
  { key: 'read', label: '已读', count: 128 },
  { key: 'archived', label: '归档', count: 0 },
]
</script>

<template>
  <am-tabs class="custom-tabs" :items="items" animated>
    <template #labelRender="{ item }">
      {{ item.label }}
      <span v-if="(item as Channel).count" class="count">{{ (item as Channel).count }}</span>
    </template>
    <template #contentRender="{ item, index }">
      <div class="pane">
        第 {{ index + 1 }} 个标签页：{{ item.label }}（{{ (item as Channel).count }} 条）
      </div>
    </template>
  </am-tabs>
</template>

<style scoped>
.custom-tabs {
  --am-tabs-ink-bar-width: 40px;
  --am-tabs-ink-bar-height: 3px;
  --am-tabs-active-color: #722ed1;
  --am-tabs-ink-bar-color: #722ed1;
}

.count {
  margin-inline-start: 4px;
  padding: 0 6px;
  color: var(--am-color-text-secondary);
  font-size: 12px;
  background: var(--am-color-fill-secondary);
  border-radius: 10px;
}

.pane {
  padding: 24px 16px;
  color: var(--am-color-text-secondary);
}
</style>
