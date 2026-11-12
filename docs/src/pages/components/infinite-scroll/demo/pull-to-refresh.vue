<docs lang="zh-CN">
与 `PullToRefresh` 组合实现「下拉刷新 + 上拉加载」：刷新时重置列表与 `hasMore`。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const list = ref<string[]>([])
const loading = ref(false)
const refreshing = ref(false)
const hasMore = ref(true)
let version = 1

function fetchPage(reset: boolean) {
  setTimeout(() => {
    if (reset) {
      list.value = []
      version += 1
      hasMore.value = true
      refreshing.value = false
    }
    const start = list.value.length
    list.value.push(...Array.from({ length: 10 }, (_, i) => `第 ${version} 版 - 列表项 ${start + i + 1}`))
    loading.value = false
    if (list.value.length >= 30)
      hasMore.value = false
  }, 800)
}
</script>

<template>
  <div class="scroller">
    <am-pull-to-refresh v-model:refreshing="refreshing" @refresh="fetchPage(true)">
      <am-infinite-scroll v-model:loading="loading" :has-more="hasMore" :disabled="refreshing" :threshold="50" @load="fetchPage(false)">
        <ul class="list">
          <li v-for="item in list" :key="item">
            {{ item }}
          </li>
        </ul>
      </am-infinite-scroll>
    </am-pull-to-refresh>
  </div>
</template>

<style scoped>
.scroller {
  height: 320px;
  overflow-y: auto;
  border: 1px solid var(--am-color-border-secondary);
  border-radius: 8px;
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.list li {
  padding: 12px 16px;
  border-bottom: 1px solid var(--am-color-split);
}
</style>
