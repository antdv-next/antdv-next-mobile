<docs lang="zh-CN">
多个 `Affix` 依次吸顶，后面的标题会盖住前面的，实现分组标题的吸顶效果。`zIndex` 可以调整固定后的层级。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const scroller = ref<HTMLElement>()
const getTarget = () => scroller.value ?? null
const groups = ['A', 'B', 'C', 'D']
</script>

<template>
  <div ref="scroller" class="scroller">
    <template v-for="(group, index) in groups" :key="group">
      <am-affix :target="getTarget" :z-index="10 + index">
        <div class="bar">
          分组 {{ group }}
        </div>
      </am-affix>
      <div v-for="i in 4" :key="i" class="row">
        {{ group }}{{ i }}
      </div>
    </template>
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

.row {
  padding: 12px 16px;
  color: var(--am-color-text);
  border-bottom: 1px solid var(--am-color-split);
}
</style>
