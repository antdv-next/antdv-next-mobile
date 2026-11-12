<docs lang="zh-CN">
字符较长时会自动缩小以适应头像宽度，`gap` 设置字符距离左右两侧的最小距离。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const names = ['U', 'Lucy', 'Tom', 'Edward']
const index = ref(0)
const gap = ref(4)
</script>

<template>
  <am-space size="middle" align="center" wrap>
    <am-avatar size="large" :gap="gap">
      {{ names[index] }}
    </am-avatar>
    <am-button size="small" @click="index = (index + 1) % names.length">
      切换名字
    </am-button>
    <am-button size="small" @click="gap = gap === 4 ? 12 : 4">
      gap: {{ gap }}
    </am-button>
  </am-space>
</template>
