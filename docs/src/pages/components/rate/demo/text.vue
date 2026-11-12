<docs lang="zh-CN">
移动端没有 hover 提示，可以在评分旁边展示与分值对应的辅助文字。
</docs>

<docs lang="en-US">
There is no hover tooltip on mobile, so a helper text matching the value can be shown next to the rating.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const desc = ['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful']
const value = ref(3)
</script>

<template>
  <div class="demo-rate-text">
    <am-rate v-model:value="value" />
    <span v-if="value">{{ desc[value - 1] }}</span>
  </div>
</template>

<style scoped>
.demo-rate-text {
  display: flex;
  gap: 12px;
  align-items: center;
  color: var(--am-color-text-secondary);
  font-size: var(--am-font-size);
}
</style>
