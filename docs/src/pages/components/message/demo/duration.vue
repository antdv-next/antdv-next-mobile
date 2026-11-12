<docs lang="zh-CN">
通过第二个参数自定义时长（单位：秒），默认 3 秒。设为 `0` 时不会自动关闭，可以调用 `message.destroy()` 关闭全部。
</docs>

<script setup lang="ts">
import { message } from 'antdv-next-mobile'
</script>

<template>
  <am-flex gap="small" wrap>
    <am-button @click="message.success('这条提示会显示 10 秒', 10)">
      显示 10 秒
    </am-button>
    <am-button @click="message.info('这条提示不会自动关闭', 0)">
      不自动关闭
    </am-button>
    <am-button danger @click="message.destroy()">
      全部关闭
    </am-button>
  </am-flex>
</template>
