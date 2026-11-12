<docs lang="zh-CN">
点击色块打开底部面板，拖动选择颜色后点击「确定」提交。`showText` 在色块旁显示颜色文本，也可以用同名插槽（或函数）自定义。
</docs>

<docs lang="en-US">
Tap the swatch to open the bottom panel, drag to pick a color and tap "OK" to commit it. `showText` shows the color text next to the swatch; customize it with the same-named slot (or a function).
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const color = ref('#1677ff')
const text = ref('#52c41a')
const custom = ref('#fa8c16')
</script>

<template>
  <am-flex wrap gap="middle" align="center">
    <am-color-picker v-model:value="color" value-format="hex" />
    <am-color-picker v-model:value="text" value-format="hex" show-text />
    <am-color-picker v-model:value="custom" value-format="hex">
      <template #showText="{ color: current }">
        Custom ({{ current.toHexString() }})
      </template>
    </am-color-picker>
  </am-flex>
  <div class="demo-result">
    Value: {{ color }}
  </div>
</template>

<style scoped>
.demo-result {
  margin-top: 12px;
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}
</style>
