<docs lang="zh-CN">
在应用顶层包裹 `<am-app>`，其内部的组件通过 `App.useApp()` 获取 `message`、`notification`、`modal`、`toast` 实例，无需手动放置 `ContextHolder`。
</docs>

<docs lang="en-US">
Wrap the application with `<am-app>`; components inside get the `message`, `notification`, `modal` and `toast` instances from `App.useApp()` without placing any `ContextHolder` by hand.
</docs>

<script setup lang="ts">
import MyPage from './my-page.vue'
</script>

<template>
  <am-app>
    <MyPage />
  </am-app>
</template>
