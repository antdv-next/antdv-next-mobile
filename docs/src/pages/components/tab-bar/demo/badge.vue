<docs lang="zh-CN">
`badge` 为数字或文字时显示徽标，为 `true` 时显示红点。
</docs>

<script setup lang="ts">
import type { TabBarItem } from 'antdv-next-mobile'
import { AppstoreOutlined, HomeOutlined, MessageOutlined, UserOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const items: TabBarItem[] = [
  { key: 'home', title: '首页', icon: () => h(HomeOutlined), badge: true },
  { key: 'apps', title: '应用', icon: () => h(AppstoreOutlined), badge: 5 },
  { key: 'message', title: '消息', icon: () => h(MessageOutlined), badge: '99+' },
  { key: 'me', title: '我的', icon: () => h(UserOutlined), badge: 'new' },
]
</script>

<template>
  <am-tab-bar :items="items" :safe-area="false" />
</template>
