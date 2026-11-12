<docs lang="zh-CN">
`mask` 控制是否显示遮罩，`maskClosable` 控制点击遮罩是否关闭。没有遮罩时页面仍可操作。
</docs>

<docs lang="en-US">
`mask` controls whether the mask is shown, and `maskClosable` controls whether clicking the mask closes the popup. Without a mask, the page can still be operated.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const noMask = ref(false)
const locked = ref(false)
</script>

<template>
  <am-flex vertical gap="small">
    <am-button block @click="noMask = !noMask">
      {{ noMask ? 'Close' : 'Open' }} popup without mask
    </am-button>
    <am-button block @click="locked = true">
      Mask not closable
    </am-button>
  </am-flex>
  <am-popup v-model:open="noMask" :mask="false" :lock-scroll="false" placement="top">
    <div class="content">
      No mask, the page stays interactive
    </div>
  </am-popup>
  <am-popup v-model:open="locked" :mask-closable="false" round>
    <div class="content">
      <p>Can only be closed with the button</p>
      <am-button type="primary" @click="locked = false">
        Close
      </am-button>
    </div>
  </am-popup>
</template>

<style scoped>
.content {
  padding: 32px 16px;
  text-align: center;
}
</style>
