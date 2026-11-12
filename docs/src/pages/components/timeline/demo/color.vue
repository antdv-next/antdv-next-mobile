<docs lang="zh-CN">
圆圈颜色：绿色用于已完成、成功状态，红色表示告警或错误状态，蓝色表示正在进行或其他默认状态，灰色表示未完成或失效状态；也可以传入任意色值。`variant="filled"` 为实心圆点。
</docs>

<docs lang="en-US">
Color of the circles: green means completed or success status, red means warning or error, blue means ongoing or other default status, and gray means unfinished or disabled status; any color value can be passed as well. `variant="filled"` gives solid dots.
</docs>

<script setup lang="ts">
const items = [
  { color: 'green', content: 'Create a services site 2026-09-01' },
  { color: 'red', content: 'Network problems solved, server room fault found' },
  { content: 'Testing failed 2026-09-01' },
  { color: 'gray', content: 'Network problems being solved 2026-09-01' },
  { color: '#00ccff', content: 'Custom color #00ccff' },
]
</script>

<template>
  <am-flex gap="large">
    <am-timeline :items="items" style="flex: 1" />
    <am-timeline :items="items" variant="filled" style="flex: 1" />
  </am-flex>
</template>
