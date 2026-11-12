<docs lang="zh-CN">
设置 `percent` 后，默认指示符会展示当前进度。
</docs>

<docs lang="en-US">
With `percent` set, the default indicator shows the current progress.
</docs>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const percent = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => {
    percent.value = percent.value >= 100 ? 0 : percent.value + 10
  }, 500)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <am-flex gap="large" align="center">
    <am-spin size="small" :percent="percent" />
    <am-spin :percent="percent" />
    <am-spin size="large" :percent="percent" :description="`${percent}%`" />
  </am-flex>
</template>
