<docs lang="zh-CN">
最常见的场景：吸底操作栏内的最后放置一个 `SafeArea`，操作栏的背景会延伸到屏幕底部，按钮不会被指示条遮挡。
</docs>

<template>
  <div class="page">
    <div class="content">
      商品详情
    </div>
    <div class="bar">
      <div class="bar-inner">
        <span class="price">合计：<b>¥ 199.00</b></span>
        <am-button type="primary" shape="round">
          提交订单
        </am-button>
      </div>
      <am-safe-area position="bottom" />
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 240px;
  background: var(--am-color-bg-layout);
}

.content {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  color: var(--am-color-text-tertiary);
  font-size: var(--am-font-size);
}

.bar {
  background: var(--am-color-bg-container);
  border-top: 1px solid var(--am-color-split);
}

.bar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  color: var(--am-color-text);
  font-size: var(--am-font-size);
}

.price b {
  color: var(--am-color-error);
  font-size: var(--am-font-size-lg);
}
</style>
