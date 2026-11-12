<docs lang="zh-CN">
通过 `position` 设置垂直方向的显示位置。
</docs>

<docs lang="en-US">
Set the vertical position with `position`.
</docs>

<script setup lang="ts">
import type { ToastPosition } from 'antdv-next-mobile'
import { Toast } from 'antdv-next-mobile'

function show(position: ToastPosition) {
  Toast.show({ content: `Position: ${position}`, position })
}
</script>

<template>
  <am-flex gap="small" wrap>
    <am-button @click="show('top')">
      Top
    </am-button>
    <am-button @click="show('center')">
      Center
    </am-button>
    <am-button @click="show('bottom')">
      Bottom
    </am-button>
  </am-flex>
</template>
