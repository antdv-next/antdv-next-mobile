<docs lang="zh-CN">
通过 `classes` / `styles` 定制各语义化结构，或在 `rootClass` 上覆盖 `--am-drawer-*` 组件变量。
</docs>

<docs lang="en-US">
Customize each semantic structure through `classes` / `styles`, or override the `--am-drawer-*` component tokens on `rootClass`.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <am-button block @click="open = true">
    Custom styles
  </am-button>
  <am-drawer
    v-model:open="open"
    title="Custom styles"
    footer="Footer content"
    swipe-to-close
    root-class="custom-drawer"
    :styles="{
      header: { background: 'var(--am-color-primary-bg)' },
      footer: { textAlign: 'center', color: 'var(--am-color-text-secondary)' },
    }"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
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
