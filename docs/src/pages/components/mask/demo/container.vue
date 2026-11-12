<docs lang="zh-CN">
蒙层默认渲染在当前位置。覆盖 `position` 后可以只遮住某个局部区域，此时通常需要关闭 `lockScroll`。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div class="box">
    <am-button type="primary" @click="open = true">
      遮住这个区域
    </am-button>
    <am-mask v-model:open="open" closable :lock-scroll="false" :style="{ position: 'absolute' }">
      <div class="tip">
        点击蒙层关闭
      </div>
    </am-mask>
  </div>
</template>

<style scoped>
.box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  overflow: hidden;
  background: var(--am-color-fill-quaternary);
  border-radius: var(--am-border-radius);
}

.tip {
  margin-top: 88px;
  color: var(--am-color-white);
  text-align: center;
  pointer-events: none;
}
</style>
