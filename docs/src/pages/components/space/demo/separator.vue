<docs lang="zh-CN">
通过 `separator` 属性或同名插槽在相邻子元素之间插入分隔符。
</docs>

<docs lang="en-US">
Insert a separator between adjacent children with the `separator` prop or the same-named slot.
</docs>

<template>
  <am-space vertical size="middle">
    <am-space separator="/">
      <a href="#">Home</a>
      <a href="#">Category</a>
      <a href="#">Detail</a>
    </am-space>
    <am-space>
      <template #separator>
        <am-divider vertical style="margin: 0" />
      </template>
      <a href="#">Edit</a>
      <a href="#">Share</a>
      <a href="#">Delete</a>
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
