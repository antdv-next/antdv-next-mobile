<docs lang="zh-CN">
`type="dot"` 使用圆点代替图标，横向与竖向均可使用。
</docs>

<docs lang="en-US">
`type="dot"` uses dots instead of icons, and works both horizontally and vertically.
</docs>

<script setup lang="ts">
import type { StepsItem } from 'antdv-next-mobile'

const items: StepsItem[] = [
  { title: 'Details' },
  { title: 'Verify' },
  { title: 'Password' },
  { title: 'Done' },
]

const timeline: StepsItem[] = [
  { title: 'Request submitted', content: 'Tom · 09:00' },
  { title: 'Manager approval', content: 'Lily · In review' },
  { title: 'Finance approval' },
]
</script>

<template>
  <am-flex vertical gap="large">
    <am-steps type="dot" :current="2" :items="items" />
    <am-steps type="dot" orientation="vertical" :current="1" :items="timeline" />
  </am-flex>
</template>
