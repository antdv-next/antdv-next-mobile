<docs lang="zh-CN">
移动端最常见的用法：用栅格搭建首页的宫格入口。
</docs>

<docs lang="en-US">
The most common usage on mobile: build the grid entries of a home page with the grid.
</docs>

<script setup lang="ts">
import {
  AppstoreOutlined,
  CreditCardOutlined,
  CustomerServiceOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  ShoppingOutlined,
  StarOutlined,
  WalletOutlined,
} from '@antdv-next/icons'

const entries = [
  { icon: WalletOutlined, text: 'Wallet' },
  { icon: CreditCardOutlined, text: 'Cards' },
  { icon: GiftOutlined, text: 'Coupons' },
  { icon: ShoppingOutlined, text: 'Orders' },
  { icon: StarOutlined, text: 'Favorites' },
  { icon: EnvironmentOutlined, text: 'Address' },
  { icon: CustomerServiceOutlined, text: 'Support' },
  { icon: AppstoreOutlined, text: 'More' },
]
</script>

<template>
  <am-row :gutter="[0, 16]">
    <am-col v-for="entry in entries" :key="entry.text" :span="6">
      <div class="entry">
        <component :is="entry.icon" class="entry-icon" />
        <span>{{ entry.text }}</span>
      </div>
    </am-col>
  </am-row>
</template>

<style scoped>
.entry {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  color: var(--am-color-text);
  font-size: var(--am-font-size-sm);
}

.entry:active {
  opacity: var(--am-opacity-active);
}

.entry-icon {
  color: var(--am-color-primary);
  font-size: 26px;
}
</style>
