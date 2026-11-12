<docs lang="zh-CN">
`column` 设置一行的列数，`span` 设置单项占据的列数，`'filled'` 占满当前行剩余的列。
</docs>

<script setup lang="ts">
const items = [
  { key: 'product', label: '产品', content: '云数据库' },
  { key: 'billing', label: '计费', content: '预付费' },
  { key: 'time', label: '到期时间', content: '2027-09-01 00:00:00', span: 2 },
  { key: 'region', label: '地域', content: '华东 1' },
  { key: 'status', label: '状态', content: '运行中', span: 'filled' as const },
  { key: 'remark', label: '备注', content: '最后一项会自动占满整行' },
]
</script>

<template>
  <am-descriptions title="实例信息" :column="2" :items="items" />
</template>
