<docs lang="zh-CN">
`active` 为 `false` 时停止动画，显示为底色的普通文字。常用于任务结束后切换状态。
</docs>

<docs lang="en-US">
With `active` set to `false` the animation stops and the text is rendered in the base color. Handy to switch the state when a task finished.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <am-flex justify="space-between" align="center">
    <am-shimmer-text :active="loading" :content="loading ? 'Uploading photos...' : 'Upload finished'" />
    <am-switch v-model:checked="loading" />
  </am-flex>
</template>
