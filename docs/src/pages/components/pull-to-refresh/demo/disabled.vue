<docs lang="zh-CN">
设置 `disabled` 后不响应下拉手势。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const disabled = ref(true)
const refreshing = ref(false)

function onRefresh() {
  setTimeout(() => {
    refreshing.value = false
  }, 1000)
}
</script>

<template>
  <am-button size="small" style="margin-bottom: 12px" @click="disabled = !disabled">
    {{ disabled ? '启用下拉刷新' : '禁用下拉刷新' }}
  </am-button>
  <am-pull-to-refresh v-model:refreshing="refreshing" :disabled="disabled" @refresh="onRefresh">
    <ul class="list">
      <li v-for="i in 5" :key="i">
        列表项 {{ i }}
      </li>
    </ul>
  </am-pull-to-refresh>
</template>

<style scoped>
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
