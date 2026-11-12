<docs lang="zh-CN">
传入 `actions` 进入菜单模式，点击操作项触发 `action` 事件并关闭。支持图标、禁用与危险状态，常用于导航栏的「更多」菜单。
</docs>

<script setup lang="ts">
import type { PopoverAction } from 'antdv-next-mobile'
import { DeleteOutlined, EllipsisOutlined, MessageOutlined, QrcodeOutlined, ScanOutlined } from '@antdv-next/icons'
import { message } from 'antdv-next-mobile'
import { h } from 'vue'

const actions: PopoverAction[] = [
  { key: 'scan', text: '扫一扫', icon: () => h(ScanOutlined) },
  { key: 'qrcode', text: '付款码', icon: () => h(QrcodeOutlined) },
  { key: 'chat', text: '发起群聊', icon: () => h(MessageOutlined), disabled: true },
  { key: 'delete', text: '删除', icon: () => h(DeleteOutlined), danger: true },
]

function onAction(action: PopoverAction) {
  message.info(`点击了 ${action.key}`)
}
</script>

<template>
  <am-flex justify="space-between">
    <am-popover :actions="actions" placement="bottomLeft" @action="onAction">
      <am-button>浅色菜单</am-button>
    </am-popover>
    <am-popover :actions="actions" mode="dark" placement="bottomRight" @action="onAction">
      <am-button shape="circle">
        <template #icon>
          <EllipsisOutlined />
        </template>
      </am-button>
    </am-popover>
  </am-flex>
</template>
