<docs lang="zh-CN">
`showIcon` 显示与类型对应的图标，也可以通过 `icon` 属性或插槽自定义。
</docs>

<script setup lang="ts">
import { SmileOutlined } from '@antdv-next/icons'
</script>

<template>
  <am-flex vertical gap="small">
    <am-alert title="成功提示的文案" type="success" show-icon />
    <am-alert title="消息提示的文案" type="info" show-icon />
    <am-alert title="警告提示的文案" type="warning" show-icon />
    <am-alert title="错误提示的文案" type="error" show-icon />
    <am-alert title="自定义图标" show-icon>
      <template #icon>
        <SmileOutlined />
      </template>
    </am-alert>
  </am-flex>
</template>
