<docs lang="zh-CN">
滚轮默认开启虚拟滚动（`virtual`）：每列只渲染可视区域附近的选项，下面的列有 10,000 个选项，实际只挂载了十几个节点，拖动与惯性滚动的手感不变。设置 `:virtual="false"` 会渲染全部选项。
</docs>

<docs lang="en-US">
The wheel uses virtual scrolling by default (`virtual`): each column only renders the options near the visible area. The column below has 10,000 options but only a dozen or so nodes are actually mounted, and dragging and momentum scrolling feel the same. Set `:virtual="false"` to render all options.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  Array.from({ length: 10000 }, (_, index) => ({ label: `No. ${index + 1}`, value: index + 1 })),
]
const value = ref<number[]>([5000])
</script>

<template>
  <am-flex vertical gap="small">
    <am-picker v-model:value="value" :columns="columns" title="Select a number" placeholder="10,000 options" />
    <div class="demo-result">
      Value: {{ JSON.stringify(value) }}
    </div>
  </am-flex>
</template>

<style scoped>
.demo-result {
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}
</style>
