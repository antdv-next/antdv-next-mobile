<docs lang="zh-CN">
通过 `description` 属性或同名插槽添加描述文案。
</docs>

<docs lang="en-US">
Add a description through the `description` prop or the same-named slot.
</docs>

<template>
  <am-flex gap="large" align="center" justify="space-around">
    <am-spin size="small" description="Loading" />
    <am-spin description="Loading..." />
    <am-spin size="large">
      <template #description>
        Working on it
      </template>
    </am-spin>
  </am-flex>
</template>
