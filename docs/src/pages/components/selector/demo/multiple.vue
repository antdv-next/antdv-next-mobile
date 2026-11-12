<docs lang="zh-CN">
设置 `multiple` 开启多选，`change` 事件的第二个参数可以拿到选中的原始选项。
</docs>

<script setup lang="ts">
import type { SelectorOption, SelectorValue } from 'antdv-next-mobile'
import { ref } from 'vue'

const options = [
  { label: '篮球', value: 'basketball' },
  { label: '足球', value: 'football' },
  { label: '羽毛球', value: 'badminton' },
  { label: '游泳', value: 'swimming' },
  { label: '跑步', value: 'running' },
]
const value = ref<SelectorValue[]>(['football', 'running'])
const text = ref('足球、跑步')

function handleChange(_: SelectorValue[], extra: { items: SelectorOption[] }) {
  text.value = extra.items.map(item => item.label).join('、') || '无'
}
</script>

<template>
  <am-selector v-model:value="value" :options="options" multiple @change="handleChange" />
  <p class="demo-selector-text">
    已选：{{ text }}
  </p>
</template>

<style scoped>
.demo-selector-text {
  margin: 12px 0 0;
  color: var(--am-color-text-secondary);
  font-size: var(--am-font-size);
}
</style>
