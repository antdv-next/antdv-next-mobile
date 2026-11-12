<docs lang="zh-CN">
通过 `description` 属性或同名插槽添加描述文案。
</docs>

<template>
  <am-flex gap="large" align="center" justify="space-around">
    <am-spin size="small" description="加载中" />
    <am-spin description="加载中..." />
    <am-spin size="large">
      <template #description>
        正在努力加载
      </template>
    </am-spin>
  </am-flex>
</template>
