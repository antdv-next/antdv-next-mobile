<docs lang="zh-CN">
通过 `classes` / `styles` 定制语义化结构，或覆盖 `--am-descriptions-*` 组件变量。
</docs>

<script setup lang="ts">
const items = [
  { key: 'name', label: '收货人', content: '周毛毛' },
  { key: 'phone', label: '联系电话', content: '181 0000 0000' },
  { key: 'address', label: '收货地址', content: '浙江省杭州市西湖区万塘路 18 号黄龙时代广场 B 座' },
]
</script>

<template>
  <am-flex vertical gap="large">
    <am-descriptions
      title="语义化样式"
      :items="items"
      :styles="{ label: { width: '5em' }, content: { fontWeight: 600 } }"
    />
    <am-descriptions title="组件变量" bordered :items="items" class="custom-descriptions" />
  </am-flex>
</template>

<style scoped>
.custom-descriptions {
  --am-descriptions-label-width: 96px;
  --am-descriptions-label-bg: var(--am-color-primary-bg);
  --am-descriptions-border-color: var(--am-color-primary-border);
  --am-descriptions-border-radius: 12px;
}
</style>
