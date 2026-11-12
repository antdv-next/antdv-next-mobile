<docs lang="zh-CN">
通过 `size` 设置三种尺寸，`count` 设置星星总数。
</docs>

<template>
  <div class="demo-rate-list">
    <am-rate size="small" :default-value="3" />
    <am-rate :default-value="3" />
    <am-rate size="large" :default-value="3" />
    <am-rate :count="8" :default-value="6" />
  </div>
</template>

<style scoped>
.demo-rate-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
</style>
