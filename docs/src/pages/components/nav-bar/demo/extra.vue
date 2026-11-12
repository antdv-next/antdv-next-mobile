<docs lang="zh-CN">
`left` 与 `right` 插槽（或同名属性）用于放置页面级操作，例如关闭、搜索和更多。
</docs>

<script setup lang="ts">
import { CloseOutlined, MoreOutlined, SearchOutlined } from '@antdv-next/icons'
</script>

<template>
  <div class="stack">
    <am-nav-bar title="标题">
      <template #right>
        <SearchOutlined class="action" />
        <MoreOutlined class="action" />
      </template>
    </am-nav-bar>
    <am-nav-bar title="网页标题" back="返回">
      <template #left>
        <CloseOutlined class="action" />
      </template>
      <template #right>
        <am-button type="link" size="small">
          完成
        </am-button>
      </template>
    </am-nav-bar>
    <am-nav-bar title="文字操作" right="编辑" />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action {
  font-size: 20px;
}
</style>
