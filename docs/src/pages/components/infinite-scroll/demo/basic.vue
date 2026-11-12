<docs lang="zh-CN">
滚动到底部附近时触发 `load`。使用 `v-model:loading` 维护加载状态，全部加载后将 `hasMore` 设为 `false`。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const list = ref<number[]>([])
const loading = ref(false)
const hasMore = ref(true)

function onLoad() {
  setTimeout(() => {
    const start = list.value.length
    list.value.push(...Array.from({ length: 10 }, (_, i) => start + i + 1))
    loading.value = false
    if (list.value.length >= 40)
      hasMore.value = false
  }, 800)
}
</script>

<template>
  <div class="scroller">
    <am-infinite-scroll v-model:loading="loading" :has-more="hasMore" :threshold="50" @load="onLoad">
      <ul class="list">
        <li v-for="item in list" :key="item">
          列表项 {{ item }}
        </li>
      </ul>
    </am-infinite-scroll>
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
