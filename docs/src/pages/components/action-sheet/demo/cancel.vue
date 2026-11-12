<docs lang="zh-CN">
`title` 与 `extra` 设置头部的标题和描述。取消按钮的文字默认取自语言包，可以通过 `cancelText` 修改，设为 `null` 则不显示。
</docs>

<script setup lang="ts">
import type { ActionSheetAction } from 'antdv-next-mobile'
import { ref } from 'vue'

const withTitle = ref(false)
const noCancel = ref(false)
const actions: ActionSheetAction[] = [
  { key: 'camera', text: '拍照' },
  { key: 'album', text: '从相册选择' },
]
</script>

<template>
  <am-flex vertical gap="small">
    <am-button block @click="withTitle = true">
      标题与描述
    </am-button>
    <am-button block @click="noCancel = true">
      无取消按钮
    </am-button>
  </am-flex>
  <am-action-sheet
    v-model:open="withTitle"
    :actions="actions"
    title="更换头像"
    extra="支持 JPG、PNG 格式，大小不超过 5MB"
    cancel-text="再想想"
  />
  <am-action-sheet v-model:open="noCancel" :actions="actions" :cancel-text="null" />
</template>
