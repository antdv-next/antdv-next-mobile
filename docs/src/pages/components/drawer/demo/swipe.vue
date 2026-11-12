<docs lang="zh-CN">
开启 `swipeToClose` 后，底部抽屉顶部会出现拖拽手柄，按住手柄或标题栏向下滑动即可关闭。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <am-button block @click="open = true">
    下滑关闭
  </am-button>
  <am-drawer v-model:open="open" title="评论" swipe-to-close :closable="false" height="60%">
    <p v-for="i in 12" :key="i">
      第 {{ i }} 条评论
    </p>
  </am-drawer>
</template>
