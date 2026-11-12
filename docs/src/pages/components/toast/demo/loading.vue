<docs lang="zh-CN">
`Toast.loading()` 默认不会自动关闭，并且阻止背景点击，需要手动调用返回的 `close` 或 `Toast.clear()` 关闭。
</docs>

<script setup lang="ts">
import { Toast } from 'antdv-next-mobile'

function load() {
  const handler = Toast.loading('加载中...')
  setTimeout(() => {
    handler.close()
    Toast.success('加载完成')
  }, 2000)
}

function loadWithDuration() {
  Toast.loading({ content: '3 秒后关闭', duration: 3000 })
}
</script>

<template>
  <am-flex vertical gap="small">
    <am-button block @click="load">
      加载后提示成功
    </am-button>
    <am-button block @click="loadWithDuration">
      指定时长
    </am-button>
  </am-flex>
</template>
