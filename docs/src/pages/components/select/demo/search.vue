<docs lang="zh-CN">
`showSearch` 在弹层顶部显示搜索框，默认按 `label` 与 `description` 筛选。远程搜索时设置 `:filter-option="false"`，在 `search` 事件中更新 `options`，并配合 `loading` 展示加载状态。
</docs>

<script setup lang="ts">
import type { SelectOption } from 'antdv-next-mobile'
import { ref } from 'vue'

const cities = ['北京', '上海', '广州', '深圳', '杭州', '南京', '苏州', '成都', '重庆', '武汉', '西安', '长沙', '青岛', '厦门']
  .map(label => ({ label, value: label }))
const city = ref<string | null>(null)

const user = ref<string | null>(null)
const users = ref<SelectOption[]>([])
const loading = ref(false)
let timer: ReturnType<typeof setTimeout>

function onSearch(keyword: string) {
  clearTimeout(timer)
  if (!keyword) {
    users.value = []
    loading.value = false
    return
  }
  loading.value = true
  timer = setTimeout(() => {
    users.value = Array.from({ length: 4 }, (_, index) => ({
      label: `${keyword}${index + 1}`,
      value: `${keyword}${index + 1}`,
      description: `${keyword}${index + 1}@example.com`,
    }))
    loading.value = false
  }, 600)
}
</script>

<template>
  <am-flex vertical gap="small">
    <am-select v-model:value="city" :options="cities" show-search title="选择城市" placeholder="本地搜索" />
    <am-select
      v-model:value="user"
      :options="users"
      :show-search="{ placeholder: '输入姓名搜索' }"
      :filter-option="false"
      :loading="loading"
      not-found-content="输入关键字开始搜索"
      title="选择成员"
      placeholder="远程搜索"
      @search="onSearch"
    />
  </am-flex>
</template>
