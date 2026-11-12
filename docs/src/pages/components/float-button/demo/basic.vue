<docs lang="zh-CN">
最简单的用法。悬浮按钮默认固定在屏幕右下角，这里为了演示把它放在了一个相对定位的容器内。
</docs>

<script setup lang="ts">
import { message } from 'antdv-next-mobile'
</script>

<template>
  <div class="demo-box">
    <am-float-button :style="{ position: 'absolute' }" @click="message.info('点击了悬浮按钮')" />
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

/* 组件变量声明在悬浮按钮（组）的根节点上，需要在其自身上覆盖 */
.demo-box > .am-float-button,
.demo-box > .am-float-button-group {
  --am-float-button-inset-block-end: 24px;
}
</style>
