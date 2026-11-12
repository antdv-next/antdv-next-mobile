<docs lang="zh-CN">
`v-model:value` 默认绑定 dayjs 对象，默认格式为 `HH:mm:ss`。
</docs>

<docs lang="en-US">
`v-model:value` binds a dayjs object by default, and the default format is `HH:mm:ss`.
</docs>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { ref } from 'vue'

const value = ref<Dayjs | null>(null)
</script>

<template>
  <am-flex vertical gap="small">
    <am-time-picker v-model:value="value" title="Select time" allow-clear />
    <div class="demo-result">
      {{ value ? value.format('HH:mm:ss') : 'Not selected' }}
    </div>
  </am-flex>
</template>

<style scoped>
.demo-result {
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}
</style>
