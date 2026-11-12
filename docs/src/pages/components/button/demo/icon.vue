<docs lang="zh-CN">
通过 `icon` 插槽或 `icon` 属性设置图标，`iconPlacement` 控制图标位置。
</docs>

<script setup lang="ts">
import { DownloadOutlined, RightOutlined, SearchOutlined } from '@antdv-next/icons'
import { h } from 'vue'
</script>

<template>
  <am-flex gap="small" align="center" wrap>
    <am-button type="primary">
      <template #icon>
        <SearchOutlined />
      </template>
      搜索
    </am-button>
    <am-button :icon="() => h(DownloadOutlined)">
      下载
    </am-button>
    <am-button icon-placement="end" color="primary" variant="filled">
      <template #icon>
        <RightOutlined />
      </template>
      下一步
    </am-button>
    <am-button>
      <template #icon>
        <SearchOutlined />
      </template>
    </am-button>
  </am-flex>
</template>
