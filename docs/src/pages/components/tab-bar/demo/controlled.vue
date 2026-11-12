<docs lang="zh-CN">
通过 `v-model:activeKey` 受控，并根据激活项切换页面内容。
</docs>

<script setup lang="ts">
import type { TabBarItem } from 'antdv-next-mobile'
import { AppstoreOutlined, HomeOutlined, MessageOutlined, UserOutlined } from '@antdv-next/icons'
import { computed, h, ref } from 'vue'

const items: TabBarItem[] = [
  { key: 'home', title: '首页', icon: () => h(HomeOutlined) },
  { key: 'apps', title: '应用', icon: () => h(AppstoreOutlined) },
  { key: 'message', title: '消息', icon: () => h(MessageOutlined) },
  { key: 'me', title: '我的', icon: () => h(UserOutlined) },
]

const activeKey = ref<string | number>('message')
const current = computed(() => items.find(item => item.key === activeKey.value))
</script>

<template>
  <div class="page">
    <div class="page-body">
      {{ current?.title }}页面
    </div>
    <am-tab-bar v-model:active-key="activeKey" :items="items" :safe-area="false" />
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 220px;
}

.page-body {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  color: var(--am-color-text-tertiary);
  font-size: 16px;
}
</style>
