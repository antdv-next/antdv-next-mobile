<docs lang="zh-CN">
通过 `items` 的 `icon` 自定义每一步的图标，或使用 `iconRender` 插槽统一渲染。
</docs>

<script setup lang="ts">
import type { StepsItem } from 'antdv-next-mobile'
import { CarOutlined, CreditCardOutlined, ShoppingCartOutlined, SmileOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const items: StepsItem[] = [
  { title: '加入购物车', icon: () => h(ShoppingCartOutlined) },
  { title: '付款', icon: () => h(CreditCardOutlined) },
  { title: '配送', icon: () => h(CarOutlined) },
  { title: '完成', icon: () => h(SmileOutlined) },
]

const plain: StepsItem[] = [{ title: '第一步' }, { title: '第二步' }, { title: '第三步' }]
</script>

<template>
  <am-flex vertical gap="large">
    <am-steps :current="2" :items="items" />
    <am-steps :current="1" :items="plain">
      <template #iconRender="{ index, status }">
        <span class="emoji">{{ status === 'finish' ? '✅' : status === 'process' ? '🚀' : `0${index + 1}` }}</span>
      </template>
    </am-steps>
  </am-flex>
</template>

<style scoped>
.emoji {
  font-size: 16px;
}
</style>
