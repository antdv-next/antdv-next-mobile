<docs lang="zh-CN">
通过 `columns` 指定列数，选项等宽排列，适合筛选面板。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const options = ['不限', '1 室', '2 室', '3 室', '4 室', '5 室及以上'].map((label, value) => ({ label, value }))
const two = ref([0])
const three = ref([1, 2])
</script>

<template>
  <div class="demo-selector-list">
    <am-selector v-model:value="two" :options="options" :columns="2" />
    <am-selector v-model:value="three" :options="options" :columns="3" multiple />
  </div>
</template>

<style scoped>
.demo-selector-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
