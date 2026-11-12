<docs lang="zh-CN">
`ghost` 让折叠面板背景透明、没有细线，适合放在卡片里；`size` 提供三种尺寸，`bordered` 控制细线。
</docs>

<script setup lang="ts">
import type { CollapseItemType } from 'antdv-next-mobile'
import { ref } from 'vue'

const items: CollapseItemType[] = [
  { key: '1', label: '什么是幽灵模式？', content: '背景透明、没有细线的折叠面板。' },
  { key: '2', label: '可以调整尺寸吗？', content: '可以，通过 size 设置 small / middle / large。' },
]

const size = ref<'small' | 'middle' | 'large'>('small')
</script>

<template>
  <am-flex vertical gap="middle">
    <am-segmented v-model:value="size" block :options="['small', 'middle', 'large']" />
    <am-collapse ghost :size="size" :items="items" :default-active-key="['1']" />
  </am-flex>
</template>
