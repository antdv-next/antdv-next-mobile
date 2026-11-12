<docs lang="zh-CN">
`open` 控制展开与收起，高度变化带有过渡动画，内容高度无需事先知道。
</docs>

<docs lang="en-US">
`open` expands and collapses the content with an animated height. The height of the content does not have to be known in advance.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <am-button type="primary" block @click="open = !open">
    {{ open ? 'Collapse' : 'Expand' }}
  </am-button>
  <am-collapse-transition :open="open">
    <div class="demo-content">
      Ant Design Mobile for Vue, a mobile UI library whose API follows Antdv Next. The height of this
      block is animated when it shows up and when it goes away.
    </div>
  </am-collapse-transition>
</template>

<style scoped>
.demo-content {
  margin-top: 12px;
  padding: 12px;
  color: var(--am-color-text-secondary);
  background: var(--am-color-fill-quaternary);
  border-radius: var(--am-border-radius);
}
</style>
