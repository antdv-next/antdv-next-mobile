<docs lang="zh-CN">
使用 `contentRender` 插槽自定义内容结构，实现移动端常见的物流轨迹。
</docs>

<script setup lang="ts">
const items = [
  { key: 1, status: '已签收', desc: '你的快递已由本人签收，感谢使用。', time: '09-03 14:21', color: 'green' },
  { key: 2, status: '派送中', desc: '快递员正在为你派送，请保持电话畅通。', time: '09-03 08:40' },
  { key: 3, status: '运输中', desc: '快件已到达【杭州转运中心】。', time: '09-02 21:15', color: 'gray' },
  { key: 4, status: '已揽收', desc: '【上海市】快递员已揽收。', time: '09-01 18:02', color: 'gray' },
]
</script>

<template>
  <am-timeline :items="items" variant="filled">
    <template #contentRender="{ index }">
      <div class="logistics-status" :class="{ 'logistics-status-active': index === 0 }">
        {{ items[index]?.status }}
      </div>
      <div class="logistics-desc">
        {{ items[index]?.desc }}
      </div>
      <div class="logistics-time">
        {{ items[index]?.time }}
      </div>
    </template>
  </am-timeline>
</template>

<style scoped>
.logistics-status {
  color: var(--am-color-text-secondary);
  font-weight: 600;
}

.logistics-status-active {
  color: var(--am-color-text);
}

.logistics-desc {
  margin-top: 2px;
  color: var(--am-color-text-secondary);
}

.logistics-time {
  margin-top: 2px;
  color: var(--am-color-text-tertiary);
  font-size: 12px;
}
</style>
