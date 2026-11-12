<docs lang="zh-CN">
`Modal.info / success / error / warning` 用于信息提示，只有一个按钮，图标显示在标题上方。`Modal.alert()` 是不带图标的单按钮提示，返回的 Promise 在关闭后完成。返回的引用可以用来更新或销毁对话框。
</docs>

<script setup lang="ts">
import { Modal } from 'antdv-next-mobile'

function info() {
  Modal.info({ title: '温馨提示', content: '系统将于今晚 23:00 进行升级维护。' })
}

function success() {
  Modal.success({ title: '支付成功', content: '订单已提交，请留意物流信息。' })
}

function error() {
  Modal.error({ title: '提交失败', content: '网络异常，请稍后重试。' })
}

function warning() {
  Modal.warning({ title: '余额不足', content: '当前余额不足以完成支付。' })
}

async function alert() {
  await Modal.alert({ title: '活动规则', content: '每位用户限参与一次。' })
}

function countdown() {
  let seconds = 5
  const modal = Modal.success({ title: '操作成功', content: `${seconds} 秒后自动关闭` })
  const timer = setInterval(() => {
    seconds -= 1
    modal.update({ content: `${seconds} 秒后自动关闭` })
    if (seconds <= 0) {
      clearInterval(timer)
      modal.destroy()
    }
  }, 1000)
}
</script>

<template>
  <am-flex gap="small" wrap>
    <am-button @click="info">
      Info
    </am-button>
    <am-button @click="success">
      Success
    </am-button>
    <am-button @click="error">
      Error
    </am-button>
    <am-button @click="warning">
      Warning
    </am-button>
    <am-button @click="alert">
      Alert
    </am-button>
    <am-button @click="countdown">
      自动更新与关闭
    </am-button>
  </am-flex>
</template>
