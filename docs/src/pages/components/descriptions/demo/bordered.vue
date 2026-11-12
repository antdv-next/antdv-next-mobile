<docs lang="zh-CN">
带边框和背景颜色的列表。
</docs>

<script setup lang="ts">
const items = [
  { key: 'product', label: '产品', content: '云数据库' },
  { key: 'billing', label: '计费模式', content: '预付费' },
  { key: 'renew', label: '自动续费', content: '是' },
  { key: 'config', label: '配置信息', content: '数据盘类型：MongoDB；数据库版本：3.4；存储空间：10 GB；副本数：3' },
]
</script>

<template>
  <am-descriptions title="带边框" bordered :items="items" />
</template>
