<docs lang="zh-CN">
最基础的列表：`header` 设置分组标题，每个 `<am-list-item>` 的默认插槽是主要内容，`extra` 展示右侧的值。
</docs>

<docs lang="en-US">
The most basic list: `header` sets the group title, the default slot of each `<am-list-item>` is the main content, and `extra` shows the value on the right.
</docs>

<template>
  <am-list header="Basic">
    <am-list-item>Single line</am-list-item>
    <am-list-item extra="Content">
      With extra
    </am-list-item>
    <am-list-item title="Using the title prop" extra="Content" />
  </am-list>
</template>
