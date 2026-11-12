<docs lang="zh-CN">
通过 `items` 配置步骤，`current` 指定当前步骤（从 0 开始）。
</docs>

<script setup lang="ts">
import type { StepsItem } from 'antdv-next-mobile'

const items: StepsItem[] = [
  { title: '买家下单', content: '10:30' },
  { title: '商家接单', content: '10:32' },
  { title: '买家提货' },
  { title: '交易完成' },
]
</script>

<template>
  <am-steps :current="1" :items="items" />
</template>
