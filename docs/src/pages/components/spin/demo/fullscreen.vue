<docs lang="zh-CN">
`fullscreen` 用于页面级的加载，显示遮罩并锁定页面滚动。
</docs>

<docs lang="en-US">
`fullscreen` is used for page-level loading. It shows a mask and locks page scrolling.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const spinning = ref(false)

function showLoader() {
  spinning.value = true
  setTimeout(() => {
    spinning.value = false
  }, 2000)
}
</script>

<template>
  <am-button type="primary" block @click="showLoader">
    Show fullscreen spin (2s)
  </am-button>
  <am-spin :spinning="spinning" fullscreen size="large" description="Submitting..." />
</template>
