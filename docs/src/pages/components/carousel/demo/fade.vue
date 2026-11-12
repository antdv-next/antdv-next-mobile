<docs lang="zh-CN">
`effect="fade"` 使用渐显切换，同样支持滑动手势与自动播放。
</docs>

<script setup lang="ts">
const colors = ['#1677ff', '#13c2c2', '#722ed1', '#eb2f96']
</script>

<template>
  <am-carousel effect="fade" autoplay :speed="500">
    <div v-for="(color, index) in colors" :key="color" class="slide" :style="{ background: color }">
      {{ index + 1 }}
    </div>
  </am-carousel>
</template>

<style scoped>
.slide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 160px;
  color: #fff;
  font-size: 32px;
  border-radius: 8px;
}
</style>
