<docs lang="zh-CN">
`title` 与 `description` 设置面板顶部的标题和描述，选项的 `description` 显示在名称下方。`cancelText` 修改取消按钮文字，设为 `null` 或 `showCancel` 为 `false` 时隐藏取消按钮。
</docs>

<docs lang="en-US">
`title` and `description` set the header of the panel, and the `description` of an option is shown below its name. `cancelText` changes the cancel button text; `null` or `showCancel` set to `false` hides the button.
</docs>

<script setup lang="ts">
import type { ShareSheetOption } from 'antdv-next-mobile'
import { LinkOutlined, PictureOutlined, QrcodeOutlined, WechatOutlined } from '@antdv-next/icons'
import { h, ref } from 'vue'

const open = ref(false)
const plain = ref(false)
const options: ShareSheetOption[] = [
  { key: 'wechat', label: 'WeChat', icon: h(WechatOutlined) },
  { key: 'link', label: 'Copy link', icon: h(LinkOutlined), description: 'Valid 7 days' },
  { key: 'poster', label: 'Poster', icon: h(PictureOutlined), description: 'Save image' },
  { key: 'qrcode', label: 'QR code', icon: h(QrcodeOutlined) },
]
</script>

<template>
  <am-space direction="vertical" block>
    <am-button block @click="open = true">
      Title and description
    </am-button>
    <am-button block @click="plain = true">
      Without cancel button
    </am-button>
  </am-space>
  <am-share-sheet
    v-model:open="open"
    :options="options"
    title="Share with friends"
    description="Friends get a coupon after they sign up"
    cancel-text="Not now"
  />
  <am-share-sheet v-model:open="plain" :options="options" title="Share with friends" :show-cancel="false" />
</template>
