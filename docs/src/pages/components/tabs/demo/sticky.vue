<docs lang="zh-CN">
开启 `sticky` 后标签栏在滚动容器内吸顶，`offsetTop` 设置与顶部的距离（例如固定导航栏的高度）。
</docs>

<script setup lang="ts">
import type { TabsItem } from 'antdv-next-mobile'

const items: TabsItem[] = [
  { key: '1', label: '商品' },
  { key: '2', label: '评价' },
  { key: '3', label: '详情' },
]
</script>

<template>
  <div class="scroller">
    <div class="banner">
      向下滚动，标签栏会吸顶
    </div>
    <am-tabs :items="items" sticky>
      <template #default="{ item }">
        <p v-for="i in 12" :key="i" class="row">
          {{ item.label }} {{ i }}
        </p>
      </template>
    </am-tabs>
  </div>
</template>

<style scoped>
.scroller {
  height: 280px;
  overflow-y: auto;
}

.banner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: var(--am-color-text-light-solid);
  background: var(--am-color-primary);
}

.row {
  margin: 0;
  padding: 12px 16px;
  color: var(--am-color-text-secondary);
}
</style>
