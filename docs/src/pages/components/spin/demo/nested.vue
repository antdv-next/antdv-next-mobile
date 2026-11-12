<docs lang="zh-CN">
可以直接把内容内嵌到 `Spin` 中，将现有容器变为加载状态。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const spinning = ref(true)
</script>

<template>
  <am-flex vertical gap="middle">
    <am-spin :spinning="spinning" description="加载中...">
      <am-alert
        type="info"
        title="提示的标题"
        description="这里是关于提示内容的进一步描述，加载完成后可以正常点击和阅读。"
      />
    </am-spin>
    <am-flex align="center" justify="space-between">
      <span>加载状态</span>
      <am-switch v-model:checked="spinning" />
    </am-flex>
  </am-flex>
</template>
