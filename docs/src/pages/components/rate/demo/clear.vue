<docs lang="zh-CN">
默认再次点击当前分值会清除评分，设置 `allowClear` 为 `false` 后不可清除，滑动时也至少保留一档。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const a = ref(3)
const b = ref(3)
</script>

<template>
  <div class="demo-rate-list">
    <div><am-rate v-model:value="a" /> <span>allowClear: true</span></div>
    <div><am-rate v-model:value="b" :allow-clear="false" /> <span>allowClear: false</span></div>
  </div>
</template>

<style scoped>
.demo-rate-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: var(--am-color-text-secondary);
  font-size: var(--am-font-size);
}

.demo-rate-list > div {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
