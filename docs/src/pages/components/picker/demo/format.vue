<docs lang="zh-CN">
多列时触发器默认用 ` / ` 连接各列的文字，可通过 `format` 自定义。`select` 在滚轮停靠时触发（尚未提交），`confirm` 在点击确定时触发。
</docs>

<docs lang="en-US">
With multiple columns the trigger joins the text of each column with ` / ` by default, which can be customized with `format`. `select` is triggered when the wheel settles (not committed yet), and `confirm` is triggered when OK is tapped.
</docs>

<script setup lang="ts">
import type { PickerOption, PickerValue } from '@antdv-next/mobile'
import { ref } from 'vue'

const columns = [
  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((label, index) => ({ label, value: index + 1 })),
  [{ label: 'AM', value: 'am' }, { label: 'PM', value: 'pm' }],
]
const value = ref<PickerValue[]>([2, 'pm'])
const log = ref('Try scrolling the wheel')

function onSelect(val: PickerValue[]) {
  log.value = `select: ${JSON.stringify(val)}`
}

function onConfirm(val: PickerValue[]) {
  log.value = `confirm: ${JSON.stringify(val)}`
}

const format = (items: (PickerOption | undefined)[]) => items.map(item => item?.label).join(' ')
</script>

<template>
  <am-flex vertical gap="small">
    <am-picker
      v-model:value="value"
      :columns="columns"
      :format="format"
      title="Delivery time"
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
