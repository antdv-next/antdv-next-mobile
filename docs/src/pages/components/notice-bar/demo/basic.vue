<docs lang="zh-CN">
通过 `content` 属性或默认插槽设置通告内容。
</docs>

<docs lang="en-US">
Set the notice content with the `content` prop or the default slot.
</docs>

<template>
  <am-flex vertical gap="small">
    <am-notice-bar content="The default notice bar shows an important message" />
    <am-notice-bar>
      Content set through the default slot
    </am-notice-bar>
  </am-flex>
</template>
