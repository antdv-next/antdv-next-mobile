<docs lang="zh-CN">
`keywords` 传入数组可以同时高亮多个关键词，重叠或相邻的匹配会合并为一段。`caseSensitive` 开启大小写敏感。
</docs>

<docs lang="en-US">
Pass an array to `keywords` to highlight several keywords at once; overlapping or adjacent matches are merged into one. `caseSensitive` turns on case-sensitive matching.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const content = 'Mobile first. Mobile components are built for touch, gestures and small screens.'
const caseSensitive = ref(false)
</script>

<template>
  <am-flex vertical gap="middle">
    <am-highlight
      :content="content"
      :keywords="['mobile', 'touch', 'small screens']"
      :case-sensitive="caseSensitive"
    />
    <am-flex justify="space-between" align="center">
      <span>Case sensitive</span>
      <am-switch v-model:checked="caseSensitive" />
    </am-flex>
  </am-flex>
</template>
