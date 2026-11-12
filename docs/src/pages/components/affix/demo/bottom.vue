<docs lang="zh-CN">
设置 `offsetBottom` 后固定在容器底部，滚动到元素原本的位置后恢复。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const scroller = ref<HTMLElement>()
const getTarget = () => scroller.value ?? null
</script>

<template>
  <div ref="scroller" class="scroller">
    <div v-for="i in 4" :key="i" class="block">
      内容 {{ i }}
    </div>
    <am-affix :offset-bottom="0" :target="getTarget">
      <div class="footer">
        <am-button type="primary" block>
          提交订单
        </am-button>
      </div>
    </am-affix>
    <div class="block">
      页面底部
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

.footer {
  padding: 8px 12px;
  background: var(--am-color-bg-container);
}
</style>
