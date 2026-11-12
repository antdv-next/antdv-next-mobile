<docs lang="zh-CN">
`DatePicker.RangePicker`（`<am-range-picker>`）与 PC 端一致，`v-model:value` 绑定 `[开始, 结束]`。点击触发器的开始或结束部分，弹层会停在对应的页签；结束日期不会早于开始日期，点击「确定」后两端一起提交。
</docs>

<docs lang="en-US">
`DatePicker.RangePicker` (`<am-range-picker>`) is the same as PC: `v-model:value` binds `[start, end]`. Tap the start or the end part of the trigger and the popup lands on that tab; the end never goes before the start, and "OK" commits both sides together.
</docs>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { ref } from 'vue'

const value = ref<[Dayjs | null, Dayjs | null] | null>(null)
</script>

<template>
  <am-flex vertical gap="small">
    <am-range-picker v-model:value="value" title="Select dates" allow-clear />
    <div class="demo-result">
      {{ value ? value.map(date => date?.format('MMM D, YYYY') ?? '-').join(' → ') : 'Not selected' }}
    </div>
  </am-flex>
</template>

<style scoped>
.demo-result {
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}
</style>
