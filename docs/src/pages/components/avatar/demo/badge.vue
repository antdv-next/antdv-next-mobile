<docs lang="zh-CN">
与 `Badge` 组合，展示未读数或在线状态。
</docs>

<script setup lang="ts">
import { UserOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const icon = h(UserOutlined)
</script>

<template>
  <am-space size="large">
    <am-badge :count="8">
      <am-avatar shape="square" :icon="icon" />
    </am-badge>
    <am-badge dot>
      <am-avatar shape="square" :icon="icon" />
    </am-badge>
    <am-badge color="green" :offset="[-4, 34]">
      <am-avatar :icon="icon" />
    </am-badge>
  </am-space>
</template>
