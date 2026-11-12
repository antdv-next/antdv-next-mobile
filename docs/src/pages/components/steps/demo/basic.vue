<docs lang="zh-CN">
通过 `items` 配置步骤，`current` 指定当前步骤（从 0 开始）。
</docs>

<docs lang="en-US">
Configure the steps with `items`; `current` specifies the current step (starting from 0).
</docs>

<script setup lang="ts">
import type { StepsItem } from 'antdv-next-mobile'

const items: StepsItem[] = [
  { title: 'Ordered', content: '10:30' },
  { title: 'Accepted', content: '10:32' },
  { title: 'Picked up' },
  { title: 'Done' },
]
</script>

<template>
  <am-steps :current="1" :items="items" />
</template>
