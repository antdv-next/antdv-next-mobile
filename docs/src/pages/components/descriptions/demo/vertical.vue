<docs lang="zh-CN">
垂直的列表，标签在上、内容在下，可以与 `column`、`bordered` 组合使用。
</docs>

<script setup lang="ts">
const items = [
  { key: 'name', label: '用户名', content: '周毛毛' },
  { key: 'phone', label: '手机号', content: '181 0000 0000' },
  { key: 'address', label: '地址', content: '浙江省杭州市西湖区万塘路 18 号', span: 2 },
]
</script>

<template>
  <am-flex vertical gap="large">
    <am-descriptions title="垂直布局" layout="vertical" :column="2" :items="items" />
    <am-descriptions title="垂直带边框" layout="vertical" bordered :column="2" :items="items" />
  </am-flex>
</template>
