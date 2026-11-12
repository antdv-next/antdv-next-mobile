<docs lang="zh-CN">
通过 `items` 配置面板，可以同时展开多个面板。`defaultActiveKey` 设置初始展开的面板。
</docs>

<script setup lang="ts">
import type { CollapseItemType } from 'antdv-next-mobile'

const text = '折叠面板可以对复杂区域进行分组和隐藏，保持页面的整洁。点击标题即可展开或收起对应的内容区域。'

const items: CollapseItemType[] = [
  { key: '1', label: '第一项', content: text },
  { key: '2', label: '第二项', content: text },
  { key: '3', label: '第三项', content: text },
]
</script>

<template>
  <am-collapse :items="items" :default-active-key="['1']" />
</template>
