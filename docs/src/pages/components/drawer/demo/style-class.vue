<docs lang="zh-CN">
通过 `classes` / `styles` 定制各语义化结构，或在 `rootClass` 上覆盖 `--am-drawer-*` 组件变量。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <am-button block @click="open = true">
    自定义样式
  </am-button>
  <am-drawer
    v-model:open="open"
    title="自定义样式"
    footer="页脚内容"
    swipe-to-close
    root-class="custom-drawer"
    :styles="{
      header: { background: 'var(--am-color-primary-bg)' },
      footer: { textAlign: 'center', color: 'var(--am-color-text-secondary)' },
    }"
  >
    <p>一些内容...</p>
    <p>一些内容...</p>
  </am-drawer>
</template>

<style>
.custom-drawer {
  --am-popup-border-radius: 24px;
  --am-drawer-title-font-size: 18px;
  --am-drawer-handle-color: var(--am-color-primary);
  --am-drawer-body-padding: 24px;
}
</style>
