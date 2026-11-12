<docs lang="zh-CN">
数据模式：传入 `dataSource`，通过 `renderItem` 插槽渲染每一项；数据为空时显示 `locale.emptyText`，`loading` 在底部显示加载指示。
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
      ...Array.from({ length: 3 }, (_, i) => ({ id: start + i, name: `联系人 ${start + i + 1}`, phone: `138 0000 00${10 + start + i}` })),
    )
    loading.value = false
  }, 800)
}
</script>

<template>
  <am-list header="联系人" :data-source="contacts" row-key="id" :loading="loading" :locale="{ emptyText: '还没有联系人，点击下方按钮加载' }">
    <template #renderItem="{ item }">
      <am-list-item :title="item.name" :extra="item.phone" />
    </template>
  </am-list>
  <div style="padding: 12px 16px">
    <am-flex gap="small">
      <am-button block type="primary" :loading="loading" @click="load">
        加载数据
      </am-button>
      <am-button block @click="contacts = []">
        清空
      </am-button>
    </am-flex>
  </div>
</template>
