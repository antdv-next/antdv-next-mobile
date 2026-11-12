<docs lang="zh-CN">
通过 `loading` 在内容加载完成前显示加载指示器。
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
    打开并加载
  </am-button>
  <am-drawer v-model:open="open" title="订单详情" :loading="loading" height="50%">
    <p>订单编号：202611110001</p>
    <p>下单时间：2026-11-11 10:00</p>
    <p>订单状态：已发货</p>
  </am-drawer>
</template>
