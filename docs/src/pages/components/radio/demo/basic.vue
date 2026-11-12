<docs lang="zh-CN">
最简单的用法，在 `Radio.Group` 中通过 `v-model:value` 绑定选中的值，`change` 事件的参数与 PC 端一致。
</docs>

<docs lang="en-US">
The simplest usage: bind the selected value with `v-model:value` on `Radio.Group`. The parameter of the `change` event is the same as on PC.
</docs>

<script setup lang="ts">
import type { RadioChangeEvent } from '@antdv-next/mobile'
import { ref } from 'vue'

const value = ref(1)

function onChange(e: RadioChangeEvent) {
  console.log('radio checked', e.target.value)
}
</script>

<template>
  <am-radio-group v-model:value="value" @change="onChange">
    <am-radio :value="1">
      A
    </am-radio>
    <am-radio :value="2">
      B
    </am-radio>
    <am-radio :value="3">
      C
    </am-radio>
  </am-radio-group>
</template>
