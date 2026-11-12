<docs lang="zh-CN">
通过 `image` 设置为 `Empty.PRESENTED_IMAGE_SIMPLE` 使用简洁插图，同时间距更紧凑，适合列表等局部区域。
</docs>

<script setup lang="ts">
import { Empty } from 'antdv-next-mobile'
</script>

<template>
  <am-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" />
</template>
