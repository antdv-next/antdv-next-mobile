<docs lang="zh-CN">
`left` / `right` 插槽可以完全自定义操作区域，例如图标按钮。自定义内容需要自行调用 `close()` 收起。
</docs>

<script setup lang="ts">
import { DeleteOutlined, StarOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const swipeRef = ref()
const starred = ref(false)

function toggleStar() {
  starred.value = !starred.value
  swipeRef.value?.close()
}
</script>

<template>
  <am-swipe-action ref="swipeRef">
    <div class="cell">
      <span>自定义操作区域</span>
      <span class="cell-extra">{{ starred ? '已收藏' : '未收藏' }}</span>
    </div>
    <template #right>
      <div class="actions">
        <button type="button" class="round star" @click="toggleStar">
          <StarOutlined />
        </button>
        <button type="button" class="round delete" @click="swipeRef?.close()">
          <DeleteOutlined />
        </button>
      </div>
    </template>
  </am-swipe-action>
</template>

<style scoped>
.cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  min-height: 52px;
  padding: 12px 16px;
  color: var(--am-color-text);
  font-size: 16px;
  background: var(--am-color-bg-container);
}

.cell-extra {
  color: var(--am-color-text-description);
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 12px;
  align-items: center;
  height: 100%;
  padding: 0 16px;
  background: var(--am-color-fill-tertiary);
}

.round {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  color: #fff;
  font-size: 16px;
  border: 0;
  border-radius: 50%;
}

.star {
  background: var(--am-color-warning);
}

.delete {
  background: var(--am-color-error);
}
</style>
