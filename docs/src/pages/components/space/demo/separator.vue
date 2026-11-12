<docs lang="zh-CN">
通过 `separator` 属性或同名插槽在相邻子元素之间插入分隔符。
</docs>

<template>
  <am-space vertical size="middle">
    <am-space separator="/">
      <a href="#">首页</a>
      <a href="#">分类</a>
      <a href="#">详情</a>
    </am-space>
    <am-space>
      <template #separator>
        <am-divider vertical style="margin: 0" />
      </template>
      <a href="#">编辑</a>
      <a href="#">分享</a>
      <a href="#">删除</a>
    </am-space>
  </am-space>
</template>

<style scoped>
a {
  color: var(--am-color-link);
  font-size: var(--am-font-size);
  text-decoration: none;
}
</style>
