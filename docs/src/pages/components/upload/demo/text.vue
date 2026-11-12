<docs lang="zh-CN">
`listType="text"` 以文件列表的形式展示，适合上传文档等非图片文件。设置 `disabled` 后不可选择与删除。
</docs>

<script setup lang="ts">
import type { UploadFile } from 'antdv-next-mobile'
import { ref } from 'vue'

const fileList = ref<UploadFile[]>([
  { uid: '-1', name: '项目计划书.pdf', status: 'done' },
  { uid: '-2', name: '报价单.xlsx', status: 'uploading', percent: 48 },
  { uid: '-3', name: '会议纪要.docx', status: 'error' },
])
const disabledList = ref<UploadFile[]>([{ uid: '-4', name: '已归档.zip', status: 'done' }])
</script>

<template>
  <am-upload v-model:file-list="fileList" list-type="text" multiple />
  <div style="height: 16px" />
  <am-upload v-model:file-list="disabledList" list-type="text" disabled />
</template>
