<docs lang="zh-CN">
通过 `position` 设置垂直方向的显示位置。
</docs>

<script setup lang="ts">
import type { ToastPosition } from 'antdv-next-mobile'
import { Toast } from 'antdv-next-mobile'

function show(position: ToastPosition) {
  Toast.show({ content: `位置：${position}`, position })
}
</script>

<template>
  <am-flex gap="small" wrap>
    <am-button @click="show('top')">
      顶部
    </am-button>
    <am-button @click="show('center')">
      居中
    </am-button>
    <am-button @click="show('bottom')">
      底部
    </am-button>
  </am-flex>
</template>
