<docs lang="zh-CN">
`mode="end"` 让时间轴点显示在内容的另一侧，也可以通过节点的 `placement` 单独指定。
</docs>

<docs lang="en-US">
`mode="end"` shows the dots on the other side of the content; it can also be specified per node with `placement`.
</docs>

<script setup lang="ts">
const items = [
  { content: 'Create a services site 2026-09-01' },
  { content: 'Solve initial network problems 2026-09-01' },
  { content: 'Testing failed 2026-09-01', color: 'red' },
  { content: 'Network problems being solved 2026-09-01' },
]
</script>

<template>
  <am-timeline mode="end" :items="items" />
</template>
