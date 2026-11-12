<docs lang="zh-CN">
`icon` 为标签添加图标，`disabled` 禁用标签，`rightExtra` / `leftExtra` 插槽在标签栏两侧放置附加操作。
</docs>

<docs lang="en-US">
`icon` adds an icon to a tab, `disabled` disables a tab, and the `rightExtra` / `leftExtra` slots place extra actions on either side of the tab bar.
</docs>

<script setup lang="ts">
import type { TabsItem } from 'antdv-next-mobile'
import { AppstoreOutlined, FilterOutlined, HeartOutlined, StarOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const items: TabsItem[] = [
  { key: 'all', label: 'All', icon: () => h(AppstoreOutlined), content: 'All content' },
  { key: 'star', label: 'Starred', icon: () => h(StarOutlined), content: 'Starred content' },
  { key: 'like', label: 'Liked', icon: () => h(HeartOutlined), content: 'Liked content', disabled: true },
]
</script>

<template>
  <am-tabs :items="items" :styles="{ content: { padding: '16px' } }">
    <template #rightExtra>
      <FilterOutlined style="font-size: 18px" />
    </template>
  </am-tabs>
</template>
