<docs lang="zh-CN">
`precision` 固定小数位数；`formatter` / `parser` 自定义展示与解析；`stringMode` 以字符串形式输出，保留末尾的 0；`prefix` / `suffix` 添加前后缀。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const price = ref(9.9)
const percent = ref(50)
const precise = ref('1.10')

const formatPercent = (value: number | string) => `${value}%`
const parsePercent = (text: string) => text.replace('%', '')
</script>

<template>
  <am-flex vertical gap="middle">
    <am-flex align="center" justify="space-between">
      <span>precision=2</span>
      <am-input-number v-model:value="price" :precision="2" :step="0.1" :min="0" prefix="¥" :styles="{ input: { width: '64px' } }" />
    </am-flex>
    <am-flex align="center" justify="space-between">
      <span>百分比</span>
      <am-input-number
        v-model:value="percent"
        :min="0"
        :max="100"
        :step="5"
        :formatter="formatPercent"
        :parser="parsePercent"
      />
    </am-flex>
    <am-flex align="center" justify="space-between">
      <span>stringMode：{{ JSON.stringify(precise) }}</span>
      <am-input-number v-model:value="precise" string-mode :precision="2" step="0.01" :styles="{ input: { width: '64px' } }" />
    </am-flex>
  </am-flex>
</template>
