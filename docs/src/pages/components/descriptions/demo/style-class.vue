<docs lang="zh-CN">
通过 `classes` / `styles` 定制语义化结构，或覆盖 `--am-descriptions-*` 组件变量。
</docs>

<docs lang="en-US">
Customize the semantic structure through `classes` / `styles`, or override the `--am-descriptions-*` component tokens.
</docs>

<script setup lang="ts">
const items = [
  { key: 'name', label: 'Recipient', content: 'Zhou Maomao' },
  { key: 'phone', label: 'Phone', content: '181 0000 0000' },
  { key: 'address', label: 'Address', content: 'No. 18 Wantang Road, Xihu District, Hangzhou, Zhejiang' },
]
</script>

<template>
  <am-flex vertical gap="large">
    <am-descriptions
      title="Semantic Styles"
      :items="items"
      :styles="{ label: { width: '5em' }, content: { fontWeight: 600 } }"
    />
    <am-descriptions title="Component Tokens" bordered :items="items" class="custom-descriptions" />
  </am-flex>
</template>

<style scoped>
.custom-descriptions {
  --am-descriptions-label-width: 96px;
  --am-descriptions-label-bg: var(--am-color-primary-bg);
  --am-descriptions-border-color: var(--am-color-primary-border);
  --am-descriptions-border-radius: 12px;
}
</style>
