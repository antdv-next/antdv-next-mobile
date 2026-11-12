<docs lang="zh-CN">
组件形式通过 `confirmLoading` 让确定按钮进入加载状态；静态方法的 `onOk` 返回 Promise 时，按钮会自动 loading 并在完成后关闭对话框。
</docs>

<script setup lang="ts">
import { message, Modal } from 'antdv-next-mobile'
import { ref } from 'vue'

const open = ref(false)
const confirmLoading = ref(false)

function handleOk() {
  confirmLoading.value = true
  setTimeout(() => {
    open.value = false
    confirmLoading.value = false
  }, 1500)
}

function showConfirm() {
  Modal.confirm({
    title: '提交订单？',
    content: '点击确定后 1.5 秒关闭。',
    onOk: () => new Promise<void>((resolve) => {
      setTimeout(() => {
        message.success('提交成功')
        resolve()
      }, 1500)
    }),
  })
}
</script>

<template>
  <am-flex vertical gap="small">
    <am-button block @click="open = true">
      confirmLoading
    </am-button>
    <am-button block @click="showConfirm">
      onOk 返回 Promise
    </am-button>
  </am-flex>
  <am-modal v-model:open="open" title="提交订单？" :confirm-loading="confirmLoading" @ok="handleOk">
    点击确定后 1.5 秒关闭。
  </am-modal>
</template>
