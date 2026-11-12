<docs lang="zh-CN">
选项列表默认开启虚拟滚动（`virtual`），5,000 个选项也只渲染可视区域附近的十几项，搜索、多选、分组都照常工作；打开弹层时已选项会滚动到列表中间。`listHeight` 设置列表的最大高度，`listItemHeight` 设置选项高度。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const options = Array.from({ length: 5000 }, (_, index) => ({
  label: `员工 ${String(index + 1).padStart(4, '0')}`,
  value: index + 1,
  description: index % 3 === 0 ? `工号 E${10000 + index}` : undefined,
}))
const plain = options.map(({ label, value }) => ({ label, value }))

const single = ref<number | null>(3200)
const multiple = ref<number[]>([])
</script>

<template>
  <am-flex vertical gap="small">
    <am-select v-model:value="single" :options="options" show-search title="选择员工" placeholder="5,000 个选项（高度不固定）" />
    <am-select
      v-model:value="multiple"
      :options="plain"
      mode="multiple"
      :max-tag-count="3"
      :list-height="280"
      :list-item-height="44"
      title="选择多名员工"
      placeholder="多选 · listHeight 280 · listItemHeight 44"
    />
  </am-flex>
</template>
