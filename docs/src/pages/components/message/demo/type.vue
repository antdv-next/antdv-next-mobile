<docs lang="zh-CN">
包括成功、失败、警告三种带有语义图标的提示，也可以通过 `icon` 自定义图标。
</docs>

<docs lang="en-US">
Success, error and warning messages come with semantic icons; the icon can also be customized with `icon`.
</docs>

<script setup lang="ts">
import { SmileOutlined } from '@antdv-next/icons'
import { message } from 'antdv-next-mobile'
import { h } from 'vue'

function custom() {
  message.open({
    content: 'Message with a custom icon',
    icon: () => h(SmileOutlined, { style: { color: 'var(--am-color-primary)' } }),
  })
}
</script>

<template>
  <am-flex gap="small" wrap>
    <am-button @click="message.success('Operation succeeded')">
      Success
    </am-button>
    <am-button @click="message.error('Operation failed, please try again later')">
      Error
    </am-button>
    <am-button @click="message.warning('Unstable network, content may be out of date')">
      Warning
    </am-button>
    <am-button @click="custom">
      Custom icon
    </am-button>
  </am-flex>
</template>
