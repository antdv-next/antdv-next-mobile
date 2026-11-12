<docs lang="zh-CN">
`status` 为 `403`、`404`、`500` 时显示内置的异常插图，用于整页的异常提示。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const texts = {
  403: '抱歉，你无权访问该页面',
  404: '抱歉，你访问的页面不存在',
  500: '抱歉，服务器出错了',
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
        返回首页
      </am-button>
    </template>
  </am-result>
</template>
