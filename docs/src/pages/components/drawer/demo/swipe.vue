<docs lang="zh-CN">
开启 `swipeToClose` 后，底部抽屉顶部会出现拖拽手柄，按住手柄或标题栏向下滑动即可关闭。
</docs>

<docs lang="en-US">
With `swipeToClose` turned on, a drag handle appears at the top of the bottom drawer. Hold the handle or the header and swipe down to close it.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <am-button block @click="open = true">
    Swipe to close
  </am-button>
  <am-drawer v-model:open="open" title="Comments" swipe-to-close :closable="false" height="60%">
    <p v-for="i in 12" :key="i">
      Comment {{ i }}
    </p>
  </am-drawer>
</template>
