<docs lang="zh-CN">
设置 `action` 后会使用内置的 XHR 请求上传并展示进度。这里用 `customRequest` 模拟上传过程：每第三个文件会上传失败，点击失败的文件即可重试。
</docs>

<script setup lang="ts">
import type { UploadFile, UploadRequestOption } from 'antdv-next-mobile'
import { ref } from 'vue'

const fileList = ref<UploadFile[]>([])
let count = 0

function customRequest(options: UploadRequestOption) {
  count += 1
  const shouldFail = count % 3 === 0
  let percent = 0
  const timer = setInterval(() => {
    percent += 20
    if (shouldFail && percent >= 60) {
      clearInterval(timer)
      options.onError(new Error('network error'))
      return
    }
    options.onProgress({ percent })
    if (percent >= 100) {
      clearInterval(timer)
      options.onSuccess({ url: 'https://example.com/file' })
    }
  }, 400)
  return {
    abort: () => clearInterval(timer),
  }
}
</script>

<template>
  <am-upload v-model:file-list="fileList" accept="image/*" multiple :custom-request="customRequest" />
</template>
