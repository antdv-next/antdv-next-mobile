<docs lang="zh-CN">
进行全局 loading，返回的函数用于异步自行移除。
</docs>

<script setup lang="ts">
import { message } from 'antdv-next-mobile'

function load() {
  const hide = message.loading('正在加载...', 0)
  setTimeout(hide, 2500)
}
</script>

<template>
  <am-button block @click="load">
    显示加载中
  </am-button>
</template>
