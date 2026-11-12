<docs lang="zh-CN">
最简单的用法，通过 `v-model:checked` 绑定选中状态，`change` 事件的参数与 PC 端一致。
</docs>

<script setup lang="ts">
import type { CheckboxChangeEvent } from 'antdv-next-mobile'
import { ref } from 'vue'

const checked = ref(true)

function onChange(e: CheckboxChangeEvent) {
  console.log('checked =', e.target.checked)
}
</script>

<template>
  <am-flex vertical gap="small">
    <am-checkbox v-model:checked="checked" @change="onChange">
      Checkbox
    </am-checkbox>
    <am-checkbox default-checked>
      非受控（defaultChecked）
    </am-checkbox>
  </am-flex>
</template>
