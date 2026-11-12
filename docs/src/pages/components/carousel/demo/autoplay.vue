<docs lang="zh-CN">
`autoplay` 开启自动播放，`autoplaySpeed` 设置间隔。传入 `{ dotDuration: true }` 时当前指示点展示播放进度。手指按住或页面不可见时会暂停。
</docs>

<docs lang="en-US">
`autoplay` turns on automatic playing and `autoplaySpeed` sets the interval. When `{ dotDuration: true }` is passed, the current dot shows the playing progress. It pauses while a finger is holding it or the page is hidden.
</docs>

<script setup lang="ts">
const colors = ['#1677ff', '#13c2c2', '#722ed1', '#eb2f96']
</script>

<template>
  <am-carousel :autoplay="{ dotDuration: true }" :autoplay-speed="2500">
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
