<docs lang="zh-CN">
`mode="alternate"` 让内容在时间轴两侧轮流出现。
</docs>

<script setup lang="ts">
import { ClockCircleOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const items = [
  { content: '创建服务现场' },
  { content: '初步排除网络异常', color: 'green' },
  { content: '技术测试异常，需要进一步排查', icon: () => h(ClockCircleOutlined) },
  { content: '网络异常正在修复', color: 'red' },
  { content: '修复完成', title: '09-02' },
]
</script>

<template>
  <am-timeline mode="alternate" :items="items" />
</template>
