<docs lang="zh-CN">
`beforeUpload` 在加入列表前校验文件：返回 `Upload.LIST_IGNORE` 时忽略该文件；返回 `false` 时文件保留在列表中但不上传；也可以返回 Promise 并 resolve 处理后的 `File` / `Blob`（如压缩后的图片）。
</docs>

<script setup lang="ts">
import type { UploadFile, UploadRawFile } from 'antdv-next-mobile'
import { Upload } from 'antdv-next-mobile'
import { ref } from 'vue'

const fileList = ref<UploadFile[]>([])
const message = ref('只能选择 PNG / JPG 图片')

function beforeUpload(file: UploadRawFile) {
  const valid = file.type === 'image/png' || file.type === 'image/jpeg'
  if (!valid) {
    message.value = `${file.name} 不是 PNG / JPG 图片，已忽略`
    return Upload.LIST_IGNORE
  }
  message.value = `${file.name} 校验通过`
  return true
}
</script>

<template>
  <am-upload v-model:file-list="fileList" multiple :before-upload="beforeUpload" />
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
