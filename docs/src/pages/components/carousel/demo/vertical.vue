<docs lang="zh-CN">
设置 `vertical`（或将 `dotPlacement` 设为 `start` / `end`）后纵向滚动，需要为组件指定高度。
</docs>

<docs lang="en-US">
Set `vertical` (or set `dotPlacement` to `start` / `end`) to scroll vertically. The component needs an explicit height.
</docs>

<script setup lang="ts">
const colors = ['#1677ff', '#13c2c2', '#722ed1', '#eb2f96']
</script>

<template>
  <am-carousel dot-placement="end" autoplay style="height: 160px">
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
  height: 100%;
  color: #fff;
  font-size: 32px;
  border-radius: 8px;
}
</style>
