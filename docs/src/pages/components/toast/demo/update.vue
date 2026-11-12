<docs lang="zh-CN">
同一时间只会显示一个 Toast：再次调用会原地替换内容，可以用来实现倒计时等动态效果。`afterClose` 在提示关闭后触发。
</docs>

<docs lang="en-US">
Only one Toast is shown at a time: calling it again replaces the content in place, which can be used for dynamic effects such as a countdown. `afterClose` fires after the toast is closed.
</docs>

<script setup lang="ts">
import { Toast } from '@antdv-next/mobile'

function countdown() {
  let seconds = 3
  const tick = () => {
    if (seconds > 0) {
      Toast.loading({ content: `Countdown ${seconds}s` })
      seconds -= 1
      setTimeout(tick, 1000)
    }
    else {
      Toast.clear()
    }
  }
  tick()
}

function afterClose() {
  Toast.show({
    content: 'Another toast shows after closing',
    duration: 1000,
    afterClose: () => Toast.show('The previous toast was closed'),
  })
}
</script>

<template>
  <am-flex vertical gap="small">
    <am-button block @click="countdown">
      Countdown
    </am-button>
    <am-button block @click="afterClose">
      afterClose callback
    </am-button>
  </am-flex>
</template>
