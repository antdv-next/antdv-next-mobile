<docs lang="zh-CN">
`accordion` 手风琴模式，每次只展开一个面板。`v-model:activeKey` 始终返回数组。
</docs>

<script setup lang="ts">
import type { CollapseItemType } from 'antdv-next-mobile'
import { ref } from 'vue'

const items: CollapseItemType[] = [
  { key: 'ship', label: '多久可以发货？', content: '付款后 24 小时内发货，预售商品以详情页说明为准。' },
  { key: 'return', label: '支持七天无理由退货吗？', content: '支持。签收后 7 天内，商品完好且不影响二次销售即可申请。' },
  { key: 'invoice', label: '如何开具发票？', content: '在「我的订单 - 订单详情」中点击「申请开票」，电子发票将发送到您的邮箱。' },
]

const activeKey = ref<(string | number)[]>(['ship'])
</script>

<template>
  <am-collapse v-model:active-key="activeKey" accordion :items="items" />
  <div class="tip">
    activeKey: {{ activeKey }}
  </div>
</template>

<style scoped>
.tip {
  padding: 12px 16px;
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}
</style>
