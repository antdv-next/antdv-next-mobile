<docs lang="zh-CN">
与 PC 端一致，`v-model:value` 默认绑定 dayjs 对象。点击「确定」提交，点击「取消」或遮罩放弃。
</docs>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { ref } from 'vue'

const value = ref<Dayjs | null>(null)
</script>

<template>
  <am-flex vertical gap="small">
    <am-date-picker v-model:value="value" title="选择日期" allow-clear />
    <div class="demo-result">
      {{ value ? value.format('YYYY年M月D日 dddd') : '尚未选择' }}
    </div>
  </am-flex>
</template>

<style scoped>
.demo-result {
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}
</style>
