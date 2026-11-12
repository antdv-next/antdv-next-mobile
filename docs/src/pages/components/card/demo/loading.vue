<docs lang="zh-CN">
数据读入前通过 `loading` 显示骨架占位。
</docs>

<docs lang="en-US">
Show a skeleton placeholder with `loading` before the data is loaded.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <am-space vertical block size="middle">
    <am-button size="small" @click="loading = !loading">
      Toggle loading
    </am-button>
    <am-card title="Card title" :loading="loading">
      <am-card-meta title="Meta title" description="This is the description of the card">
        <template #avatar>
          <am-avatar>A</am-avatar>
        </template>
      </am-card-meta>
    </am-card>
  </am-space>
</template>
