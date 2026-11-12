<docs lang="zh-CN">
开启 `swipeable` 后可以左右滑动内容区域切换标签页，手指跟随、边缘带阻尼，并自动跳过禁用的标签。
</docs>

<script setup lang="ts">
import type { TabsItem } from 'antdv-next-mobile'
import { ref } from 'vue'

const items: TabsItem[] = [
  { key: 'a', label: '关注' },
  { key: 'b', label: '推荐' },
  { key: 'c', label: '禁用', disabled: true },
  { key: 'd', label: '同城' },
]

const activeKey = ref<string | number>('b')
</script>

<template>
  <am-tabs v-model:active-key="activeKey" :items="items" swipeable>
    <template #default="{ item }">
      <div class="pane">
        ← 左右滑动切换 →<br>{{ item.label }}
      </div>
    </template>
  </am-tabs>
</template>

<style scoped>
.pane {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 160px;
  color: var(--am-color-text-tertiary);
  text-align: center;
}
</style>
