<docs lang="zh-CN">
`status` 指定当前步骤的状态，也可以在 `items` 中为某一步单独指定 `status`。
</docs>

<script setup lang="ts">
import type { StepsItem } from 'antdv-next-mobile'

const items: StepsItem[] = [
  { title: '提交申请' },
  { title: '资料审核', content: '证件照不清晰' },
  { title: '开通成功' },
]
</script>

<template>
  <am-flex vertical gap="large">
    <am-steps :current="1" status="error" :items="items" />
    <am-steps :current="2" status="finish" :items="items.map(item => ({ title: item.title }))" />
  </am-flex>
</template>
