<docs lang="zh-CN">
标签超出宽度时标签栏可以横向滚动，切换后激活的标签会自动滚动到中间，指示条跟随滑动。
</docs>

<script setup lang="ts">
import type { TabsItem } from 'antdv-next-mobile'
import { ref } from 'vue'

const items: TabsItem[] = ['推荐', '热点', '科技', '财经', '体育', '娱乐', '汽车', '军事', '国际', '游戏'].map((label, index) => ({
  key: index,
  label,
  content: `${label}频道的内容`,
}))

const activeKey = ref<string | number>(2)
</script>

<template>
  <am-tabs v-model:active-key="activeKey" :items="items" :styles="{ content: { padding: '16px' } }" />
</template>
