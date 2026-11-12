<docs lang="zh-CN">
`direction` 设置翻滚方向（默认向下），`stopOrder` 设置各位数字停止的先后顺序：`ltr` 从高位到低位，`rtl` 从个位开始。
</docs>

<docs lang="en-US">
`direction` sets the rolling direction (down by default). `stopOrder` sets which digit stops first: `ltr` from the highest digit, `rtl` from the lowest.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const direction = ref<'up' | 'down'>('up')
const stopOrder = ref<'ltr' | 'rtl'>('rtl')
</script>

<template>
  <am-flex vertical gap="middle" align="flex-start">
    <am-rolling-text :value="54321" :direction="direction" :stop-order="stopOrder" />
    <am-segmented v-model:value="direction" :options="['up', 'down']" />
    <am-segmented v-model:value="stopOrder" :options="['ltr', 'rtl']" />
  </am-flex>
</template>
