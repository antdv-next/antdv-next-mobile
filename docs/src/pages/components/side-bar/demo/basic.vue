<docs lang="zh-CN">
左侧导航、右侧内容的经典分类布局。通过 `v-model:activeKey` 获取当前激活项并渲染对应内容。
</docs>

<script setup lang="ts">
import type { SideBarItem } from 'antdv-next-mobile'
import { computed, ref } from 'vue'

const items: SideBarItem[] = [
  { key: 'recommend', title: '为你推荐' },
  { key: 'phone', title: '手机数码' },
  { key: 'home', title: '家用电器' },
  { key: 'food', title: '食品生鲜' },
  { key: 'clothes', title: '服饰鞋包' },
  { key: 'book', title: '图书文娱' },
  { key: 'sport', title: '运动户外' },
  { key: 'baby', title: '母婴玩具' },
]

const activeKey = ref<string | number>('recommend')
const current = computed(() => items.find(item => item.key === activeKey.value))
</script>

<template>
  <div class="layout">
    <am-side-bar v-model:active-key="activeKey" :items="items" />
    <div class="content">
      {{ current?.title }}
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 300px;
  background: var(--am-color-bg-container);
}

.content {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  color: var(--am-color-text-tertiary);
  font-size: 16px;
}
</style>
