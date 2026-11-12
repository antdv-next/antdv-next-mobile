<docs lang="zh-CN">
通过 `options` 设置分享选项，`v-model:open` 控制显示。点击选项后触发 `select` 事件并默认关闭面板。组件不内置任何品牌图标，图标由 `icon` 传入。
</docs>

<docs lang="en-US">
Set the share options with `options` and control visibility with `v-model:open`. Clicking an option fires the `select` event and closes the panel by default. No brand icons are built in: pass them through `icon`.
</docs>

<script setup lang="ts">
import type { ShareSheetOption } from '@antdv-next/mobile'
import { LinkOutlined, PictureOutlined, QqOutlined, QrcodeOutlined, WechatOutlined, WeiboOutlined } from '@antdv-next/icons'
import { message } from '@antdv-next/mobile'
import { h, ref } from 'vue'

const open = ref(false)
const options: ShareSheetOption[] = [
  { key: 'wechat', label: 'WeChat', icon: h(WechatOutlined) },
  { key: 'qq', label: 'QQ', icon: h(QqOutlined) },
  { key: 'weibo', label: 'Weibo', icon: h(WeiboOutlined) },
  { key: 'link', label: 'Copy link', icon: h(LinkOutlined) },
  { key: 'poster', label: 'Poster', icon: h(PictureOutlined) },
  { key: 'qrcode', label: 'QR code', icon: h(QrcodeOutlined) },
]

function onSelect(option: ShareSheetOption) {
  message.info(`Share to ${option.key}`)
}
</script>

<template>
  <am-button type="primary" block @click="open = true">
    Basic
  </am-button>
  <am-share-sheet v-model:open="open" :options="options" @select="onSelect" />
</template>
