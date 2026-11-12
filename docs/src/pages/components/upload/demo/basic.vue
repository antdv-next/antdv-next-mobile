<docs lang="zh-CN">
未设置 `action` 时只收集选择的文件，可以随表单一起提交。点击图片可以全屏预览，点击角标删除。
</docs>

<docs lang="en-US">
When `action` is not set, the selected files are only collected and can be submitted together with a form. Tap an image to preview it full screen, and tap the corner badge to remove it.
</docs>

<script setup lang="ts">
import type { UploadFile } from '@antdv-next/mobile'
import { ref } from 'vue'

const fileList = ref<UploadFile[]>([])
</script>

<template>
  <am-upload v-model:file-list="fileList" accept="image/*" multiple />
  <p class="tip">
    {{ fileList.length }} file(s) selected
  </p>
</template>

<style scoped>
.tip {
  margin: 12px 0 0;
  color: var(--am-color-text-description);
  font-size: 14px;
}
</style>
