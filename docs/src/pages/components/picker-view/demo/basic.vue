<docs lang="zh-CN">
`columns` 是一个二维数组，每一项代表一列。通过 `v-model:value` 绑定每列的选中值。
</docs>

<docs lang="en-US">
`columns` is a two-dimensional array in which each item represents a column. Bind the selected value of each column with `v-model:value`.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  ['Hangzhou', 'Ningbo', 'Wenzhou', 'Shaoxing', 'Huzhou', 'Jiaxing', 'Jinhua'].map(city => ({ label: city, value: city })),
]
const value = ref(['Wenzhou'])
</script>

<template>
  <am-picker-view v-model:value="value" :columns="columns" />
  <div class="demo-result">
    Value: {{ value }}
  </div>
</template>

<style scoped>
.demo-result {
  margin-top: 12px;
  color: var(--am-color-text-secondary);
  font-size: 14px;
  text-align: center;
}
</style>
