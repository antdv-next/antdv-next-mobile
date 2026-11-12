<docs lang="zh-CN">
`orientation="vertical"` 渲染竖向步骤条，适合带有较长描述的流程，例如物流跟踪。
</docs>

<docs lang="en-US">
`orientation="vertical"` renders vertical steps, which suit flows with longer descriptions, such as delivery tracking.
</docs>

<script setup lang="ts">
import type { StepsItem } from '@antdv-next/mobile'

const items: StepsItem[] = [
  { title: 'Delivered', subTitle: '06-12 14:20', content: 'Signed for by the recipient. Thank you.' },
  { title: 'Out for delivery', subTitle: '06-12 09:05', content: 'The courier is on the way, please keep your phone on.' },
  { title: 'In transit', subTitle: '06-11 21:40', content: 'Arrived at the Hangzhou transfer center.' },
  { title: 'Picked up', subTitle: '06-10 18:12', content: 'Shipped by the seller and picked up by the courier.' },
]
</script>

<template>
  <am-steps orientation="vertical" :current="1" :items="items" />
</template>
