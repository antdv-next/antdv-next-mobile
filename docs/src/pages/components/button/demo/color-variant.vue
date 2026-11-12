<docs lang="zh-CN">
同时设置 `color` 和 `variant` 可以衍生出更多的变体按钮。
</docs>

<docs lang="en-US">
Set `color` and `variant` together to derive more button variants.
</docs>

<script setup lang="ts">
const colors = ['default', 'primary', 'danger', 'success', 'warning'] as const
const variants = ['solid', 'outlined', 'dashed', 'filled', 'text', 'link'] as const
</script>

<template>
  <am-flex vertical gap="small">
    <am-flex v-for="color in colors" :key="color" gap="small" wrap align="center">
      <am-button v-for="variant in variants" :key="variant" :color="color" :variant="variant" size="small">
        {{ variant }}
      </am-button>
    </am-flex>
  </am-flex>
</template>
