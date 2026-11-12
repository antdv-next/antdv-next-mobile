<docs lang="zh-CN">
`shape` 控制圆角形状，`bordered` 控制边框。非通栏使用时推荐 `neutral` 或 `rounded`。
</docs>

<template>
  <am-flex vertical gap="small">
    <am-notice-bar shape="rectangular" content="rectangular：直角，默认仅上下边框" />
    <am-notice-bar shape="neutral" color="info" content="neutral：圆角" />
    <am-notice-bar shape="rounded" color="success" content="rounded：胶囊" />
    <am-notice-bar shape="neutral" color="error" :bordered="false" content="bordered=false：无边框" />
  </am-flex>
</template>
