<docs lang="zh-CN">
基础对话框，通过 `v-model:open` 控制显示。点击取消、遮罩都会触发 `cancel` 并关闭；点击确定只触发 `ok`，需要自行关闭。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <am-button type="primary" block @click="open = true">
    打开对话框
  </am-button>
  <am-modal v-model:open="open" title="标题" @ok="open = false">
    这是一段对话框的内容，用于说明当前操作的含义。
  </am-modal>
</template>
