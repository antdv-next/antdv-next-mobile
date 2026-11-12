<docs lang="zh-CN">
滚轮默认开启虚拟滚动（`virtual`）：每列只渲染可视区域附近的选项。下面两列分别有 10,000 和 2,000 个选项，实际挂载的节点数显示在下方。
</docs>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'

const columns = [
  Array.from({ length: 10000 }, (_, index) => ({ label: `${index + 1}`, value: index + 1 })),
  Array.from({ length: 2000 }, (_, index) => ({ label: `${1000 + index} 年`, value: 1000 + index })),
]
const value = ref<number[]>([6666, 2026])

const wrapRef = ref<HTMLElement>()
const mounted = ref(0)
function count() {
  mounted.value = wrapRef.value?.querySelectorAll('.am-picker-view-item').length ?? 0
}
onMounted(count)
watch(value, () => nextTick(count))
</script>

<template>
  <div ref="wrapRef">
    <am-picker-view v-model:value="value" :columns="columns" />
  </div>
  <div class="demo-result">
    绑定值：{{ JSON.stringify(value) }}，共 12,000 个选项，已挂载 {{ mounted }} 个节点
  </div>
</template>

<style scoped>
.demo-result {
  margin-top: 8px;
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}
</style>
