<docs lang="zh-CN">
通过 `icon` 属性或同名插槽自定义图标，`--am-result-icon-color` 可以调整图标颜色。
</docs>

<script setup lang="ts">
import { SmileOutlined } from '@antdv-next/icons'
</script>

<template>
  <am-result title="太棒了，所有任务都已完成" class="custom">
    <template #icon>
      <SmileOutlined />
    </template>
    <template #extra>
      <am-button type="primary" shape="round">
        下一步
      </am-button>
    </template>
  </am-result>
</template>

<style scoped>
.custom {
  --am-result-icon-color: var(--am-color-primary);
}
</style>
