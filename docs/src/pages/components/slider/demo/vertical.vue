<docs lang="zh-CN">
设置 `vertical`（或 `orientation="vertical"`）得到垂直方向的滑动条，高度由 `--am-slider-vertical-height` 或 `style.height` 控制。
</docs>

<script setup lang="ts">
const marks = { 0: '0', 50: '50', 100: '100' }
</script>

<template>
  <div class="demo-slider-vertical">
    <am-slider vertical :default-value="30" />
    <am-slider vertical range :default-value="[20, 50]" :step="10" dots />
    <am-slider orientation="vertical" :default-value="50" :marks="marks" />
    <am-slider vertical reverse :default-value="30" style="height: 160px" />
  </div>
</template>

<style scoped>
.demo-slider-vertical {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}
</style>
