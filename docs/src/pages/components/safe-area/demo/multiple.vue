<docs lang="zh-CN">
覆盖 `--am-safe-area-multiple` 可以按倍数放大预留的空间，例如需要在指示条上方再留出同样高度的呼吸空间时。
</docs>

<docs lang="en-US">
Override `--am-safe-area-multiple` to enlarge the reserved space by a multiple, for example when you need the same amount of breathing room again above the home indicator.
</docs>

<template>
  <div class="page">
    <div class="content">
      Double bottom safe area
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
