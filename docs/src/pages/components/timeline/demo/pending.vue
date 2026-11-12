<docs lang="zh-CN">
当任务状态正在发生，还在记录过程中，可用 `pending` 展示幽灵节点；`reverse` 控制节点排序。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const reverse = ref(false)
const items = [
  { content: '创建服务现场 2026-09-01' },
  { content: '初步排除网络异常 2026-09-01' },
  { content: '技术测试异常 2026-09-01' },
]
</script>

<template>
  <am-flex vertical gap="middle">
    <am-timeline :items="items" pending="记录中..." :reverse="reverse" />
    <am-button block @click="reverse = !reverse">
      切换排序
    </am-button>
  </am-flex>
</template>
