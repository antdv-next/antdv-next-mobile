<docs lang="zh-CN">
典型的搜索场景：输入内容作为关键词，高亮结果列表中的匹配文字。关键词默认按字面量匹配，特殊字符（如 `+`、`.`）无需转义。
</docs>

<docs lang="en-US">
A typical search scenario: the input is used as the keyword and the matching text in the result list is highlighted. Keywords are matched literally by default, so special characters such as `+` or `.` need no escaping.
</docs>

<script setup lang="ts">
import { computed, ref } from 'vue'

const keyword = ref('pro')
const products = [
  'Phone 17 Pro Max 256GB',
  'Laptop Pro 14-inch (M5)',
  'Wireless Earbuds Pro 3',
  'Protective Case for Phone 17',
  'Smart Watch Series 11',
]

const results = computed(() => {
  const value = keyword.value.trim().toLowerCase()
  return value ? products.filter(item => item.toLowerCase().includes(value)) : products
})
</script>

<template>
  <am-flex vertical gap="small">
    <am-input v-model:value="keyword" placeholder="Search products" allow-clear />
    <div v-for="item in results" :key="item" class="result">
      <am-highlight :content="item" :keywords="keyword.trim()" />
    </div>
    <div v-if="!results.length" class="result result-empty">
      No results
    </div>
  </am-flex>
</template>

<style scoped>
.result {
  padding: 10px 0;
  color: var(--am-color-text);
  font-size: 15px;
  border-bottom: 1px solid var(--am-color-split);
}

.result-empty {
  color: var(--am-color-text-description);
  text-align: center;
  border-bottom: none;
}
</style>
