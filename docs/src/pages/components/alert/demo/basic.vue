<docs lang="zh-CN">
共有四种样式 `success`、`info`、`warning`、`error`，默认为 `info`。
</docs>

<docs lang="en-US">
There are four styles: `success`, `info`, `warning` and `error`. The default is `info`.
</docs>

<template>
  <am-flex vertical gap="small">
    <am-alert title="Success Text" type="success" />
    <am-alert title="Info Text" type="info" />
    <am-alert title="Warning Text" type="warning" />
    <am-alert type="error">
      Error Text (default slot)
    </am-alert>
  </am-flex>
</template>
