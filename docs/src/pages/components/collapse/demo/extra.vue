<docs lang="zh-CN">
`extra` 在标题右侧展示附加内容，`showArrow: false` 隐藏展开图标，`expandIconPlacement="start"` 把图标放到左侧。
</docs>

<docs lang="en-US">
`extra` shows extra content on the right side of the title, `showArrow: false` hides the expand icon, and `expandIconPlacement="start"` puts the icon on the left.
</docs>

<script setup lang="ts">
import type { CollapseItemType } from '@antdv-next/mobile'

const items: CollapseItemType[] = [
  { key: '1', label: 'Order', extra: '3 items', content: 'Order No. 2024061200001' },
  { key: '2', label: 'Delivery', extra: 'Delivered', content: 'Recipient: John Brown, Xihu District, Hangzhou, Zhejiang' },
  { key: '3', label: 'Panel without arrow', showArrow: false, content: 'Tapping the header still expands and collapses it.' },
]
</script>

<template>
  <am-collapse :items="items" expand-icon-placement="start" />
</template>
