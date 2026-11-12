<docs lang="zh-CN">
通过 `items` 配置标签页，默认激活第一项。标签不超过 4 个时等分标签栏宽度。
</docs>

<script setup lang="ts">
import type { TabsItem } from 'antdv-next-mobile'

const items: TabsItem[] = [
  { key: '1', label: '标签一', content: '内容一' },
  { key: '2', label: '标签二', content: '内容二' },
  { key: '3', label: '标签三', content: '内容三' },
]
</script>

<template>
  <am-tabs :items="items" :styles="{ content: { padding: '16px' } }" />
</template>
