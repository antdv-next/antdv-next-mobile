<docs lang="zh-CN">
可以通过节点的 `icon`、`loading`，或 `dotRender` 插槽自定义时间轴点。
</docs>

<script setup lang="ts">
import { CheckCircleFilled, ClockCircleOutlined, SmileOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const items = [
  { content: '创建服务现场 2026-09-01' },
  { content: '初步排除网络异常 2026-09-01', icon: () => h(ClockCircleOutlined), color: 'red' },
  { content: '技术测试中', loading: true },
  { content: '等待验收', icon: () => h(SmileOutlined), color: 'green' },
]

const steps = [
  { content: '提交申请', done: true },
  { content: '主管审批', done: true },
  { content: '财务打款', done: false },
]
</script>

<template>
  <am-flex vertical gap="large">
    <am-timeline :items="items" />
    <am-timeline :items="steps">
      <template #dotRender="{ index }">
        <CheckCircleFilled v-if="steps[index]?.done" style="color: var(--am-color-success)" />
      </template>
    </am-timeline>
  </am-flex>
</template>
