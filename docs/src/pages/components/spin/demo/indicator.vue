<docs lang="zh-CN">
使用 `indicator` 插槽或属性自定义指示符。
</docs>

<script setup lang="ts">
import { LoadingOutlined, SyncOutlined } from '@antdv-next/icons'
import { h } from 'vue'
</script>

<template>
  <am-flex gap="large" align="center">
    <am-spin>
      <template #indicator>
        <LoadingOutlined class="am-spin-icon" />
      </template>
    </am-spin>
    <am-spin size="large" :indicator="() => h(SyncOutlined, { class: 'am-spin-icon' })" />
    <am-spin class="custom-color" description="自定义颜色" />
  </am-flex>
</template>

<style scoped>
.custom-color {
  --am-spin-color: var(--am-color-success);
  --am-spin-description-color: var(--am-color-success);
}
</style>
