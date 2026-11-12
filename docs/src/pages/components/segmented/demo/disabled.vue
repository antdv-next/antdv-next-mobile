<docs lang="zh-CN">
`disabled` 禁用整个组件，也可以在选项上单独设置 `disabled`。
</docs>

<script setup lang="ts">
const options = [
  { label: '微信', value: 'wechat' },
  { label: '支付宝', value: 'alipay' },
  { label: '银行卡', value: 'card', disabled: true },
]
</script>

<template>
  <am-flex vertical gap="middle">
    <am-segmented block :options="options" />
    <am-segmented block disabled :options="options" />
  </am-flex>
</template>
