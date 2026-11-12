<docs lang="zh-CN">
`contentAlign="end"` 让内容靠右对齐，配合 `colon=false` 即为移动端常见的订单详情样式。
</docs>

<script setup lang="ts">
const items = [
  { key: 'no', label: '订单编号', content: '2026090112345678' },
  { key: 'time', label: '下单时间', content: '2026-09-01 12:30:45' },
  { key: 'pay', label: '支付方式', content: '在线支付' },
  { key: 'amount', label: '实付金额', content: '¥ 268.00', styles: { content: { color: 'var(--am-color-error)', fontWeight: 600 } } },
]
</script>

<template>
  <am-descriptions title="订单信息" :items="items" :colon="false" content-align="end" />
</template>
