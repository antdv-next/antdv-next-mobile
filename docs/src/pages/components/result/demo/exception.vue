<docs lang="zh-CN">
`status` 为 `403`、`404`、`500` 时显示内置的异常插图，用于整页的异常提示。
</docs>

<docs lang="en-US">
When `status` is `403`, `404` or `500`, the built-in exception illustration is shown, for full-page exception prompts.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const texts = {
  403: 'Sorry, you are not authorized to access this page',
  404: 'Sorry, the page you visited does not exist',
  500: 'Sorry, something went wrong',
}
const statuses = [403, 404, 500] as const
const status = ref<(typeof statuses)[number]>(404)
</script>

<template>
  <am-space>
    <am-checkable-tag
      v-for="item in statuses"
      :key="item"
      :checked="status === item"
      @change="status = item"
    >
      {{ item }}
    </am-checkable-tag>
  </am-space>
  <am-result :status="status" :title="String(status)" :sub-title="texts[status]">
    <template #extra>
      <am-button type="primary" shape="round">
        Back home
      </am-button>
    </template>
  </am-result>
</template>
