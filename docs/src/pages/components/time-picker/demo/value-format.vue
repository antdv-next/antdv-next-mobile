<docs lang="zh-CN">
设置 `valueFormat` 后，`v-model:value` 收发该格式的字符串。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('07:30')
</script>

<template>
  <am-flex vertical gap="small">
    <am-time-picker v-model:value="value" format="HH:mm" value-format="HH:mm" title="闹钟" />
    <div class="demo-result">
      绑定值：{{ JSON.stringify(value) }}
    </div>
  </am-flex>
</template>

<style scoped>
.demo-result {
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}
</style>
