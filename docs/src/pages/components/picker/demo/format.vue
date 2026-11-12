<docs lang="zh-CN">
多列时触发器默认用 ` / ` 连接各列的文字，可通过 `format` 自定义。`select` 在滚轮停靠时触发（尚未提交），`confirm` 在点击确定时触发。
</docs>

<script setup lang="ts">
import type { PickerOption, PickerValue } from 'antdv-next-mobile'
import { ref } from 'vue'

const columns = [
  ['周一', '周二', '周三', '周四', '周五'].map((label, index) => ({ label, value: index + 1 })),
  [{ label: '上午', value: 'am' }, { label: '下午', value: 'pm' }],
]
const value = ref<PickerValue[]>([2, 'pm'])
const log = ref('滑动滚轮试试')

function onSelect(val: PickerValue[]) {
  log.value = `select: ${JSON.stringify(val)}`
}

function onConfirm(val: PickerValue[]) {
  log.value = `confirm: ${JSON.stringify(val)}`
}

const format = (items: (PickerOption | undefined)[]) => items.map(item => item?.label).join('')
</script>

<template>
  <am-flex vertical gap="small">
    <am-picker
      v-model:value="value"
      :columns="columns"
      :format="format"
      title="配送时间"
      @select="onSelect"
      @confirm="onConfirm"
      @cancel="log = 'cancel'"
    />
    <div class="demo-log">
      {{ log }}
    </div>
  </am-flex>
</template>

<style scoped>
.demo-log {
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}
</style>
