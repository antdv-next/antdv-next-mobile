<docs lang="zh-CN">
`orientation="vertical"` 渲染竖向步骤条，适合带有较长描述的流程，例如物流跟踪。
</docs>

<script setup lang="ts">
import type { StepsItem } from 'antdv-next-mobile'

const items: StepsItem[] = [
  { title: '已签收', subTitle: '06-12 14:20', content: '快件已由本人签收，感谢使用。' },
  { title: '派送中', subTitle: '06-12 09:05', content: '快递员正在为您派送，请保持电话畅通。' },
  { title: '运输中', subTitle: '06-11 21:40', content: '快件已到达【杭州转运中心】。' },
  { title: '已揽收', subTitle: '06-10 18:12', content: '商家已发货，快递员已揽收。' },
]
</script>

<template>
  <am-steps orientation="vertical" :current="1" :items="items" />
</template>
