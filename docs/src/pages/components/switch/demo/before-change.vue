<docs lang="zh-CN">
`beforeChange` 在切换前被调用，返回 Promise 时开关自动进入加载状态；resolve `false` 或 reject 则取消本次切换。适合「先请求接口，成功后再切换」的场景。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const success = ref(false)
const fail = ref(false)

function requestOk() {
  return new Promise<void>(resolve => setTimeout(resolve, 1000))
}

function requestFail() {
  return new Promise<boolean>(resolve => setTimeout(() => resolve(false), 1000))
}
</script>

<template>
  <am-flex vertical gap="middle">
    <am-flex align="center" gap="small">
      <am-switch v-model:checked="success" :before-change="requestOk" />
      <span>1 秒后切换成功</span>
    </am-flex>
    <am-flex align="center" gap="small">
      <am-switch v-model:checked="fail" :before-change="requestFail" />
      <span>1 秒后切换失败，保持原状态</span>
    </am-flex>
  </am-flex>
</template>
