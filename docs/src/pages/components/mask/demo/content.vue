<docs lang="zh-CN">
默认插槽的内容显示在蒙层之上。点击内容不会触发 `click` 事件，也不会关闭蒙层。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <am-button block @click="open = true">
    显示带内容的蒙层
  </am-button>
  <am-mask v-model:open="open" closable>
    <div class="wrapper">
      <div class="card">
        <p>点击卡片不会关闭</p>
        <am-button type="primary" size="small" @click="open = false">
          我知道了
        </am-button>
      </div>
    </div>
  </am-mask>
</template>

<style scoped>
.wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.card {
  width: 220px;
  padding: 24px 16px;
  color: var(--am-color-text);
  text-align: center;
  background: var(--am-color-bg-elevated);
  border-radius: var(--am-border-radius-lg);
}

.card p {
  margin: 0 0 16px;
}
</style>
