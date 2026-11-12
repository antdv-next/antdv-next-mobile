<docs lang="zh-CN">
通过 `v-model:open` 控制显示，默认从底部弹出，点击遮罩关闭。
</docs>

<docs lang="en-US">
Control the visibility with `v-model:open`. It pops up from the bottom by default and closes when the mask is clicked.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <am-button type="primary" block @click="open = true">
    Show popup
  </am-button>
  <am-popup v-model:open="open">
    <div class="content">
      Content
    </div>
  </am-popup>
</template>

<style scoped>
.content {
  padding: 48px 16px;
  text-align: center;
}
</style>
