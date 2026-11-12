<docs lang="zh-CN">
基本滑动条，支持 `v-model:value`。当 `disabled` 为 `true` 时，滑块处于不可用状态。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(30)
const disabled = ref(false)
</script>

<template>
  <am-slider v-model:value="value" :disabled="disabled" />
  <div class="demo-slider-row">
    <span>当前值：{{ value }}</span>
    <am-button size="small" @click="disabled = !disabled">
      {{ disabled ? '启用' : '禁用' }}
    </am-button>
  </div>
</template>

<style scoped>
.demo-slider-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--am-color-text-secondary);
  font-size: var(--am-font-size);
}
</style>
