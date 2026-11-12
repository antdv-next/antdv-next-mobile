<docs lang="zh-CN">
覆盖 `--am-side-bar-*` 组件变量调整宽度与颜色，使用 `title` 插槽自定义标题内容。
</docs>

<docs lang="en-US">
Override the `--am-side-bar-*` component tokens to adjust the width and colors, and use the `title` slot to customize the title content.
</docs>

<script setup lang="ts">
import type { SideBarItem } from 'antdv-next-mobile'
import { FireOutlined } from '@antdv-next/icons'

const items: SideBarItem[] = [
  { key: 'hot', title: 'Hot' },
  { key: 'new', title: 'New' },
  { key: 'combo', title: 'Combos' },
  { key: 'drink', title: 'Drinks' },
]
</script>

<template>
  <div class="layout">
    <am-side-bar class="custom-side-bar" :items="items">
      <template #title="{ item }">
        <FireOutlined v-if="item.key === 'hot'" style="margin-inline-end: 4px" />{{ item.title }}
      </template>
    </am-side-bar>
  </div>
</template>

<style scoped>
.layout {
  height: 220px;
  background: var(--am-color-bg-container);
}

.custom-side-bar {
  --am-side-bar-width: 88px;
  --am-side-bar-active-color: #fa541c;
  --am-side-bar-item-padding: 18px 12px;
  --am-side-bar-indicator-height: 24px;
}
</style>
