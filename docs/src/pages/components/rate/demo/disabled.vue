<docs lang="zh-CN">
`disabled` 时只读，无法进行交互，常用于展示评分结果。
</docs>

<template>
  <div class="demo-rate-list">
    <am-rate disabled :default-value="2" />
    <am-rate disabled allow-half :default-value="3.5" />
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
