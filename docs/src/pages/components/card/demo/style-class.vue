<docs lang="zh-CN">
通过 `classes` / `styles` 定制语义化结构，或覆盖 `--am-card-*` 组件变量调整圆角、内边距和背景。
</docs>

<template>
  <am-space vertical block size="middle">
    <am-card
      title="语义化样式"
      extra="styles"
      :styles="{
        header: { borderBottom: 0 },
        title: { color: 'var(--am-color-primary)' },
        body: { paddingTop: 0 },
      }"
    >
      去掉标题栏的分割线并收紧内容区。
    </am-card>
    <am-card title="组件变量" class="brand-card" variant="borderless">
      覆盖 CSS 变量得到品牌色卡片。
    </am-card>
  </am-space>
</template>

<style scoped>
.brand-card {
  --am-card-bg: var(--am-color-primary-bg);
  --am-card-border-color: var(--am-color-primary-border);
  --am-card-border-radius: 20px;
  --am-card-padding: 20px;
}
</style>
