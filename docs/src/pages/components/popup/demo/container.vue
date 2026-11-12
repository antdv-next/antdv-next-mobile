<docs lang="zh-CN">
默认挂载到 `document.body`。通过 `getContainer` 指定挂载节点，设为 `false` 则渲染在当前位置。配合带有 `transform` 的容器，可以把弹出层限制在局部区域内。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div class="box">
    <am-button type="primary" @click="open = true">
      在容器内弹出
    </am-button>
    <am-popup v-model:open="open" :get-container="false" :lock-scroll="false" round>
      <div class="content">
        渲染在当前容器内
      </div>
    </am-popup>
  </div>
</template>

<style scoped>
.box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 240px;
  overflow: hidden;
  background: var(--am-color-fill-quaternary);
  border-radius: var(--am-border-radius);

  /* 让内部 position: fixed 的弹出层以该容器为参照 */
  transform: translateZ(0);
}

.content {
  padding: 32px 16px;
  text-align: center;
}
</style>
