<docs lang="zh-CN">
设置 `title` 后，标题会显示在时间轴的另一侧，`titleSpan` 调整标题列的宽度。
</docs>

<script setup lang="ts">
const items = [
  { title: '09-01 09:12', content: '创建服务现场' },
  { title: '09-01 11:30', content: '初步排除网络异常' },
  { title: '09-02 08:05', content: '技术测试异常' },
  { content: '没有标题的节点' },
]
</script>

<template>
  <am-timeline :items="items" title-span="88px" />
</template>
