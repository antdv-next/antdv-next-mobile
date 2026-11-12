<docs lang="zh-CN">
基本用法：传入 `value` 即可，默认渲染为 `canvas`，颜色跟随主题。
</docs>

<docs lang="en-US">
Basic usage: pass a `value`. It renders a `canvas` by default and the colors follow the theme.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref('https://www.antdv-next.com')
</script>

<template>
  <am-flex vertical align="center" gap="middle">
    <am-qrcode :value="text || '-'" />
    <am-input v-model:value="text" placeholder="Text to encode" :maxlength="60" style="width: 100%" />
  </am-flex>
</template>
