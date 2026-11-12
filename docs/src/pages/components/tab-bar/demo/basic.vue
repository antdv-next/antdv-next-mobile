<docs lang="zh-CN">
通过 `items` 配置标签项，默认激活第一项。`icon` 支持传入接收激活状态的函数，方便切换线性与面性图标。
</docs>

<docs lang="en-US">
Configure the tab items with `items`; the first item is active by default. `icon` accepts a function that receives the active state, making it easy to switch between outlined and filled icons.
</docs>

<script setup lang="ts">
import type { TabBarItem } from '@antdv-next/mobile'
import { AppstoreFilled, AppstoreOutlined, HomeFilled, HomeOutlined, MessageFilled, MessageOutlined, UserOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const items: TabBarItem[] = [
  { key: 'home', title: 'Home', icon: active => h(active ? HomeFilled : HomeOutlined) },
  { key: 'apps', title: 'Apps', icon: active => h(active ? AppstoreFilled : AppstoreOutlined) },
  { key: 'message', title: 'Messages', icon: active => h(active ? MessageFilled : MessageOutlined) },
  { key: 'me', title: 'Me', icon: () => h(UserOutlined) },
]
</script>

<template>
  <am-tab-bar :items="items" :safe-area="false" />
</template>
