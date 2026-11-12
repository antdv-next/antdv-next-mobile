<docs lang="zh-CN">
可以通过节点的 `icon`、`loading`，或 `dotRender` 插槽自定义时间轴点。
</docs>

<docs lang="en-US">
Customize the dots through `icon` and `loading` of a node, or through the `dotRender` slot.
</docs>

<script setup lang="ts">
import { CheckCircleFilled, ClockCircleOutlined, SmileOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const items = [
  { content: 'Create a services site 2026-09-01' },
  { content: 'Solve initial network problems 2026-09-01', icon: () => h(ClockCircleOutlined), color: 'red' },
  { content: 'Testing in progress', loading: true },
  { content: 'Awaiting acceptance', icon: () => h(SmileOutlined), color: 'green' },
]

const steps = [
  { content: 'Submit request', done: true },
  { content: 'Manager approval', done: true },
  { content: 'Payment', done: false },
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
