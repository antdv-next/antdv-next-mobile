<docs lang="zh-CN">
组件形式通过 `confirmLoading` 让确定按钮进入加载状态；静态方法的 `onOk` 返回 Promise 时，按钮会自动 loading 并在完成后关闭对话框。
</docs>

<docs lang="en-US">
In the component form, `confirmLoading` puts the OK button into the loading state; when `onOk` of a static method returns a Promise, the button shows loading automatically and the modal closes once it is done.
</docs>

<script setup lang="ts">
import { message, Modal } from '@antdv-next/mobile'
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
    title: 'Submit order?',
    content: 'Closes 1.5s after OK is clicked.',
    onOk: () => new Promise<void>((resolve) => {
      setTimeout(() => {
        message.success('Submitted')
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
      onOk returns a Promise
    </am-button>
  </am-flex>
  <am-modal v-model:open="open" title="Submit order?" :confirm-loading="confirmLoading" @ok="handleOk">
    Closes 1.5s after OK is clicked.
  </am-modal>
</template>
