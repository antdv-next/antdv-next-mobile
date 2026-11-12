<docs lang="zh-CN">
内容超出一行时自动滚动，`delay` 控制开始前的停留时间，`speed` 控制速度；`scrollable` 可以强制滚动或禁止滚动。
</docs>

<script setup lang="ts">
const text = '在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准，优秀的代码读起来应该像一篇散文。'
</script>

<template>
  <am-flex vertical gap="small">
    <am-notice-bar :content="text" />
    <am-notice-bar :content="text" color="info" :delay="0" :speed="100" />
    <am-notice-bar content="内容较短时也强制滚动" color="success" scrollable />
    <am-notice-bar :content="text" color="default" :scrollable="false" />
  </am-flex>
</template>
