<docs lang="zh-CN">
通过 CSS 变量定制间距、圆角与颜色，例如做成胶囊形的标签选择。
</docs>

<docs lang="en-US">
Customize the gap, border radius and colors through CSS variables, for example to build pill-shaped tag selection.
</docs>

<script setup lang="ts">
const options = ['Top', 'Tech', 'Finance', 'Sports', 'Fun', 'Autos'].map(label => ({ label, value: label }))
</script>

<template>
  <am-selector class="demo-selector-pill" :options="options" :default-value="['Tech']" :show-check-mark="false" multiple />
</template>

<style scoped>
.demo-selector-pill {
  --am-selector-gap: 12px;
  --am-selector-min-height: 32px;
  --am-selector-padding: 4px 16px;
  --am-selector-border-radius: 999px;
  --am-selector-active-color: var(--am-color-text-light-solid);
  --am-selector-active-bg: var(--am-color-primary);
}
</style>
