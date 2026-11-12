<docs lang="zh-CN">
`TextArea` 用于多行输入。`autoSize` 让高度随内容自适应，可通过 `minRows` / `maxRows` 限制范围；`showCount` 显示字数统计。
</docs>

<docs lang="en-US">
`TextArea` is used for multi-line input. `autoSize` adapts the height to the content, and the range can be limited with `minRows` / `maxRows`; `showCount` shows the character count.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <am-flex vertical gap="small">
    <am-textarea :rows="3" placeholder="Fixed 3 rows" />
    <am-textarea v-model:value="value" auto-size placeholder="autoSize: height fits the content" allow-clear />
    <am-textarea
      :auto-size="{ minRows: 2, maxRows: 5 }"
      :maxlength="100"
      show-count
      variant="filled"
      placeholder="2 to 5 rows, up to 100 characters"
    />
  </am-flex>
</template>
