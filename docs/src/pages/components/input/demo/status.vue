<docs lang="zh-CN">
`status` 设置校验状态（在 `FormItem` 中会自动跟随校验结果），以及禁用与只读状态。
</docs>

<docs lang="en-US">
`status` sets the validation status (inside `FormItem` it follows the validation result automatically), along with the disabled and read-only states.
</docs>

<template>
  <am-flex vertical gap="small">
    <am-input status="error" default-value="Error" />
    <am-input status="warning" default-value="Warning" />
    <am-input variant="filled" status="error" default-value="Filled error" />
    <am-input disabled default-value="Disabled" />
    <am-input read-only default-value="Read only" />
  </am-flex>
</template>
