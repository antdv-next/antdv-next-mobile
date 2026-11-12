<docs lang="zh-CN">
把任意内容放进 `Draggable` 即可拖动。默认 `position: fixed`，相对视口移动；设置为 `position: absolute` 时在定位父元素内移动。拖拽结束不会触发 `click`。
</docs>

<docs lang="en-US">
Put any content inside `Draggable` to make it draggable. It is `position: fixed` by default and moves inside the viewport; with `position: absolute` it moves inside its offset parent. `click` is not triggered at the end of a drag.
</docs>

<script setup lang="ts">
import { message } from '@antdv-next/mobile'
</script>

<template>
  <div class="demo-box">
    <am-draggable class="demo-drag" @click="message.info('Clicked')">
      <am-button type="primary">
        Drag me
      </am-button>
    </am-draggable>
  </div>
</template>

<style scoped>
.demo-box {
  position: relative;
  height: 240px;
  overflow: hidden;
  background: var(--am-color-fill-quaternary);
  border-radius: var(--am-border-radius);
}

.demo-drag {
  position: absolute;
  top: 16px;
  left: 16px;
}
</style>
