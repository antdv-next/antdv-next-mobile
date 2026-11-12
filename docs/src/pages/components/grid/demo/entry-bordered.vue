<docs lang="zh-CN">
`bordered` 显示宫格之间的分割线，`square` 让每一格保持正方形。
</docs>

<docs lang="en-US">
`bordered` shows the hairlines between the items and `square` keeps every item square.
</docs>

<script setup lang="ts">
import { PictureOutlined } from '@antdv-next/icons'
</script>

<template>
  <am-grid :columns="3" bordered square>
    <am-grid-item v-for="i in 6" :key="i" :title="`Item ${i}`">
      <template #icon>
        <PictureOutlined />
      </template>
    </am-grid-item>
  </am-grid>
</template>
