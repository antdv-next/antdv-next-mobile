<docs lang="zh-CN">
不设置 `fixed` 时，列表项的高度由内容决定：`itemHeight` 只是渲染前的预估值，实际高度会在渲染后测量并缓存，内容变化（如展开 / 收起）时自动更新。
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

const sentence = '虚拟列表只渲染可视区域附近的列表项。'
const data = reactive(
  Array.from({ length: 3000 }, (_, index) => ({
    id: index,
    title: `第 ${index + 1} 条`,
    content: sentence.repeat((index % 5) + 1),
    expanded: false,
  })),
)
</script>

<template>
  <am-virtual-list :data="data" :height="360" :item-height="72" item-key="id" class="demo-list">
    <template #default="{ item }">
      <div class="demo-card" @click="item.expanded = !item.expanded">
        <div class="demo-card-title">
          {{ item.title }}
          <am-tag v-if="item.expanded" color="processing">
            已展开
          </am-tag>
        </div>
        <div class="demo-card-content">
          {{ item.content }}
        </div>
        <div v-if="item.expanded" class="demo-card-extra">
          点击可以收起。高度变化后，后面的列表项会自动重新定位。
        </div>
      </div>
    </template>
  </am-virtual-list>
</template>

<style scoped>
.demo-list {
  background: var(--am-color-bg-layout);
}

.demo-card {
  margin: 8px 12px;
  padding: 12px;
  color: var(--am-color-text);
  font-size: 14px;
  line-height: 1.6;
  background: var(--am-color-bg-container);
  border-radius: var(--am-border-radius-lg);
}

.demo-card-title {
  display: flex;
  gap: 8px;
  align-items: center;
  font-weight: 600;
}

.demo-card-content {
  color: var(--am-color-text-secondary);
}

.demo-card-extra {
  margin-top: 8px;
  padding: 8px;
  color: var(--am-color-text-tertiary);
  background: var(--am-color-fill-tertiary);
  border-radius: var(--am-border-radius);
}
</style>
