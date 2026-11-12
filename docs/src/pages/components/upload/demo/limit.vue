<docs lang="zh-CN">
`maxCount` 限制文件数量，达到上限后隐藏上传按钮；`maxSize` 限制单个文件大小（字节）。被忽略的文件通过 `exceed` 事件通知。
</docs>

<script setup lang="ts">
import type { UploadFile } from 'antdv-next-mobile'
import { ref } from 'vue'

const fileList = ref<UploadFile[]>([])
const message = ref('最多 3 张，单张不超过 500KB')

function onExceed(files: File[], reason: 'maxCount' | 'maxSize') {
  message.value = reason === 'maxCount'
    ? `超出数量限制，已忽略 ${files.length} 个文件`
    : `${files.map(file => file.name).join('、')} 超过 500KB`
}
</script>

<template>
  <am-upload
    v-model:file-list="fileList"
    accept="image/*"
    multiple
    :max-count="3"
    :max-size="500 * 1024"
    @exceed="onExceed"
  />
  <p class="tip">
    {{ message }}
  </p>
</template>

<style scoped>
.tip {
  margin: 12px 0 0;
  color: var(--am-color-text-description);
  font-size: 14px;
}
</style>
