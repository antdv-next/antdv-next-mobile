<docs lang="zh-CN">
`highlight` 让标题保持高亮，用来提示该项已应用了筛选条件；`disabled` 禁用某一项。
</docs>

<script setup lang="ts">
import { computed, ref } from 'vue'

const price = ref('all')
const options = [
  { label: '不限价格', value: 'all' },
  { label: '0 - 100 元', value: '0-100' },
  { label: '100 - 500 元', value: '100-500' },
  { label: '500 元以上', value: '500+' },
]
const highlight = computed(() => price.value !== 'all')
</script>

<template>
  <am-dropdown>
    <am-dropdown-item key="price" v-model:value="price" title="价格" :options="options" :highlight="highlight" />
    <am-dropdown-item key="brand" title="品牌" highlight :options="[{ label: '已选：品牌 A', value: 'a' }]" default-value="a" />
    <am-dropdown-item key="region" title="地区" disabled />
  </am-dropdown>
  <div class="page">
    选择价格区间后「价格」会高亮
  </div>
</template>

<style scoped>
.page {
  padding: 48px 16px;
  color: var(--am-color-text-secondary);
  text-align: center;
}
</style>
