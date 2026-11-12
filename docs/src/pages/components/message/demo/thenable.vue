<docs lang="zh-CN">
返回值是 thenable 的，可以通过 `then` 或 `await` 在提示关闭后执行后续逻辑。
</docs>

<script setup lang="ts">
import { message } from 'antdv-next-mobile'

async function run() {
  await message.loading('正在校验...', 1.5)
  await message.success('校验通过', 1.5)
  message.info('两条提示都已关闭')
}
</script>

<template>
  <am-button block @click="run">
    依次显示
  </am-button>
</template>
