<docs lang="zh-CN">
通过 `actions` 自定义操作按钮：不超过 2 个时横向排列，超过 2 个时纵向堆叠。`Modal.show()` 默认在点击操作后关闭。
</docs>

<script setup lang="ts">
import type { ModalAction } from 'antdv-next-mobile'
import { message, Modal } from 'antdv-next-mobile'
import { ref } from 'vue'

const open = ref(false)

const actions: ModalAction[] = [
  { key: 'online', text: '在线支付', bold: true },
  { key: 'offline', text: '货到付款' },
  { key: 'disabled', text: '找人代付（暂不可用）', disabled: true },
  { key: 'cancel', text: '取消订单', danger: true },
]

function onAction(action: ModalAction) {
  message.info(`点击了：${action.key}`)
}

function showStatic() {
  Modal.show({
    title: '发现新版本',
    content: '新版本带来了更流畅的体验，是否立即更新？',
    actions: [
      { key: 'later', text: '稍后再说' },
      { key: 'update', text: '立即更新', bold: true, onClick: () => message.success('开始更新') },
    ],
  })
}
</script>

<template>
  <am-flex vertical gap="small">
    <am-button block @click="open = true">
      纵向排列的操作
    </am-button>
    <am-button block @click="showStatic">
      Modal.show()
    </am-button>
  </am-flex>
  <am-modal
    v-model:open="open"
    title="选择支付方式"
    :actions="actions"
    close-on-action
    @action="onAction"
  />
</template>
