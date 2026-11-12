<docs lang="zh-CN">
三种尺寸：`large`（48px）、`middle`（40px，默认）和 `small`（30px）。字号始终不小于 16px，避免 iOS 聚焦时页面缩放。
</docs>

<docs lang="en-US">
Three sizes: `large` (48px), `middle` (40px, default) and `small` (30px). The font size is never smaller than 16px, to avoid the page zooming on focus in iOS.
</docs>

<template>
  <am-flex vertical gap="small">
    <am-input size="large" placeholder="large" />
    <am-input placeholder="middle" />
    <am-input size="small" placeholder="small" />
  </am-flex>
</template>
