<docs lang="zh-CN">
通过 CSS 变量定制间距、圆角与颜色，例如做成胶囊形的标签选择。
</docs>

<script setup lang="ts">
const options = ['推荐', '科技', '财经', '体育', '娱乐', '汽车'].map(label => ({ label, value: label }))
</script>

<template>
  <am-selector class="demo-selector-pill" :options="options" :default-value="['科技']" :show-check-mark="false" multiple />
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
