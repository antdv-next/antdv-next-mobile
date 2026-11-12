<docs lang="zh-CN">
数据模式：传入 `dataSource`，通过 `renderItem` 插槽渲染每一项；数据为空时显示 `locale.emptyText`，`loading` 在底部显示加载指示。
</docs>

<docs lang="en-US">
Data mode: pass `dataSource` and render each item through the `renderItem` slot; `locale.emptyText` is shown when the data is empty, and `loading` shows a loading indicator at the bottom.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

interface Contact {
  id: number
  name: string
  phone: string
}

const contacts = ref<Contact[]>([])
const loading = ref(false)

function load() {
  loading.value = true
  setTimeout(() => {
    const start = contacts.value.length
    contacts.value.push(
      ...Array.from({ length: 3 }, (_, i) => ({ id: start + i, name: `Contact ${start + i + 1}`, phone: `138 0000 00${10 + start + i}` })),
    )
    loading.value = false
  }, 800)
}
</script>

<template>
  <am-list header="Contacts" :data-source="contacts" row-key="id" :loading="loading" :locale="{ emptyText: 'No contacts yet, tap the button below to load' }">
    <template #renderItem="{ item }">
      <am-list-item :title="item.name" :extra="item.phone" />
    </template>
  </am-list>
  <div style="padding: 12px 16px">
    <am-flex gap="small">
      <am-button block type="primary" :loading="loading" @click="load">
        Load data
      </am-button>
      <am-button block @click="contacts = []">
        Clear
      </am-button>
    </am-flex>
  </div>
</template>
