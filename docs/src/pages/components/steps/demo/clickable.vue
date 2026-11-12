<docs lang="zh-CN">
使用 `v-model:current`（或监听 `change` 事件）后，点击步骤即可切换；`disabled` 的步骤不可点击。
</docs>

<script setup lang="ts">
import type { StepsItem } from 'antdv-next-mobile'
import { ref } from 'vue'

const items: StepsItem[] = [
  { title: '基本信息' },
  { title: '收货地址' },
  { title: '支付方式' },
  { title: '确认', disabled: true },
]

const current = ref(0)
</script>

<template>
  <am-steps v-model:current="current" :items="items" />
  <am-flex gap="small" style="margin-top: 24px">
    <am-button block :disabled="current === 0" @click="current--">
      上一步
    </am-button>
    <am-button block type="primary" :disabled="current === items.length - 1" @click="current++">
      下一步
    </am-button>
  </am-flex>
</template>
