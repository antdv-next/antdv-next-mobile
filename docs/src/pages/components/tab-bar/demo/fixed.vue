<docs lang="zh-CN">
`fixed` 将标签栏固定在视口底部，`placeholder` 在文档流中保留等高占位，`safeArea` 默认开启以适配底部安全区。示例中用带 `transform` 的容器模拟视口。
</docs>

<script setup lang="ts">
import type { TabBarItem } from 'antdv-next-mobile'
import { AppstoreOutlined, HomeOutlined, UserOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const items: TabBarItem[] = [
  { key: 'home', title: '首页', icon: () => h(HomeOutlined) },
  { key: 'apps', title: '应用', icon: () => h(AppstoreOutlined) },
  { key: 'me', title: '我的', icon: () => h(UserOutlined) },
]
</script>

<template>
  <div class="viewport">
    <div class="scroller">
      <p v-for="i in 12" :key="i" class="row">
        内容 {{ i }}
      </p>
      <am-tab-bar :items="items" fixed placeholder />
    </div>
  </div>
</template>

<style scoped>
/* transform 让内部的 fixed 元素相对该容器定位 */
.viewport {
  height: 240px;
  overflow: hidden;
  transform: translateZ(0);
}

.scroller {
  height: 100%;
  overflow-y: auto;
}

.row {
  margin: 0;
  padding: 12px 16px;
  color: var(--am-color-text-secondary);
}
</style>
