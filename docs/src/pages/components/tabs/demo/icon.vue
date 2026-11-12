<docs lang="zh-CN">
`icon` 为标签添加图标，`disabled` 禁用标签，`rightExtra` / `leftExtra` 插槽在标签栏两侧放置附加操作。
</docs>

<script setup lang="ts">
import type { TabsItem } from 'antdv-next-mobile'
import { AppstoreOutlined, FilterOutlined, HeartOutlined, StarOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const items: TabsItem[] = [
  { key: 'all', label: '全部', icon: () => h(AppstoreOutlined), content: '全部内容' },
  { key: 'star', label: '收藏', icon: () => h(StarOutlined), content: '收藏的内容' },
  { key: 'like', label: '喜欢', icon: () => h(HeartOutlined), content: '喜欢的内容', disabled: true },
]
</script>

<template>
  <am-tabs :items="items" :styles="{ content: { padding: '16px' } }">
    <template #rightExtra>
      <FilterOutlined style="font-size: 18px" />
    </template>
  </am-tabs>
</template>
