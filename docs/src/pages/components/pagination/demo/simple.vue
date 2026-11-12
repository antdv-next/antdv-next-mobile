<docs lang="zh-CN">
`simple` 为移动端推荐的简洁模式：两侧是上一页 / 下一页按钮，中间显示当前页与总页数，文案跟随 `ConfigProvider` 的语言包。
</docs>

<docs lang="en-US">
`simple` is the simple mode recommended for mobile: previous / next buttons on both sides with the current page and the total pages in the middle. The texts follow the locale of `ConfigProvider`.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const current = ref(2)
</script>

<template>
  <am-pagination v-model:current="current" simple :total="86" />
</template>
