<docs lang="zh-CN">
可以通过唯一的 `key` 来更新内容：相同 `key` 的提示会原地更新，而不是新增一条。
</docs>

<script setup lang="ts">
import { message } from 'antdv-next-mobile'

const key = 'updatable'

function update() {
  message.open({ key, type: 'loading', content: '正在提交...', duration: 0 })
  setTimeout(() => {
    message.open({ key, type: 'success', content: '提交成功', duration: 2 })
  }, 1500)
}
</script>

<template>
  <am-button block @click="update">
    更新消息内容
  </am-button>
</template>
