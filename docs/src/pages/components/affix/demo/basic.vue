<docs lang="zh-CN">
滚动到顶部后固定。`offsetTop` 设置固定时距离容器顶部的偏移。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const scroller = ref<HTMLElement>()
const getTarget = () => scroller.value ?? null
</script>

<template>
  <div ref="scroller" class="scroller">
    <div class="block">
      向下滚动
    </div>
    <am-affix :target="getTarget">
      <div class="bar">
        <span>筛选栏</span>
        <span>offsetTop = 0</span>
      </div>
    </am-affix>
    <div v-for="i in 5" :key="i" class="block">
      内容 {{ i }}
    </div>
  </div>
</template>

<style scoped>
.scroller {
  position: relative;
  height: 280px;
  overflow-y: auto;
  background: var(--am-color-bg-layout);
  border: 1px solid var(--am-color-border-secondary);
  border-radius: 8px;
}

.block {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  margin: 12px;
  color: var(--am-color-text-description);
  background: var(--am-color-bg-container);
  border-radius: 8px;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  height: 44px;
  padding: 0 16px;
  color: var(--am-color-text);
  font-size: 15px;
  background: var(--am-color-bg-container);
  border-bottom: 1px solid var(--am-color-split);
}
</style>
