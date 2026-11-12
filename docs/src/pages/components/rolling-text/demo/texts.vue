<docs lang="zh-CN">
设置 `texts` 后不再翻滚数字，而是按列依次翻过一组等长的文本，最后一项为最终显示的内容。
</docs>

<docs lang="en-US">
With `texts`, each column rolls through a list of equal-length strings instead of digits; the last one is what stays on screen.
</docs>

<script setup lang="ts">
const texts = ['aaaaa', 'bbbbb', 'ccccc', 'ddddd', 'eeeee', 'fffff', 'hello']
const times = ['08:30', '11:45', '14:20', '17:05', '21:50']
</script>

<template>
  <am-flex vertical gap="middle" align="flex-start">
    <am-rolling-text :texts="texts" :duration="1" />
    <am-rolling-text :texts="times" direction="up" stop-order="rtl" />
  </am-flex>
</template>
