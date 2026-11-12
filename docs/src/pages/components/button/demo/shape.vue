<docs lang="zh-CN">
通过 `shape` 设置胶囊按钮或圆形按钮。
</docs>

<script setup lang="ts">
import { SearchOutlined } from '@antdv-next/icons'
</script>

<template>
  <am-flex gap="small" align="center" wrap>
    <am-button type="primary">
      Default
    </am-button>
    <am-button type="primary" shape="round">
      Round
    </am-button>
    <am-button type="primary" shape="circle">
      <template #icon>
        <SearchOutlined />
      </template>
    </am-button>
    <am-button shape="circle">
      <template #icon>
        <SearchOutlined />
      </template>
    </am-button>
  </am-flex>
</template>
