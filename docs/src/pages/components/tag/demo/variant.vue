<docs lang="zh-CN">
通过 `variant` 设置填充（默认）、实心和描边三种变体，`bordered` 为 `false` 时移除描边。
</docs>

<script setup lang="ts">
const colors = [undefined, 'blue', 'success', 'error', '#722ed1']
const variants = ['filled', 'solid', 'outlined'] as const
</script>

<template>
  <am-space vertical size="middle">
    <am-space v-for="variant in variants" :key="variant" wrap>
      <am-tag v-for="color in colors" :key="color ?? 'default'" :variant="variant" :color="color">
        {{ variant }}
      </am-tag>
    </am-space>
    <am-space wrap>
      <am-tag v-for="color in colors" :key="color ?? 'default'" variant="outlined" :bordered="false" :color="color">
        borderless
      </am-tag>
    </am-space>
  </am-space>
</template>
