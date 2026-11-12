<docs lang="zh-CN">
`disabled` 禁用整个组件，也可以在选项上单独设置 `disabled`。
</docs>

<docs lang="en-US">
`disabled` disables the whole component; `disabled` can also be set on individual options.
</docs>

<script setup lang="ts">
const options = [
  { label: 'WeChat', value: 'wechat' },
  { label: 'Alipay', value: 'alipay' },
  { label: 'Card', value: 'card', disabled: true },
]
</script>

<template>
  <am-flex vertical gap="middle">
    <am-segmented block :options="options" />
    <am-segmented block disabled :options="options" />
  </am-flex>
</template>
