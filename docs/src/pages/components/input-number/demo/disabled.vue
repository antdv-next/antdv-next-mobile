<docs lang="zh-CN">
禁用、只读与校验状态。`longPress` 关闭长按连续步进，`step` 事件可以获知每次步进的方向。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const log = ref('')

function onStep(value: number | string, info: { offset: number | string, type: 'up' | 'down' }) {
  log.value = `step ${info.type} → ${value}`
}
</script>

<template>
  <am-flex vertical gap="middle">
    <am-flex align="center" gap="middle" wrap>
      <am-input-number :default-value="2" disabled />
      <am-input-number :default-value="2" read-only />
      <am-input-number :default-value="2" status="error" />
    </am-flex>
    <am-flex align="center" gap="middle">
      <am-input-number :default-value="2" :long-press="false" @step="onStep" />
      <span style="font-size: 12px; color: var(--am-color-text-tertiary)">{{ log || '点击按钮触发 step' }}</span>
    </am-flex>
  </am-flex>
</template>
