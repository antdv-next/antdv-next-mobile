<docs lang="zh-CN">
通过 `content` 属性或默认插槽设置通告内容。
</docs>

<template>
  <am-flex vertical gap="small">
    <am-notice-bar content="默认的通告栏，用于展示一条重要信息" />
    <am-notice-bar>
      通过默认插槽设置内容
    </am-notice-bar>
  </am-flex>
</template>
