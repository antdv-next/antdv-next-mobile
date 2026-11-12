<docs lang="zh-CN">
默认挂载到 `document.body`。通过 `getContainer` 指定挂载节点，设为 `false` 则渲染在当前位置。配合带有 `transform` 的容器，可以把弹出层限制在局部区域内。
</docs>

<docs lang="en-US">
Mounted to `document.body` by default. Specify the mount node with `getContainer`, or set it to `false` to render in place. Together with a container that has a `transform`, the popup can be confined to a local area.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div class="box">
    <am-button type="primary" @click="open = true">
      Open in container
    </am-button>
    <am-popup v-model:open="open" :get-container="false" :lock-scroll="false" round>
      <div class="content">
        Rendered inside this container
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

  /* Make the position: fixed popup inside use this container as its reference */
  transform: translateZ(0);
}

.content {
  padding: 32px 16px;
  text-align: center;
}
</style>
