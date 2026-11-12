<docs lang="zh-CN">
拖动时默认在滑块上方显示数值气泡。`tooltip.formatter` 可以格式化内容，设为 `null` 隐藏；`tooltip.open` 为 `true` 时始终显示。
</docs>

<docs lang="en-US">
A value tooltip is shown above the handle while dragging by default. `tooltip.formatter` formats the content, and setting it to `null` hides the tooltip; the tooltip is always shown when `tooltip.open` is `true`.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const a = ref(30)
const b = ref<[number, number]>([20, 70])
const c = ref(50)
const formatter = (value: number) => `${value}%`
</script>

<template>
  <div class="demo-slider-list">
    <div>
      <p>Format as percentage</p>
      <am-slider v-model:value="a" :tooltip="{ formatter }" />
    </div>
    <div class="demo-slider-open">
      <p>Always visible</p>
      <am-slider v-model:value="b" range :tooltip="{ open: true }" />
    </div>
    <div>
      <p>Hide tooltip</p>
      <am-slider v-model:value="c" :tooltip="{ formatter: null }" />
    </div>
  </div>
</template>

<style scoped>
.demo-slider-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-slider-list p {
  margin: 0;
  color: var(--am-color-text-secondary);
  font-size: var(--am-font-size);
}

.demo-slider-open p {
  margin-bottom: 28px;
}
</style>
