<docs lang="zh-CN">
最基本的全局提示，3 秒后自动消失。
</docs>

<docs lang="en-US">
The most basic global message, dismissed automatically after 3 seconds.
</docs>

<script setup lang="ts">
import { message } from 'antdv-next-mobile'

function info() {
  message.info('This is a normal message')
}
</script>

<template>
  <am-button type="primary" block @click="info">
    Show message
  </am-button>
</template>
