<docs lang="zh-CN">
`Toast.show()` 可以直接传入文字，默认 2 秒后自动关闭。文字较长时会自动换行。
</docs>

<docs lang="en-US">
`Toast.show()` accepts text directly and closes automatically after 2 seconds by default. Long text wraps automatically.
</docs>

<script setup lang="ts">
import { Toast } from '@antdv-next/mobile'
</script>

<template>
  <am-flex vertical gap="small">
    <am-button type="primary" block @click="Toast.show('This is a toast')">
      Toast
    </am-button>
    <am-button block @click="Toast.show('This is a rather long toast. The text wraps automatically when it exceeds the max width')">
      Long text
    </am-button>
  </am-flex>
</template>
