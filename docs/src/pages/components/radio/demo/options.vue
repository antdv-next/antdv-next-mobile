<docs lang="zh-CN">
通过 `options` 快速生成一组单选框，支持字符串、数字或 `{ label, value, disabled }` 对象。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const fruit = ref('Apple')
const plain = ['Apple', 'Pear', 'Orange']

const city = ref('hz')
const options = [
  { label: '杭州', value: 'hz' },
  { label: '上海', value: 'sh' },
  { label: '北京', value: 'bj', disabled: true },
]
</script>

<template>
  <am-flex vertical gap="small">
    <am-radio-group v-model:value="fruit" :options="plain" />
    <am-radio-group v-model:value="city" :options="options" />
  </am-flex>
</template>
