<docs lang="zh-CN">
通过 `items` 配置面板，可以同时展开多个面板。`defaultActiveKey` 设置初始展开的面板。
</docs>

<docs lang="en-US">
Configure the panels through `items`; more than one panel can be expanded at the same time. `defaultActiveKey` sets the initially expanded panels.
</docs>

<script setup lang="ts">
import type { CollapseItemType } from '@antdv-next/mobile'

const text = 'A collapse groups and hides complex areas to keep the page clean. Tap a header to expand or collapse its content.'

const items: CollapseItemType[] = [
  { key: '1', label: 'Panel 1', content: text },
  { key: '2', label: 'Panel 2', content: text },
  { key: '3', label: 'Panel 3', content: text },
]
</script>

<template>
  <am-collapse :items="items" :default-active-key="['1']" />
</template>
