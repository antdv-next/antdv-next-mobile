<docs lang="zh-CN">
圆圈颜色：绿色用于已完成、成功状态，红色表示告警或错误状态，蓝色表示正在进行或其他默认状态，灰色表示未完成或失效状态；也可以传入任意色值。`variant="filled"` 为实心圆点。
</docs>

<script setup lang="ts">
const items = [
  { color: 'green', content: '创建服务现场 2026-09-01' },
  { color: 'red', content: '初步排除网络异常，发现机房故障' },
  { content: '技术测试异常 2026-09-01' },
  { color: 'gray', content: '网络异常正在修复 2026-09-01' },
  { color: '#00ccff', content: '自定义颜色 #00ccff' },
]
</script>

<template>
  <am-flex gap="large">
    <am-timeline :items="items" style="flex: 1" />
    <am-timeline :items="items" variant="filled" style="flex: 1" />
  </am-flex>
</template>
