<docs lang="zh-CN">
`size` 控制列表项的间距，`bordered` 时控制单元格内边距。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const size = ref<'small' | 'middle' | 'large'>('small')
const options = [
  { label: '小', value: 'small' },
  { label: '中', value: 'middle' },
  { label: '大', value: 'large' },
]
const items = [
  { key: 'product', label: '产品', content: '云数据库' },
  { key: 'billing', label: '计费模式', content: '预付费' },
  { key: 'renew', label: '自动续费', content: '是' },
]
</script>

<template>
  <am-flex vertical gap="middle">
    <am-flex gap="small">
      <am-button
        v-for="option in options"
        :key="option.value"
        size="small"
        :type="size === option.value ? 'primary' : 'default'"
        @click="size = option.value as typeof size"
      >
        {{ option.label }}
      </am-button>
    </am-flex>
    <am-descriptions :size="size" bordered :items="items" />
    <am-descriptions :size="size" :items="items" />
  </am-flex>
</template>
