<docs lang="zh-CN">
通过选项的 `icon` 设置图标，可以只展示图标。
</docs>

<script setup lang="ts">
import type { SegmentedOption } from 'antdv-next-mobile'
import { AppstoreOutlined, BarsOutlined, MoonOutlined, SunOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const viewOptions: SegmentedOption[] = [
  { label: '列表', value: 'list', icon: () => h(BarsOutlined) },
  { label: '宫格', value: 'grid', icon: () => h(AppstoreOutlined) },
]

const themeOptions: SegmentedOption[] = [
  { value: 'light', icon: () => h(SunOutlined) },
  { value: 'dark', icon: () => h(MoonOutlined) },
]
</script>

<template>
  <am-flex gap="middle" align="center" wrap>
    <am-segmented :options="viewOptions" />
    <am-segmented :options="themeOptions" shape="round" />
  </am-flex>
</template>
