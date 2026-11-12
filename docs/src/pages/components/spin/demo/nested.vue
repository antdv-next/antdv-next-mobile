<docs lang="zh-CN">
可以直接把内容内嵌到 `Spin` 中，将现有容器变为加载状态。
</docs>

<docs lang="en-US">
Embed content into `Spin` directly to put an existing container into the loading state.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const spinning = ref(true)
</script>

<template>
  <am-flex vertical gap="middle">
    <am-spin :spinning="spinning" description="Loading...">
      <am-alert
        type="info"
        title="Alert title"
        description="Further details about the alert. You can tap and read it once loading is done."
      />
    </am-spin>
    <am-flex align="center" justify="space-between">
      <span>Loading</span>
      <am-switch v-model:checked="spinning" />
    </am-flex>
  </am-flex>
</template>
