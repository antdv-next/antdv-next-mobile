<docs lang="zh-CN">
通过 `checkedValue` 与 `unCheckedValue` 自定义选中 / 未选中时 `checked` 的值，方便直接对接后端字段。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const agree = ref('N')
</script>

<template>
  <am-flex vertical gap="small">
    <am-checkbox v-model:checked="agree" checked-value="Y" un-checked-value="N">
      我已阅读并同意用户协议
    </am-checkbox>
    <div>当前值：{{ agree }}</div>
  </am-flex>
</template>
