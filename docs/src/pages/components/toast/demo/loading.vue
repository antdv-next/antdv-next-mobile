<docs lang="zh-CN">
`Toast.loading()` 默认不会自动关闭，并且阻止背景点击，需要手动调用返回的 `close` 或 `Toast.clear()` 关闭。
</docs>

<docs lang="en-US">
`Toast.loading()` does not close automatically by default and blocks background clicks. It must be closed manually by calling the returned `close` or `Toast.clear()`.
</docs>

<script setup lang="ts">
import { Toast } from '@antdv-next/mobile'

function load() {
  const handler = Toast.loading('Loading...')
  setTimeout(() => {
    handler.close()
    Toast.success('Loaded')
  }, 2000)
}

function loadWithDuration() {
  Toast.loading({ content: 'Closes in 3s', duration: 3000 })
}
</script>

<template>
  <am-flex vertical gap="small">
    <am-button block @click="load">
      Loading then success
    </am-button>
    <am-button block @click="loadWithDuration">
      Custom duration
    </am-button>
  </am-flex>
</template>
