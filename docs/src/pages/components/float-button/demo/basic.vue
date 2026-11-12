<docs lang="zh-CN">
最简单的用法。悬浮按钮默认固定在屏幕右下角，这里为了演示把它放在了一个相对定位的容器内。
</docs>

<docs lang="en-US">
The simplest usage. The float button is fixed at the bottom right corner of the screen by default; here it is placed in a relatively positioned container for demonstration.
</docs>

<script setup lang="ts">
import { message } from '@antdv-next/mobile'
</script>

<template>
  <div class="demo-box">
    <am-float-button :style="{ position: 'absolute' }" @click="message.info('Float button clicked')" />
  </div>
</template>

<style scoped>
.demo-box {
  position: relative;
  height: 160px;
  overflow: hidden;
  background: var(--am-color-fill-quaternary);
  border-radius: var(--am-border-radius);
}

/* The component variables are declared on the root of the float button (group), so override them on that element */
.demo-box > .am-float-button,
.demo-box > .am-float-button-group {
  --am-float-button-inset-block-end: 24px;
}
</style>
