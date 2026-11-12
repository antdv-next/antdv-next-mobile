<docs lang="zh-CN">
通过 `icon` 属性或插槽自定义左侧图标，传入 `null` 可以隐藏图标。
</docs>

<script setup lang="ts">
import { CloseCircleOutlined, CompassOutlined, GiftOutlined } from '@antdv-next/icons'
import { h } from 'vue'
</script>

<template>
  <am-flex vertical gap="small">
    <am-notice-bar content="通过插槽自定义图标">
      <template #icon>
        <GiftOutlined />
      </template>
    </am-notice-bar>
    <am-notice-bar color="info" content="通过属性自定义图标" :icon="() => h(CompassOutlined)" />
    <am-notice-bar color="success" content="不显示图标" :icon="null" />
    <am-notice-bar color="error" closable content="自定义关闭图标">
      <template #closeIcon>
        <CloseCircleOutlined />
      </template>
    </am-notice-bar>
  </am-flex>
</template>
