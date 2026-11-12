<docs lang="zh-CN">
与 PC 端一致，`v-model:value` 默认绑定 dayjs 对象。点击「确定」提交，点击「取消」或遮罩放弃。
</docs>

<docs lang="en-US">
Same as PC, `v-model:value` binds a dayjs object by default. Tap "OK" to commit, tap "Cancel" or the mask to discard.
</docs>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { ref } from 'vue'

const value = ref<Dayjs | null>(null)
</script>

<template>
  <am-flex vertical gap="small">
    <am-date-picker v-model:value="value" title="Select date" allow-clear />
    <div class="demo-result">
      {{ value ? value.format('YYYY-MM-DD dddd') : 'Not selected' }}
    </div>
  </am-flex>
</template>

<style scoped>
.demo-result {
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}
</style>
