<docs lang="zh-CN">
共有四种样式 `success`、`info`、`warning`、`error`，默认为 `info`。
</docs>

<template>
  <am-flex vertical gap="small">
    <am-alert title="成功提示的文案" type="success" />
    <am-alert title="消息提示的文案" type="info" />
    <am-alert title="警告提示的文案" type="warning" />
    <am-alert type="error">
      错误提示的文案（默认插槽）
    </am-alert>
  </am-flex>
</template>
