<docs lang="zh-CN">
`vertical`（或 `orientation="vertical"`）让选项垂直排列。
</docs>

<script setup lang="ts">
import type { SegmentedOption } from 'antdv-next-mobile'
import { AppstoreOutlined, BarsOutlined, UserOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const options: SegmentedOption[] = [
  { label: '列表视图', value: 'list', icon: () => h(BarsOutlined) },
  { label: '宫格视图', value: 'grid', icon: () => h(AppstoreOutlined) },
  { label: '成员视图', value: 'member', icon: () => h(UserOutlined) },
]
</script>

<template>
  <am-flex gap="large" align="flex-start">
    <am-segmented vertical :options="options" />
    <am-segmented vertical shape="round" :options="['上', '中', '下']" />
  </am-flex>
</template>
