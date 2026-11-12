<docs lang="zh-CN">
三种尺寸：`large`（48px）、`middle`（40px，默认）和 `small`（30px）。字号始终不小于 16px，避免 iOS 聚焦时页面缩放。
</docs>

<template>
  <am-flex vertical gap="small">
    <am-input size="large" placeholder="large" />
    <am-input placeholder="middle" />
    <am-input size="small" placeholder="small" />
  </am-flex>
</template>
