<docs lang="zh-CN">
最基础的列表：`header` 设置分组标题，每个 `<am-list-item>` 的默认插槽是主要内容，`extra` 展示右侧的值。
</docs>

<template>
  <am-list header="基础用法">
    <am-list-item>单行列表</am-list-item>
    <am-list-item extra="内容">
      带额外内容
    </am-list-item>
    <am-list-item title="使用 title 属性" extra="内容" />
  </am-list>
</template>
