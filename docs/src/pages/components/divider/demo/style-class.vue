<docs lang="zh-CN">
通过 `styles` 定制语义化结构，或覆盖 `--am-divider-*` 组件变量调整颜色与粗细。
</docs>

<docs lang="en-US">
Customize the semantic structure with `styles`, or override the `--am-divider-*` component tokens to adjust the color and thickness.
</docs>

<template>
  <am-divider :styles="{ content: { color: 'var(--am-color-primary)', fontWeight: 600 } }">
    Semantic styles
  </am-divider>
  <am-divider class="brand-divider" title-placement="start">
    Component tokens
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
