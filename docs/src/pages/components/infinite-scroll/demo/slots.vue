<docs lang="zh-CN">
通过 `loadingText` / `finishedText` / `errorText` 属性或同名插槽自定义各状态的提示。
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
    if (list.value.length >= 20)
      hasMore.value = false
  }, 1200)
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
      <template #loading>
        <span class="dots"><i /><i /><i /></span>
        <span>正在赶来的路上</span>
      </template>
      <template #finished>
        <span>—— 我是有底线的 ——</span>
      </template>
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

.dots {
  display: inline-flex;
  gap: 4px;
}

.dots i {
  width: 6px;
  height: 6px;
  background: var(--am-color-primary);
  border-radius: 50%;
  animation: dot-blink 1s infinite ease-in-out;
}

.dots i:nth-child(2) {
  animation-delay: 0.15s;
}

.dots i:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes dot-blink {
  0%,
  100% {
    opacity: 0.2;
  }

  50% {
    opacity: 1;
  }
}
</style>
