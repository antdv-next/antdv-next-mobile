<docs lang="zh-CN">
通过 `size` 调整水平分割线的上下间距：`small` 8px、`middle` 12px、`large`（默认）16px。
</docs>

<docs lang="en-US">
Adjust the vertical spacing of a horizontal divider with `size`: `small` 8px, `middle` 12px, `large` (default) 16px.
</docs>

<template>
  <div class="text">
    small
  </div>
  <am-divider size="small" />
  <div class="text">
    middle
  </div>
  <am-divider size="middle" />
  <div class="text">
    large
  </div>
  <am-divider size="large" />
  <div class="text">
    End
  </div>
</template>

<style scoped>
.text {
  color: var(--am-color-text-secondary);
  font-size: var(--am-font-size);
}
</style>
