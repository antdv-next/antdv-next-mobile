<docs lang="zh-CN">
滚动到底部附近时触发 `reachEnd`，在其中追加数据即可实现无限加载；数据长度变化后 `reachEnd` 可以再次触发。`footer` 插槽位于滚动容器内，适合放置「加载中」「没有更多了」。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const PAGE_SIZE = 30
const TOTAL = 150

function create(start: number, length: number) {
  return Array.from({ length }, (_, i) => ({ id: start + i, name: `订单 ${String(start + i + 1).padStart(4, '0')}` }))
}

const data = ref(create(0, PAGE_SIZE))
const loading = ref(false)
const finished = ref(false)

function loadMore() {
  if (loading.value || finished.value)
    return
  loading.value = true
  setTimeout(() => {
    data.value = data.value.concat(create(data.value.length, PAGE_SIZE))
    loading.value = false
    finished.value = data.value.length >= TOTAL
  }, 800)
}
</script>

<template>
  <am-virtual-list :data="data" :height="360" :item-height="56" item-key="id" fixed class="demo-list" @reach-end="loadMore">
    <template #header>
      <div class="demo-tip">
        已加载 {{ data.length }} / {{ TOTAL }} 条
      </div>
    </template>
    <template #default="{ item }">
      <div class="demo-row">
        {{ item.name }}
      </div>
    </template>
    <template #footer>
      <div class="demo-tip demo-footer">
        <am-spin v-if="loading" size="small" />
        <span>{{ finished ? '没有更多了' : loading ? '加载中...' : '上拉加载更多' }}</span>
      </div>
    </template>
  </am-virtual-list>
</template>

<style scoped>
.demo-list {
  background: var(--am-color-bg-container);
}

.demo-tip {
  padding: 8px 16px;
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}

.demo-footer {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.demo-row {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 56px;
  padding: 0 16px;
  color: var(--am-color-text);
  font-size: 15px;
  border-bottom: 1px solid var(--am-color-split);
}
</style>
