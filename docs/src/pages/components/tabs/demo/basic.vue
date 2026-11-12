<docs lang="zh-CN">
通过 `items` 配置标签页，默认激活第一项。标签不超过 4 个时等分标签栏宽度。
</docs>

<docs lang="en-US">
Configure the tabs with `items`. The first tab is active by default. When there are no more than 4 tabs, they share the tab bar width equally.
</docs>

<script setup lang="ts">
import type { TabsItem } from 'antdv-next-mobile'

const items: TabsItem[] = [
  { key: '1', label: 'Tab 1', content: 'Content 1' },
  { key: '2', label: 'Tab 2', content: 'Content 2' },
  { key: '3', label: 'Tab 3', content: 'Content 3' },
]
</script>

<template>
  <am-tabs :items="items" :styles="{ content: { padding: '16px' } }" />
</template>
