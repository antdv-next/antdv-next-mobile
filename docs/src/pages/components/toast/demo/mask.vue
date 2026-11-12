<docs lang="zh-CN">
`maskClickable` 设为 `false` 后，提示显示期间页面不可点击和滚动。
</docs>

<script setup lang="ts">
import { Toast } from 'antdv-next-mobile'

function show() {
  Toast.show({ content: '3 秒内无法操作页面', duration: 3000, maskClickable: false })
}
</script>

<template>
  <am-button block @click="show">
    阻止背景点击
  </am-button>
</template>
