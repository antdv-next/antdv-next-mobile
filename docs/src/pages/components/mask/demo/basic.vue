<docs lang="zh-CN">
通过 `v-model:open` 控制显示。设置 `closable` 后点击蒙层即可关闭。
</docs>

<docs lang="en-US">
Control the visibility with `v-model:open`. With `closable` set, clicking the mask closes it.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <am-button type="primary" block @click="open = true">
    Show mask
  </am-button>
  <am-mask v-model:open="open" closable />
</template>
