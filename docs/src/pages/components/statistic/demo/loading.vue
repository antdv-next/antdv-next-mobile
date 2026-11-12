<docs lang="zh-CN">
数值在加载中时显示骨架屏占位。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <am-flex vertical gap="middle">
    <am-flex gap="large">
      <am-statistic title="活跃用户" :value="112893" :loading="loading" style="flex: 1" />
      <am-statistic title="账户余额 (元)" :value="112893.12" :precision="2" :loading="loading" style="flex: 1" />
    </am-flex>
    <am-flex align="center" justify="space-between">
      <span>加载中</span>
      <am-switch v-model:checked="loading" />
    </am-flex>
  </am-flex>
</template>
