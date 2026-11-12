<docs lang="zh-CN">
添加 `loading` 属性即可让按钮处于加载状态，加载中不会触发 `click`。
</docs>

<docs lang="en-US">
Add the `loading` prop to put a button in the loading state; `click` is not triggered while loading.
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
        Loading
      </am-button>
      <am-button loading />
      <am-button color="primary" variant="filled" loading shape="round">
        Submitting
      </am-button>
    </am-flex>
    <am-button type="primary" block :loading="loading" @click="submit">
      Tap to submit
    </am-button>
  </am-flex>
</template>
