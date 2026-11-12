<docs lang="zh-CN">
在灰色背景上使用 `variant="borderless"` 的无边框卡片，是移动端最常见的页面分组方式。
</docs>

<template>
  <div class="page">
    <am-card title="收货地址" variant="borderless">
      浙江省杭州市西湖区文三路 000 号
    </am-card>
    <am-card title="配送方式" extra="免运费" variant="borderless">
      标准快递，预计 3 天内送达
    </am-card>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: var(--am-color-bg-layout);
  border-radius: var(--am-border-radius);
}
</style>
