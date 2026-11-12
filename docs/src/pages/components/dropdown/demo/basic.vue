<docs lang="zh-CN">
`DropdownItem` 通过 `options` 渲染单选列表，`v-model:value` 绑定选中值。未设置 `title` 时，菜单栏显示已选选项的文字。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const sort = ref('default')
const category = ref('all')

const sortOptions = [
  { label: '综合排序', value: 'default' },
  { label: '销量优先', value: 'sales' },
  { label: '价格从低到高', value: 'price-asc' },
  { label: '价格从高到低', value: 'price-desc' },
]
const categoryOptions = [
  { label: '全部商品', value: 'all' },
  { label: '新款商品', value: 'new' },
  { label: '活动商品', value: 'sale' },
  { label: '预售商品（暂未开放）', value: 'presale', disabled: true },
]
</script>

<template>
  <am-dropdown>
    <am-dropdown-item key="category" v-model:value="category" :options="categoryOptions" />
    <am-dropdown-item key="sort" v-model:value="sort" :options="sortOptions" />
  </am-dropdown>
  <div class="page">
    当前：{{ category }} / {{ sort }}
  </div>
</template>

<style scoped>
.page {
  padding: 48px 16px;
  color: var(--am-color-text-secondary);
  text-align: center;
}
</style>
