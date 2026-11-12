<docs lang="zh-CN">
`collapsible` 控制可折叠的触发区域：`header` 只有点击标题文字才触发，`icon` 只有点击图标才触发，`disabled` 禁用面板。
</docs>

<script setup lang="ts">
import type { CollapseItemType } from 'antdv-next-mobile'

const items: CollapseItemType[] = [
  { key: 'header', label: '只有点击这段文字才能展开', collapsible: 'header', content: '标题右侧的空白区域不会触发展开。' },
  { key: 'icon', label: '只有点击右侧箭头才能展开', collapsible: 'icon', content: '适合标题区域还有其他可点击内容的场景。' },
  { key: 'disabled', label: '禁用的面板', collapsible: 'disabled', content: '不会展示。' },
]
</script>

<template>
  <am-collapse :items="items" />
</template>
