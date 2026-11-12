<docs lang="zh-CN">
通过 `actions` 设置动作列表，`v-model:open` 控制显示。点击动作后触发 `action` 事件并默认关闭面板。
</docs>

<script setup lang="ts">
import type { ActionSheetAction } from 'antdv-next-mobile'
import { message } from 'antdv-next-mobile'
import { ref } from 'vue'

const open = ref(false)
const actions: ActionSheetAction[] = [
  { key: 'copy', text: '复制' },
  { key: 'edit', text: '修改' },
  { key: 'save', text: '保存' },
]

function onAction(action: ActionSheetAction) {
  message.info(`点击了 ${action.key}`)
}
</script>

<template>
  <am-button type="primary" block @click="open = true">
    基础用法
  </am-button>
  <am-action-sheet v-model:open="open" :actions="actions" @action="onAction" />
</template>
