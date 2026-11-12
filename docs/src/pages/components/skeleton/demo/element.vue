<docs lang="zh-CN">
骨架按钮、头像、输入框和图像，可以自由组合出任意页面的占位效果。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref(true)
</script>

<template>
  <am-flex vertical gap="middle">
    <am-flex gap="small" align="center" wrap>
      <am-skeleton-button :active="active" />
      <am-skeleton-button :active="active" shape="round" />
      <am-skeleton-button :active="active" shape="circle" />
      <am-skeleton-avatar :active="active" />
      <am-skeleton-avatar :active="active" shape="square" />
    </am-flex>
    <am-skeleton-input :active="active" block />
    <am-skeleton-button :active="active" block size="large" />
    <am-flex gap="small">
      <am-skeleton-image :active="active" />
      <am-skeleton-image :active="active" :size="[160, 96]" />
    </am-flex>
    <am-flex align="center" justify="space-between">
      <span>动画效果</span>
      <am-switch v-model:checked="active" />
    </am-flex>
  </am-flex>
</template>
