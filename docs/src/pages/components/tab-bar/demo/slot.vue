<docs lang="zh-CN">
使用 `icon` / `title` 插槽自定义渲染，插槽参数包含当前项与激活状态；通过组件变量调整激活色。
</docs>

<script setup lang="ts">
import type { TabBarItem } from 'antdv-next-mobile'

const items: TabBarItem[] = [
  { key: 'home', title: '首页' },
  { key: 'discover', title: '发现' },
  { key: 'cart', title: '购物车', badge: 2 },
  { key: 'me', title: '我的' },
]

const emojis: Record<string, [string, string]> = {
  home: ['🏠', '🏡'],
  discover: ['🧭', '🚀'],
  cart: ['🛒', '🛍️'],
  me: ['🙂', '😎'],
}
</script>

<template>
  <am-tab-bar class="custom-tab-bar" :items="items" default-active-key="discover" :safe-area="false">
    <template #icon="{ item, active }">
      <span class="emoji" :class="{ active }">{{ emojis[item.key][active ? 1 : 0] }}</span>
    </template>
    <template #title="{ item, active }">
      <b v-if="active">{{ item.title }}</b>
      <template v-else>
        {{ item.title }}
      </template>
    </template>
  </am-tab-bar>
</template>

<style scoped>
.custom-tab-bar {
  --am-tab-bar-height: 56px;
  --am-tab-bar-active-color: #eb2f96;
}

.emoji {
  font-size: 22px;
  transition: transform 0.2s;
}

.emoji.active {
  transform: scale(1.2);
}
</style>
