<docs lang="zh-CN">
使用 `orientation="vertical"` 或 `vertical` 得到行内的垂直分割线。
</docs>

<docs lang="en-US">
Use `orientation="vertical"` or `vertical` for an inline vertical divider.
</docs>

<template>
  <div class="row">
    Text
    <am-divider vertical />
    <a href="#">Link</a>
    <am-divider orientation="vertical" />
    <a href="#">Link</a>
    <am-divider vertical variant="dashed" />
    More
  </div>
</template>

<style scoped>
.row {
  color: var(--am-color-text);
  font-size: var(--am-font-size);
}

.row a {
  color: var(--am-color-link);
  text-decoration: none;
}
</style>
