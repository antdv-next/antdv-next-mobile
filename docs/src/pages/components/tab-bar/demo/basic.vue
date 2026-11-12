<docs lang="zh-CN">
通过 `items` 配置标签项，默认激活第一项。`icon` 支持传入接收激活状态的函数，方便切换线性与面性图标。
</docs>

<script setup lang="ts">
import type { TabBarItem } from 'antdv-next-mobile'
import { AppstoreFilled, AppstoreOutlined, HomeFilled, HomeOutlined, MessageFilled, MessageOutlined, UserOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const items: TabBarItem[] = [
  { key: 'home', title: '首页', icon: active => h(active ? HomeFilled : HomeOutlined) },
  { key: 'apps', title: '应用', icon: active => h(active ? AppstoreFilled : AppstoreOutlined) },
  { key: 'message', title: '消息', icon: active => h(active ? MessageFilled : MessageOutlined) },
  { key: 'me', title: '我的', icon: () => h(UserOutlined) },
]
</script>

<template>
  <am-tab-bar :items="items" :safe-area="false" />
</template>
