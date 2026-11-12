<docs lang="zh-CN">
警告类型的结果。
</docs>

<docs lang="en-US">
A warning result.
</docs>

<template>
  <am-result status="warning" title="Account at risk" sub-title="A login from an unusual location was detected. Please change your password soon">
    <template #extra>
      <am-button type="primary" shape="round">
        Change password
      </am-button>
    </template>
  </am-result>
</template>
