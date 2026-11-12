<docs lang="zh-CN">
通过 `duration` 修改自动关闭的延时（秒）。设为 `0` 时不会自动关闭，需要点击关闭按钮或滑动关闭。`showProgress` 显示剩余时间的进度条，按住通知时计时会暂停。
</docs>

<docs lang="en-US">
Change the delay (in seconds) with `duration`. `0` keeps the notification open until it is closed with the close button or a swipe. `showProgress` shows a progress bar of the remaining time; the timer pauses while the notification is touched.
</docs>

<script setup lang="ts">
import { notification } from '@antdv-next/mobile'

function sticky() {
  notification.warning({
    title: 'Storage almost full',
    description: 'I stay here until you close me.',
    duration: 0,
  })
}

function progress() {
  notification.info({
    title: 'Backup started',
    description: 'Touch and hold to pause the timer.',
    duration: 6,
    showProgress: true,
  })
}
</script>

<template>
  <am-flex vertical gap="small">
    <am-button block @click="sticky">
      Never close automatically
    </am-button>
    <am-button block @click="progress">
      6 seconds with progress
    </am-button>
  </am-flex>
</template>
