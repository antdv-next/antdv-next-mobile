<docs lang="zh-CN">
`status` 设置校验状态（在 `FormItem` 中会自动跟随校验结果），以及禁用与只读状态。
</docs>

<template>
  <am-flex vertical gap="small">
    <am-input status="error" default-value="错误状态" />
    <am-input status="warning" default-value="警告状态" />
    <am-input variant="filled" status="error" default-value="filled 错误状态" />
    <am-input disabled default-value="禁用状态" />
    <am-input read-only default-value="只读状态" />
  </am-flex>
</template>
