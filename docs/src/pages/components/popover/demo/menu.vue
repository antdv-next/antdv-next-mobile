<docs lang="zh-CN">
传入 `actions` 进入菜单模式，点击操作项触发 `action` 事件并关闭。支持图标、禁用与危险状态，常用于导航栏的「更多」菜单。
</docs>

<docs lang="en-US">
Pass `actions` to enter menu mode; clicking an action triggers the `action` event and closes the popover. Icons, disabled and danger states are supported. Commonly used for the "More" menu of a navigation bar.
</docs>

<script setup lang="ts">
import type { PopoverAction } from 'antdv-next-mobile'
import { DeleteOutlined, EllipsisOutlined, MessageOutlined, QrcodeOutlined, ScanOutlined } from '@antdv-next/icons'
import { message } from 'antdv-next-mobile'
import { h } from 'vue'

const actions: PopoverAction[] = [
  { key: 'scan', text: 'Scan', icon: () => h(ScanOutlined) },
  { key: 'qrcode', text: 'Pay code', icon: () => h(QrcodeOutlined) },
  { key: 'chat', text: 'Group chat', icon: () => h(MessageOutlined), disabled: true },
  { key: 'delete', text: 'Delete', icon: () => h(DeleteOutlined), danger: true },
]

function onAction(action: PopoverAction) {
  message.info(`Clicked ${action.key}`)
}
</script>

<template>
  <am-flex justify="space-between">
    <am-popover :actions="actions" placement="bottomLeft" @action="onAction">
      <am-button>Light menu</am-button>
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
