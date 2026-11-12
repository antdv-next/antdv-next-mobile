<docs lang="zh-CN">
`fullPage` 让水印固定覆盖整个页面，适合内部系统的全局水印。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <am-button type="primary" block @click="visible = !visible">
    {{ visible ? '关闭' : '开启' }}全屏水印
  </am-button>
  <am-watermark v-if="visible" full-page :content="['内部资料', '请勿外传']" :gap="[60, 80]" />
</template>
