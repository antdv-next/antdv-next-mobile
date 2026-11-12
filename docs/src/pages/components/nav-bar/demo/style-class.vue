<docs lang="zh-CN">
覆盖 `--am-nav-bar-*` 组件变量，或使用 `classes` / `styles` 定制各语义化结构。
</docs>

<script setup lang="ts">
import { ShareAltOutlined } from '@antdv-next/icons'
</script>

<template>
  <div class="stack">
    <am-nav-bar class="brand-bar" title="品牌色导航" back="返回" :bordered="false">
      <template #right>
        <ShareAltOutlined style="font-size: 20px" />
      </template>
    </am-nav-bar>
    <am-nav-bar
      title="语义化样式"
      sub-title="styles.title / styles.subTitle"
      :styles="{ title: { alignItems: 'flex-start', maxWidth: 'none', flex: 2 }, subTitle: { color: 'var(--am-color-primary)' } }"
    />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.brand-bar {
  --am-nav-bar-height: 52px;
  --am-nav-bar-background: var(--am-color-primary);
  --am-nav-bar-color: var(--am-color-text-light-solid);
}
</style>
