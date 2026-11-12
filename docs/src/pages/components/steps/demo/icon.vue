<docs lang="zh-CN">
通过 `items` 的 `icon` 自定义每一步的图标，或使用 `iconRender` 插槽统一渲染。
</docs>

<docs lang="en-US">
Customize the icon of each step with `icon` in `items`, or render them all with the `iconRender` slot.
</docs>

<script setup lang="ts">
import type { StepsItem } from 'antdv-next-mobile'
import { CarOutlined, CreditCardOutlined, ShoppingCartOutlined, SmileOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const items: StepsItem[] = [
  { title: 'Cart', icon: () => h(ShoppingCartOutlined) },
  { title: 'Pay', icon: () => h(CreditCardOutlined) },
  { title: 'Ship', icon: () => h(CarOutlined) },
  { title: 'Done', icon: () => h(SmileOutlined) },
]

const plain: StepsItem[] = [{ title: 'Step 1' }, { title: 'Step 2' }, { title: 'Step 3' }]
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
