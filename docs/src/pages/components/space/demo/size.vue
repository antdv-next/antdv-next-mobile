<docs lang="zh-CN">
通过 `size` 设置间距，支持预设值、数字（px）、CSS 长度和 `[水平, 垂直]` 数组。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const sizes = ['small', 'middle', 'large', 32] as const
const size = ref<(typeof sizes)[number]>('small')
</script>

<template>
  <am-space vertical size="middle">
    <am-space wrap>
      <am-checkable-tag
        v-for="item in sizes"
        :key="item"
        :checked="size === item"
        @change="size = item"
      >
        {{ item }}
      </am-checkable-tag>
    </am-space>
    <am-space :size="size">
      <am-button type="primary">
        主要
      </am-button>
      <am-button>默认</am-button>
      <am-button type="dashed">
        虚线
      </am-button>
    </am-space>
  </am-space>
</template>
