<docs lang="zh-CN">
基础抽屉，默认从底部滑出，点击遮罩或关闭按钮关闭。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <am-button type="primary" block @click="open = true">
    打开抽屉
  </am-button>
  <am-drawer v-model:open="open" title="基础抽屉">
    <p>一些内容...</p>
    <p>一些内容...</p>
    <p>一些内容...</p>
  </am-drawer>
</template>
