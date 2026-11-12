<docs lang="zh-CN">
`simple` 为移动端推荐的简洁模式：两侧是上一页 / 下一页按钮，中间显示当前页与总页数，文案跟随 `ConfigProvider` 的语言包。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const current = ref(2)
</script>

<template>
  <am-pagination v-model:current="current" simple :total="86" />
</template>
