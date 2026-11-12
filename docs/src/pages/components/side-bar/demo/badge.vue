<docs lang="zh-CN">
`badge` 为数字或文字时显示徽标，为 `true` 时显示红点。
</docs>

<script setup lang="ts">
import type { SideBarItem } from 'antdv-next-mobile'

const items: SideBarItem[] = [
  { key: 'all', title: '全部订单' },
  { key: 'pay', title: '待付款', badge: 5 },
  { key: 'ship', title: '待发货', badge: '99+' },
  { key: 'receive', title: '待收货', badge: true },
  { key: 'review', title: '待评价' },
]
</script>

<template>
  <div class="layout">
    <am-side-bar :items="items" />
  </div>
</template>

<style scoped>
.layout {
  height: 260px;
  background: var(--am-color-bg-container);
}
</style>
