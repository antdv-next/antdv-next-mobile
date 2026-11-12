<docs lang="zh-CN">
`disabled` 可以设置在单个 `Radio` 上，也可以设置在 `Radio.Group` 上禁用整组。
</docs>

<docs lang="en-US">
`disabled` can be set on a single `Radio`, or on `Radio.Group` to disable the whole group.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const disabled = ref(true)
</script>

<template>
  <am-flex vertical gap="small">
    <am-radio-group default-value="b" :disabled="disabled">
      <am-radio value="a">
        Option A
      </am-radio>
      <am-radio value="b">
        Option B
      </am-radio>
    </am-radio-group>
    <am-radio-group default-value="a">
      <am-radio value="a">
        Enabled
      </am-radio>
      <am-radio value="b" disabled>
        Disabled
      </am-radio>
    </am-radio-group>
    <am-button size="small" @click="disabled = !disabled">
      Toggle disabled of group 1
    </am-button>
  </am-flex>
</template>
