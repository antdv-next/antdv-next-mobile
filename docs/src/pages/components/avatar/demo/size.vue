<docs lang="zh-CN">
内置 `small`、`middle`、`large` 三种尺寸，也可以传入数字自定义大小，图标和字符会按比例缩放。
</docs>

<docs lang="en-US">
Three sizes are built in: `small`, `middle` and `large`. A number can also be passed for a custom size, and the icon and characters scale proportionally.
</docs>

<script setup lang="ts">
import { UserOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const icon = h(UserOutlined)
</script>

<template>
  <am-space vertical size="middle">
    <am-space size="middle" align="center">
      <am-avatar size="small" :icon="icon" />
      <am-avatar :icon="icon" />
      <am-avatar size="large" :icon="icon" />
      <am-avatar :size="72" :icon="icon" />
    </am-space>
    <am-space size="middle" align="center">
      <am-avatar shape="square" size="small">
        A
      </am-avatar>
      <am-avatar shape="square">
        A
      </am-avatar>
      <am-avatar shape="square" size="large">
        A
      </am-avatar>
      <am-avatar shape="square" :size="72">
        A
      </am-avatar>
    </am-space>
  </am-space>
</template>
