<docs lang="zh-CN">
覆盖 `--am-safe-area-multiple` 可以按倍数放大预留的空间，例如需要在指示条上方再留出同样高度的呼吸空间时。
</docs>

<template>
  <div class="page">
    <div class="content">
      双倍底部安全区
    </div>
    <am-safe-area position="bottom" class="double" />
  </div>
</template>

<style scoped>
.page {
  background: var(--am-color-bg-container);
}

.content {
  padding: 24px 16px;
  color: var(--am-color-text);
  font-size: var(--am-font-size);
  text-align: center;
}

.double {
  --am-safe-area-multiple: 2;

  background: var(--am-color-primary-bg);
}
</style>
