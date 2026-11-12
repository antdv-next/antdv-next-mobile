<docs lang="zh-CN">
`variant` 支持 `outlined`、`filled`、`borderless`、`underlined` 四种形态。在 `Form` 中默认使用 `borderless`。
</docs>

<docs lang="en-US">
`variant` supports four variants: `outlined`, `filled`, `borderless` and `underlined`. `borderless` is used by default inside `Form`.
</docs>

<template>
  <am-flex vertical gap="small">
    <am-input placeholder="outlined (default)" />
    <am-input variant="filled" placeholder="filled" />
    <am-input variant="underlined" placeholder="underlined" />
    <am-input variant="borderless" placeholder="borderless" />
  </am-flex>
</template>
