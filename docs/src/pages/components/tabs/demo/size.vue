<docs lang="zh-CN">
`size` 提供三种尺寸；`centered` 让标签居中排列而不是等分宽度；`tabPlacement="bottom"` 把标签栏放到内容下方。
</docs>

<script setup lang="ts">
import type { TabsItem } from 'antdv-next-mobile'
import { ref } from 'vue'

const items: TabsItem[] = [
  { key: '1', label: '标签一', content: '内容一' },
  { key: '2', label: '标签二', content: '内容二' },
  { key: '3', label: '标签三', content: '内容三' },
]

const sizeOptions = [
  { label: '小', value: 'small' },
  { label: '中', value: 'middle' },
  { label: '大', value: 'large' },
]
const size = ref<'small' | 'middle' | 'large'>('middle')
const centered = ref(true)
const bottom = ref(false)
</script>

<template>
  <div class="toolbar">
    <am-segmented v-model:value="size" :options="sizeOptions" />
    <label><am-switch v-model:checked="centered" size="small" /> 居中</label>
    <label><am-switch v-model:checked="bottom" size="small" /> 底部</label>
  </div>
  <am-tabs
    :items="items"
    :size="size"
    :centered="centered"
    :tab-placement="bottom ? 'bottom' : 'top'"
    :styles="{ content: { padding: '16px' } }"
  />
</template>

<style scoped>
.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 16px;
  font-size: 13px;
}

.toolbar label {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}
</style>
