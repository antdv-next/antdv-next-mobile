<docs lang="zh-CN">
数据读入前通过 `loading` 显示骨架占位。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <am-space vertical block size="middle">
    <am-button size="small" @click="loading = !loading">
      切换加载状态
    </am-button>
    <am-card title="卡片标题" :loading="loading">
      <am-card-meta title="内容标题" description="这是一段卡片的描述信息">
        <template #avatar>
          <am-avatar>A</am-avatar>
        </template>
      </am-card-meta>
    </am-card>
  </am-space>
</template>
