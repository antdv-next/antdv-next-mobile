<docs lang="zh-CN">
通过 `disabled` 禁用某一项，`change` 事件在切换时触发。
</docs>

<script setup lang="ts">
import type { SideBarItem } from 'antdv-next-mobile'
import { ref } from 'vue'

const items: SideBarItem[] = [
  { key: 1, title: '选项一' },
  { key: 2, title: '选项二' },
  { key: 3, title: '选项三', disabled: true },
  { key: 4, title: '选项四' },
]

const log = ref('点击左侧选项')

function handleChange(key: string | number) {
  log.value = `change: ${key}`
}
</script>

<template>
  <div class="layout">
    <am-side-bar :items="items" :default-active-key="2" @change="handleChange" />
    <div class="content">
      {{ log }}
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 220px;
  background: var(--am-color-bg-container);
}

.content {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  color: var(--am-color-text-tertiary);
}
</style>
