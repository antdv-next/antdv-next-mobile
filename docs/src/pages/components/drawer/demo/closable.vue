<docs lang="zh-CN">
`closable` 支持对象形式：自定义图标、放到头部起始位置或禁用。设为 `false` 时不显示关闭按钮。
</docs>

<script setup lang="ts">
import { LeftOutlined } from '@antdv-next/icons'
import { h, ref } from 'vue'

const start = ref(false)
const none = ref(false)
</script>

<template>
  <am-flex vertical gap="small">
    <am-button block @click="start = true">
      关闭按钮在起始位置
    </am-button>
    <am-button block @click="none = true">
      无关闭按钮、无标题
    </am-button>
  </am-flex>
  <am-drawer
    v-model:open="start"
    title="设置"
    placement="right"
    size="large"
    :round="false"
    :closable="{ placement: 'start', closeIcon: () => h(LeftOutlined) }"
  >
    <p>全屏的右侧抽屉，像一个新页面。</p>
  </am-drawer>
  <am-drawer v-model:open="none" :closable="false">
    <p>没有头部的抽屉，点击遮罩关闭。</p>
  </am-drawer>
</template>
