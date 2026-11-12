<docs lang="zh-CN">
请求失败时将 `error` 置为 `true`，组件展示失败提示；点击提示会把 `error` 置回 `false` 并重新触发 `load`。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const list = ref<number[]>([])
const loading = ref(false)
const error = ref(false)
const finished = ref(false)
let times = 0

function onLoad() {
  setTimeout(() => {
    times += 1
    loading.value = false
    // 第二次请求模拟失败
    if (times === 2) {
      error.value = true
      return
    }
    const start = list.value.length
    list.value.push(...Array.from({ length: 10 }, (_, i) => start + i + 1))
    if (list.value.length >= 30)
      finished.value = true
  }, 800)
}
</script>

<template>
  <div class="scroller">
    <am-infinite-scroll v-model:loading="loading" v-model:error="error" :finished="finished" :threshold="50" @load="onLoad">
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
