<docs lang="zh-CN">
设置 `value` 作为目标数值，数字会从 `from`（默认 0）翻滚到目标值；数值变化时会重新翻滚。
</docs>

<docs lang="en-US">
Set the target number with `value`; the digits roll from `from` (0 by default) to the target, and roll again whenever the value changes.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(1024)

function random() {
  value.value = Math.floor(Math.random() * 9000) + 1000
}
</script>

<template>
  <am-flex vertical gap="middle" align="flex-start">
    <am-rolling-text :value="value" />
    <am-rolling-text :value="99.5" :from="10" :duration="1" />
    <am-button size="small" @click="random">
      Random value
    </am-button>
  </am-flex>
</template>
