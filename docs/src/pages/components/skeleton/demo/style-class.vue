<docs lang="zh-CN">
通过 `classes` / `styles` 定制语义化结构，或覆盖 `--am-skeleton-*` 组件变量调整颜色与尺寸。
</docs>

<docs lang="en-US">
Customize the semantic structure with `classes` / `styles`, or override the `--am-skeleton-*` component tokens to adjust the color and size.
</docs>

<template>
  <am-flex vertical gap="large">
    <am-skeleton
      avatar
      active
      :styles="{ title: { height: '20px' }, avatar: { borderRadius: '12px' } }"
    />
    <am-skeleton active class="brand-skeleton" :paragraph="{ rows: 2 }" />
  </am-flex>
</template>

<style scoped>
.brand-skeleton {
  --am-skeleton-color: var(--am-color-primary-bg);
  --am-skeleton-color-highlight: var(--am-color-primary-bg-hover);
  --am-skeleton-paragraph-height: 12px;
  --am-skeleton-border-radius: 6px;
}
</style>
