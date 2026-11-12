<docs lang="zh-CN">
通过 `classes` / `styles` 定制遮罩与面板，或覆盖 `--am-popup-*` 组件变量。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <am-button block @click="open = true">
    自定义样式
  </am-button>
  <am-popup
    v-model:open="open"
    round
    closable
    root-class="custom-popup"
    :styles="{ mask: { backdropFilter: 'blur(4px)' }, body: { padding: '32px 16px', textAlign: 'center' } }"
  >
    毛玻璃遮罩与更大的圆角
  </am-popup>
</template>

<style>
.custom-popup {
  --am-popup-border-radius: 28px;
  --am-popup-close-size: 22px;
}
</style>
