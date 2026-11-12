<docs lang="zh-CN">
设置 `valueFormat` 后，`v-model:value` 收发该格式的字符串，方便直接提交给后端；`format` 只影响展示。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const date = ref('2024-10-01')
const month = ref<string | null>(null)
</script>

<template>
  <am-flex vertical gap="small">
    <am-date-picker v-model:value="date" value-format="YYYY-MM-DD" format="YYYY年M月D日" />
    <div class="demo-result">
      绑定值：{{ JSON.stringify(date) }}
    </div>
    <am-date-picker v-model:value="month" picker="month" value-format="YYYYMM" format="YYYY年M月" placeholder="请选择账期" />
    <div class="demo-result">
      绑定值：{{ JSON.stringify(month) }}
    </div>
  </am-flex>
</template>

<style scoped>
.demo-result {
  color: var(--am-color-text-tertiary);
  font-size: 13px;
}
</style>
