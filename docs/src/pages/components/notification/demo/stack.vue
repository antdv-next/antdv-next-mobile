<docs lang="zh-CN">
同一侧的通知超过 3 条（`stack.threshold`）时会折叠成一叠，点击展开，点击其他区域收起。`notification.config({ stack: false })` 可以关闭堆叠，`maxCount` 限制最大显示数。
</docs>

<docs lang="en-US">
More than 3 notifications (`stack.threshold`) on one edge collapse into a stack: tap it to expand, tap elsewhere to fold it again. Turn stacking off with `notification.config({ stack: false })`, and limit the number with `maxCount`.
</docs>

<script setup lang="ts">
import { notification } from 'antdv-next-mobile'

let count = 0

function open() {
  count += 1
  notification.open({
    title: `Notification ${count}`,
    description: 'Open a few more to see them stack.',
    duration: 8,
  })
}
</script>

<template>
  <am-flex vertical gap="small">
    <am-button type="primary" block @click="open">
      Open one more
    </am-button>
    <am-button block @click="notification.destroy()">
      Destroy all
    </am-button>
  </am-flex>
</template>
