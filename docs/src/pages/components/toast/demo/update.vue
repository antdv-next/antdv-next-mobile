<docs lang="zh-CN">
同一时间只会显示一个 Toast：再次调用会原地替换内容，可以用来实现倒计时等动态效果。`afterClose` 在提示关闭后触发。
</docs>

<script setup lang="ts">
import { Toast } from 'antdv-next-mobile'

function countdown() {
  let seconds = 3
  const tick = () => {
    if (seconds > 0) {
      Toast.loading({ content: `倒计时 ${seconds} 秒` })
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
    content: '关闭后会再提示一次',
    duration: 1000,
    afterClose: () => Toast.show('上一条提示已关闭'),
  })
}
</script>

<template>
  <am-flex vertical gap="small">
    <am-button block @click="countdown">
      倒计时
    </am-button>
    <am-button block @click="afterClose">
      afterClose 回调
    </am-button>
  </am-flex>
</template>
