<docs lang="zh-CN">
`InputSearch` 是移动端的搜索栏：按下键盘上的「搜索」或点击清除按钮触发 `search`。`showCancel` 在聚焦或有内容时显示取消按钮，`enterButton` 在右侧显示搜索按钮，`loading` 显示加载状态。
</docs>

<docs lang="en-US">
`InputSearch` is the mobile search bar: pressing "Search" on the keyboard or clicking the clear button triggers `search`. `showCancel` shows a cancel button when focused or when there is content, `enterButton` shows a search button on the right, and `loading` shows the loading state.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')
const loading = ref(false)
const log = ref('')

function onSearch(value: string, _event?: Event, info?: { source?: 'input' | 'clear' }) {
  log.value = `search: "${value}" (source: ${info?.source})`
  if (!value)
    return
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}
</script>

<template>
  <am-flex vertical gap="middle">
    <am-input-search v-model:value="keyword" :loading="loading" @search="onSearch" />
    <am-input-search placeholder="With cancel button" show-cancel @search="onSearch" @cancel="log = 'cancel'" />
    <am-input-search placeholder="With search button" enter-button="Search" :round="false" @search="onSearch" />
    <span style="font-size: 12px; color: var(--am-color-text-tertiary)">{{ log || 'Press Enter to search' }}</span>
  </am-flex>
</template>
