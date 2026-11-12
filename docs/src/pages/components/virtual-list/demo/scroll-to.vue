<docs lang="zh-CN">
通过 ref 调用 `scrollTo`：传入数字滚动到指定位置，传入 `{ index }` 或 `{ key }` 滚动到指定的项，`align` 控制目标项停在可视区域的顶部、中间或底部。
</docs>

<script setup lang="ts">
import type { VirtualListExpose } from 'antdv-next-mobile'
import { ref } from 'vue'

const data = Array.from({ length: 10000 }, (_, index) => ({ id: `user-${index}`, name: `用户 ${index + 1}` }))
const listRef = ref<VirtualListExpose>()
const active = ref('')

function toIndex(index: number) {
  active.value = data[index].id
  listRef.value?.scrollTo({ index, align: 'center' })
}

function toKey(key: string) {
  active.value = key
  listRef.value?.scrollTo({ key, align: 'start' })
}
</script>

<template>
  <div style="padding: 12px 16px">
    <am-flex gap="small" wrap>
      <am-button size="small" @click="listRef?.scrollTo(0)">
        顶部
      </am-button>
      <am-button size="small" @click="toIndex(4999)">
        index: 4999（居中）
      </am-button>
      <am-button size="small" @click="toKey('user-8000')">
        key: user-8000（置顶）
      </am-button>
      <am-button size="small" @click="toIndex(data.length - 1)">
        底部
      </am-button>
    </am-flex>
  </div>
  <am-virtual-list ref="listRef" :data="data" :height="320" :item-height="48" item-key="id" fixed class="demo-list">
    <template #default="{ item, index }">
      <div class="demo-row" :class="{ 'demo-row-active': item.id === active }">
        <span>{{ item.name }}</span>
        <span class="demo-row-extra">index {{ index }} · {{ item.id }}</span>
      </div>
    </template>
  </am-virtual-list>
</template>

<style scoped>
.demo-list {
  background: var(--am-color-bg-container);
}

.demo-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  height: 48px;
  padding: 0 16px;
  color: var(--am-color-text);
  font-size: 15px;
  border-bottom: 1px solid var(--am-color-split);
}

.demo-row-active {
  color: var(--am-color-primary);
  background: var(--am-color-primary-bg);
}

.demo-row-extra {
  color: var(--am-color-text-tertiary);
  font-size: 12px;
}
</style>
