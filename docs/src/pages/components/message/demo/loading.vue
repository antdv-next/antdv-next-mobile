<docs lang="zh-CN">
进行全局 loading，返回的函数用于异步自行移除。
</docs>

<docs lang="en-US">
Display a global loading indicator; the returned function is used to dismiss it yourself asynchronously.
</docs>

<script setup lang="ts">
import { message } from '@antdv-next/mobile'

function load() {
  const hide = message.loading('Loading...', 0)
  setTimeout(hide, 2500)
}
</script>

<template>
  <am-button block @click="load">
    Show loading
  </am-button>
</template>
