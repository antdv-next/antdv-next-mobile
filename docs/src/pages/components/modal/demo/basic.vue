<docs lang="zh-CN">
基础对话框，通过 `v-model:open` 控制显示。点击取消、遮罩都会触发 `cancel` 并关闭；点击确定只触发 `ok`，需要自行关闭。
</docs>

<docs lang="en-US">
A basic modal, with visibility controlled by `v-model:open`. Clicking Cancel or the mask fires `cancel` and closes it; clicking OK only fires `ok`, and you need to close it yourself.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <am-button type="primary" block @click="open = true">
    Open modal
  </am-button>
  <am-modal v-model:open="open" title="Title" @ok="open = false">
    This is the content of the modal, explaining the current action.
  </am-modal>
</template>
