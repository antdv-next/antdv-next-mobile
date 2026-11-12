<docs lang="zh-CN">
使用 `orientation="vertical"` 或 `vertical` 得到行内的垂直分割线。
</docs>

<template>
  <div class="row">
    文本
    <am-divider vertical />
    <a href="#">链接</a>
    <am-divider orientation="vertical" />
    <a href="#">链接</a>
    <am-divider vertical variant="dashed" />
    更多
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
