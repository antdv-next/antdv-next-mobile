<docs lang="zh-CN">
通过 CSS 变量定制星星的大小、间距与颜色，`classes` / `styles` 可定制语义化结构。
</docs>

<template>
  <div class="demo-rate-list">
    <am-rate class="demo-rate-custom" :default-value="3" />
    <am-rate :default-value="4" :styles="{ star: { fontSize: '20px' } }" root-class="demo-rate-primary" />
  </div>
</template>

<style scoped>
.demo-rate-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}

.demo-rate-custom {
  --am-rate-size: 28px;
  --am-rate-gap: 16px;
  --am-rate-color: var(--am-color-error);
  --am-rate-color-inactive: var(--am-color-error-bg-hover);
}

.demo-rate-primary {
  --am-rate-color: var(--am-color-primary);
}
</style>
