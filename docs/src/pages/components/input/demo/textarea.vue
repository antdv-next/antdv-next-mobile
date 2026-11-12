<docs lang="zh-CN">
`TextArea` 用于多行输入。`autoSize` 让高度随内容自适应，可通过 `minRows` / `maxRows` 限制范围；`showCount` 显示字数统计。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <am-flex vertical gap="small">
    <am-textarea :rows="3" placeholder="固定 3 行" />
    <am-textarea v-model:value="value" auto-size placeholder="autoSize：高度随内容自适应" allow-clear />
    <am-textarea
      :auto-size="{ minRows: 2, maxRows: 5 }"
      :maxlength="100"
      show-count
      variant="filled"
      placeholder="最少 2 行，最多 5 行，最多 100 字"
    />
  </am-flex>
</template>
