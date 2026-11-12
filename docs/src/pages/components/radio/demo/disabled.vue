<docs lang="zh-CN">
`disabled` 可以设置在单个 `Radio` 上，也可以设置在 `Radio.Group` 上禁用整组。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const disabled = ref(true)
</script>

<template>
  <am-flex vertical gap="small">
    <am-radio-group default-value="b" :disabled="disabled">
      <am-radio value="a">
        选项 A
      </am-radio>
      <am-radio value="b">
        选项 B
      </am-radio>
    </am-radio-group>
    <am-radio-group default-value="a">
      <am-radio value="a">
        可用
      </am-radio>
      <am-radio value="b" disabled>
        单个禁用
      </am-radio>
    </am-radio-group>
    <am-button size="small" @click="disabled = !disabled">
      切换第一组禁用状态
    </am-button>
  </am-flex>
</template>
