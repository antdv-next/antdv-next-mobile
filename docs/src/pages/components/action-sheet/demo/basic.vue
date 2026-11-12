<docs lang="zh-CN">
通过 `actions` 设置动作列表，`v-model:open` 控制显示。点击动作后触发 `action` 事件并默认关闭面板。
</docs>

<docs lang="en-US">
Set the list of actions with `actions` and control visibility with `v-model:open`. Clicking an action fires the `action` event and closes the panel by default.
</docs>

<script setup lang="ts">
import type { ActionSheetAction } from '@antdv-next/mobile'
import { message } from '@antdv-next/mobile'
import { ref } from 'vue'

const open = ref(false)
const actions: ActionSheetAction[] = [
  { key: 'copy', text: 'Copy' },
  { key: 'edit', text: 'Edit' },
  { key: 'save', text: 'Save' },
]

function onAction(action: ActionSheetAction) {
  message.info(`Clicked ${action.key}`)
}
</script>

<template>
  <am-button type="primary" block @click="open = true">
    Basic
  </am-button>
  <am-action-sheet v-model:open="open" :actions="actions" @action="onAction" />
</template>
