<docs lang="zh-CN">
可以通过唯一的 `key` 来更新内容：相同 `key` 的通知会原地更新并重新计时，而不是新增一条。
</docs>

<docs lang="en-US">
Update the content with a unique `key`: a notification with the same `key` is updated in place and its timer restarts, instead of adding a new one.
</docs>

<script setup lang="ts">
import { notification } from '@antdv-next/mobile'

const key = 'updatable'

function update() {
  notification.info({
    key,
    title: 'Uploading',
    description: 'photo.png is being uploaded...',
    duration: 0,
  })
  setTimeout(() => {
    notification.success({
      key,
      title: 'Upload finished',
      description: 'photo.png was saved to your album.',
      duration: 3,
    })
  }, 1500)
}
</script>

<template>
  <am-button block @click="update">
    Update by key
  </am-button>
</template>
