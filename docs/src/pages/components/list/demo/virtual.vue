<docs lang="zh-CN">
数据模式下设置 `virtual` 与 `height` 开启虚拟滚动：10,000 条数据只渲染可视区域附近的列表项，列表项高度可以不一致（渲染后自动测量）。`scrollTo` 方法可滚动到指定下标或 `rowKey`；滚动到底部附近会触发 `reachEnd`，可用于无限加载。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

interface Message {
  id: number
  title: string
  description?: string
}

function create(start: number, length: number): Message[] {
  return Array.from({ length }, (_, i) => {
    const id = start + i
    return { id, title: `消息 ${id + 1}`, description: id % 4 === 0 ? '这条消息带有一行描述，高度与其他项不同' : undefined }
  })
}

const messages = ref<Message[]>(create(0, 10000))
const loading = ref(false)
const listRef = ref<{ scrollTo: (target: number | { index?: number, key?: number, align?: 'start' | 'center' }) => void }>()

function loadMore() {
  if (loading.value)
    return
  loading.value = true
  setTimeout(() => {
    messages.value = messages.value.concat(create(messages.value.length, 50))
    loading.value = false
  }, 800)
}
</script>

<template>
  <am-list
    ref="listRef"
    :header="`共 ${messages.length} 条消息`"
    :data-source="messages"
    row-key="id"
    virtual
    :height="360"
    :loading="loading"
    @reach-end="loadMore"
  >
    <template #renderItem="{ item }">
      <am-list-item :title="item.title" :description="item.description" :extra="`#${item.id + 1}`" />
    </template>
  </am-list>
  <div style="padding: 12px 16px">
    <am-flex gap="small">
      <am-button block @click="listRef?.scrollTo(0)">
        顶部
      </am-button>
      <am-button block @click="listRef?.scrollTo({ index: 4999, align: 'center' })">
        第 5000 条
      </am-button>
      <am-button block @click="listRef?.scrollTo({ index: messages.length - 1 })">
        底部
      </am-button>
    </am-flex>
  </div>
</template>
