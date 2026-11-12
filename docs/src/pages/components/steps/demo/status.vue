<docs lang="zh-CN">
`status` 指定当前步骤的状态，也可以在 `items` 中为某一步单独指定 `status`。
</docs>

<docs lang="en-US">
`status` specifies the status of the current step; a `status` can also be set for an individual step in `items`.
</docs>

<script setup lang="ts">
import type { StepsItem } from '@antdv-next/mobile'

const items: StepsItem[] = [
  { title: 'Apply' },
  { title: 'Review', content: 'ID photo is blurry' },
  { title: 'Activated' },
]
</script>

<template>
  <am-flex vertical gap="large">
    <am-steps :current="1" status="error" :items="items" />
    <am-steps :current="2" status="finish" :items="items.map(item => ({ title: item.title }))" />
  </am-flex>
</template>
