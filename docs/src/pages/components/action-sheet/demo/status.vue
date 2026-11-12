<docs lang="zh-CN">
动作支持 `description` 描述、`icon` 图标、`danger` 危险、`bold` 加粗与 `disabled` 禁用状态。
</docs>

<script setup lang="ts">
import type { ActionSheetAction } from 'antdv-next-mobile'
import { DeleteOutlined, EditOutlined, ShareAltOutlined } from '@antdv-next/icons'
import { h, ref } from 'vue'

const open = ref(false)
const actions: ActionSheetAction[] = [
  { key: 'share', text: '分享', icon: () => h(ShareAltOutlined), bold: true },
  { key: 'edit', text: '编辑', icon: () => h(EditOutlined), description: '修改后需要重新审核' },
  { key: 'top', text: '置顶', disabled: true, description: '置顶数量已达上限' },
  { key: 'delete', text: '删除', icon: () => h(DeleteOutlined), danger: true, description: '删除后不可恢复' },
]
</script>

<template>
  <am-button block @click="open = true">
    选项状态
  </am-button>
  <am-action-sheet v-model:open="open" :actions="actions" />
</template>
