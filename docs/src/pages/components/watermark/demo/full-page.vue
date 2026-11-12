<docs lang="zh-CN">
`fullPage` 让水印固定覆盖整个页面，适合内部系统的全局水印。
</docs>

<docs lang="en-US">
`fullPage` makes the watermark fixed and cover the whole page, which suits a global watermark for internal systems.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <am-button type="primary" block @click="visible = !visible">
    {{ visible ? 'Hide' : 'Show' }} watermark
  </am-button>
  <am-watermark v-if="visible" full-page :content="['Internal', 'Do not share']" :gap="[60, 80]" />
</template>
