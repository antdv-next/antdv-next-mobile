<docs lang="zh-CN">
`maskClickable` 设为 `false` 后，提示显示期间页面不可点击和滚动。
</docs>

<docs lang="en-US">
With `maskClickable` set to `false`, the page cannot be clicked or scrolled while the toast is shown.
</docs>

<script setup lang="ts">
import { Toast } from '@antdv-next/mobile'

function show() {
  Toast.show({ content: 'Page is blocked for 3s', duration: 3000, maskClickable: false })
}
</script>

<template>
  <am-button block @click="show">
    Block background clicks
  </am-button>
</template>
