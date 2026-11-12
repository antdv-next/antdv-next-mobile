<docs lang="zh-CN">
基本的时间轴。
</docs>

<docs lang="en-US">
Basic timeline.
</docs>

<script setup lang="ts">
const items = [
  { content: 'Create a services site 2026-09-01' },
  { content: 'Solve initial network problems 2026-09-01' },
  { content: 'Testing failed 2026-09-01' },
  { content: 'Network problems being solved 2026-09-01' },
]
</script>

<template>
  <am-timeline :items="items" />
</template>
