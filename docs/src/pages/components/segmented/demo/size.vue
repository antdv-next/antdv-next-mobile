<docs lang="zh-CN">
`size` 提供小、中、大三种尺寸，`shape="round"` 使用胶囊形状。
</docs>

<docs lang="en-US">
`size` provides small, middle and large sizes, and `shape="round"` uses a pill shape.
</docs>

<script setup lang="ts">
const options = ['List', 'Board', 'Calendar']
</script>

<template>
  <am-flex vertical gap="middle" align="flex-start">
    <am-segmented size="small" :options="options" />
    <am-segmented :options="options" />
    <am-segmented size="large" :options="options" />
    <am-segmented shape="round" :options="options" />
    <am-segmented shape="round" size="large" block :options="options" />
  </am-flex>
</template>
