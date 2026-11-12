<docs lang="zh-CN">
`indicator` 插槽接收 `{ current, total }`，可以替换默认的指示点，例如常见的数字页码。
</docs>

<docs lang="en-US">
The `indicator` slot receives `{ current, total }` and replaces the default dots, e.g. with the common page number.
</docs>

<script setup lang="ts">
const colors = ['#1677ff', '#13c2c2', '#722ed1', '#eb2f96']
</script>

<template>
  <am-carousel>
    <div v-for="(color, index) in colors" :key="color" class="slide" :style="{ background: color }">
      {{ index + 1 }}
    </div>
    <template #indicator="{ current, total }">
      <div class="indicator">
        {{ current + 1 }}/{{ total }}
      </div>
    </template>
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

.indicator {
  position: absolute;
  right: 8px;
  bottom: 8px;
  padding: 2px 8px;
  color: #fff;
  font-size: 12px;
  background: rgb(0 0 0 / 40%);
  border-radius: 10px;
}
</style>
