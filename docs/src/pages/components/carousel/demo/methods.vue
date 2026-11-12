<docs lang="zh-CN">
通过 ref 调用 `prev`、`next`、`goTo`。`infinite` 为 `false` 时滑到首尾会停止，`draggable` 为 `false` 时禁用手势。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const colors = ['#1677ff', '#13c2c2', '#722ed1', '#eb2f96']
const carouselRef = ref()
</script>

<template>
  <am-carousel ref="carouselRef" :infinite="false" :draggable="false">
    <div v-for="(color, index) in colors" :key="color" class="slide" :style="{ background: color }">
      {{ index + 1 }}
    </div>
  </am-carousel>
  <am-flex gap="small" wrap style="margin-top: 12px">
    <am-button size="small" @click="carouselRef?.prev()">
      上一页
    </am-button>
    <am-button size="small" @click="carouselRef?.next()">
      下一页
    </am-button>
    <am-button size="small" @click="carouselRef?.goTo(0)">
      回到第一页
    </am-button>
    <am-button size="small" @click="carouselRef?.goTo(3, true)">
      无动画跳到末页
    </am-button>
  </am-flex>
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
