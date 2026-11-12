<docs lang="zh-CN">
通过 `styles` 定制语义化结构，或覆盖 `--am-divider-*` 组件变量调整颜色与粗细。
</docs>

<template>
  <am-divider :styles="{ content: { color: 'var(--am-color-primary)', fontWeight: 600 } }">
    语义化样式
  </am-divider>
  <am-divider class="brand-divider" title-placement="start">
    组件变量
  </am-divider>
</template>

<style scoped>
.brand-divider {
  --am-divider-color: var(--am-color-primary-border);
  --am-divider-line-width: 2px;
  --am-divider-text-color: var(--am-color-primary);
  --am-divider-placement-rail-width: 24px;
}
</style>
