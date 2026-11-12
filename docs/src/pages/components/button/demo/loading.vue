<docs lang="zh-CN">
添加 `loading` 属性即可让按钮处于加载状态，加载中不会触发 `click`。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)

function submit() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<template>
  <am-flex vertical gap="small">
    <am-flex gap="small" wrap>
      <am-button type="primary" loading>
        加载中
      </am-button>
      <am-button loading />
      <am-button color="primary" variant="filled" loading shape="round">
        提交中
      </am-button>
    </am-flex>
    <am-button type="primary" block :loading="loading" @click="submit">
      点击提交
    </am-button>
  </am-flex>
</template>
