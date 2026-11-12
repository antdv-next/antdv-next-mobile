<docs lang="zh-CN">
头像有圆形和方形两种形状，通过 `shape` 设置。
</docs>

<script setup lang="ts">
import { UserOutlined } from '@antdv-next/icons'
</script>

<template>
  <am-space size="middle">
    <am-avatar>
      <template #icon>
        <UserOutlined />
      </template>
    </am-avatar>
    <am-avatar shape="square">
      <template #icon>
        <UserOutlined />
      </template>
    </am-avatar>
  </am-space>
</template>
