<docs lang="zh-CN">
默认描述跟随 `ConfigProvider` 的 `locale`。
</docs>

<docs lang="en-US">
The default description follows the `locale` of `ConfigProvider`.
</docs>

<script setup lang="ts">
import enUS from '@antdv-next/mobile/locale/en_US'
import zhCN from '@antdv-next/mobile/locale/zh_CN'
import { ref } from 'vue'

const english = ref(true)
</script>

<template>
  <am-button size="small" @click="english = !english">
    {{ english ? '切换为中文' : 'Switch to English' }}
  </am-button>
  <am-config-provider :locale="english ? enUS : zhCN">
    <am-empty />
  </am-config-provider>
</template>
