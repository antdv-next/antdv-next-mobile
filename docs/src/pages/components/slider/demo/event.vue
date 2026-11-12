<docs lang="zh-CN">
拖动过程中连续触发 `change`，手指离开时触发 `changeComplete`，适合在松手后再发起请求。
</docs>

<docs lang="en-US">
`change` fires continuously while dragging and `changeComplete` fires when the finger leaves, which suits sending a request only after release.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const changing = ref(20)
const completed = ref(20)
</script>

<template>
  <am-slider :default-value="20" @change="changing = $event" @change-complete="completed = $event" />
  <div class="demo-slider-text">
    change: {{ changing }} / changeComplete: {{ completed }}
  </div>
</template>

<style scoped>
.demo-slider-text {
  color: var(--am-color-text-secondary);
  font-size: var(--am-font-size);
}
</style>
