<docs lang="zh-CN">
`mode="end"` 让时间轴点显示在内容的另一侧，也可以通过节点的 `placement` 单独指定。
</docs>

<script setup lang="ts">
const items = [
  { content: '创建服务现场 2026-09-01' },
  { content: '初步排除网络异常 2026-09-01' },
  { content: '技术测试异常 2026-09-01', color: 'red' },
  { content: '网络异常正在修复 2026-09-01' },
]
</script>

<template>
  <am-timeline mode="end" :items="items" />
</template>
