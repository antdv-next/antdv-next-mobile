<docs lang="zh-CN">
通过 `statusRender` 插槽（或同名属性）自定义不同状态的渲染内容。
</docs>

<docs lang="en-US">
Customize the content of every state with the `statusRender` slot (or the same-named prop).
</docs>

<script setup lang="ts">
import { CheckCircleFilled, CloseCircleFilled, ReloadOutlined } from '@antdv-next/icons'

const value = 'https://www.antdv-next.com'
</script>

<template>
  <am-flex wrap gap="middle" justify="center">
    <am-qrcode :value="value" :size="150" status="expired" @refresh="() => {}">
      <template #statusRender="{ locale, onRefresh }">
        <div>
          <CloseCircleFilled style="color: var(--am-color-error)" /> {{ locale.expired }}
        </div>
        <am-button type="link" size="small" @click="onRefresh">
          <template #icon>
            <ReloadOutlined />
          </template>
          {{ locale.refresh }}
        </am-button>
      </template>
    </am-qrcode>
    <am-qrcode :value="value" :size="150" status="scanned">
      <template #statusRender="{ locale }">
        <div>
          <CheckCircleFilled style="color: var(--am-color-success)" /> {{ locale.scanned }}
        </div>
      </template>
    </am-qrcode>
  </am-flex>
</template>
