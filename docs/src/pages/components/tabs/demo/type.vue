<docs lang="zh-CN">
除默认的 `line` 外，还提供 `card` 卡片样式和移动端新增的 `capsule` 胶囊样式。
</docs>

<script setup lang="ts">
import type { TabsItem } from 'antdv-next-mobile'

const items: TabsItem[] = [
  { key: '1', label: '全部', content: '全部订单' },
  { key: '2', label: '待付款', content: '待付款订单' },
  { key: '3', label: '待收货', content: '待收货订单' },
  { key: '4', label: '已完成', content: '已完成订单' },
]

const contentStyles = { content: { padding: '16px' } }
</script>

<template>
  <div class="stack">
    <am-tabs type="card" :items="items" :styles="contentStyles" />
    <am-tabs type="capsule" :items="items" :stretch="false" :styles="contentStyles" />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stack > * {
  background: var(--am-color-bg-container);
}
</style>
