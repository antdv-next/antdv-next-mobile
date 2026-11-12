<docs lang="zh-CN">
通知可以从顶部或底部弹出，并自动避开安全区。PC 端的 `topLeft`、`bottomRight` 等角落位置会分别映射为 `top`、`bottom`。
</docs>

<docs lang="en-US">
A notification pops up from the top or the bottom and avoids the safe area. The corner placements of PC such as `topLeft` and `bottomRight` map to `top` and `bottom`.
</docs>

<script setup lang="ts">
import type { NotificationPlacement } from 'antdv-next-mobile'
import { notification } from 'antdv-next-mobile'

function open(placement: NotificationPlacement) {
  notification.info({
    title: `Placement: ${placement}`,
    description: 'Swipe towards the edge to dismiss.',
    placement,
  })
}
</script>

<template>
  <am-flex gap="small" wrap>
    <am-button @click="open('top')">
      top
    </am-button>
    <am-button @click="open('bottom')">
      bottom
    </am-button>
    <am-button @click="open('bottomRight')">
      bottomRight
    </am-button>
  </am-flex>
</template>
