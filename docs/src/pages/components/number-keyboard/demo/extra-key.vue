<docs lang="zh-CN">
`extraKey` 设置额外按键：默认样式支持左下角 1 个（如身份证号的 `X`、金额的小数点），`custom` 样式支持最多 2 个。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const current = ref<'id' | 'decimal' | 'double' | ''>('')
const id = ref('')
const decimal = ref('')
const double = ref('')
</script>

<template>
  <am-list>
    <am-list-item title="身份证号（X 键）" :extra="id || '点击输入'" clickable @click="current = 'id'" />
    <am-list-item title="带小数点" :extra="decimal || '点击输入'" clickable @click="current = 'decimal'" />
    <am-list-item title="两个额外按键" :extra="double || '点击输入'" clickable @click="current = 'double'" />
  </am-list>
  <am-number-keyboard
    v-model:value="id"
    :open="current === 'id'"
    extra-key="X"
    :maxlength="18"
    close-button-text="完成"
    @update:open="current = ''"
  />
  <am-number-keyboard
    v-model:value="decimal"
    :open="current === 'decimal'"
    extra-key="."
    close-button-text="完成"
    @update:open="current = ''"
  />
  <am-number-keyboard
    v-model:value="double"
    :open="current === 'double'"
    theme="custom"
    :extra-key="['00', '.']"
    @update:open="current = ''"
  />
</template>
