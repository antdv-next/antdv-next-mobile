<docs lang="zh-CN">
最基础的导航栏：标题加返回箭头，点击返回区域触发 `back` 事件。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <am-nav-bar title="标题" @back="count++" />
  <div class="tip">
    已触发 back 事件 {{ count }} 次
  </div>
</template>

<style scoped>
.tip {
  padding: 12px 16px;
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}
</style>
