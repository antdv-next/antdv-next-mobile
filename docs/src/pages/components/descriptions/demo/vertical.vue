<docs lang="zh-CN">
垂直的列表，标签在上、内容在下，可以与 `column`、`bordered` 组合使用。
</docs>

<docs lang="en-US">
A vertical list with the label above the content, which can be combined with `column` and `bordered`.
</docs>

<script setup lang="ts">
const items = [
  { key: 'name', label: 'UserName', content: 'Zhou Maomao' },
  { key: 'phone', label: 'Telephone', content: '181 0000 0000' },
  { key: 'address', label: 'Address', content: 'No. 18 Wantang Road, Xihu District, Hangzhou, Zhejiang', span: 2 },
]
</script>

<template>
  <am-flex vertical gap="large">
    <am-descriptions title="Vertical" layout="vertical" :column="2" :items="items" />
    <am-descriptions title="Vertical Bordered" layout="vertical" bordered :column="2" :items="items" />
  </am-flex>
</template>
