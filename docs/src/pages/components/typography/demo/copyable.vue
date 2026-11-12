<docs lang="zh-CN">
`copyable` 提供一键复制，可以指定复制的文本、自定义图标，并在 `copy` 事件中给出反馈。
</docs>

<script setup lang="ts">
import { SmileFilled, SmileOutlined } from '@antdv-next/icons'
import { h, ref } from 'vue'

const tip = ref('点击文本后的图标进行复制')
</script>

<template>
  <am-flex vertical gap="small">
    <am-typography-text copyable @copy="tip = '已复制订单号'">
      订单号：2026090112345678
    </am-typography-text>
    <am-typography-text :copyable="{ text: 'ANTDV-NEXT-2026' }" @copy="tip = '已复制邀请码 ANTDV-NEXT-2026'">
      邀请码（复制的内容与显示的不同）
    </am-typography-text>
    <am-typography-text
      :copyable="{ icon: [() => h(SmileOutlined), () => h(SmileFilled)] }"
      @copy="tip = '已复制（自定义图标）'"
    >
      自定义复制图标
    </am-typography-text>
    <am-typography-paragraph :ellipsis="{ rows: 2 }" copyable @copy="tip = '已复制整段文本'">
      省略的文本也可以完整复制：蚂蚁的企业级产品是一个庞大且复杂的体系。这类产品不仅量级巨大且功能复杂，而且变动和并发频繁，常常需要设计与开发能够快速的做出响应。
    </am-typography-paragraph>
    <am-typography-text type="secondary">
      {{ tip }}
    </am-typography-text>
  </am-flex>
</template>
