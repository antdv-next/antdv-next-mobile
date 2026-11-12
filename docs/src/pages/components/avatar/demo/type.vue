<docs lang="zh-CN">
支持图片、图标和字符三种类型，其中图标和字符头像可以通过 `style` 或 `--am-avatar-*` 变量自定义颜色。
</docs>

<script setup lang="ts">
import { UserOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const src = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
</script>

<template>
  <am-space size="middle" wrap>
    <am-avatar :src="src" alt="avatar" />
    <am-avatar :icon="h(UserOutlined)" />
    <am-avatar>U</am-avatar>
    <am-avatar>USER</am-avatar>
    <am-avatar class="orange">
      张
    </am-avatar>
    <am-avatar class="green" :icon="h(UserOutlined)" />
  </am-space>
</template>

<style scoped>
.orange {
  --am-avatar-bg: var(--am-color-warning-bg);
  --am-avatar-color: var(--am-color-warning);
}

.green {
  --am-avatar-bg: var(--am-color-success);
}
</style>
