<docs lang="zh-CN">
基本的时间轴。
</docs>

<script setup lang="ts">
const items = [
  { content: '创建服务现场 2026-09-01' },
  { content: '初步排除网络异常 2026-09-01' },
  { content: '技术测试异常 2026-09-01' },
  { content: '网络异常正在修复 2026-09-01' },
]
</script>

<template>
  <am-timeline :items="items" />
</template>
