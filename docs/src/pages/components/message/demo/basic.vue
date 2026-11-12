<docs lang="zh-CN">
最基本的全局提示，3 秒后自动消失。
</docs>

<script setup lang="ts">
import { message } from 'antdv-next-mobile'

function info() {
  message.info('这是一条普通的提示')
}
</script>

<template>
  <am-button type="primary" block @click="info">
    显示提示
  </am-button>
</template>
