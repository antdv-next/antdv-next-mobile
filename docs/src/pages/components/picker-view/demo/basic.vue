<docs lang="zh-CN">
`columns` 是一个二维数组，每一项代表一列。通过 `v-model:value` 绑定每列的选中值。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  ['杭州', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华'].map(city => ({ label: city, value: city })),
]
const value = ref(['温州'])
</script>

<template>
  <am-picker-view v-model:value="value" :columns="columns" />
  <div class="demo-result">
    当前值：{{ value }}
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
