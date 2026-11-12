<docs lang="zh-CN">
`loading` 标识开关操作仍在执行中，此时不可操作。
</docs>

<docs lang="en-US">
`loading` indicates that the switch operation is still in progress; it cannot be operated meanwhile.
</docs>

<template>
  <am-flex align="center" gap="middle">
    <am-switch loading default-checked />
    <am-switch loading />
    <am-switch size="small" loading default-checked />
  </am-flex>
</template>
