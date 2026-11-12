<docs lang="zh-CN">
包括成功、失败、警告三种带有语义图标的提示，也可以通过 `icon` 自定义图标。
</docs>

<script setup lang="ts">
import { SmileOutlined } from '@antdv-next/icons'
import { message } from 'antdv-next-mobile'
import { h } from 'vue'

function custom() {
  message.open({
    content: '自定义图标的提示',
    icon: () => h(SmileOutlined, { style: { color: 'var(--am-color-primary)' } }),
  })
}
</script>

<template>
  <am-flex gap="small" wrap>
    <am-button @click="message.success('操作成功')">
      Success
    </am-button>
    <am-button @click="message.error('操作失败，请稍后重试')">
      Error
    </am-button>
    <am-button @click="message.warning('网络不稳定，内容可能没有及时更新')">
      Warning
    </am-button>
    <am-button @click="custom">
      自定义图标
    </am-button>
  </am-flex>
</template>
