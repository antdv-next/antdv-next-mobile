<docs lang="zh-CN">
通过 `loading` 在内容加载完成前显示加载指示器。
</docs>

<docs lang="en-US">
Show a loading indicator with `loading` until the content has finished loading.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const loading = ref(false)

function show() {
  open.value = true
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1500)
}
</script>

<template>
  <am-button block @click="show">
    Open and load
  </am-button>
  <am-drawer v-model:open="open" title="Order details" :loading="loading" height="50%">
    <p>Order No.: 202611110001</p>
    <p>Ordered at: 2026-11-11 10:00</p>
    <p>Status: Shipped</p>
  </am-drawer>
</template>
