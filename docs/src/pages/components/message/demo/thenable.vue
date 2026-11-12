<docs lang="zh-CN">
返回值是 thenable 的，可以通过 `then` 或 `await` 在提示关闭后执行后续逻辑。
</docs>

<docs lang="en-US">
The return value is thenable, so follow-up logic can run after the message is closed with `then` or `await`.
</docs>

<script setup lang="ts">
import { message } from '@antdv-next/mobile'

async function run() {
  await message.loading('Verifying...', 1.5)
  await message.success('Verified', 1.5)
  message.info('Both messages are closed')
}
</script>

<template>
  <am-button block @click="run">
    Show in sequence
  </am-button>
</template>
