<docs lang="zh-CN">
`extra` 在标题右侧展示附加内容，`showArrow: false` 隐藏展开图标，`expandIconPlacement="start"` 把图标放到左侧。
</docs>

<script setup lang="ts">
import type { CollapseItemType } from 'antdv-next-mobile'

const items: CollapseItemType[] = [
  { key: '1', label: '订单信息', extra: '3 件商品', content: '订单编号：2024061200001' },
  { key: '2', label: '配送信息', extra: '已签收', content: '收货人：张三，浙江省杭州市西湖区' },
  { key: '3', label: '没有箭头的面板', showArrow: false, content: '点击标题同样可以展开和收起。' },
]
</script>

<template>
  <am-collapse :items="items" expand-icon-placement="start" />
</template>
