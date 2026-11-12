<docs lang="zh-CN">
选项设置 `disabled` 后置灰且无法停靠，滚动到禁用项时会吸附到最近的可选项。`loading` 用于异步获取列数据的场景。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  [
    { label: '09:00', value: '09:00' },
    { label: '10:00（已约满）', value: '10:00', disabled: true },
    { label: '11:00', value: '11:00' },
    { label: '14:00（已约满）', value: '14:00', disabled: true },
    { label: '15:00', value: '15:00' },
    { label: '16:00', value: '16:00' },
  ],
]
const value = ref(['11:00'])
const loading = ref(false)

function reload() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1500)
}
</script>

<template>
  <am-flex vertical gap="middle">
    <am-picker-view v-model:value="value" :columns="columns" :loading="loading" />
    <am-button block :loading="loading" @click="reload">
      重新加载
    </am-button>
  </am-flex>
</template>
