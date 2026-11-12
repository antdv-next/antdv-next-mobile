<docs lang="zh-CN">
`showIcon` 显示与类型对应的图标，也可以通过 `icon` 属性或插槽自定义。
</docs>

<docs lang="en-US">
`showIcon` shows the icon matching the type, which can also be customized through the `icon` prop or slot.
</docs>

<script setup lang="ts">
import { SmileOutlined } from '@antdv-next/icons'
</script>

<template>
  <am-flex vertical gap="small">
    <am-alert title="Success Text" type="success" show-icon />
    <am-alert title="Info Text" type="info" show-icon />
    <am-alert title="Warning Text" type="warning" show-icon />
    <am-alert title="Error Text" type="error" show-icon />
    <am-alert title="Custom icon" show-icon>
      <template #icon>
        <SmileOutlined />
      </template>
    </am-alert>
  </am-flex>
</template>
