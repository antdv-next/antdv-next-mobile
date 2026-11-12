<docs lang="zh-CN">
使用 `Modal.confirm()` 快捷地弹出确认框。`Modal.confirmAsync()` 返回 Promise，方便在 `async` 函数中使用。
</docs>

<script setup lang="ts">
import { message, Modal } from 'antdv-next-mobile'

function showConfirm() {
  Modal.confirm({
    title: '确定要退出登录吗？',
    content: '退出后将无法收到新消息通知。',
    onOk() {
      message.success('已退出')
    },
  })
}

function showDanger() {
  Modal.confirm({
    title: '删除这条记录？',
    content: '删除后不可恢复。',
    okText: '删除',
    okType: 'danger',
  })
}

async function showAsync() {
  const confirmed = await Modal.confirmAsync({ title: '是否保存本次修改？', okText: '保存', cancelText: '不保存' })
  message.info(confirmed ? '已保存' : '已放弃修改')
}
</script>

<template>
  <am-flex vertical gap="small">
    <am-button block @click="showConfirm">
      确认框
    </am-button>
    <am-button block danger @click="showDanger">
      危险操作
    </am-button>
    <am-button block @click="showAsync">
      await Modal.confirmAsync()
    </am-button>
  </am-flex>
</template>
