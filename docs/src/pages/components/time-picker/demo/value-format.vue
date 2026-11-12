<docs lang="zh-CN">
设置 `valueFormat` 后，`v-model:value` 收发该格式的字符串。
</docs>

<docs lang="en-US">
With `valueFormat` set, `v-model:value` sends and receives strings in that format.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('07:30')
</script>

<template>
  <am-flex vertical gap="small">
    <am-time-picker v-model:value="value" format="HH:mm" value-format="HH:mm" title="Alarm" />
    <div class="demo-result">
      Value: {{ JSON.stringify(value) }}
    </div>
  </am-flex>
</template>

<style scoped>
.demo-result {
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}
</style>
