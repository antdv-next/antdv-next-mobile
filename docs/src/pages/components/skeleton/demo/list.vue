<docs lang="zh-CN">
在列表首屏加载时，为每一项渲染一个骨架屏。
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)
const list = [
  { title: '系统通知', description: '你的账号已通过实名认证。' },
  { title: '订单提醒', description: '你购买的商品已经发货，请注意查收。' },
  { title: '活动推荐', description: '新人专享礼包已到账，点击查看。' },
]
</script>

<template>
  <div class="skeleton-list">
    <div class="skeleton-list-bar">
      <span>加载中</span>
      <am-switch v-model:checked="loading" />
    </div>
    <div v-for="item in list" :key="item.title" class="skeleton-list-item">
      <am-skeleton :loading="loading" active avatar :paragraph="{ rows: 1 }">
        <div class="skeleton-list-avatar">
          {{ item.title.slice(0, 1) }}
        </div>
        <div>
          <div class="skeleton-list-title">
            {{ item.title }}
          </div>
          <div class="skeleton-list-desc">
            {{ item.description }}
          </div>
        </div>
      </am-skeleton>
    </div>
  </div>
</template>

<style scoped>
.skeleton-list {
  background: var(--am-color-bg-container);
}

.skeleton-list-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  color: var(--am-color-text);
  font-size: var(--am-font-size);
}

.skeleton-list-item {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid var(--am-color-split);
}

.skeleton-list-avatar {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: var(--am-color-primary);
  font-size: var(--am-font-size-lg);
  background: var(--am-color-primary-bg);
  border-radius: 50%;
}

.skeleton-list-title {
  color: var(--am-color-text);
  font-size: var(--am-font-size-lg);
}

.skeleton-list-desc {
  margin-top: 4px;
  color: var(--am-color-text-secondary);
  font-size: var(--am-font-size);
}
</style>
