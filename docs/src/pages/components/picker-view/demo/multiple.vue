<docs lang="zh-CN">
多列之间互相独立。`change` 事件的第二个参数包含每列选中的完整选项 `items` 与发生变化的列 `columnIndex`。
</docs>

<script setup lang="ts">
import type { PickerChangeInfo, PickerValue } from 'antdv-next-mobile'
import { ref } from 'vue'

const columns = [
  ['周一', '周二', '周三', '周四', '周五'].map((label, index) => ({ label, value: index + 1 })),
  [{ label: '上午', value: 'am' }, { label: '下午', value: 'pm' }, { label: '晚上', value: 'night' }],
]
const value = ref<PickerValue[]>([3, 'pm'])
const text = ref('周三 下午')

function onChange(_: PickerValue[], info: PickerChangeInfo) {
  text.value = info.items.map(item => item?.label).join(' ')
}
</script>

<template>
  <am-picker-view v-model:value="value" :columns="columns" @change="onChange" />
  <div class="demo-result">
    {{ text }}
  </div>
</template>

<style scoped>
.demo-result {
  margin-top: 12px;
  color: var(--am-color-text-secondary);
  font-size: 14px;
  text-align: center;
}
</style>
