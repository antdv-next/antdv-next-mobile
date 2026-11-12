<docs lang="zh-CN">
通过 `step` 设置步长，`dots` 显示每一步的刻度点。支持小数步长。
</docs>

<docs lang="en-US">
Set the step with `step`, and `dots` shows a dot for each step. Decimal steps are supported.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const a = ref(40)
const b = ref(0.4)
</script>

<template>
  <am-slider v-model:value="a" :step="20" dots />
  <am-slider v-model:value="b" :min="0" :max="1" :step="0.1" />
  <div class="demo-slider-text">
    {{ a }} / {{ b }}
  </div>
</template>

<style scoped>
.demo-slider-text {
  color: var(--am-color-text-secondary);
  font-size: var(--am-font-size);
}
</style>
