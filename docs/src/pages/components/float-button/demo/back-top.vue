<docs lang="zh-CN">
`BackTop`（`<am-back-top>`）在滚动超过 `visibilityHeight` 后出现，点击后平滑回到顶部。默认监听 `window`，可以通过 `target` 指定滚动容器。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const scroller = ref<HTMLElement>()
</script>

<template>
  <div class="demo-box">
    <div ref="scroller" class="scroller">
      <p v-for="i in 40" :key="i">
        向下滚动试试 · 第 {{ i }} 行
      </p>
    </div>
    <am-back-top
      :target="() => scroller!"
      :visibility-height="200"
      type="primary"
      :style="{ position: 'absolute' }"
    />
  </div>
</template>

<style scoped>
.demo-box {
  position: relative;
  height: 280px;
  overflow: hidden;
  background: var(--am-color-fill-quaternary);
  border-radius: var(--am-border-radius);
}

.scroller {
  height: 100%;
  overflow-y: auto;
}

.scroller p {
  margin: 0;
  padding: 10px 16px;
  color: var(--am-color-text-secondary);
}

/* 组件变量声明在悬浮按钮（组）的根节点上，需要在其自身上覆盖 */
.demo-box > .am-float-button,
.demo-box > .am-float-button-group {
  --am-float-button-inset-block-end: 24px;
}
</style>
